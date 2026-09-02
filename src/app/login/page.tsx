"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconeSunburst } from "@/components/icons";

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
    <div className="flex flex-1 items-center justify-center bg-bg p-4 md:p-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl md:grid-cols-2 md:min-h-[640px]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-navy-deep p-14 md:flex">
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-28 h-72 w-72 rounded-full bg-primary/70 blur-2xl" />

          <p className="relative max-w-sm font-display text-4xl font-bold leading-tight text-white lg:text-5xl">
            Accueillez, notez et célébrez la jeunesse du Bénin.
          </p>

          <p className="relative text-sm text-white/50">
            Journée Internationale de la Jeunesse — 2026
          </p>
        </div>

        <div className="relative flex flex-col justify-center p-10 sm:p-14 lg:p-16">
          <div className="absolute right-8 top-8">
            <ThemeToggle />
          </div>

          <IconeSunburst className="h-10 w-10 text-primary" />
          <h1 className="mt-5 font-display text-3xl font-bold text-fg">
            Connexion
          </h1>
          <p className="mt-2 text-base text-fg-muted">
            Espace admin, hôtesses ou jury — JIJ 2026.
          </p>

          <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-5">
            <div>
              <label className="block text-sm text-fg-muted">
                Votre email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-fg-muted">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg focus:border-primary focus:outline-none"
              />
            </div>

            {erreur && <p className="text-sm text-error-text">{erreur}</p>}

            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Pas encore de compte ?{" "}
            <span className="font-medium text-fg">
              Contactez l&apos;administrateur
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
