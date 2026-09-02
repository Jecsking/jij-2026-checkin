"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

export function NavLink({
  href,
  label,
  icone: Icone,
  exact = false,
}: {
  href: string;
  label: string;
  icone: ComponentType<SVGProps<SVGSVGElement>>;
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
      <Icone className="h-[18px] w-[18px] shrink-0" />
      {label}
    </Link>
  );
}
