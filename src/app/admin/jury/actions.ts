"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmailTransactionnel } from "@/lib/brevo";
import { emailIdentifiantsJuryHtml } from "@/lib/email-templates";
import { genererToken } from "@/lib/tokens";

export interface ResultatCreationJure {
  erreur?: string;
  succes?: boolean;
}

export async function creerJureAction(
  _prevState: ResultatCreationJure,
  formData: FormData
): Promise<ResultatCreationJure> {
  const nomComplet = (formData.get("nom_complet") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!nomComplet || !email) {
    return { erreur: "Nom et email sont requis." };
  }
  if (!appUrl) {
    return { erreur: "NEXT_PUBLIC_APP_URL n'est pas configuré." };
  }

  const admin = createAdminClient();
  const motDePasse = genererToken(6);

  const { data: utilisateur, error: erreurCreation } =
    await admin.auth.admin.createUser({
      email,
      password: motDePasse,
      email_confirm: true,
    });

  if (erreurCreation || !utilisateur.user) {
    return {
      erreur: `Impossible de créer le compte : ${erreurCreation?.message ?? "erreur inconnue"}`,
    };
  }

  await admin.from("profils_utilisateurs").insert({
    id: utilisateur.user.id,
    role: "jury",
    nom_complet: nomComplet,
  });

  const { error: erreurJure } = await admin.from("jures").insert({
    compte_auth_id: utilisateur.user.id,
    nom_complet: nomComplet,
    email,
  });

  if (erreurJure) {
    return { erreur: `Compte créé mais échec d'enregistrement juré : ${erreurJure.message}` };
  }

  try {
    await envoyerEmailTransactionnel({
      destinataireEmail: email,
      destinataireNom: nomComplet,
      sujet: "Vos identifiants — Jury Hackathon JIJ 2026",
      htmlContent: emailIdentifiantsJuryHtml({
        nomComplet,
        email,
        motDePasse,
        lienConnexion: `${appUrl}/login`,
      }),
    });
  } catch {
    // Le compte est créé même si l'email échoue ; l'admin peut le retrouver et
    // communiquer les identifiants manuellement.
  }

  revalidatePath("/admin/jury");
  return { succes: true };
}

export async function supprimerJureAction(formData: FormData) {
  const id = formData.get("id") as string;
  const compteAuthId = formData.get("compte_auth_id") as string | null;
  if (!id) return;

  const admin = createAdminClient();
  await admin.from("jures").delete().eq("id", id);
  if (compteAuthId) {
    await admin.auth.admin.deleteUser(compteAuthId);
  }
  revalidatePath("/admin/jury");
}
