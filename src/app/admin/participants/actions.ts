"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canonicaliserCommune } from "@/lib/communes";

export interface ResultatAjoutInvite {
  erreur?: string;
  succes?: boolean;
}

export async function ajouterInviteAction(
  _prevState: ResultatAjoutInvite,
  formData: FormData
): Promise<ResultatAjoutInvite> {
  const nomComplet = (formData.get("nom_complet") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const telephone = (formData.get("telephone") as string)?.trim() || null;
  const sexe = (formData.get("sexe") as string)?.trim() || null;
  const communeBrute = (formData.get("commune") as string)?.trim() || null;
  const profil = (formData.get("profil") as string)?.trim() || "Invité";
  const participation =
    (formData.get("participation") as string) || "deux_jours";

  if (!nomComplet || !email) {
    return { erreur: "Nom et email sont requis." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("participants").insert({
    nom_complet: nomComplet,
    email,
    telephone,
    sexe,
    commune: communeBrute,
    commune_normalisee: canonicaliserCommune(communeBrute),
    profil,
    participation: participation as "jour1" | "jour2" | "deux_jours",
    statut: "inscrit",
    reponses_brutes: {},
  });

  if (error) {
    if (error.code === "23505") {
      return { erreur: "Un participant avec cet email existe déjà." };
    }
    return { erreur: `Échec de l'ajout : ${error.message}` };
  }

  revalidatePath("/admin/participants");
  revalidatePath("/admin");

  return { succes: true };
}

export async function supprimerParticipantAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  // emails_envoyes.participant_id est en "on delete cascade" : supprimer le
  // participant supprime automatiquement tout son historique d'envoi
  // (confirmation, QR code).
  await supabase.from("participants").delete().eq("id", id);

  revalidatePath("/admin/participants");
  revalidatePath("/admin");
  revalidatePath("/admin/checkin");
  revalidatePath("/admin/campagnes");
}
