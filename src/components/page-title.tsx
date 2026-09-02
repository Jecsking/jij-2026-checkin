"use client";

import { usePathname } from "next/navigation";
import { estActif, type NavItem } from "@/lib/nav-items";

export function PageTitle({
  items,
  fallback = "Admin",
}: {
  items: NavItem[];
  fallback?: string;
}) {
  const pathname = usePathname();
  const item = items.find((i) => estActif(pathname, i.href, i.exact));

  return (
    <h1 className="font-display text-xl font-bold text-fg">
      {item?.label ?? fallback}
    </h1>
  );
}
