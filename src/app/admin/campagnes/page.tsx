import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SegmentCount } from "./segment-count";
import { EnvoyerCampagneForm } from "./envoyer-campagne-form";
import { EnvoyerUnePersonneForm } from "./envoyer-une-personne-form";
import { VilleMultiSelect } from "@/components/ville-multi-select";

const LIBELLES_PARTICIPATION: Record<string, string> = {
  jour1: "Jour 1 uniquement",
  jour2: "Jour 2 uniquement",
  deux_jours: "Les deux jours",
};

const LIBELLES_STATUT: Record<string, string> = {
  inscrit: "Inscrit (jamais contacté)",
  email_envoye: "Email envoyé, sans réponse (relance)",
  confirme: "Déjà confirmé",
};

const LIBELLES_TYPE_ENVOI: Record<string, string> = {
  confirmation: "Envoyé",
  qr_code: "Code QR",
};

interface RechercheParams {
  profil?: string;
  participation?: string;
  statut?: string;
  ville?: string | string[];
}

export default async function CampagnesPage({
  searchParams,
}: {
  searchParams: Promise<RechercheParams>;
}) {
  const params = await searchParams;
  const villeSelection = Array.isArray(params.ville)
    ? params.ville
    : params.ville
      ? [params.ville]
      : [];
  const supabase = await createClient();

  const { data: profilsDistincts } = await supabase
    .from("participants")
    .select("profil")
    .not("profil", "is", null);
  const profils = Array.from(
    new Set((profilsDistincts ?? []).map((p) => p.profil).filter(Boolean))
  ).sort() as string[];

  const { data: villesDistinctes } = await supabase
    .from("participants")
    .select("commune_normalisee")
    .not("commune_normalisee", "is", null);
  const villes = Array.from(
    new Set(
      (villesDistinctes ?? []).map((p) => p.commune_normalisee).filter(Boolean)
    )
  ).sort() as string[];

  const { data: historiqueBrut } = await supabase
    .from("emails_envoyes")
    .select(
      "id, participant_id, type, date_envoi, statut_brevo, erreur, participants(nom_complet, email)"
    )
    .order("date_envoi", { ascending: false })
    .limit(300);

  // Une seule ligne par participant : celle de son événement le plus récent
  // (donc "code QR" prime sur "envoyé" pour qui a confirmé, puisqu'il est
  // toujours envoyé après).
  const parParticipant = new Map<
    string,
    NonNullable<typeof historiqueBrut>[number]
  >();
  for (const h of historiqueBrut ?? []) {
    if (!parParticipant.has(h.participant_id)) {
      parParticipant.set(h.participant_id, h);
    }
  }
  // Les confirmés (code QR) remontent en haut, au fur et à mesure qu'ils
  // confirment ; les non-confirmés restent en dessous.
  const historique = Array.from(parParticipant.values())
    .sort((a, b) => {
      const aConfirme = a.type === "qr_code" ? 1 : 0;
      const bConfirme = b.type === "qr_code" ? 1 : 0;
      if (aConfirme !== bConfirme) return bConfirme - aConfirme;
      return (
        new Date(b.date_envoi).getTime() - new Date(a.date_envoi).getTime()
      );
    })
    .slice(0, 50);

  const { data: tousParticipants } = await supabase
    .from("participants")
    .select("id, nom_complet, email")
    .order("nom_complet", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">
        Campagnes de confirmation
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Sélectionnez un segment de participants pour leur envoyer l&apos;email
        de confirmation de présence via Brevo.
      </p>

      <form
        method="get"
        className="mt-6 flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-4"
      >
        <select
          name="profil"
          defaultValue={params.profil ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        >
          <option value="">Tous les profils</option>
          {profils.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          name="participation"
          defaultValue={params.participation ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        >
          <option value="">Toute participation</option>
          {Object.entries(LIBELLES_PARTICIPATION).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          name="statut"
          defaultValue={params.statut ?? "inscrit"}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        >
          <option value="">Tout statut</option>
          {Object.entries(LIBELLES_STATUT).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <VilleMultiSelect villes={villes} selection={villeSelection} />
        <button
          type="submit"
          className="rounded-md bg-accent-crimson px-4 py-2 text-sm font-medium text-white hover:bg-accent-crimson/90"
        >
          Mettre à jour le segment
        </button>
      </form>

      <div className="mt-4 rounded-lg border border-border bg-surface p-4">
        <Suspense fallback={<p className="text-sm text-fg-muted">Calcul du segment...</p>}>
          <SegmentCount
            profil={params.profil}
            participation={params.participation}
            statut={params.statut}
            ville={villeSelection}
          />
        </Suspense>
        <EnvoyerCampagneForm
          profil={params.profil}
          participation={params.participation}
          statut={params.statut}
          ville={villeSelection}
        />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-fg">
          Envoyer à une seule personne
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Tapez un nom pour cibler une seule personne, indépendamment du
          segment ci-dessus.
        </p>
        <EnvoyerUnePersonneForm participants={tousParticipants ?? []} />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-fg">
        Historique des envois
      </h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Participant</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Type</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Date</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(historique ?? []).map((h) => {
              const participant = Array.isArray(h.participants)
                ? h.participants[0]
                : h.participants;
              return (
                <tr key={h.id}>
                  <td className="px-4 py-2">
                    {participant?.nom_complet}{" "}
                    <span className="text-fg-muted">{participant?.email}</span>
                  </td>
                  <td className="px-4 py-2">
                    {LIBELLES_TYPE_ENVOI[h.type] ?? h.type}
                  </td>
                  <td className="px-4 py-2 text-fg-muted">
                    {new Date(h.date_envoi).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-2">
                    {h.type === "qr_code" ? (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs text-success-text">
                        Confirmé
                      </span>
                    ) : (
                      <span className="rounded-full bg-error-soft px-2 py-0.5 text-xs text-error-text">
                        Non confirmé
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
