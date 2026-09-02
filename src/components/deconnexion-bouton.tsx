"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeconnexionBouton() {
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
      className="text-sm font-medium text-zinc-500 hover:text-red-600"
    >
      Se déconnecter
    </button>
  );
}
