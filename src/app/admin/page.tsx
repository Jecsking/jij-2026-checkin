import { createClient } from "@/lib/supabase/server";

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

  const cartes = [
    { label: "Inscrits (total)", valeur: total },
    { label: "En attente d'email", valeur: inscrits },
    { label: "Email envoyé, sans réponse", valeur: emailEnvoye },
    { label: "Présence confirmée", valeur: confirmes },
    { label: "Présents — Jour 1", valeur: presentsJour1 ?? 0 },
    { label: "Présents — Jour 2", valeur: presentsJour2 ?? 0 },
    { label: "Équipes hackathon", valeur: equipesCount },
    { label: "Membres du jury", valeur: juresCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        Tableau de bord
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cartes.map((carte) => (
          <div
            key={carte.label}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <p className="text-sm text-zinc-500">{carte.label}</p>
            <p className="mt-2 text-3xl font-semibold text-teal-800">
              {carte.valeur}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
