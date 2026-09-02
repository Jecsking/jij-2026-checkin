import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUtilisateurConnecte } from "@/lib/auth";
import { NotationForm } from "./notation-form";

export default async function NotationEquipePage({
  params,
}: {
  params: Promise<{ equipeId: string }>;
}) {
  const { equipeId } = await params;
  const connecte = await getUtilisateurConnecte();
  const supabase = await createClient();

  const { data: equipe } = await supabase
    .from("equipes")
    .select("*")
    .eq("id", equipeId)
    .maybeSingle();

  if (!equipe) notFound();

  const { data: jure } = await supabase
    .from("jures")
    .select("id")
    .eq("compte_auth_id", connecte!.user.id)
    .maybeSingle();

  const { data: criteres } = await supabase
    .from("criteres_notation")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  const { data: parametres } = await supabase
    .from("parametres_evenement")
    .select("votes_clotures")
    .eq("id", 1)
    .maybeSingle();

  const { data: notes } = jure
    ? await supabase
        .from("notes")
        .select("critere_id, valeur")
        .eq("jure_id", jure.id)
        .eq("equipe_id", equipeId)
    : { data: [] };

  const notesExistantes = Object.fromEntries(
    (notes ?? []).map((n) => [n.critere_id, n.valeur])
  );

  return (
    <div className="max-w-xl">
      <Link href="/jury" className="text-sm text-teal-700 hover:underline">
        ← Retour aux équipes
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-zinc-900">
        Noter : {equipe.nom}
      </h1>
      {equipe.description && (
        <p className="mt-1 text-sm text-zinc-600">{equipe.description}</p>
      )}

      <NotationForm
        equipeId={equipeId}
        criteres={criteres ?? []}
        notesExistantes={notesExistantes}
        votesClotures={parametres?.votes_clotures ?? false}
      />
    </div>
  );
}
