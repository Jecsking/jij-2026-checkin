"use client";

import type { ReactNode } from "react";
import { useStaffSidebar } from "./staff-sidebar-context";

export function StaffAside({ children }: { children: ReactNode }) {
  const { mobileOuvert, fermerMobile } = useStaffSidebar();

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
        className={`fixed inset-y-0 left-0 z-50 w-56 shrink-0 space-y-1 overflow-y-auto border-r border-white/10 bg-sidebar p-3 transition-transform duration-200 md:relative md:z-auto md:translate-x-0 ${
          mobileOuvert ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}
