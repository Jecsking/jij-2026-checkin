import Image from "next/image";
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
      <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 text-center">
        <Image
          src="/logo/icone-jij.png"
          alt="JIJ 2026"
          width={64}
          height={64}
          className="h-16 w-16 opacity-70"
        />
        <p className="mt-4 text-fg-muted">
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
    <div className="mx-auto min-h-full w-full max-w-xl bg-bg px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo/icone-jij.png"
          alt="JIJ 2026"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <h1 className="font-display mt-3 text-2xl font-bold text-fg">
          Classement — Hackathon JIJ 2026
        </h1>
      </div>
      <div className="mt-8 space-y-3">
        {(classement ?? []).map((c, index) => (
          <div
            key={c.equipe_id}
            className={`flex items-center justify-between rounded-2xl border p-4 ${
              index === 0
                ? "border-accent-gold bg-accent-gold/15"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-bold text-fg-muted">
                #{index + 1}
              </span>
              <span className="font-medium text-fg">{c.nom}</span>
            </div>
            <span className="font-display font-bold text-primary">
              {c.score_final !== null ? c.score_final.toFixed(2) : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
