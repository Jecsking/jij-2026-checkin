import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { ThemeToggle } from "@/components/theme-toggle";
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
  IconeCompte,
} from "@/components/icons";

const LIENS = [
  { href: "/admin", label: "Tableau de bord", icone: IconeTableauDeBord },
  { href: "/admin/participants", label: "Participants", icone: IconeParticipants },
  { href: "/admin/campagnes", label: "Campagnes email", icone: IconeCampagnes },
  { href: "/admin/checkin", label: "Check-in temps réel", icone: IconeCheckin },
  { href: "/admin/equipes", label: "Équipes hackathon", icone: IconeEquipes },
  { href: "/admin/criteres", label: "Critères de notation", icone: IconeCriteres },
  { href: "/admin/jury", label: "Jury", icone: IconeJury },
  { href: "/admin/classement", label: "Classement", icone: IconeClassement },
  { href: "/admin/parametres", label: "Paramètres", icone: IconeParametres },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["admin"]);

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

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {LIENS.map((lien) => {
            const Icone = lien.icone;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-fg-muted transition-colors hover:bg-sidebar-hover hover:text-white"
              >
                <Icone className="h-[18px] w-[18px] shrink-0" />
                {lien.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-3">
          <Link
            href="/compte"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-fg-muted transition-colors hover:bg-sidebar-hover hover:text-white"
          >
            <IconeCompte className="h-[18px] w-[18px] shrink-0" />
            Mon compte
          </Link>
          <DeconnexionBouton className="w-full justify-start px-3 py-2.5 text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white" />
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
