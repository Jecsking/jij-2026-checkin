import Image from "next/image";
import { exigerRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { avatarAnimal } from "@/lib/avatar-animal";
import { NavLink } from "@/components/nav-link";
import { AppHeader } from "@/components/app-header";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import { SidebarAside } from "@/components/sidebar/sidebar-aside";
import { SidebarLabel } from "@/components/sidebar/sidebar-label";
import { AddGuestCard } from "@/components/sidebar/add-guest-card";
import { NAV_ITEMS } from "@/lib/nav-items";
import {
  IconeTableauDeBord,
  IconeParticipants,
  IconeCampagnes,
  IconeCheckin,
  IconeEquipes,
  IconeCriteres,
  IconeClassement,
  IconeParametres,
  IconeStaff,
} from "@/components/icons";

const CLASSE_ICONE = "h-[18px] w-[18px] shrink-0";

const SECTIONS_BASE = [
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

const LIEN_EQUIPE = {
  href: "/admin/equipe",
  label: "Équipe",
  icone: <IconeStaff className={CLASSE_ICONE} />,
};

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

  const { data: echecsRecents } = await supabase
    .from("emails_envoyes")
    .select("id, type, date_envoi, erreur, participants(nom_complet, email)")
    .eq("statut_brevo", "echec")
    .order("date_envoi", { ascending: false })
    .limit(5);

  const echecs = (echecsRecents ?? []).map((e) => {
    const participant = Array.isArray(e.participants)
      ? e.participants[0]
      : e.participants;
    return {
      id: e.id,
      type: e.type,
      date_envoi: e.date_envoi,
      erreur: e.erreur,
      nom: participant?.nom_complet ?? null,
      email: participant?.email ?? null,
    };
  });

  const SECTIONS = connecte.profil?.super_admin
    ? SECTIONS_BASE.map((section) =>
        section.titre === "Système"
          ? { ...section, liens: [LIEN_EQUIPE, ...section.liens] }
          : section
      )
    : SECTIONS_BASE;

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

          <AddGuestCard />

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
          <AppHeader
            navItems={NAV_ITEMS}
            rechercheHref="/admin/participants"
            nom={nom}
            avatar={avatarAnimal(connecte.user.id)}
            echecsCount={echecsCount ?? 0}
            echecs={echecs}
          />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
