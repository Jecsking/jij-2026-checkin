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
      <h1 className="text-2xl font-semibold text-fg">Jury</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Chaque juré reçoit un compte par email pour noter les équipes.
      </p>

      <div className="mt-6">
        <CreerJureForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Nom</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Email</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(jures ?? []).map((j) => (
              <tr key={j.id}>
                <td className="px-4 py-2">{j.nom_complet}</td>
                <td className="px-4 py-2 text-fg-muted">{j.email}</td>
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
                      className="text-xs text-error-text hover:underline"
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
          <p className="p-4 text-sm text-fg-muted">Aucun juré pour le moment.</p>
        )}
      </div>
    </div>
  );
}
