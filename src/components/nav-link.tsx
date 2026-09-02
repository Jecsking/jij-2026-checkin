"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSidebar } from "@/components/sidebar/sidebar-context";
import { estActif } from "@/lib/nav-items";

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
  const { reduite } = useSidebar();
  const actif = estActif(pathname, href, exact);

  return (
    <Link
      href={href}
      title={reduite ? label : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        reduite ? "justify-center" : ""
      } ${
        actif
          ? "bg-primary text-primary-fg"
          : "text-sidebar-fg-muted hover:bg-sidebar-hover hover:text-white"
      }`}
    >
      {icone}
      {!reduite && label}
    </Link>
  );
}
