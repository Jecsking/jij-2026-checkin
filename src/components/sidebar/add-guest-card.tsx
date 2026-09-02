"use client";

import { useActionState, useEffect, useState } from "react";
import { useSidebar } from "./sidebar-context";
import { ajouterInviteAction, type ResultatAjoutInvite } from "@/app/admin/participants/actions";
import { IconeAjouterInvite } from "@/components/icons";

const ETAT_INITIAL: ResultatAjoutInvite = {};

export function AddGuestCard() {
  const { reduite } = useSidebar();
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      <div className="px-3 pb-3">
        {reduite ? (
          <button
            type="button"
            onClick={() => setOuvert(true)}
            title="Ajouter un invité"
            aria-label="Ajouter un invité"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand-navy-deep py-2.5 text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <IconeAjouterInvite className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <div className="rounded-xl bg-gradient-to-br from-primary to-brand-navy-deep p-4 shadow-sm">
            <IconeAjouterInvite className="h-6 w-6 text-white" />
            <p className="mt-2 text-sm font-semibold text-white">
              Ajouter un invité
            </p>
            <p className="mt-1 text-xs text-white/80">
              Enregistrez directement un invité depuis le système.
            </p>
            <button
              type="button"
              onClick={() => setOuvert(true)}
              className="mt-3 w-full rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
            >
              + Ajouter un invité
            </button>
          </div>
        )}
      </div>

      {ouvert && <AjouterInviteModal onFermer={() => setOuvert(false)} />}
    </>
  );
}

function AjouterInviteModal({ onFermer }: { onFermer: () => void }) {
  const [etat, dispatch, enCours] = useActionState(
    ajouterInviteAction,
    ETAT_INITIAL
  );

  useEffect(() => {
    if (etat.succes) {
      const minuteur = setTimeout(onFermer, 1500);
      return () => clearTimeout(minuteur);
    }
  }, [etat.succes, onFermer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Ajouter un invité</h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="text-fg-muted hover:text-fg"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-fg-muted">
          Il apparaîtra dans la liste des participants comme les autres.
        </p>

        <form action={dispatch} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs text-fg-muted">Nom complet</label>
            <input
              name="nom_complet"
              required
              placeholder="Prénom Nom"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-fg-muted">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-fg-muted">Téléphone</label>
              <input
                name="telephone"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted">Sexe</label>
              <select
                name="sexe"
                defaultValue=""
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
              >
                <option value="">—</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-fg-muted">Commune</label>
              <input
                name="commune"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted">Profil</label>
              <input
                name="profil"
                placeholder="Invité"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-fg-muted">Participation</label>
            <select
              name="participation"
              defaultValue="deux_jours"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
            >
              <option value="jour1">Jour 1 uniquement</option>
              <option value="jour2">Jour 2 uniquement</option>
              <option value="deux_jours">Les deux jours</option>
            </select>
          </div>

          {etat.erreur && (
            <p className="text-sm text-error-text">{etat.erreur}</p>
          )}
          {etat.succes && (
            <p className="text-sm text-primary">Invité ajouté avec succès.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onFermer}
              className="rounded-md px-4 py-2 text-sm font-medium text-fg-muted hover:bg-surface-hover"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
            >
              {enCours ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
