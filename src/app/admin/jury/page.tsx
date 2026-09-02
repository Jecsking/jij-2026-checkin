import { createClient } from "@/lib/supabase/server";
import { CreerJureForm } from "./creer-jure-form";
import { supprimerJureAction } from "./actions";

export default async function JuryPage() {
  const supabase = await createClient();
  const { data: jures } = await supabase
    .from("jures")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Jury</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Chaque juré reçoit un compte par email pour noter les équipes.
      </p>

      <div className="mt-6">
        <CreerJureForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-zinc-500">Nom</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-500">Email</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {(jures ?? []).map((j) => (
              <tr key={j.id}>
                <td className="px-4 py-2">{j.nom_complet}</td>
                <td className="px-4 py-2 text-zinc-500">{j.email}</td>
                <td className="px-4 py-2">
                  <form action={supprimerJureAction}>
                    <input type="hidden" name="id" value={j.id} />
                    <input
                      type="hidden"
                      name="compte_auth_id"
                      value={j.compte_auth_id ?? ""}
                    />
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline"
                    >
                      Retirer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(jures ?? []).length === 0 && (
          <p className="p-4 text-sm text-zinc-400">Aucun juré pour le moment.</p>
        )}
      </div>
    </div>
  );
}
