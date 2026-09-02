import { createClient } from "@/lib/supabase/server";
import { togglerClotureAction, togglerPublicationAction } from "./actions";

export default async function ClassementPage() {
  const supabase = await createClient();

  const { data: parametres } = await supabase
    .from("parametres_evenement")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const { data: classement } = await supabase
    .from("vue_classement")
    .select("*")
    .order("score_final", { ascending: false, nullsFirst: false });

  const { count: nbJures } = await supabase
    .from("jures")
    .select("id", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">
        Classement du hackathon
      </h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <form action={togglerClotureAction}>
          <button
            type="submit"
            name="votes_clotures"
            value={parametres?.votes_clotures ? "on" : "off"}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              parametres?.votes_clotures
                ? "bg-warning-soft text-fg"
                : "bg-accent-crimson text-white hover:bg-accent-crimson/90"
            }`}
          >
            {parametres?.votes_clotures
              ? "Rouvrir le vote"
              : "Clôturer le vote du jury"}
          </button>
        </form>
        <form action={togglerPublicationAction}>
          <button
            type="submit"
            name="classement_publie"
            value={parametres?.classement_publie ? "on" : "off"}
            disabled={!parametres?.votes_clotures}
            className="rounded-md bg-accent-crimson px-4 py-2 text-sm font-medium text-white hover:bg-accent-crimson/90 disabled:opacity-50"
          >
            {parametres?.classement_publie
              ? "Dépublier le classement"
              : "Publier le classement publiquement"}
          </button>
        </form>
      </div>
      {!parametres?.votes_clotures && (
        <p className="mt-2 text-xs text-fg-muted">
          Clôturez le vote avant de pouvoir publier le classement.
        </p>
      )}

      <p className="mt-4 text-xs text-fg-muted">
        Passage 1 compte pour 50 points, passage 2 pour 100 points. La note
        finale est leur somme, sur 150.
      </p>

      <div className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">#</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Équipe</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Passage 1 (/50)</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Passage 2 (/100)</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Score final (/150)</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Jurés ayant noté</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(classement ?? []).map((c, index) => (
              <tr key={c.equipe_id} className={index === 0 ? "bg-primary/10" : ""}>
                <td className="px-4 py-2 font-semibold">{index + 1}</td>
                <td className="px-4 py-2">{c.nom}</td>
                <td className="px-4 py-2 text-fg-muted">
                  {c.score_passage1 !== null
                    ? (c.score_passage1 * 0.5).toFixed(1)
                    : "—"}
                </td>
                <td className="px-4 py-2 text-fg-muted">
                  {c.score_passage2 !== null ? c.score_passage2.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-2 font-medium text-primary">
                  {c.score_final !== null ? c.score_final.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-2 text-fg-muted">
                  P1 : {c.nb_jures_passage1}/{nbJures ?? 0} · P2 :{" "}
                  {c.nb_jures_passage2}/{nbJures ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(classement ?? []).length === 0 && (
          <p className="p-4 text-sm text-fg-muted">Aucune équipe pour le moment.</p>
        )}
      </div>
    </div>
  );
}
