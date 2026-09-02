"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Passage } from "@/types/database";

export async function creerCritereAction(formData: FormData) {
  const libelle = (formData.get("libelle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const poids = Number(formData.get("poids") ?? "1");
  const passage = (formData.get("passage") as string) === "2" ? 2 : 1;
  if (!libelle || Number.isNaN(poids) || poids <= 0) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("criteres_notation")
    .select("id", { count: "exact", head: true })
    .eq("passage", passage);

  await supabase.from("criteres_notation").insert({
    libelle,
    description,
    poids,
    passage,
    ordre: count ?? 0,
  });
  revalidatePath("/admin/criteres");
  revalidatePath("/jury");
}

export async function modifierCritereAction(formData: FormData) {
  const id = formData.get("id") as string;
  const poids = Number(formData.get("poids") ?? "1");
  const actif = formData.get("actif") === "on";
  if (!id || Number.isNaN(poids) || poids <= 0) return;

  const supabase = await createClient();
  await supabase
    .from("criteres_notation")
    .update({ poids, actif })
    .eq("id", id);
  revalidatePath("/admin/criteres");
  revalidatePath("/jury");
}

export async function supprimerCritereAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("criteres_notation").delete().eq("id", id);
  revalidatePath("/admin/criteres");
  revalidatePath("/jury");
}

export async function modifierPointsMaxAction(formData: FormData) {
  const passage: Passage = (formData.get("passage") as string) === "2" ? 2 : 1;
  const pointsMax = Number(formData.get("points_max"));
  if (Number.isNaN(pointsMax) || pointsMax <= 0) return;

  const supabase = await createClient();
  await supabase
    .from("parametres_evenement")
    .update(
      passage === 1
        ? { points_max_passage1: pointsMax }
        : { points_max_passage2: pointsMax }
    )
    .eq("id", 1);

  revalidatePath("/admin/criteres");
  revalidatePath("/admin/classement");
  revalidatePath("/classement");
  revalidatePath("/jury");
}
