const VARIABLES_REQUISES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
  "BREVO_SENDER_NAME",
  "NEXT_PUBLIC_APP_URL",
];

export default function ParametresPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Paramètres</h1>
        <p className="mt-1 text-sm text-fg-muted">
          La clôture du vote et la publication du classement se gèrent depuis
          la page{" "}
          <a href="/admin/classement" className="text-primary hover:underline">
            Classement
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-fg">
          Variables d&apos;environnement
        </h2>
        <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-surface">
          {VARIABLES_REQUISES.map((nom) => {
            const definie = Boolean(process.env[nom]);
            return (
              <li
                key={nom}
                className="flex items-center justify-between px-4 py-2 text-sm"
              >
                <code className="text-fg">{nom}</code>
                <span
                  className={
                    definie
                      ? "text-primary"
                      : "font-medium text-danger"
                  }
                >
                  {definie ? "Configurée" : "Manquante"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-fg">
          Créer un compte admin ou staff
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Les comptes admin et staff ne se créent pas depuis cette interface.
          Depuis le Dashboard Supabase : Authentication → Users → Add user
          (email + mot de passe), puis dans l&apos;éditeur SQL :
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-100">
{`insert into public.profils_utilisateurs (id, role, nom_complet)
values ('<uid-de-l-utilisateur>', 'staff', 'Nom Prénom');`}
        </pre>
      </div>
    </div>
  );
}
