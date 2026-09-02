"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { envoyerEmailTransactionnel, BrevoError } from "@/lib/brevo";
import { emailConfirmationHtml } from "@/lib/email-templates";
import { genererToken } from "@/lib/tokens";
import type { Participation, StatutParticipant } from "@/types/database";

// Note : les Server Actions ne peuvent pas exporter `maxDuration`. Si de
// grandes campagnes dépassent la limite d'exécution par défaut de Vercel,
// filtrez le segment en plusieurs envois plus petits ou passez à un plan
// avec un `maxDuration` de fonction plus élevé.

export interface ResultatCampagne {
  erreur?: string;
  succes?: boolean;
  envoyes?: number;
  echecs?: number;
  erreursDetail?: string[];
}

const CONCURRENCE = 8;

function decouperEnLots<T>(items: T[], taille: number): T[][] {
  const lots: T[][] = [];
  for (let i = 0; i < items.length; i += taille) {
    lots.push(items.slice(i, i + taille));
  }
  return lots;
}

export async function envoyerCampagneAction(
  _prevState: ResultatCampagne,
  formData: FormData
): Promise<ResultatCampagne> {
  const profil = (formData.get("profil") as string) || undefined;
  const participation = (formData.get("participation") as string) || undefined;
  const statut = (formData.get("statut") as string) || undefined;
  const ville = (formData.get("ville") as string) || undefined;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return { erreur: "NEXT_PUBLIC_APP_URL n'est pas configuré." };
  }

  const supabase = await createClient();

  let requete = supabase
    .from("participants")
    .select("id, nom_complet, email, token_confirmation");

  if (profil) requete = requete.eq("profil", profil);
  if (participation)
    requete = requete.eq("participation", participation as Participation);
  if (statut) requete = requete.eq("statut", statut as StatutParticipant);
  if (ville) requete = requete.eq("commune_normalisee", ville);

  const { data: participants, error } = await requete;

  if (error) {
    return { erreur: `Impossible de charger le segment : ${error.message}` };
  }

  if (!participants || participants.length === 0) {
    return { erreur: "Aucun participant ne correspond à ce segment." };
  }

  let envoyes = 0;
  let echecs = 0;
  const erreursDetail: string[] = [];

  const lots = decouperEnLots(participants, CONCURRENCE);

  for (const lot of lots) {
    await Promise.all(
      lot.map(async (participant) => {
        const token = participant.token_confirmation ?? genererToken();
        const lienConfirmation = `${appUrl}/confirmer/${token}`;

        try {
          const resultat = await envoyerEmailTransactionnel({
            destinataireEmail: participant.email,
            destinataireNom: participant.nom_complet,
            sujet: "Confirmez votre présence — JIJ 2026",
            htmlContent: emailConfirmationHtml({
              nomComplet: participant.nom_complet,
              lienConfirmation,
            }),
          });

          await supabase
            .from("participants")
            .update({
              token_confirmation: token,
              statut: "email_envoye",
              date_envoi_email: new Date().toISOString(),
            })
            .eq("id", participant.id);

          await supabase.from("emails_envoyes").insert({
            participant_id: participant.id,
            type: "confirmation",
            statut_brevo: "envoye",
            brevo_message_id: resultat.messageId,
          });

          envoyes++;
        } catch (e) {
          const message =
            e instanceof BrevoError
              ? `Brevo ${e.status}`
              : e instanceof Error
                ? e.message
                : "Erreur inconnue";

          await supabase.from("emails_envoyes").insert({
            participant_id: participant.id,
            type: "confirmation",
            statut_brevo: "echec",
            erreur: message,
          });

          echecs++;
          erreursDetail.push(`${participant.email} : ${message}`);
        }
      })
    );
  }

  revalidatePath("/admin/campagnes");
  revalidatePath("/admin/participants");
  revalidatePath("/admin");

  return {
    succes: true,
    envoyes,
    echecs,
    erreursDetail: erreursDetail.slice(0, 20),
  };
}

export async function envoyerCampagneUnePersonneAction(
  _prevState: ResultatCampagne,
  formData: FormData
): Promise<ResultatCampagne> {
  const participantId = formData.get("participant_id") as string;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return { erreur: "NEXT_PUBLIC_APP_URL n'est pas configuré." };
  }
  if (!participantId) {
    return { erreur: "Choisissez d'abord une personne dans la liste." };
  }

  const supabase = await createClient();

  const { data: participant, error: erreurLecture } = await supabase
    .from("participants")
    .select("id, nom_complet, email, token_confirmation")
    .eq("id", participantId)
    .maybeSingle();

  if (erreurLecture || !participant) {
    return { erreur: "Participant introuvable." };
  }

  const token = participant.token_confirmation ?? genererToken();
  const lienConfirmation = `${appUrl}/confirmer/${token}`;

  try {
    const resultat = await envoyerEmailTransactionnel({
      destinataireEmail: participant.email,
      destinataireNom: participant.nom_complet,
      sujet: "Confirmez votre présence — JIJ 2026",
      htmlContent: emailConfirmationHtml({
        nomComplet: participant.nom_complet,
        lienConfirmation,
      }),
    });

    await supabase
      .from("participants")
      .update({
        token_confirmation: token,
        statut: "email_envoye",
        date_envoi_email: new Date().toISOString(),
      })
      .eq("id", participant.id);

    await supabase.from("emails_envoyes").insert({
      participant_id: participant.id,
      type: "confirmation",
      statut_brevo: "envoye",
      brevo_message_id: resultat.messageId,
    });

    revalidatePath("/admin/campagnes");
    revalidatePath("/admin/participants");

    return { succes: true, envoyes: 1, echecs: 0 };
  } catch (e) {
    const message =
      e instanceof BrevoError
        ? `Brevo ${e.status}`
        : e instanceof Error
          ? e.message
          : "Erreur inconnue";

    await supabase.from("emails_envoyes").insert({
      participant_id: participant.id,
      type: "confirmation",
      statut_brevo: "echec",
      erreur: message,
    });

    return { erreur: `Échec de l'envoi : ${message}` };
  }
}
