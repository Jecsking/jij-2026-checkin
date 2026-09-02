import Image from "next/image";
import { exigerRole } from "@/lib/auth";
import { avatarAnimal } from "@/lib/avatar-animal";
import { NavLink } from "@/components/nav-link";
import { AppHeader } from "@/components/app-header";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import { SidebarAside } from "@/components/sidebar/sidebar-aside";
import { SidebarLabel } from "@/components/sidebar/sidebar-label";
import { NAV_ITEMS_HOTESSE } from "@/lib/nav-items";
import { IconeCheckin, IconeParticipants } from "@/components/icons";

const CLASSE_ICONE = "h-[18px] w-[18px] shrink-0";

const LIENS = [
  {
    href: "/staff/scan",
    label: "Scanner",
    icone: <IconeCheckin className={CLASSE_ICONE} />,
    exact: true,
  },
  {
    href: "/staff/participants",
    label: "Participants",
    icone: <IconeParticipants className={CLASSE_ICONE} />,
  },
];

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const connecte = await exigerRole(["staff", "admin"]);
  const nom = connecte.profil?.nom_complet || connecte.user.email || "Hôtesse";

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
                <p className="text-[11px] text-sidebar-fg-muted">Espace hôtesses</p>
              </div>
            </SidebarLabel>
          </div>

          <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
            {LIENS.map((lien) => (
              <NavLink key={lien.href} {...lien} />
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
          <AppHeader
            navItems={NAV_ITEMS_HOTESSE}
            rechercheHref="/staff/participants"
            nom={nom}
            avatar={avatarAnimal(connecte.user.id)}
          />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
