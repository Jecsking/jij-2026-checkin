import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUtilisateurConnecte } from "@/lib/auth";
import { NotationForm } from "./notation-form";
import { obtenirPointsMaxParPassage } from "@/lib/notation";
import type { Passage } from "@/types/database";

export default async function NotationEquipePage({
  params,
  searchParams,
}: {
  params: Promise<{ equipeId: string }>;
  searchParams: Promise<{ passage?: string }>;
}) {
  const { equipeId } = await params;
  const { passage: passageBrut } = await searchParams;
  const passage: Passage = passageBrut === "2" ? 2 : 1;

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
    .eq("passage", passage)
    .order("ordre", { ascending: true });

  const { data: parametres } = await supabase
    .from("parametres_evenement")
    .select("votes_clotures")
    .eq("id", 1)
    .maybeSingle();

  const pointsMaxParPassage = await obtenirPointsMaxParPassage(supabase);

  const { data: notes } = jure
    ? await supabase
        .from("notes")
        .select("critere_id, valeur")
        .eq("jure_id", jure.id)
        .eq("equipe_id", equipeId)
        .eq("passage", passage)
    : { data: [] };

  const notesExistantes = Object.fromEntries(
    (notes ?? []).map((n) => [n.critere_id, n.valeur])
  );

  return (
    <div className="max-w-xl">
      <Link href="/jury" className="text-sm text-primary hover:underline">
        ← Retour aux équipes
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-fg">
        Noter : {equipe.nom}
      </h1>
      {equipe.description && (
        <p className="mt-1 text-sm text-fg-muted">{equipe.description}</p>
      )}

      <div className="mt-4 flex gap-2">
        {([1, 2] as const).map((p) => (
          <Link
            key={p}
            href={`/jury/${equipeId}?passage=${p}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              p === passage
                ? "bg-primary text-primary-fg"
                : "border border-border text-fg-muted hover:text-fg"
            }`}
          >
            Passage {p} (/{pointsMaxParPassage[p]})
          </Link>
        ))}
      </div>

      <NotationForm
        equipeId={equipeId}
        passage={passage}
        maxPoints={pointsMaxParPassage[passage]}
        criteres={criteres ?? []}
        notesExistantes={notesExistantes}
        votesClotures={parametres?.votes_clotures ?? false}
      />
    </div>
  );
}
