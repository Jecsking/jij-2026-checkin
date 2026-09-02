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
          className="text-sm text-teal-700 hover:underline"
        >
          ← Retour aux participants
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900">
        Importer les inscrits
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
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
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={enCours}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {enCours ? "Import en cours..." : "Importer"}
        </button>
      </form>

      {etat.erreur && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {etat.erreur}
        </p>
      )}

      {etat.succes && (
        <div className="mt-4 rounded-md bg-teal-50 p-4 text-sm text-teal-900">
          <p>
            {etat.total} ligne(s) traitée(s) — {etat.crees} créé(s),{" "}
            {etat.misAJour} mis à jour.
          </p>
          {etat.erreursLignes && etat.erreursLignes.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-red-700">
                Erreurs sur certaines lignes :
              </p>
              <ul className="mt-1 list-disc pl-5 text-red-700">
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
