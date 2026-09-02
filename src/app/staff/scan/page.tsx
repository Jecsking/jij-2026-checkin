"use client";

import { useEffect, useRef, useState } from "react";

type StatutScan =
  | "ok"
  | "deja_scanne"
  | "non_reconnu"
  | "non_confirme"
  | "jour_non_prevu"
  | "erreur";

interface ResultatScan {
  statut: StatutScan;
  nomComplet?: string;
  profil?: string;
  participation?: string;
  horodatage?: string;
}

const LIBELLES_PARTICIPATION: Record<string, string> = {
  jour1: "Jour 1 uniquement",
  jour2: "Jour 2 uniquement",
  deux_jours: "Les deux jours",
};

const STYLE_PAR_STATUT: Record<StatutScan, string> = {
  ok: "bg-accent-green",
  jour_non_prevu: "bg-amber-500",
  deja_scanne: "bg-orange-600",
  non_confirme: "bg-orange-600",
  non_reconnu: "bg-red-600",
  erreur: "bg-red-600",
};

const MESSAGE_PAR_STATUT: Record<StatutScan, string> = {
  ok: "Accès autorisé",
  jour_non_prevu: "Accès autorisé (jour non prévu à l'inscription)",
  deja_scanne: "Déjà scanné pour cette journée",
  non_confirme: "Présence non confirmée",
  non_reconnu: "QR code non reconnu",
  erreur: "Erreur réseau",
};

export default function ScanPage() {
  const [jour, setJour] = useState<"jour1" | "jour2">("jour1");
  const [resultat, setResultat] = useState<ResultatScan | null>(null);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const jourRef = useRef(jour);
  const verrouilleRef = useRef(false);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  useEffect(() => {
    jourRef.current = jour;
  }, [jour]);

  useEffect(() => {
    let annule = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (annule || !conteneurRef.current) return;

      const scanner = new Html5Qrcode(conteneurRef.current.id);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (texteDecode) => {
            if (verrouilleRef.current) return;
            verrouilleRef.current = true;

            try {
              const reponse = await fetch("/api/checkin", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ token: texteDecode, jour: jourRef.current }),
              });
              const donnees = await reponse.json();
              setResultat(donnees);
            } catch {
              setResultat({ statut: "erreur" });
            }

            setTimeout(() => {
              verrouilleRef.current = false;
            }, 2500);
          },
          () => {
            // ignorer les frames sans QR code détecté
          }
        )
        .catch((err) => {
          console.error("Impossible de démarrer la caméra", err);
        });
    });

    return () => {
      annule = true;
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {(["jour1", "jour2"] as const).map((j) => (
          <button
            key={j}
            onClick={() => setJour(j)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              jour === j
                ? "bg-primary text-primary-fg"
                : "bg-surface text-fg border border-border"
            }`}
          >
            {j === "jour1" ? "Jour 1" : "Jour 2"}
          </button>
        ))}
      </div>

      <div
        id="lecteur-qr"
        ref={conteneurRef}
        className="w-full max-w-sm overflow-hidden rounded-lg border border-border"
      />

      {resultat && (
        <div
          className={`w-full max-w-sm rounded-lg p-5 text-center text-white ${STYLE_PAR_STATUT[resultat.statut]}`}
        >
          <p className="text-lg font-semibold">
            {MESSAGE_PAR_STATUT[resultat.statut]}
          </p>
          {resultat.nomComplet && (
            <div className="mt-2 text-sm opacity-95">
              <p className="font-medium">{resultat.nomComplet}</p>
              {resultat.profil && <p>{resultat.profil}</p>}
              {resultat.participation && (
                <p>{LIBELLES_PARTICIPATION[resultat.participation]}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
