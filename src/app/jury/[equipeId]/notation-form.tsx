"use client";

import { useActionState } from "react";
import { enregistrerNotesAction, type ResultatNotation } from "./actions";

const ETAT_INITIAL: ResultatNotation = {};

interface Critere {
  id: string;
  libelle: string;
  description: string | null;
  poids: number;
}

export function NotationForm({
  equipeId,
  criteres,
  notesExistantes,
  votesClotures,
}: {
  equipeId: string;
  criteres: Critere[];
  notesExistantes: Record<string, number>;
  votesClotures: boolean;
}) {
  const action = enregistrerNotesAction.bind(null, equipeId);
  const [etat, dispatch, enCours] = useActionState(action, ETAT_INITIAL);

  return (
    <form action={dispatch} className="mt-6 space-y-4">
      {criteres.map((critere) => (
        <div
          key={critere.id}
          className="rounded-lg border border-zinc-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <label className="font-medium text-zinc-900">
              {critere.libelle}
              <span className="ml-2 text-xs text-zinc-400">
                (poids {critere.poids})
              </span>
            </label>
          </div>
          {critere.description && (
            <p className="mt-1 text-sm text-zinc-500">{critere.description}</p>
          )}
          <input
            type="range"
            name={`critere_${critere.id}`}
            min={0}
            max={10}
            step={0.5}
            disabled={votesClotures}
            defaultValue={notesExistantes[critere.id] ?? 5}
            className="mt-3 w-full accent-teal-700"
            onInput={(e) => {
              const output = e.currentTarget.nextElementSibling;
              if (output) output.textContent = e.currentTarget.value;
            }}
          />
          <output className="mt-1 block text-sm font-semibold text-teal-800">
            {notesExistantes[critere.id] ?? 5}
          </output>
        </div>
      ))}

      {criteres.length === 0 && (
        <p className="text-sm text-zinc-400">
          Aucun critère de notation actif n&apos;a été configuré.
        </p>
      )}

      {votesClotures && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Le vote est clôturé, les notes ne peuvent plus être modifiées.
        </p>
      )}

      {criteres.length > 0 && !votesClotures && (
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {enCours ? "Enregistrement..." : "Enregistrer mes notes"}
        </button>
      )}

      {etat.erreur && <p className="text-sm text-red-600">{etat.erreur}</p>}
      {etat.succes && (
        <p className="text-sm text-teal-700">Notes enregistrées.</p>
      )}
    </form>
  );
}
