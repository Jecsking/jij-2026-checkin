"use client";

import Link from "next/link";
import { useState } from "react";

export interface EchecNotification {
  id: string;
  type: string;
  date_envoi: string;
  erreur: string | null;
  nom: string | null;
  email: string | null;
}

const LIBELLES_TYPE: Record<string, string> = {
  confirmation: "Email de confirmation",
  qr: "Envoi du QR code",
};

export function NotificationBell({
  nombre,
  echecs,
}: {
  nombre: number;
  echecs: EchecNotification[];
}) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
        >
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {nombre > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-gold px-1 text-[10px] font-bold text-brand-navy-deep">
            {nombre > 9 ? "9+" : nombre}
          </span>
        )}
      </button>

      {ouvert && (
        <>
          <button
            type="button"
            aria-label="Fermer les notifications"
            onClick={() => setOuvert(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-surface shadow-lg">
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-sm font-semibold text-fg">Notifications</p>
            </div>
            {echecs.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-fg-muted">
                Aucun échec d&apos;envoi récent.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto divide-y divide-border">
                {echecs.map((e) => (
                  <li key={e.id} className="px-4 py-2.5 text-sm">
                    <p className="text-fg">
                      Échec — {LIBELLES_TYPE[e.type] ?? e.type}
                    </p>
                    <p className="mt-0.5 text-fg-muted">
                      {e.nom ?? "—"}{" "}
                      <span className="text-fg-muted/70">{e.email}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-fg-muted/70">
                      {new Date(e.date_envoi).toLocaleString("fr-FR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-border px-4 py-2 text-right">
              <Link
                href="/admin/campagnes"
                onClick={() => setOuvert(false)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Voir l&apos;historique complet →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
