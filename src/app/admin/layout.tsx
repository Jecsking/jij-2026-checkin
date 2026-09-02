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

const CLASSE_ICONE = "h-[18px] w-[18px] shrink-0";

const SECTIONS = [
  {
    titre: "Vue d'ensemble",
    liens: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icone: <IconeTableauDeBord className={CLASSE_ICONE} />,
        exact: true,
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
      },
      {
        href: "/admin/campagnes",
        label: "Campagnes email",
        icone: <IconeCampagnes className={CLASSE_ICONE} />,
      },
      {
        href: "/admin/checkin",
        label: "Check-in temps réel",
        icone: <IconeCheckin className={CLASSE_ICONE} />,
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
      },
      {
        href: "/admin/criteres",
        label: "Critères de notation",
        icone: <IconeCriteres className={CLASSE_ICONE} />,
      },
      { href: "/admin/jury", label: "Jury", icone: <IconeJury className={CLASSE_ICONE} /> },
      {
        href: "/admin/classement",
        label: "Classement",
        icone: <IconeClassement className={CLASSE_ICONE} />,
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
            <Image
              src="/logo/icone-jij.png"
              alt="JIJ 2026"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
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
            <SidebarLabel>
              <div className="px-2 pb-2">
                <Image
                  src="/logo/forteresse-wordmark.png"
                  alt="Forteresse"
                  width={160}
                  height={50}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </SidebarLabel>
            <DeconnexionBouton className="w-full justify-start px-2 py-2 text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white" />
          </div>
        </SidebarAside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
            <div className="flex items-center gap-3">
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
