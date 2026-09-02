import type { Passage } from "@/types/database";

// Le passage 1 vaut 50 points, le passage 2 vaut 100 points ; la note
// finale d'une équipe est leur somme (sur 150), pas une moyenne.
export const POINTS_MAX_PAR_PASSAGE: Record<Passage, number> = { 1: 50, 2: 100 };
