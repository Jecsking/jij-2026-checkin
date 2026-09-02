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
    return <p className="text-sm text-zinc-400">Chargement...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Profil</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Présents J1</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Attendus J1</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Présents J2</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Attendus J2</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {stats.lignes.map((l) => (
            <tr key={l.profil}>
              <td className="px-4 py-2">{l.profil}</td>
              <td className="px-4 py-2 font-medium text-teal-800">{l.presentsJ1}</td>
              <td className="px-4 py-2 text-zinc-500">{l.attendusJ1}</td>
              <td className="px-4 py-2 font-medium text-teal-800">{l.presentsJ2}</td>
              <td className="px-4 py-2 text-zinc-500">{l.attendusJ2}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-zinc-50 font-semibold">
          <tr>
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2 text-teal-800">{stats.total.presentsJ1}</td>
            <td className="px-4 py-2 text-zinc-500">{stats.total.attendusJ1}</td>
            <td className="px-4 py-2 text-teal-800">{stats.total.presentsJ2}</td>
            <td className="px-4 py-2 text-zinc-500">{stats.total.attendusJ2}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
