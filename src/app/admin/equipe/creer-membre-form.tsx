"use client";

import { useActionState } from "react";
import { creerMembreEquipeAction, type ResultatCreationMembre } from "./actions";

const ETAT_INITIAL: ResultatCreationMembre = {};

export function CreerMembreForm() {
  const [etat, dispatch, enCours] = useActionState(
    creerMembreEquipeAction,
    ETAT_INITIAL
  );

  return (
    <form
      action={dispatch}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
    >
      <div>
        <label className="block text-xs text-fg-muted">Nom complet</label>
        <input
          name="nom_complet"
          required
          placeholder="Prénom Nom"
          className="mt-1 rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-fg-muted">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-fg-muted">Rôle</label>
        <select
          name="role"
          required
          defaultValue="staff"
          className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="admin">Admin (accès complet)</option>
          <option value="staff">Hôtesse (contrôle d&apos;accès)</option>
          <option value="jury">Jury (notation)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-fg-muted">
          Mot de passe (optionnel)
        </label>
        <input
          name="mot_de_passe"
          type="text"
          minLength={8}
          placeholder="généré si vide"
          className="mt-1 rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
      >
        {enCours ? "Création..." : "Créer le compte"}
      </button>

      {etat.erreur && (
        <p className="w-full text-sm text-error-text">{etat.erreur}</p>
      )}
      {etat.succes && (
        <p className="w-full text-sm text-primary">
          Compte créé, identifiants envoyés par email.
          {etat.motDePasseGenere && (
            <>
              {" "}
              Mot de passe généré : <strong>{etat.motDePasseGenere}</strong>
            </>
          )}
        </p>
      )}
    </form>
  );
}
