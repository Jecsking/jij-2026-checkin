"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { estActif } from "@/lib/nav-items";

export function StaffNavLink({
  href,
  label,
  icone,
}: {
  href: string;
  label: string;
  icone: ReactNode;
}) {
  const pathname = usePathname();
  const actif = estActif(pathname, href);

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
