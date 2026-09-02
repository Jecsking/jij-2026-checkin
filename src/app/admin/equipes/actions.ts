"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function creerEquipeAction(formData: FormData) {
  const nom = (formData.get("nom") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  if (!nom) return;

  const supabase = await createClient();
  await supabase.from("equipes").insert({ nom, description });
  revalidatePath("/admin/equipes");
}

export async function supprimerEquipeAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("equipes").delete().eq("id", id);
  revalidatePath("/admin/equipes");
}

export async function ajouterMembreAction(formData: FormData) {
  const equipeId = formData.get("equipe_id") as string;
  const nomComplet = (formData.get("nom_complet") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const telephone = (formData.get("telephone") as string)?.trim() || null;
  const role = (formData.get("role") as string)?.trim() || null;
  if (!equipeId || !nomComplet) return;

  const supabase = await createClient();
  await supabase.from("membres_equipe").insert({
    equipe_id: equipeId,
    nom_complet: nomComplet,
    email,
    telephone,
    role,
  });
  revalidatePath("/admin/equipes");
}

export async function supprimerMembreAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("membres_equipe").delete().eq("id", id);
  revalidatePath("/admin/equipes");
}
