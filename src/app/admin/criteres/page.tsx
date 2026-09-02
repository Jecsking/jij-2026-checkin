import { createClient } from "@/lib/supabase/server";
import {
  creerCritereAction,
  modifierCritereAction,
  supprimerCritereAction,
  modifierPointsMaxAction,
} from "./actions";
import type { Passage } from "@/types/database";

export default async function CriteresPage({
  searchParams,
}: {
  searchParams: Promise<{ passage?: string }>;
}) {
  const { passage: passageBrut } = await searchParams;
  const passage: Passage = passageBrut === "2" ? 2 : 1;

  const supabase = await createClient();
  const { data: criteres } = await supabase
    .from("criteres_notation")
    .select("*")
    .eq("passage", passage)
    .order("ordre", { ascending: true });

  const { data: parametres } = await supabase
    .from("parametres_evenement")
    .select("points_max_passage1, points_max_passage2")
    .eq("id", 1)
    .maybeSingle();

  const pointsMax =
    passage === 1
      ? parametres?.points_max_passage1 ?? 50
      : parametres?.points_max_passage2 ?? 100;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">
        Critères de notation
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Chaque passage a ses propres critères et pondérations. Le score
        d&apos;une équipe pour un passage est la moyenne, entre jurés, de la
        somme pondérée de ses critères actifs.
      </p>

      <div className="mt-6 flex gap-2">
        {([1, 2] as const).map((p) => (
          <a
            key={p}
            href={`/admin/criteres?passage=${p}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              p === passage
                ? "bg-primary text-primary-fg"
                : "border border-border text-fg-muted hover:text-fg"
            }`}
          >
            Passage {p}
          </a>
        ))}
      </div>

      <form
        action={modifierPointsMaxAction}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
      >
        <input type="hidden" name="passage" value={passage} />
        <div>
          <label className="block text-xs text-fg-muted">
            Note totale du passage {passage}
          </label>
          <input
            name="points_max"
            type="number"
            step="1"
            min="1"
            defaultValue={pointsMax}
            className="mt-1 w-32 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent-crimson px-4 py-2 text-sm font-medium text-white hover:bg-accent-crimson/90"
        >
          Mettre à jour la note totale
        </button>
      </form>

      <form
        action={creerCritereAction}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
      >
        <input type="hidden" name="passage" value={passage} />
        <div>
          <label className="block text-xs text-fg-muted">Libellé</label>
          <input
            name="libelle"
            required
            placeholder="Ex. Innovation"
            className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">Description</label>
          <input
            name="description"
            placeholder="Optionnel"
            className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">Poids</label>
          <input
            name="poids"
            type="number"
            step="0.1"
            min="0.1"
            defaultValue="1"
            className="mt-1 w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover"
        >
          Ajouter au passage {passage}
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Libellé</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Poids</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Actif</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(criteres ?? []).map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">
                  {c.libelle}
                  {c.description && (
                    <p className="text-xs text-fg-muted">{c.description}</p>
                  )}
                </td>
                <td className="px-4 py-2">
                  <form action={modifierCritereAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="poids"
                      type="number"
                      step="0.1"
                      min="0.1"
                      defaultValue={c.poids}
                      className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-sm text-fg"
                    />
                    <label className="flex items-center gap-1 text-xs text-fg-muted">
                      <input
                        type="checkbox"
                        name="actif"
                        defaultChecked={c.actif}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded-md bg-accent-crimson px-2 py-1 text-xs font-medium text-white hover:bg-accent-crimson/90"
                    >
                      Mettre à jour
                    </button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  <form action={modifierCritereAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="poids" value={c.poids} />
                    <button
                      type="submit"
                      name="actif"
                      value={c.actif ? "off" : "on"}
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        c.actif
                          ? "bg-success-soft text-success-text"
                          : "bg-surface-hover text-fg-muted"
                      }`}
                    >
                      {c.actif ? "Actif" : "Inactif"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  <form action={supprimerCritereAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="text-xs text-error-text hover:underline"
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(criteres ?? []).length === 0 && (
          <p className="p-4 text-sm text-fg-muted">
            Aucun critère défini pour le passage {passage}.
          </p>
        )}
      </div>
    </div>
  );
}
