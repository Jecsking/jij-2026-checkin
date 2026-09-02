"use client";

import { useActionState } from "react";
import { creerJureAction, type ResultatCreationJure } from "./actions";

const ETAT_INITIAL: ResultatCreationJure = {};

export function CreerJureForm() {
  const [etat, dispatch, enCours] = useActionState(creerJureAction, ETAT_INITIAL);

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
      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
      >
        {enCours ? "Création..." : "Créer le compte jury"}
      </button>
      {etat.erreur && (
        <p className="w-full text-sm text-error-text">{etat.erreur}</p>
      )}
      {etat.succes && (
        <p className="w-full text-sm text-primary">
          Compte créé, identifiants envoyés par email.
        </p>
      )}
    </form>
  );
}
