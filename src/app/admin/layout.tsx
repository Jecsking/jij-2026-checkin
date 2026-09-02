import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/nav-link";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import {
  IconeTableauDeBord,
  IconeParticipants,
  IconeCampagnes,
  IconeCheckin,
  IconeEquipes,
  IconeCriteres,
  IconeJury,
  IconeClassement,
  IconeParametres,
} from "@/components/icons";

const SECTIONS = [
  {
    titre: "Vue d'ensemble",
    liens: [
      { href: "/admin", label: "Tableau de bord", icone: IconeTableauDeBord, exact: true },
    ],
  },
  {
    titre: "Participants",
    liens: [
      { href: "/admin/participants", label: "Participants", icone: IconeParticipants },
      { href: "/admin/campagnes", label: "Campagnes email", icone: IconeCampagnes },
      { href: "/admin/checkin", label: "Check-in temps réel", icone: IconeCheckin },
    ],
  },
  {
    titre: "Hackathon",
    liens: [
      { href: "/admin/equipes", label: "Équipes", icone: IconeEquipes },
      { href: "/admin/criteres", label: "Critères de notation", icone: IconeCriteres },
      { href: "/admin/jury", label: "Jury", icone: IconeJury },
      { href: "/admin/classement", label: "Classement", icone: IconeClassement },
    ],
  },
  {
    titre: "Système",
    liens: [
      { href: "/admin/parametres", label: "Paramètres", icone: IconeParametres },
    ],
  },
];

function initiales(nom: string): string {
  return nom
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((mot) => mot[0]?.toUpperCase())
    .join("");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const connecte = await exigerRole(["admin"]);
  const nom = connecte.profil?.nom_complet || connecte.user.email || "Admin";

  return (
    <div className="flex min-h-full flex-1 bg-bg">
      <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-fg">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image
            src="/logo/icone-jij.png"
            alt="JIJ 2026"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-white">JIJ 2026</p>
            <p className="text-[11px] text-sidebar-fg-muted">Espace admin</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-5 overflow-y-auto px-3 pb-3">
          {SECTIONS.map((section) => (
            <div key={section.titre}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-fg-muted/70">
                {section.titre}
              </p>
              <div className="mt-1.5 space-y-1">
                {section.liens.map((lien) => (
                  <NavLink key={lien.href} {...lien} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/compte"
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-hover"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-gold font-display text-sm font-bold text-brand-navy-deep">
              {initiales(nom)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-white">{nom}</p>
              <p className="text-[11px] text-sidebar-fg-muted">Espace admin</p>
            </div>
          </Link>
          <DeconnexionBouton className="mt-1 w-full justify-start px-2 py-2 text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white" />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-border bg-surface px-6 py-3">
          <ThemeToggle />
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
