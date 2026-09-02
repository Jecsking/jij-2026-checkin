import type { createClient } from "@/lib/supabase/server";
import type { Passage } from "@/types/database";

// Le nombre de points maximum de chaque passage est réglable par l'admin
// (parametres_evenement.points_max_passage1/2) ; la note finale d'une
// équipe est la somme des deux passages, pas une moyenne.
export async function obtenirPointsMaxParPassage(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Record<Passage, number>> {
  const { data } = await supabase
    .from("parametres_evenement")
    .select("points_max_passage1, points_max_passage2")
    .eq("id", 1)
    .maybeSingle();

  return {
    1: data?.points_max_passage1 ?? 50,
    2: data?.points_max_passage2 ?? 100,
  };
}
