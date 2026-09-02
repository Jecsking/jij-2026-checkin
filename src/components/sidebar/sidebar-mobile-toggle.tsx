"use client";

import { useSidebar } from "./sidebar-context";

export function SidebarMobileToggle() {
  const { ouvrirMobile } = useSidebar();

  return (
    <button
      type="button"
      onClick={ouvrirMobile}
      aria-label="Ouvrir le menu"
      className="flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg md:hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
    </button>
  );
}
