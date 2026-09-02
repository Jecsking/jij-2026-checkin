import Image from "next/image";
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
      <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 text-center">
        <Image
          src="/logo/icone-jij.png"
          alt="JIJ 2026"
          width={64}
          height={64}
          className="h-16 w-16 opacity-70"
        />
        <p className="mt-4 max-w-md text-fg-muted">
          Ce lien de confirmation est invalide. Contactez l&apos;organisation
          si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  if (participant.statut === "confirme" && participant.token_qr) {
    const qrDataUrl = await genererQrDataUrl(participant.token_qr);
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 py-12 text-center">
        <Image
          src="/logo/icone-jij.png"
          alt="JIJ 2026"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <h1 className="font-display mt-4 text-xl font-bold text-accent-green">
          Présence confirmée ✅
        </h1>
        <p className="mt-2 max-w-md text-fg-muted">
          Merci {participant.nom_complet}. Présentez ce QR code (sur votre
          téléphone ou imprimé) à l&apos;entrée de l&apos;événement. Il vous a
          également été envoyé par email.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt="QR code d'accès"
          className="mt-6 h-56 w-56 rounded-2xl border border-border bg-white p-3"
        />
      </div>
    );
  }

  const confirmerAction = confirmerPresenceAction.bind(null, token);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <Image
        src="/logo/icone-jij.png"
        alt="JIJ 2026"
        width={72}
        height={72}
        className="h-[72px] w-[72px]"
      />
      <h1 className="font-display mt-4 text-xl font-bold text-fg">
        Journée Internationale de la Jeunesse 2026
      </h1>
      <p className="mt-3 max-w-md text-fg-muted">
        Bonjour {participant.nom_complet}, merci de confirmer votre présence
        à l&apos;événement.
      </p>
      <form action={confirmerAction} className="mt-6">
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-fg transition-colors hover:bg-primary-hover"
        >
          Je confirme ma présence
        </button>
      </form>
    </div>
  );
}
