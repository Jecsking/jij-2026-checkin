"use client";

import { useActionState, useState } from "react";
import { creerMembreEquipeAction, type ResultatCreationMembre } from "./actions";

const ETAT_INITIAL: ResultatCreationMembre = {};

export function CreerMembreForm() {
  const [etat, dispatch, enCours] = useActionState(
    creerMembreEquipeAction,
    ETAT_INITIAL
  );
  const [role, setRole] = useState("staff");

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
          className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </div>
      <div>
        <label className="block text-xs text-fg-muted">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </div>
      <div>
        <label className="block text-xs text-fg-muted">Rôle</label>
        <select
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
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
          className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </div>
      {role === "admin" && (
        <label className="mb-2 flex items-center gap-2 text-xs text-fg-muted">
          <input type="checkbox" name="super_admin" className="h-4 w-4" />
          Super admin (peut gérer l&apos;équipe)
        </label>
      )}
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
