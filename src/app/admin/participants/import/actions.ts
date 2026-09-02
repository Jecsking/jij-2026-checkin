"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parserFichierParticipants, type LigneImportee } from "@/lib/import-participants";

// Note : les Server Actions ne peuvent pas exporter `maxDuration`. Pour un
// très gros fichier, augmentez le `maxDuration` de fonction au niveau du
// plan Vercel si l'import dépasse la limite d'exécution par défaut.

export interface ResultatImport {
  erreur?: string;
  succes?: boolean;
  crees?: number;
  misAJour?: number;
  total?: number;
  erreursLignes?: string[];
}

const TAILLE_LOT = 25;

function decouperEnLots<T>(items: T[], taille: number): T[][] {
  const lots: T[][] = [];
  for (let i = 0; i < items.length; i += taille) {
    lots.push(items.slice(i, i + taille));
  }
  return lots;
}

export async function importerParticipantsAction(
  _prevState: ResultatImport,
  formData: FormData
): Promise<ResultatImport> {
  const fichier = formData.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) {
    return { erreur: "Veuillez sélectionner un fichier .xlsx ou .csv." };
  }

  let lignes: LigneImportee[];
  try {
    lignes = await parserFichierParticipants(fichier);
  } catch {
    return { erreur: "Impossible de lire le fichier. Vérifiez le format." };
  }

  if (lignes.length === 0) {
    return { erreur: "Aucune ligne valide trouvée dans le fichier." };
  }

  const supabase = await createClient();

  const { data: existants, error: erreurLecture } = await supabase
    .from("participants")
    .select("id, email");

  if (erreurLecture) {
    return { erreur: `Lecture des participants existants impossible : ${erreurLecture.message}` };
  }

  const parEmail = new Map(
    (existants ?? []).map((p) => [p.email.toLowerCase().trim(), p.id])
  );

  let crees = 0;
  let misAJour = 0;
  const erreursLignes: string[] = [];

  const lots = decouperEnLots(lignes, TAILLE_LOT);

  for (const lot of lots) {
    const resultats = await Promise.all(
      lot.map(async (ligne) => {
        const idExistant = parEmail.get(ligne.email);
        const donnees = {
          nom_complet: ligne.nom_complet,
          telephone: ligne.telephone,
          sexe: ligne.sexe,
          age_saisi: ligne.age_saisi,
          commune: ligne.commune,
          profil: ligne.profil,
          participation: ligne.participation,
          consentement_infos: ligne.consentement_infos,
          autorisation_photos: ligne.autorisation_photos,
          engagement_reglement: ligne.engagement_reglement,
          horodatage_inscription: ligne.horodatage_inscription,
          reponses_brutes: ligne.reponses_brutes,
        };

        if (idExistant) {
          const { error } = await supabase
            .from("participants")
            .update(donnees)
            .eq("id", idExistant);
          return { type: "maj" as const, email: ligne.email, error };
        }

        const { error } = await supabase.from("participants").insert({
          ...donnees,
          email: ligne.email,
          statut: "inscrit",
        });
        return { type: "creation" as const, email: ligne.email, error };
      })
    );

    for (const r of resultats) {
      if (r.error) {
        erreursLignes.push(`${r.email} : ${r.error.message}`);
      } else if (r.type === "creation") {
        crees++;
      } else {
        misAJour++;
      }
    }
  }

  revalidatePath("/admin/participants");
  revalidatePath("/admin");

  return {
    succes: true,
    crees,
    misAJour,
    total: lignes.length,
    erreursLignes: erreursLignes.slice(0, 20),
  };
}
