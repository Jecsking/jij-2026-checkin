import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { ThemeToggle } from "@/components/theme-toggle";
import { StaffNavLink } from "@/components/staff/staff-nav-link";
import { StaffSidebarProvider } from "@/components/staff/staff-sidebar-context";
import { StaffAside } from "@/components/staff/staff-aside";
import { StaffMobileToggle } from "@/components/staff/staff-mobile-toggle";
import { IconeCheckin, IconeParticipants } from "@/components/icons";

const CLASSE_ICONE = "h-[18px] w-[18px] shrink-0";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["staff", "admin"]);

  return (
    <StaffSidebarProvider>
      <div className="flex min-h-full flex-1 flex-col bg-bg">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2.5">
            <StaffMobileToggle />
            <Image src="/logo/icone-jij.png" alt="JIJ 2026" width={28} height={28} className="h-7 w-7" />
            <h1 className="font-display text-sm font-bold text-fg">
              Espace hôtesses
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/compte" className="text-sm text-fg-muted hover:text-primary">
              Mon compte
            </Link>
            <DeconnexionBouton className="text-fg-muted" />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1">
          <StaffAside>
            <StaffNavLink
              href="/staff/scan"
              label="Scanner"
              icone={<IconeCheckin className={CLASSE_ICONE} />}
            />
            <StaffNavLink
              href="/staff/participants"
              label="Participants"
              icone={<IconeParticipants className={CLASSE_ICONE} />}
            />
          </StaffAside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </StaffSidebarProvider>
  );
}
