"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface SidebarContextValue {
  reduite: boolean;
  basculer: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  reduite: false,
  basculer: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [reduite, setReduite] = useState(false);

  useEffect(() => {
    // Lecture de la préférence après le montage (SSR ne connaît pas
    // localStorage) : premier rendu toujours "déplié" pour éviter un
    // mismatch d'hydratation, puis correction si une préférence existe.
    try {
      const preference = localStorage.getItem("sidebar-reduite") === "true";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (preference) setReduite(true);
    } catch {
      // stockage indisponible
    }
  }, []);

  function basculer() {
    setReduite((valeurActuelle) => {
      const nouvelleValeur = !valeurActuelle;
      try {
        localStorage.setItem("sidebar-reduite", String(nouvelleValeur));
      } catch {
        // stockage indisponible
      }
      return nouvelleValeur;
    });
  }

  return (
    <SidebarContext.Provider value={{ reduite, basculer }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
