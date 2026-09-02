"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSidebar } from "@/components/sidebar/sidebar-context";

export function NavLink({
  href,
  label,
  icone,
  exact = false,
  chipBg = "bg-white/10",
  chipIcon = "text-white",
}: {
  href: string;
  label: string;
  icone: ReactNode;
  exact?: boolean;
  chipBg?: string;
  chipIcon?: string;
}) {
  const pathname = usePathname();
  const { reduite } = useSidebar();
  const actif = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={reduite ? label : undefined}
      className={`relative flex items-center gap-3 rounded-xl py-2 pr-3 text-sm font-medium transition-colors ${
        reduite ? "justify-center px-0" : "pl-3"
      } ${
        actif
          ? "bg-white/[0.06] text-white"
          : "text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white"
      }`}
    >
      {actif && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-gold" />
      )}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${chipBg} ${chipIcon}`}
      >
        {icone}
      </span>
      {!reduite && label}
    </Link>
  );
}
