"use client";

import { useActionState, useMemo, useState } from "react";
import {
  envoyerCampagneUnePersonneAction,
  type ResultatCampagne,
} from "./actions";

const ETAT_INITIAL: ResultatCampagne = {};

export function EnvoyerUnePersonneForm({
  participants,
}: {
  participants: { id: string; nom_complet: string; email: string }[];
}) {
  const [etat, dispatch, enCours] = useActionState(
    envoyerCampagneUnePersonneAction,
    ETAT_INITIAL
  );
  const [recherche, setRecherche] = useState("");

  const trouve = useMemo(
    () =>
      participants.find(
        (p) => p.nom_complet.trim().toLowerCase() === recherche.trim().toLowerCase()
      ),
    [participants, recherche]
  );

  return (
    <form action={dispatch} className="mt-4 space-y-3">
      <div>
        <label className="block text-xs text-fg-muted">
          Nom de la personne
        </label>
        <input
          list="dl-personnes-campagne"
          name="nom_recherche"
          autoComplete="off"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Tapez un nom..."
          className="mt-1 w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
        <datalist id="dl-personnes-campagne">
          {participants.map((p) => (
            <option key={p.id} value={p.nom_complet} />
          ))}
        </datalist>
        {recherche && !trouve && (
          <p className="mt-1 text-xs text-error-text">
            Aucun participant avec exactement ce nom.
          </p>
        )}
        {trouve && (
          <p className="mt-1 text-xs text-fg-muted">{trouve.email}</p>
        )}
      </div>

      <input type="hidden" name="participant_id" value={trouve?.id ?? ""} />

      <button
        type="submit"
        disabled={enCours || !trouve}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        onClick={(e) => {
          if (
            !confirm(
              `Envoyer l'email de confirmation à ${trouve?.nom_complet} uniquement ?`
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        {enCours ? "Envoi..." : "Envoyer à cette personne"}
      </button>

      {etat.erreur && (
        <p className="rounded-md bg-error-soft p-3 text-sm text-error-text">
          {etat.erreur}
        </p>
      )}
      {etat.succes && (
        <p className="rounded-md bg-primary/10 p-3 text-sm text-fg">
          Email envoyé avec succès.
        </p>
      )}
    </form>
  );
}
