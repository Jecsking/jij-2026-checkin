const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export default function ParametresPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">
          Paramètres généraux
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Informations générales sur l&apos;événement et liens utiles.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-fg">Événement</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">Nom</dt>
            <dd className="text-fg">Journée Internationale de la Jeunesse 2026</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Organisation</dt>
            <dd className="text-fg">Parlement des Jeunes du Bénin</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Durée</dt>
            <dd className="text-fg">2 jours</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-fg">Liens utiles</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="/admin/classement"
              className="text-primary hover:underline"
            >
              Clôturer le vote et publier le classement du hackathon
            </a>
          </li>
          <li>
            <a href="/classement" className="text-primary hover:underline">
              Voir la page de classement publique
            </a>
          </li>
          {APP_URL && (
            <li className="text-fg-muted">
              URL publique de la plateforme :{" "}
              <span className="text-fg">{APP_URL}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
