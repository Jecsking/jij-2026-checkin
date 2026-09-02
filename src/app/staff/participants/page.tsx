import { createClient } from "@/lib/supabase/server";

const LIBELLES_PARTICIPATION: Record<string, string> = {
  jour1: "Jour 1 uniquement",
  jour2: "Jour 2 uniquement",
  deux_jours: "Les deux jours",
};

interface RechercheParams {
  recherche?: string;
}

export default async function ParticipantsHotessePage({
  searchParams,
}: {
  searchParams: Promise<RechercheParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let requete = supabase
    .from("participants")
    .select(
      "id, nom_complet, email, profil, participation, date_checkin_jour1, date_checkin_jour2"
    )
    .eq("statut", "confirme")
    .order("nom_complet", { ascending: true });

  if (params.recherche) {
    requete = requete.or(
      `nom_complet.ilike.%${params.recherche}%,email.ilike.%${params.recherche}%`
    );
  }

  const { data: participants } = await requete;
  const liste = participants ?? [];
  const presentsJ1 = liste.filter((p) => p.date_checkin_jour1).length;
  const presentsJ2 = liste.filter((p) => p.date_checkin_jour2).length;

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-fg">
          Participants confirmés
        </h1>
        <div className="flex gap-4 text-sm text-fg-muted">
          <span>
            Jour 1 : <strong className="text-primary">{presentsJ1}</strong>/
            {liste.length}
          </span>
          <span>
            Jour 2 : <strong className="text-primary">{presentsJ2}</strong>/
            {liste.length}
          </span>
        </div>
      </div>

      <form method="get" className="mt-4">
        <input
          type="text"
          name="recherche"
          defaultValue={params.recherche}
          placeholder="Rechercher un nom ou un email..."
          className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </form>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Nom</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Email</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Participation</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Jour 1</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Jour 2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {liste.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.nom_complet}</td>
                <td className="px-4 py-2 text-fg-muted">{p.email}</td>
                <td className="px-4 py-2">
                  {p.participation
                    ? LIBELLES_PARTICIPATION[p.participation]
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {p.date_checkin_jour1 ? (
                    <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs text-success-text">
                      Présent
                    </span>
                  ) : (
                    <span className="text-fg-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {p.date_checkin_jour2 ? (
                    <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs text-success-text">
                      Présent
                    </span>
                  ) : (
                    <span className="text-fg-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {liste.length === 0 && (
          <p className="p-4 text-sm text-fg-muted">
            Aucun participant confirmé trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
