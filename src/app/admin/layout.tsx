import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/nav-link";
import { PageTitle } from "@/components/page-title";
import { NotificationBell } from "@/components/notification-bell";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import { SidebarAside } from "@/components/sidebar/sidebar-aside";
import { SidebarLabel } from "@/components/sidebar/sidebar-label";
import { SidebarCollapseButton } from "@/components/sidebar/sidebar-collapse-button";
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

const CLASSE_ICONE = "h-4 w-4 shrink-0";
const ICONE_SOMBRE = "text-brand-navy-deep";
const ICONE_CLAIRE = "text-white";

const SECTIONS = [
  {
    titre: "Vue d'ensemble",
    liens: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icone: <IconeTableauDeBord className={CLASSE_ICONE} />,
        exact: true,
        chipBg: "bg-primary",
        chipIcon: ICONE_SOMBRE,
      },
    ],
  },
  {
    titre: "Participants",
    liens: [
      {
        href: "/admin/participants",
        label: "Participants",
        icone: <IconeParticipants className={CLASSE_ICONE} />,
        chipBg: "bg-info",
        chipIcon: ICONE_SOMBRE,
      },
      {
        href: "/admin/campagnes",
        label: "Campagnes email",
        icone: <IconeCampagnes className={CLASSE_ICONE} />,
        chipBg: "bg-accent-gold",
        chipIcon: ICONE_SOMBRE,
      },
      {
        href: "/admin/checkin",
        label: "Check-in temps réel",
        icone: <IconeCheckin className={CLASSE_ICONE} />,
        chipBg: "bg-success",
        chipIcon: ICONE_SOMBRE,
      },
    ],
  },
  {
    titre: "Hackathon",
    liens: [
      {
        href: "/admin/equipes",
        label: "Équipes",
        icone: <IconeEquipes className={CLASSE_ICONE} />,
        chipBg: "bg-accent-purple",
        chipIcon: ICONE_CLAIRE,
      },
      {
        href: "/admin/criteres",
        label: "Critères de notation",
        icone: <IconeCriteres className={CLASSE_ICONE} />,
        chipBg: "bg-warning",
        chipIcon: ICONE_SOMBRE,
      },
      {
        href: "/admin/jury",
        label: "Jury",
        icone: <IconeJury className={CLASSE_ICONE} />,
        chipBg: "bg-accent-crimson",
        chipIcon: ICONE_CLAIRE,
      },
      {
        href: "/admin/classement",
        label: "Classement",
        icone: <IconeClassement className={CLASSE_ICONE} />,
        chipBg: "bg-brand-blue",
        chipIcon: ICONE_CLAIRE,
      },
    ],
  },
  {
    titre: "Système",
    liens: [
      {
        href: "/admin/parametres",
        label: "Paramètres",
        icone: <IconeParametres className={CLASSE_ICONE} />,
        chipBg: "bg-white/10",
        chipIcon: ICONE_CLAIRE,
      },
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

  const supabase = await createClient();
  const { count: echecsCount } = await supabase
    .from("emails_envoyes")
    .select("id", { count: "exact", head: true })
    .eq("statut_brevo", "echec");

  return (
    <SidebarProvider>
      <div className="flex min-h-full flex-1 bg-bg">
        <SidebarAside>
          <div className="flex items-center gap-2.5 px-5 py-5">
            <div className="relative shrink-0">
              <Image
                src="/logo/icone-jij.png"
                alt="JIJ 2026"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent-gold ring-2 ring-sidebar" />
            </div>
            <SidebarLabel>
              <div className="leading-tight">
                <p className="font-display text-sm font-bold text-white">JIJ 2026</p>
                <p className="text-[11px] text-sidebar-fg-muted">Espace admin</p>
              </div>
            </SidebarLabel>
          </div>

          <nav className="mt-2 flex-1 space-y-5 overflow-y-auto px-3 pb-3">
            {SECTIONS.map((section) => (
              <div key={section.titre}>
                <SidebarLabel>
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-fg-muted/70">
                    {section.titre}
                  </p>
                </SidebarLabel>
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-gold font-display text-sm font-bold text-brand-navy-deep ring-2 ring-accent-gold/30">
                {initiales(nom)}
              </div>
              <SidebarLabel>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-medium text-white">{nom}</p>
                  <p className="text-[11px] text-sidebar-fg-muted">Espace admin</p>
                </div>
              </SidebarLabel>
            </Link>
            <SidebarLabel>
              <DeconnexionBouton className="mt-1 w-full justify-start px-2 py-2 text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white" />
            </SidebarLabel>
          </div>
        </SidebarAside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
            <div className="flex items-center gap-3">
              <SidebarCollapseButton />
              <PageTitle />
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/participants"
                aria-label="Rechercher un participant"
                className="flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg"
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </Link>
              <NotificationBell nombre={echecsCount ?? 0} />
              <ThemeToggle />
              <Link
                href="/compte"
                className="ml-2 flex items-center gap-2 border-l border-border pl-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-fg">
                  {initiales(nom)}
                </div>
                <span className="hidden text-sm font-medium text-fg sm:inline">
                  {nom}
                </span>
              </Link>
            </div>
          </header>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
