"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";

export function SidebarLabel({ children }: { children: ReactNode }) {
  const { reduite } = useSidebar();
  if (reduite) return null;
  return <>{children}</>;
}
