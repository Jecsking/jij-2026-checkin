"use client";

import { useActionState } from "react";
import { envoyerCampagneAction, type ResultatCampagne } from "./actions";

const ETAT_INITIAL: ResultatCampagne = {};

export function EnvoyerCampagneForm({
  profil,
  participation,
  statut,
  ville,
}: {
  profil?: string;
  participation?: string;
  statut?: string;
  ville?: string;
}) {
  const [etat, dispatch, enCours] = useActionState(
    envoyerCampagneAction,
    ETAT_INITIAL
  );

  return (
    <form action={dispatch} className="mt-4 space-y-3">
      <input type="hidden" name="profil" value={profil ?? ""} />
      <input type="hidden" name="participation" value={participation ?? ""} />
      <input type="hidden" name="statut" value={statut ?? ""} />
      <input type="hidden" name="ville" value={ville ?? ""} />

      <button
        type="submit"
        disabled={enCours}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        onClick={(e) => {
          if (
            !confirm(
              "Envoyer l'email de confirmation à tous les participants de ce segment ?"
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        {enCours ? "Envoi en cours..." : "Envoyer la campagne à ce segment"}
      </button>

      {etat.erreur && (
        <p className="rounded-md bg-danger-bg p-3 text-sm text-danger">
          {etat.erreur}
        </p>
      )}

      {etat.succes && (
        <div className="rounded-md bg-primary/10 p-4 text-sm text-fg">
          <p>
            {etat.envoyes} email(s) envoyé(s), {etat.echecs} échec(s).
          </p>
          {etat.erreursDetail && etat.erreursDetail.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-danger">
              {etat.erreursDetail.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
