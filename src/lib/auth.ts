import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfilUtilisateur, RoleUtilisateur } from "@/types/database";

export async function getUtilisateurConnecte() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profil } = await supabase
    .from("profils_utilisateurs")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profil: profil as ProfilUtilisateur | null };
}

/**
 * À utiliser en tête de layout serveur pour protéger une section par rôle.
 * Redirige vers /login si non connecté, ou vers /login si le rôle ne correspond pas.
 */
export async function exigerRole(rolesAutorises: RoleUtilisateur[]) {
  const connecte = await getUtilisateurConnecte();

  if (!connecte || !connecte.profil) {
    redirect("/login");
  }

  if (!rolesAutorises.includes(connecte.profil.role)) {
    redirect("/login");
  }

  return connecte;
}
