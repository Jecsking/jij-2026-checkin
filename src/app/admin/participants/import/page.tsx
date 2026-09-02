"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  importerParticipantsAction,
  type ResultatImport,
} from "./actions";

const ETAT_INITIAL: ResultatImport = {};

export default function ImportParticipantsPage() {
  const [etat, dispatch, enCours] = useActionState(
    importerParticipantsAction,
    ETAT_INITIAL
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link
          href="/admin/participants"
          className="text-sm text-primary hover:underline"
        >
          ← Retour aux participants
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-fg">
        Importer les inscrits
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Déposez l&apos;export du formulaire Google Form (.xlsx ou .csv). Les
        emails déjà présents sont mis à jour, les nouveaux sont créés — aucun
        doublon n&apos;est créé.
      </p>

      <form action={dispatch} className="mt-6 space-y-4">
        <input
          type="file"
          name="fichier"
          accept=".xlsx,.csv"
          required
          className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        >
          {enCours ? "Import en cours..." : "Importer"}
        </button>
      </form>

      {etat.erreur && (
        <p className="mt-4 rounded-md bg-error-soft p-3 text-sm text-error-text">
          {etat.erreur}
        </p>
      )}

      {etat.succes && (
        <div className="mt-4 rounded-md bg-primary/10 p-4 text-sm text-fg">
          <p>
            {etat.total} ligne(s) traitée(s) — {etat.crees} créé(s),{" "}
            {etat.misAJour} mis à jour.
          </p>
          {etat.erreursLignes && etat.erreursLignes.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-error-text">
                Erreurs sur certaines lignes :
              </p>
              <ul className="mt-1 list-disc pl-5 text-error-text">
                {etat.erreursLignes.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
