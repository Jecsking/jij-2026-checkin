import { createClient } from "@/lib/supabase/server";
import type { Participation, StatutParticipant } from "@/types/database";

export async function SegmentCount({
  profil,
  participation,
  statut,
  ville,
  depuis,
}: {
  profil?: string;
  participation?: string;
  statut?: string;
  ville?: string[];
  depuis?: string;
}) {
  const supabase = await createClient();
  let requete = supabase
    .from("participants")
    .select("id", { count: "exact", head: true });

  if (profil) requete = requete.eq("profil", profil);
  if (participation)
    requete = requete.eq("participation", participation as Participation);
  if (statut) requete = requete.eq("statut", statut as StatutParticipant);
  if (ville && ville.length > 0) requete = requete.in("commune_normalisee", ville);
  if (depuis) requete = requete.gte("created_at", depuis);

  const { count } = await requete;

  return (
    <p className="text-sm text-fg-muted">
      Ce segment cible <span className="font-semibold">{count ?? 0}</span>{" "}
      participant(s).
    </p>
  );
}
