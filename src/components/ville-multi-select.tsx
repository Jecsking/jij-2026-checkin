"use client";

import { useEffect, useRef, useState } from "react";

export function VilleMultiSelect({
  villes,
  selection,
  nomChamp = "ville",
}: {
  villes: string[];
  selection: string[];
  nomChamp?: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [choisies, setChoisies] = useState<Set<string>>(new Set(selection));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickDehors(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    document.addEventListener("mousedown", onClickDehors);
    return () => document.removeEventListener("mousedown", onClickDehors);
  }, []);

  function basculer(v: string) {
    setChoisies((prev) => {
      const suivant = new Set(prev);
      if (suivant.has(v)) suivant.delete(v);
      else suivant.add(v);
      return suivant;
    });
  }

  const villesFiltrees = villes.filter((v) =>
    v.toLowerCase().includes(recherche.toLowerCase())
  );

  const libelle =
    choisies.size === 0
      ? "Toute ville"
      : choisies.size === 1
        ? [...choisies][0]
        : `${choisies.size} villes`;

  return (
    <div className="relative" ref={ref}>
      {/* Les cases à cocher ci-dessous ne servent qu'à l'affichage : elles
          disparaissent du DOM quand le menu se ferme (y compris au moment
          même où on clique sur "Filtrer", qui est hors du menu). Ces champs
          cachés, eux, restent toujours montés et portent la vraie valeur
          soumise au formulaire. */}
      {[...choisies].map((v) => (
        <input key={v} type="hidden" name={nomChamp} value={v} />
      ))}
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
      >
        {libelle}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 transition-transform ${ouvert ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {ouvert && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-border bg-surface shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une ville..."
              className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-fg placeholder:text-fg-muted"
            />
          </div>
          <div className="max-h-64 overflow-y-auto border-t border-border p-1.5">
            {villesFiltrees.map((v) => (
              <label
                key={v}
                className="flex items-center gap-2 rounded px-1.5 py-1.5 text-sm text-fg hover:bg-surface-hover"
              >
                <input
                  type="checkbox"
                  checked={choisies.has(v)}
                  onChange={() => basculer(v)}
                  className="h-4 w-4"
                />
                {v}
              </label>
            ))}
            {villesFiltrees.length === 0 && (
              <p className="px-1.5 py-2 text-xs text-fg-muted">Aucun résultat.</p>
            )}
          </div>
          {choisies.size > 0 && (
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => setChoisies(new Set())}
                className="text-xs text-error-text hover:underline"
              >
                Tout désélectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
