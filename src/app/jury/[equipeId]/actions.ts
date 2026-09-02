"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { POINTS_MAX_PAR_PASSAGE } from "@/lib/notation";
import type { Passage } from "@/types/database";

export interface ResultatNotation {
  erreur?: string;
  succes?: boolean;
}

export async function enregistrerNotesAction(
  equipeId: string,
  passage: Passage,
  _prevState: ResultatNotation,
  formData: FormData
): Promise<ResultatNotation> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erreur: "Session expirée." };

  const { data: jure } = await supabase
    .from("jures")
    .select("id")
    .eq("compte_auth_id", user.id)
    .maybeSingle();

  if (!jure) return { erreur: "Profil juré introuvable." };

  const entrees = Array.from(formData.entries()).filter(([cle]) =>
    cle.startsWith("critere_")
  );

  const erreurs: string[] = [];
  const maxPourPassage = POINTS_MAX_PAR_PASSAGE[passage];

  for (const [cle, valeurBrute] of entrees) {
    const critereId = cle.replace("critere_", "");
    const valeur = Number(valeurBrute);
    if (Number.isNaN(valeur) || valeur < 0 || valeur > maxPourPassage) continue;

    const { error } = await supabase
      .from("notes")
      .upsert(
        { jure_id: jure.id, equipe_id: equipeId, critere_id: critereId, passage, valeur },
        { onConflict: "jure_id,equipe_id,critere_id,passage" }
      );

    if (error) erreurs.push(error.message);
  }

  if (erreurs.length > 0) {
    return { erreur: `Certaines notes n'ont pas pu être enregistrées : ${erreurs[0]}` };
  }

  revalidatePath(`/jury/${equipeId}`);
  revalidatePath("/jury");
  return { succes: true };
}
