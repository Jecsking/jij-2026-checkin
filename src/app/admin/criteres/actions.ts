"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function creerCritereAction(formData: FormData) {
  const libelle = (formData.get("libelle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const poids = Number(formData.get("poids") ?? "1");
  if (!libelle || Number.isNaN(poids) || poids <= 0) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("criteres_notation")
    .select("id", { count: "exact", head: true });

  await supabase.from("criteres_notation").insert({
    libelle,
    description,
    poids,
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
