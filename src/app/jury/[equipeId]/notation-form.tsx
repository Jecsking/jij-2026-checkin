"use client";

import { useActionState } from "react";
import { enregistrerNotesAction, type ResultatNotation } from "./actions";
import type { Passage } from "@/types/database";

const ETAT_INITIAL: ResultatNotation = {};

interface Critere {
  id: string;
  libelle: string;
  description: string | null;
  poids: number;
}

export function NotationForm({
  equipeId,
  passage,
  maxPoints,
  criteres,
  notesExistantes,
  votesClotures,
}: {
  equipeId: string;
  passage: Passage;
  maxPoints: number;
  criteres: Critere[];
  notesExistantes: Record<string, number>;
  votesClotures: boolean;
}) {
  const action = enregistrerNotesAction.bind(null, equipeId, passage);
  const [etat, dispatch, enCours] = useActionState(action, ETAT_INITIAL);
  const valeurParDefaut = Math.round(maxPoints / 2);

  return (
    <form action={dispatch} className="mt-6 space-y-4">
      {criteres.map((critere) => (
        <div
          key={critere.id}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <label className="font-medium text-fg">
              {critere.libelle}
              <span className="ml-2 text-xs text-fg-muted">
                (poids {critere.poids})
              </span>
            </label>
          </div>
          {critere.description && (
            <p className="mt-1 text-sm text-fg-muted">{critere.description}</p>
          )}
          <input
            type="range"
            name={`critere_${critere.id}`}
            min={0}
            max={maxPoints}
            step={1}
            disabled={votesClotures}
            defaultValue={notesExistantes[critere.id] ?? valeurParDefaut}
            className="mt-3 w-full accent-primary"
            onInput={(e) => {
              const output = e.currentTarget.nextElementSibling;
              if (output) output.textContent = e.currentTarget.value;
            }}
          />
          <output className="mt-1 block text-sm font-semibold text-primary">
            {notesExistantes[critere.id] ?? valeurParDefaut} / {maxPoints}
          </output>
        </div>
      ))}

      {criteres.length === 0 && (
        <p className="text-sm text-fg-muted">
          Aucun critère de notation actif n&apos;a été configuré.
        </p>
      )}

      {votesClotures && (
        <p className="rounded-md bg-warning-soft p-3 text-sm text-fg">
          Le vote est clôturé, les notes ne peuvent plus être modifiées.
        </p>
      )}

      {criteres.length > 0 && !votesClotures && (
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        >
          {enCours
            ? "Enregistrement..."
            : `Enregistrer mes notes — Passage ${passage} (/${maxPoints})`}
        </button>
      )}

      {etat.erreur && <p className="text-sm text-error-text">{etat.erreur}</p>}
      {etat.succes && (
        <p className="text-sm text-primary">Notes enregistrées.</p>
      )}
    </form>
  );
}
