import { createAdminClient } from "@/lib/supabase/admin";
import { genererQrDataUrl } from "@/lib/qr";
import { confirmerPresenceAction } from "./actions";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: participant } = await supabase
    .from("participants")
    .select("*")
    .eq("token_confirmation", token)
    .maybeSingle();

  if (!participant) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 text-center">
        <p className="text-zinc-600">
          Ce lien de confirmation est invalide. Contactez l&apos;organisation
          si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  if (participant.statut === "confirme" && participant.token_qr) {
    const qrDataUrl = await genererQrDataUrl(participant.token_qr);
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-center">
        <h1 className="text-xl font-semibold text-teal-800">
          Présence confirmée ✅
        </h1>
        <p className="mt-2 max-w-md text-zinc-600">
          Merci {participant.nom_complet}. Présentez ce QR code (sur votre
          téléphone ou imprimé) à l&apos;entrée de l&apos;événement. Il vous a
          également été envoyé par email.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt="QR code d'accès"
          className="mt-6 h-56 w-56 rounded-lg border border-zinc-200 bg-white p-3"
        />
      </div>
    );
  }

  const confirmerAction = confirmerPresenceAction.bind(null, token);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-center">
      <h1 className="text-xl font-semibold text-teal-800">
        Journée Internationale de la Jeunesse 2026
      </h1>
      <p className="mt-3 max-w-md text-zinc-600">
        Bonjour {participant.nom_complet}, merci de confirmer votre présence
        à l&apos;événement.
      </p>
      <form action={confirmerAction} className="mt-6">
        <button
          type="submit"
          className="rounded-md bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
        >
          Je confirme ma présence
        </button>
      </form>
    </div>
  );
}
