"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";

export function SidebarAside({ children }: { children: ReactNode }) {
  const { reduite } = useSidebar();

  return (
    <aside
      className={`flex shrink-0 flex-col bg-sidebar text-sidebar-fg transition-[width] duration-200 ${
        reduite ? "w-20" : "w-64"
      }`}
    >
      {children}
    </aside>
  );
}
