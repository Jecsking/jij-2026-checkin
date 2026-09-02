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
        <h1 className="text-2xl font-semibold text-zinc-900">Paramètres</h1>
        <p className="mt-1 text-sm text-zinc-600">
          La clôture du vote et la publication du classement se gèrent depuis
          la page{" "}
          <a href="/admin/classement" className="text-teal-700 hover:underline">
            Classement
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-700">
          Variables d&apos;environnement
        </h2>
        <ul className="mt-2 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
          {VARIABLES_REQUISES.map((nom) => {
            const definie = Boolean(process.env[nom]);
            return (
              <li
                key={nom}
                className="flex items-center justify-between px-4 py-2 text-sm"
              >
                <code className="text-zinc-700">{nom}</code>
                <span
                  className={
                    definie
                      ? "text-teal-700"
                      : "font-medium text-red-600"
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
        <h2 className="text-sm font-semibold text-zinc-700">
          Créer un compte admin ou staff
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
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
