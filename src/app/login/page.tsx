"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="relative flex flex-1 items-center justify-center bg-bg px-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo/icone-jij.png"
            alt="JIJ 2026"
            width={56}
            height={56}
            className="h-14 w-14"
          />
          <h1 className="font-display mt-3 text-xl font-bold text-fg">
            Connexion
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Espace admin, hôtesses ou jury — JIJ 2026.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">
            Mot de passe
          </label>
          <input
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
          />
        </div>

        {erreur && <p className="text-sm text-error-text">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
