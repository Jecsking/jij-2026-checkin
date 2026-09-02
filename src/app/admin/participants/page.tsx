import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Participant, Participation, StatutParticipant } from "@/types/database";
import { supprimerParticipantAction } from "./actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

const PAR_PAGE = 50;

const LIBELLES_PARTICIPATION: Record<string, string> = {
  jour1: "Jour 1 uniquement",
  jour2: "Jour 2 uniquement",
  deux_jours: "Les deux jours",
};

const LIBELLES_STATUT: Record<string, string> = {
  inscrit: "Inscrit",
  email_envoye: "Email envoyé",
  confirme: "Confirmé",
};

interface RechercheParams {
  page?: string;
  recherche?: string;
  profil?: string;
  participation?: string;
  statut?: string;
  ville?: string;
}

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<RechercheParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const supabase = await createClient();

  let requete = supabase
    .from("participants")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.recherche) {
    requete = requete.or(
      `nom_complet.ilike.%${params.recherche}%,email.ilike.%${params.recherche}%`
    );
  }
  if (params.profil) requete = requete.eq("profil", params.profil);
  if (params.participation)
    requete = requete.eq("participation", params.participation as Participation);
  if (params.statut)
    requete = requete.eq("statut", params.statut as StatutParticipant);
  if (params.ville) requete = requete.eq("commune_normalisee", params.ville);

  const debut = (page - 1) * PAR_PAGE;
  const { data: participants, count } = await requete.range(
    debut,
    debut + PAR_PAGE - 1
  );

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

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE));

  function lienAvecParams(nouveaux: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const fusion = { ...params, ...nouveaux };
    Object.entries(fusion).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return `/admin/participants?${p.toString()}`;
  }

  const paramsSegmentCampagne = new URLSearchParams();
  if (params.profil) paramsSegmentCampagne.set("profil", params.profil);
  if (params.participation)
    paramsSegmentCampagne.set("participation", params.participation);
  if (params.statut) paramsSegmentCampagne.set("statut", params.statut);
  if (params.ville) paramsSegmentCampagne.set("ville", params.ville);
  const lienCampagne = `/admin/campagnes?${paramsSegmentCampagne.toString()}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fg">
          Participants ({count ?? 0})
        </h1>
        <div className="flex gap-2">
          <Link
            href={lienCampagne}
            className="rounded-md bg-accent-crimson px-4 py-2 text-sm font-medium text-white hover:bg-accent-crimson/90"
          >
            Envoyer une campagne à ce segment
          </Link>
          <Link
            href="/admin/participants/import"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover"
          >
            Importer
          </Link>
        </div>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="recherche"
          defaultValue={params.recherche}
          placeholder="Nom ou email..."
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
        <select
          name="profil"
          defaultValue={params.profil ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
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
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
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
          defaultValue={params.statut ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
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
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
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
          Filtrer
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Nom</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Email</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Téléphone</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Ville</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Profil</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Participation</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Statut</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Présence</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(participants as Participant[] | null)?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.nom_complet}</td>
                <td className="px-4 py-2 text-fg-muted">{p.email}</td>
                <td className="px-4 py-2 text-fg-muted">{p.telephone ?? "—"}</td>
                <td className="px-4 py-2">{p.commune_normalisee ?? "—"}</td>
                <td className="px-4 py-2">{p.profil ?? "—"}</td>
                <td className="px-4 py-2">
                  {p.participation
                    ? LIBELLES_PARTICIPATION[p.participation]
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-fg-muted">
                    {LIBELLES_STATUT[p.statut]}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-fg-muted">
                  {p.date_checkin_jour1 && "J1 ✓ "}
                  {p.date_checkin_jour2 && "J2 ✓"}
                  {!p.date_checkin_jour1 && !p.date_checkin_jour2 && "—"}
                </td>
                <td className="px-4 py-2">
                  <form action={supprimerParticipantAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmitButton
                      confirmMessage={`Supprimer définitivement ${p.nom_complet} ? Son historique d'emails sera aussi supprimé. Cette action est irréversible.`}
                      className="text-xs text-error-text hover:underline"
                    >
                      Supprimer
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-fg-muted">
        <span>
          Page {page} / {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={lienAvecParams({ page: String(page - 1) })}
              className="text-primary hover:underline"
            >
              ← Précédent
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={lienAvecParams({ page: String(page + 1) })}
              className="text-primary hover:underline"
            >
              Suivant →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
