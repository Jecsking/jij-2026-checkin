"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";
import { SidebarCollapseButton } from "./sidebar-collapse-button";

export function SidebarAside({ children }: { children: ReactNode }) {
  const { reduite, mobileOuvert, fermerMobile } = useSidebar();

  return (
    <>
      {mobileOuvert && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={fermerMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-fg transition-transform duration-200 md:relative md:z-auto md:translate-x-0 md:transition-[width] ${
          mobileOuvert ? "translate-x-0" : "-translate-x-full"
        } ${reduite ? "md:w-20" : "md:w-64"}`}
      >
        {children}
        <SidebarCollapseButton />
      </aside>
    </>
  );
}
