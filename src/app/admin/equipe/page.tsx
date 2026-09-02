import { createAdminClient } from "@/lib/supabase/admin";
import { CreerMembreForm } from "./creer-membre-form";
import { supprimerMembreEquipeAction } from "./actions";

const LIBELLES_ROLE: Record<string, { texte: string; classe: string }> = {
  admin: { texte: "Admin", classe: "bg-accent-crimson/10 text-accent-crimson" },
  staff: { texte: "Hôtesse", classe: "bg-info/10 text-info-text" },
  jury: { texte: "Jury", classe: "bg-accent-purple/10 text-accent-purple" },
};

export default async function EquipePage() {
  const admin = createAdminClient();

  const { data: profils } = await admin
    .from("profils_utilisateurs")
    .select("*")
    .order("created_at", { ascending: true });

  const {
    data: { users },
  } = await admin.auth.admin.listUsers();
  const emailParId = new Map(users.map((u) => [u.id, u.email ?? "—"]));

  const { data: juresRows } = await admin
    .from("jures")
    .select("id, compte_auth_id");
  const jureIdParCompte = new Map(
    (juresRows ?? [])
      .filter((j) => j.compte_auth_id)
      .map((j) => [j.compte_auth_id as string, j.id])
  );

  const membres = profils ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">Équipe</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Gérez qui a accès à la plateforme : administrateurs (accès complet),
        hôtesses d&apos;accueil (contrôle d&apos;accès uniquement) et jury
        (notation uniquement). Chaque personne reçoit ses identifiants par
        email.
      </p>

      <div className="mt-6">
        <CreerMembreForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Nom</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Email</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted">Rôle</th>
              <th className="px-4 py-2 text-left font-medium text-fg-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {membres.map((m) => {
              const libelle = LIBELLES_ROLE[m.role] ?? {
                texte: m.role,
                classe: "bg-surface-hover text-fg-muted",
              };
              return (
                <tr key={m.id}>
                  <td className="px-4 py-2">{m.nom_complet ?? "—"}</td>
                  <td className="px-4 py-2 text-fg-muted">
                    {emailParId.get(m.id) ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${libelle.classe}`}
                    >
                      {libelle.texte}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <form action={supprimerMembreEquipeAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input
                        type="hidden"
                        name="jure_id"
                        value={jureIdParCompte.get(m.id) ?? ""}
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
              );
            })}
          </tbody>
        </table>
        {membres.length === 0 && (
          <p className="p-4 text-sm text-fg-muted">
            Aucun membre d&apos;équipe pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
