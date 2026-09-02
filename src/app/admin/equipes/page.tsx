import { createClient } from "@/lib/supabase/server";
import {
  creerEquipeAction,
  supprimerEquipeAction,
  ajouterMembreAction,
  supprimerMembreAction,
} from "./actions";

export default async function EquipesPage() {
  const supabase = await createClient();

  const { data: equipes } = await supabase
    .from("equipes")
    .select("*, membres_equipe(*)")
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Équipes du hackathon
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Les équipes ne sont pas encore connues : créez-les et ajoutez leurs
        membres au fur et à mesure de leur constitution.
      </p>

      <form
        action={creerEquipeAction}
        className="mt-6 flex flex-wrap gap-3 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <input
          name="nom"
          required
          placeholder="Nom de l'équipe"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          name="description"
          placeholder="Description (optionnel)"
          className="flex-1 min-w-[200px] rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Créer l&apos;équipe
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {(equipes ?? []).map((equipe) => (
          <div
            key={equipe.id}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-900">{equipe.nom}</h2>
                {equipe.description && (
                  <p className="text-sm text-zinc-500">{equipe.description}</p>
                )}
              </div>
              <form action={supprimerEquipeAction}>
                <input type="hidden" name="id" value={equipe.id} />
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline"
                >
                  Supprimer l&apos;équipe
                </button>
              </form>
            </div>

            <ul className="mt-3 space-y-1">
              {(equipe.membres_equipe ?? []).map(
                (membre: { id: string; nom_complet: string; email: string | null; role: string | null }) => (
                  <li
                    key={membre.id}
                    className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-1.5 text-sm"
                  >
                    <span>
                      {membre.nom_complet}
                      {membre.role && (
                        <span className="text-zinc-400"> — {membre.role}</span>
                      )}
                      {membre.email && (
                        <span className="text-zinc-400"> ({membre.email})</span>
                      )}
                    </span>
                    <form action={supprimerMembreAction}>
                      <input type="hidden" name="id" value={membre.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline"
                      >
                        Retirer
                      </button>
                    </form>
                  </li>
                )
              )}
            </ul>

            <form
              action={ajouterMembreAction}
              className="mt-3 flex flex-wrap gap-2"
            >
              <input type="hidden" name="equipe_id" value={equipe.id} />
              <input
                name="nom_complet"
                required
                placeholder="Nom du membre"
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                name="role"
                placeholder="Rôle (optionnel)"
                className="w-32 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                name="email"
                type="email"
                placeholder="Email (optionnel)"
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                name="telephone"
                placeholder="Téléphone (optionnel)"
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
              >
                Ajouter
              </button>
            </form>
          </div>
        ))}

        {(equipes ?? []).length === 0 && (
          <p className="text-sm text-zinc-400">Aucune équipe pour le moment.</p>
        )}
      </div>
    </div>
  );
}
