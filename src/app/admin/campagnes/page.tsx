import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SegmentCount } from "./segment-count";
import { EnvoyerCampagneForm } from "./envoyer-campagne-form";

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

interface RechercheParams {
  profil?: string;
  participation?: string;
  statut?: string;
  ville?: string;
}

export default async function CampagnesPage({
  searchParams,
}: {
  searchParams: Promise<RechercheParams>;
}) {
  const params = await searchParams;
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

  const { data: historique } = await supabase
    .from("emails_envoyes")
    .select("id, type, date_envoi, statut_brevo, erreur, participants(nom_complet, email)")
    .order("date_envoi", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-3xl">
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
        <select
          name="ville"
          defaultValue={params.ville ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        >
          <option value="">Toute ville</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
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
            ville={params.ville}
          />
        </Suspense>
        <EnvoyerCampagneForm
          profil={params.profil}
          participation={params.participation}
          statut={params.statut}
          ville={params.ville}
        />
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
                  <td className="px-4 py-2">{h.type}</td>
                  <td className="px-4 py-2 text-fg-muted">
                    {new Date(h.date_envoi).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-2">
                    {h.statut_brevo === "envoye" ? (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs text-success-text">
                        Envoyé
                      </span>
                    ) : (
                      <span
                        title={h.erreur ?? ""}
                        className="rounded-full bg-error-soft px-2 py-0.5 text-xs text-error-text"
                      >
                        Échec
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
