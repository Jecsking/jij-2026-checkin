"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DESTINATION_PAR_ROLE: Record<string, string> = {
  admin: "/admin",
  staff: "/staff/scan",
  jury: "/jury",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error || !data.user) {
      setErreur("Identifiants incorrects.");
      setChargement(false);
      return;
    }

    const { data: profil } = await supabase
      .from("profils_utilisateurs")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profil) {
      setErreur("Aucun rôle n'est associé à ce compte. Contactez l'admin.");
      await supabase.auth.signOut();
      setChargement(false);
      return;
    }

    router.push(DESTINATION_PAR_ROLE[profil.role] ?? "/");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-teal-800">Connexion</h1>
        <p className="text-sm text-zinc-500">
          Espace admin, staff d&apos;entrée ou jury — JIJ 2026.
        </p>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <input
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
          />
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
