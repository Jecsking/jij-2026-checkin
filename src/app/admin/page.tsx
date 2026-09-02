import { createClient } from "@/lib/supabase/server";
import { getUtilisateurConnecte } from "@/lib/auth";
import { DonutChart } from "@/components/donut-chart";
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

function salutation(): string {
  const heure = new Date().getHours();
  if (heure < 12) return "Bonjour";
  if (heure < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const connecte = await getUtilisateurConnecte();
  const prenom = (connecte?.profil?.nom_complet || "").split(" ")[0] || "Admin";

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
  const tauxPresenceGlobal =
    confirmes > 0 ? Math.round(((p1 + p2) / (confirmes * 2)) * 100) : 0;

  const pastilles = [
    { label: "Participants", valeur: total, icone: IconeParticipants },
    { label: "Équipes", valeur: equipesCount, icone: IconeEquipes },
    { label: "Jurés", valeur: juresCount, icone: IconeJury },
  ];

  const cartes = [
    {
      label: "Inscrits (total)",
      valeur: total,
      icone: IconeParticipants,
      couleur: "primary",
    },
    {
      label: "Email envoyé, sans réponse",
      valeur: emailEnvoye,
      icone: IconeCampagnes,
      couleur: "gold",
    },
    {
      label: "En attente d'email",
      valeur: inscrits,
      icone: IconeCampagnes,
      couleur: "crimson",
    },
    {
      label: "Présence confirmée",
      valeur: confirmes,
      icone: IconeCheckin,
      couleur: "green",
    },
    {
      label: "Présents — Jour 1",
      valeur: p1,
      icone: IconeCheckin,
      couleur: "primary",
    },
    {
      label: "Présents — Jour 2",
      valeur: p2,
      icone: IconeCheckin,
      couleur: "green",
    },
  ];

  const STYLES_COULEUR: Record<string, { bg: string; badge: string; texte: string }> = {
    primary: { bg: "bg-primary/10", badge: "bg-primary", texte: "text-primary" },
    gold: { bg: "bg-accent-gold/15", badge: "bg-accent-gold", texte: "text-accent-gold" },
    crimson: { bg: "bg-accent-crimson/10", badge: "bg-accent-crimson", texte: "text-accent-crimson" },
    green: { bg: "bg-accent-green/10", badge: "bg-accent-green", texte: "text-accent-green" },
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">
            {salutation()}, {prenom} 👋
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Voici un aperçu de l&apos;activité JIJ 2026.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {pastilles.map((p) => {
            const Icone = p.icone;
            return (
              <div
                key={p.label}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2"
              >
                <Icone className="h-4 w-4 text-fg-muted" />
                <span className="font-display text-base font-bold text-fg">
                  {p.valeur}
                </span>
                <span className="text-xs text-fg-muted">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cartes.map((carte) => {
          const Icone = carte.icone;
          const style = STYLES_COULEUR[carte.couleur];
          return (
            <div
              key={carte.label}
              className={`rounded-2xl p-5 ${style.bg}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${style.badge}`}
              >
                <Icone className="h-5 w-5 text-white" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                {carte.label}
              </p>
              <p className={`mt-1 font-display text-3xl font-bold ${style.texte}`}>
                {carte.valeur}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-base font-bold text-fg">
            Répartition des inscrits
          </h2>
          <div className="mt-5 flex items-center gap-8">
            <DonutChart
              total={total}
              segments={[
                { valeur: inscrits, couleur: "var(--accent-crimson)" },
                { valeur: emailEnvoye, couleur: "var(--accent-gold)" },
                { valeur: confirmes, couleur: "var(--accent-green)" },
              ]}
            />
            <div className="space-y-2 text-sm">
              <p className="font-display text-2xl font-bold text-fg">{total}</p>
              <p className="-mt-1 text-xs text-fg-muted">total</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-crimson" />
                  <span className="text-fg-muted">En attente</span>
                  <span className="ml-auto font-medium text-fg">{inscrits}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
                  <span className="text-fg-muted">Email envoyé</span>
                  <span className="ml-auto font-medium text-fg">{emailEnvoye}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
                  <span className="text-fg-muted">Confirmé</span>
                  <span className="ml-auto font-medium text-fg">{confirmes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-fg">
              Check-in — taux de présence
            </h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {tauxPresenceGlobal}% global
            </span>
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-fg">Jour 1</span>
                <span className="text-fg-muted">
                  {p1} / {confirmes} confirmés
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${confirmes > 0 ? Math.min((p1 / confirmes) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-fg">Jour 2</span>
                <span className="text-fg-muted">
                  {p2} / {confirmes} confirmés
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent-green"
                  style={{
                    width: `${confirmes > 0 ? Math.min((p2 / confirmes) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
