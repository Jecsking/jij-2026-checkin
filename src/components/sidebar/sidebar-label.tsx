"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";

export function SidebarLabel({ children }: { children: ReactNode }) {
  const { reduite } = useSidebar();
  // Le mode "réduit" ne concerne que le rail desktop : sur le tiroir mobile,
  // toujours en pleine largeur, les libellés restent visibles.
  return <div className={reduite ? "md:hidden" : ""}>{children}</div>;
}
