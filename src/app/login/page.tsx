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
    <div className="flex flex-1 items-center justify-center bg-bg p-4 md:p-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl md:grid-cols-2 md:min-h-[640px]">
        <div className="relative h-64 overflow-hidden bg-brand-navy-deep sm:h-80 md:h-auto">
          <Image
            src="/logo/login-hero.png"
            alt="Journée Internationale de la Jeunesse — 2026"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative flex flex-col justify-center p-8 font-montserrat sm:p-14 lg:p-16">
          <div className="absolute right-8 top-8">
            <ThemeToggle />
          </div>

          <Image
            src="/logo/icone-jij.png"
            alt="JIJ 2026"
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <h1 className="mt-5 font-bebas text-5xl uppercase tracking-wide text-fg">
            Connexion
          </h1>
          <p className="mt-2 text-base text-fg-muted">
            Espace admin, hôtesses ou jury… JIJ 2026.
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
