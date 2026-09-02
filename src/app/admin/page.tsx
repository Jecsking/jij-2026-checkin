import { createClient } from "@/lib/supabase/server";
import {
  IconeParticipants,
  IconeCampagnes,
  IconeCheckin,
  IconeEquipes,
  IconeJury,
} from "@/components/icons";

async function compter(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filtre: Record<string, string>
) {
  let requete = supabase
    .from("participants")
    .select("id", { count: "exact", head: true });
  for (const [colonne, valeur] of Object.entries(filtre)) {
    requete = requete.eq(colonne, valeur);
  }
  const { count } = await requete;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [total, inscrits, emailEnvoye, confirmes, equipesCount, juresCount] =
    await Promise.all([
      compter(supabase, {}),
      compter(supabase, { statut: "inscrit" }),
      compter(supabase, { statut: "email_envoye" }),
      compter(supabase, { statut: "confirme" }),
      supabase
        .from("equipes")
        .select("id", { count: "exact", head: true })
        .then((r) => r.count ?? 0),
      supabase
        .from("jures")
        .select("id", { count: "exact", head: true })
        .then((r) => r.count ?? 0),
    ]);

  const { count: presentsJour1 } = await supabase
    .from("participants")
    .select("id", { count: "exact", head: true })
    .not("date_checkin_jour1", "is", null);

  const { count: presentsJour2 } = await supabase
    .from("participants")
    .select("id", { count: "exact", head: true })
    .not("date_checkin_jour2", "is", null);

  const p1 = presentsJour1 ?? 0;
  const p2 = presentsJour2 ?? 0;
  const tauxJ1 = confirmes > 0 ? Math.round((p1 / confirmes) * 100) : 0;
  const tauxJ2 = confirmes > 0 ? Math.round((p2 / confirmes) * 100) : 0;

  const cartesPrincipales = [
    {
      label: "Inscrits (total)",
      valeur: total,
      icone: IconeParticipants,
      classes: "bg-primary text-primary-fg",
    },
    {
      label: "Présence confirmée",
      valeur: confirmes,
      icone: IconeCampagnes,
      classes: "bg-accent-green text-white",
    },
    {
      label: "Équipes hackathon",
      valeur: equipesCount,
      icone: IconeEquipes,
      classes: "bg-accent-gold text-brand-navy-deep",
    },
    {
      label: "Membres du jury",
      valeur: juresCount,
      icone: IconeJury,
      classes: "bg-accent-crimson text-white",
    },
  ];

  const cartesSecondaires = [
    { label: "En attente d'email", valeur: inscrits },
    { label: "Email envoyé, sans réponse", valeur: emailEnvoye },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fg">
        Tableau de bord
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Vue d&apos;ensemble de la JIJ 2026.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cartesPrincipales.map((carte) => {
          const Icone = carte.icone;
          return (
            <div
              key={carte.label}
              className={`rounded-2xl p-5 shadow-sm ${carte.classes}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                <Icone className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-bold">{carte.valeur}</p>
              <p className="mt-1 text-sm opacity-90">{carte.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-fg">
            <IconeCheckin className="h-5 w-5 text-primary" />
            <h2 className="font-display text-base font-bold">
              Check-in — taux de présence
            </h2>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-fg">Jour 1</span>
                <span className="text-fg-muted">
                  {p1} / {confirmes} confirmés ({tauxJ1}%)
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(tauxJ1, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-fg">Jour 2</span>
                <span className="text-fg-muted">
                  {p2} / {confirmes} confirmés ({tauxJ2}%)
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent-green"
                  style={{ width: `${Math.min(tauxJ2, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-base font-bold text-fg">
            Pipeline campagnes
          </h2>
          <div className="mt-4 space-y-3">
            {cartesSecondaires.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between rounded-lg bg-surface-hover px-3 py-2.5"
              >
                <span className="text-sm text-fg-muted">{c.label}</span>
                <span className="font-display text-lg font-bold text-fg">
                  {c.valeur}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
