import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUtilisateurConnecte } from "@/lib/auth";

export default async function JuryHomePage() {
  const connecte = await getUtilisateurConnecte();
  const supabase = await createClient();

  const { data: jure } = await supabase
    .from("jures")
    .select("id")
    .eq("compte_auth_id", connecte!.user.id)
    .maybeSingle();

  const { data: equipes } = await supabase
    .from("equipes")
    .select("*")
    .order("nom", { ascending: true });

  const { data: criteresActifs } = await supabase
    .from("criteres_notation")
    .select("id")
    .eq("actif", true);
  const nbCriteres = criteresActifs?.length ?? 0;

  const { data: notesJure } = jure
    ? await supabase.from("notes").select("equipe_id").eq("jure_id", jure.id)
    : { data: [] };

  const notesParEquipe = new Map<string, number>();
  for (const n of notesJure ?? []) {
    notesParEquipe.set(n.equipe_id, (notesParEquipe.get(n.equipe_id) ?? 0) + 1);
  }

  if (!jure) {
    return (
      <p className="text-sm text-error-text">
        Votre compte n&apos;est associé à aucun profil juré. Contactez
        l&apos;organisation.
      </p>
    );
  }

  const equipesListe = equipes ?? [];
  const nbEquipesNotees = equipesListe.filter((e) => {
    const nbNotes = notesParEquipe.get(e.id) ?? 0;
    return nbCriteres > 0 && nbNotes >= nbCriteres;
  }).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">Tableau de bord</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Vos notes restent privées jusqu&apos;à la clôture du vote.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Équipes
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-fg">
            {equipesListe.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Critères actifs
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-fg">
            {nbCriteres}
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Notées par vous
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-primary-dark">
            {nbEquipesNotees} / {equipesListe.length}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-fg">Équipes à noter</h2>
      <div className="mt-4 max-w-2xl space-y-2">
        {(equipes ?? []).map((equipe) => {
          const nbNotes = notesParEquipe.get(equipe.id) ?? 0;
          const complet = nbCriteres > 0 && nbNotes >= nbCriteres;
          return (
            <Link
              key={equipe.id}
              href={`/jury/${equipe.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 hover:border-accent-gold"
            >
              <span className="font-medium text-fg">{equipe.nom}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  complet
                    ? "bg-success-soft text-success-text"
                    : "bg-warning-soft text-fg"
                }`}
              >
                {complet ? "Noté" : `${nbNotes}/${nbCriteres}`}
              </span>
            </Link>
          );
        })}
        {(equipes ?? []).length === 0 && (
          <p className="text-sm text-fg-muted">
            Aucune équipe n&apos;est encore enregistrée.
          </p>
        )}
      </div>
    </div>
  );
}
