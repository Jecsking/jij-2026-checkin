"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconeDeconnexion } from "@/components/icons";

export function DeconnexionBouton({ className = "" }: { className?: string }) {
  const router = useRouter();

  async function seDeconnecter() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={seDeconnecter}
      className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors hover:text-error-text ${className}`}
    >
      <IconeDeconnexion className="h-[18px] w-[18px] shrink-0" />
      Se déconnecter
    </button>
  );
}
