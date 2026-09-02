"use client";

import { useSidebar } from "./sidebar-context";

export function SidebarCollapseButton() {
  const { reduite, basculer } = useSidebar();

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={reduite ? "Déplier le menu" : "Réduire le menu"}
      className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-fg-muted shadow-sm transition-colors hover:text-fg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-3 w-3 transition-transform ${reduite ? "rotate-180" : ""}`}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
