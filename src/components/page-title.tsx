"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

export function PageTitle() {
  const pathname = usePathname();
  const item = NAV_ITEMS.find((i) =>
    i.exact ? pathname === i.href : pathname.startsWith(i.href)
  );

  return (
    <h1 className="font-display text-xl font-bold text-fg">
      {item?.label ?? "Admin"}
    </h1>
  );
}
