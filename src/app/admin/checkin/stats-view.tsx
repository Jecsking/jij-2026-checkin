"use client";

import { useEffect, useState } from "react";

interface Ligne {
  profil: string;
  attendusJ1: number;
  presentsJ1: number;
  attendusJ2: number;
  presentsJ2: number;
}

interface Stats {
  lignes: Ligne[];
  total: Ligne | Omit<Ligne, "profil">;
}

export function StatsCheckin() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        const res = await fetch("/api/checkin/stats", { cache: "no-store" });
        const data = await res.json();
        if (!annule) setStats(data);
      } catch {
        // ignore, on réessaiera au prochain intervalle
      }
    }

    charger();
    const intervalle = setInterval(charger, 5000);
    return () => {
      annule = true;
      clearInterval(intervalle);
    };
  }, []);

  if (!stats) {
    return <p className="text-sm text-fg-muted">Chargement...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-bg">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-fg-muted">Profil</th>
            <th className="px-4 py-2 text-left font-medium text-fg-muted">Présents J1</th>
            <th className="px-4 py-2 text-left font-medium text-fg-muted">Attendus J1</th>
            <th className="px-4 py-2 text-left font-medium text-fg-muted">Présents J2</th>
            <th className="px-4 py-2 text-left font-medium text-fg-muted">Attendus J2</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stats.lignes.map((l) => (
            <tr key={l.profil}>
              <td className="px-4 py-2">{l.profil}</td>
              <td className="px-4 py-2 font-medium text-primary">{l.presentsJ1}</td>
              <td className="px-4 py-2 text-fg-muted">{l.attendusJ1}</td>
              <td className="px-4 py-2 font-medium text-primary">{l.presentsJ2}</td>
              <td className="px-4 py-2 text-fg-muted">{l.attendusJ2}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-bg font-semibold">
          <tr>
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2 text-primary">{stats.total.presentsJ1}</td>
            <td className="px-4 py-2 text-fg-muted">{stats.total.attendusJ1}</td>
            <td className="px-4 py-2 text-primary">{stats.total.presentsJ2}</td>
            <td className="px-4 py-2 text-fg-muted">{stats.total.attendusJ2}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
