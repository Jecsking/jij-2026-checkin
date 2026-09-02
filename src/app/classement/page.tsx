import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ClassementPublicPage() {
  const supabase = createAdminClient();

  const { data: parametres } = await supabase
    .from("parametres_evenement")
    .select("classement_publie")
    .eq("id", 1)
    .maybeSingle();

  if (!parametres?.classement_publie) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 text-center">
        <p className="text-zinc-600">
          Le classement du hackathon n&apos;est pas encore publié.
        </p>
      </div>
    );
  }

  const { data: classement } = await supabase
    .from("vue_classement")
    .select("*")
    .order("score_final", { ascending: false, nullsFirst: false });

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-center text-2xl font-semibold text-teal-800">
        Classement — Hackathon JIJ 2026
      </h1>
      <div className="mt-8 space-y-3">
        {(classement ?? []).map((c, index) => (
          <div
            key={c.equipe_id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              index === 0
                ? "border-teal-400 bg-teal-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-zinc-400">
                #{index + 1}
              </span>
              <span className="font-medium text-zinc-900">{c.nom}</span>
            </div>
            <span className="font-semibold text-teal-800">
              {c.score_final !== null ? c.score_final.toFixed(2) : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
