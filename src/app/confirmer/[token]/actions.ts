"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { genererToken } from "@/lib/tokens";
import { genererQrDataUrl, genererQrPngBuffer } from "@/lib/qr";
import { envoyerEmailTransactionnel } from "@/lib/brevo";
import { emailQrHtml } from "@/lib/email-templates";

export async function confirmerPresenceAction(token: string) {
  const supabase = createAdminClient();

  const { data: participant, error } = await supabase
    .from("participants")
    .select("*")
    .eq("token_confirmation", token)
    .maybeSingle();

  if (error || !participant) {
    return;
  }

  const premiereConfirmation = participant.statut !== "confirme";
  const tokenQr = participant.token_qr ?? genererToken(16);

  await supabase
    .from("participants")
    .update({
      statut: "confirme",
      date_confirmation: participant.date_confirmation ?? new Date().toISOString(),
      token_qr: tokenQr,
    })
    .eq("id", participant.id);

  if (premiereConfirmation) {
    try {
      const qrDataUrl = await genererQrDataUrl(tokenQr);
      const buffer = await genererQrPngBuffer(tokenQr);

      await envoyerEmailTransactionnel({
        destinataireEmail: participant.email,
        destinataireNom: participant.nom_complet,
        sujet: "Votre badge d'accès — JIJ 2026",
        htmlContent: emailQrHtml({
          nomComplet: participant.nom_complet,
          qrDataUrl,
        }),
        piecesJointes: [
          { nom: "badge-jij-2026.png", contenuBase64: buffer.toString("base64") },
        ],
      });

      await supabase.from("emails_envoyes").insert({
        participant_id: participant.id,
        type: "qr_code",
        statut_brevo: "envoye",
      });
    } catch (e) {
      await supabase.from("emails_envoyes").insert({
        participant_id: participant.id,
        type: "qr_code",
        statut_brevo: "echec",
        erreur: e instanceof Error ? e.message : "Erreur inconnue",
      });
    }
  }

  revalidatePath(`/confirmer/${token}`);
}
