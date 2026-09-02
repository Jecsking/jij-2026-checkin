"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface StaffSidebarContextValue {
  mobileOuvert: boolean;
  ouvrirMobile: () => void;
  fermerMobile: () => void;
}

const StaffSidebarContext = createContext<StaffSidebarContextValue>({
  mobileOuvert: false,
  ouvrirMobile: () => {},
  fermerMobile: () => {},
});

export function StaffSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOuvert, setMobileOuvert] = useState(false);

  return (
    <StaffSidebarContext.Provider
      value={{
        mobileOuvert,
        ouvrirMobile: () => setMobileOuvert(true),
        fermerMobile: () => setMobileOuvert(false),
      }}
    >
      {children}
    </StaffSidebarContext.Provider>
  );
}

export function useStaffSidebar() {
  return useContext(StaffSidebarContext);
}
