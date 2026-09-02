"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmailTransactionnel } from "@/lib/brevo";
import { emailIdentifiantsEquipeHtml } from "@/lib/email-templates";
import { genererToken } from "@/lib/tokens";
import type { RoleUtilisateur } from "@/types/database";

export interface ResultatCreationMembre {
  erreur?: string;
  succes?: boolean;
  motDePasseGenere?: string;
}

const ROLES_VALIDES: RoleUtilisateur[] = ["admin", "staff", "jury"];

export async function creerMembreEquipeAction(
  _prevState: ResultatCreationMembre,
  formData: FormData
): Promise<ResultatCreationMembre> {
  const nomComplet = (formData.get("nom_complet") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = formData.get("role") as RoleUtilisateur;
  const motDePasseSaisi = (formData.get("mot_de_passe") as string)?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!nomComplet || !email) {
    return { erreur: "Nom et email sont requis." };
  }
  if (!ROLES_VALIDES.includes(role)) {
    return { erreur: "Rôle invalide." };
  }
  if (motDePasseSaisi && motDePasseSaisi.length < 8) {
    return { erreur: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (!appUrl) {
    return { erreur: "NEXT_PUBLIC_APP_URL n'est pas configuré." };
  }

  const admin = createAdminClient();
  const motDePasse = motDePasseSaisi || genererToken(6);

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

  const { error: erreurProfil } = await admin
    .from("profils_utilisateurs")
    .insert({ id: utilisateur.user.id, role, nom_complet: nomComplet });

  if (erreurProfil) {
    return { erreur: `Compte créé mais échec d'attribution du rôle : ${erreurProfil.message}` };
  }

  if (role === "jury") {
    const { error: erreurJure } = await admin.from("jures").insert({
      compte_auth_id: utilisateur.user.id,
      nom_complet: nomComplet,
      email,
    });
    if (erreurJure) {
      return { erreur: `Compte créé mais échec d'enregistrement juré : ${erreurJure.message}` };
    }
  }

  try {
    await envoyerEmailTransactionnel({
      destinataireEmail: email,
      destinataireNom: nomComplet,
      sujet: "Vos identifiants — JIJ 2026",
      htmlContent: emailIdentifiantsEquipeHtml({
        nomComplet,
        email,
        motDePasse,
        role,
        appUrl,
      }),
    });
  } catch {
    // Le compte est créé même si l'email échoue ; l'admin peut communiquer
    // les identifiants manuellement (mot de passe affiché ci-dessous).
  }

  revalidatePath("/admin/equipe");
  return { succes: true, motDePasseGenere: motDePasseSaisi ? undefined : motDePasse };
}

export async function supprimerMembreEquipeAction(formData: FormData) {
  const id = formData.get("id") as string;
  const jureId = formData.get("jure_id") as string | null;
  if (!id) return;

  const admin = createAdminClient();
  if (jureId) {
    await admin.from("jures").delete().eq("id", jureId);
  }
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/admin/equipe");
}
