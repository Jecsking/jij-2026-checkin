import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client "service role" — contourne le RLS. Réservé aux routes API serveur
 * qui appliquent elles-mêmes leur propre logique d'autorisation
 * (import, envoi de campagnes, confirmation, check-in QR).
 * Ne jamais importer ce module dans un composant client.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
