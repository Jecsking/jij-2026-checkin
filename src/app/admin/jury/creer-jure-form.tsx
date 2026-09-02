"use client";

import { useActionState } from "react";
import { creerJureAction, type ResultatCreationJure } from "./actions";

const ETAT_INITIAL: ResultatCreationJure = {};

export function CreerJureForm() {
  const [etat, dispatch, enCours] = useActionState(creerJureAction, ETAT_INITIAL);

  return (
    <form
      action={dispatch}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div>
        <label className="block text-xs text-zinc-500">Nom complet</label>
        <input
          name="nom_complet"
          required
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-zinc-500">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {enCours ? "Création..." : "Créer le compte jury"}
      </button>
      {etat.erreur && (
        <p className="w-full text-sm text-red-600">{etat.erreur}</p>
      )}
      {etat.succes && (
        <p className="w-full text-sm text-teal-700">
          Compte créé, identifiants envoyés par email.
        </p>
      )}
    </form>
  );
}
