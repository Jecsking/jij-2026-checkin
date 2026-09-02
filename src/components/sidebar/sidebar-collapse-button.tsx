"use client";

import { useSidebar } from "./sidebar-context";

export function SidebarCollapseButton() {
  const { reduite, basculer } = useSidebar();

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={reduite ? "Déplier le menu" : "Réduire le menu"}
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar text-white hover:bg-sidebar-hover"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 transition-transform ${reduite ? "rotate-180" : ""}`}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
