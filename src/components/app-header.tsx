import Link from "next/link";
import { PageTitle } from "./page-title";
import { NotificationBell, type EchecNotification } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { SidebarMobileToggle } from "./sidebar/sidebar-mobile-toggle";
import type { NavItem } from "@/lib/nav-items";

export function AppHeader({
  navItems,
  rechercheHref,
  nom,
  avatar,
  echecsCount = 0,
  echecs = [],
}: {
  navItems: NavItem[];
  rechercheHref?: string;
  nom: string;
  avatar: string;
  echecsCount?: number;
  echecs?: EchecNotification[];
}) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarMobileToggle />
        <PageTitle items={navItems} />
      </div>
      <div className="flex items-center gap-2">
        {rechercheHref && (
          <Link
            href={rechercheHref}
            aria-label="Rechercher"
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
        )}
        <NotificationBell nombre={echecsCount} echecs={echecs} />
        <ThemeToggle />
        <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-base">
            {avatar}
          </div>
          <span className="hidden text-sm font-medium text-fg sm:inline">
            {nom}
          </span>
        </div>
      </div>
    </header>
  );
}
