"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function ChangerMotDePasse() {
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setMessage(null);

    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: motDePasse });

    if (error) {
      setErreur("Impossible de changer le mot de passe.");
      return;
    }

    setMessage("Mot de passe mis à jour.");
    setMotDePasse("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <label className="block text-sm font-medium text-zinc-700">
        Nouveau mot de passe
      </label>
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        minLength={8}
        required
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        Mettre à jour
      </button>
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      {message && <p className="text-sm text-teal-700">{message}</p>}
    </form>
  );
}
