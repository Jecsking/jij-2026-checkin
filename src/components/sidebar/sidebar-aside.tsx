"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";
import { SidebarCollapseButton } from "./sidebar-collapse-button";

export function SidebarAside({ children }: { children: ReactNode }) {
  const { reduite } = useSidebar();

  return (
    <aside
      className={`relative flex shrink-0 flex-col bg-sidebar text-sidebar-fg transition-[width] duration-200 ${
        reduite ? "w-20" : "w-64"
      }`}
    >
      {children}
      <SidebarCollapseButton />
    </aside>
  );
}
