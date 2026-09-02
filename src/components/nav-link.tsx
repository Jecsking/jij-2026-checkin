"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({
  href,
  label,
  icone,
  exact = false,
}: {
  href: string;
  label: string;
  icone: ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const actif = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        actif
          ? "bg-primary text-primary-fg"
          : "text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white"
      }`}
    >
      {icone}
      {label}
    </Link>
  );
}
