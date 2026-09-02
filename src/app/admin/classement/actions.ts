"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function togglerClotureAction(formData: FormData) {
  const clotures = formData.get("votes_clotures") === "on";
  const supabase = await createClient();
  await supabase
    .from("parametres_evenement")
    .update({ votes_clotures: !clotures })
    .eq("id", 1);
  revalidatePath("/admin/classement");
  revalidatePath("/jury");
}

export async function togglerPublicationAction(formData: FormData) {
  const publie = formData.get("classement_publie") === "on";
  const supabase = await createClient();
  await supabase
    .from("parametres_evenement")
    .update({ classement_publie: !publie })
    .eq("id", 1);
  revalidatePath("/admin/classement");
  revalidatePath("/classement");
}
