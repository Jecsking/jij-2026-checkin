import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "non_autorise" }, { status: 401 });
  }

  const { data: profil } = await supabase
    .from("profils_utilisateurs")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profil || !["admin", "staff"].includes(profil.role)) {
    return NextResponse.json({ erreur: "non_autorise" }, { status: 403 });
  }

  const { data: confirmes } = await supabase
    .from("participants")
    .select("profil, participation, date_checkin_jour1, date_checkin_jour2")
    .eq("statut", "confirme");

  const parProfil = new Map<
    string,
    { attendusJ1: number; presentsJ1: number; attendusJ2: number; presentsJ2: number }
  >();

  for (const p of confirmes ?? []) {
    const cle = p.profil ?? "Non renseigné";
    if (!parProfil.has(cle)) {
      parProfil.set(cle, { attendusJ1: 0, presentsJ1: 0, attendusJ2: 0, presentsJ2: 0 });
    }
    const ligne = parProfil.get(cle)!;

    const attenduJ1 = p.participation === "jour1" || p.participation === "deux_jours";
    const attenduJ2 = p.participation === "jour2" || p.participation === "deux_jours";

    if (attenduJ1) ligne.attendusJ1++;
    if (attenduJ2) ligne.attendusJ2++;
    if (p.date_checkin_jour1) ligne.presentsJ1++;
    if (p.date_checkin_jour2) ligne.presentsJ2++;
  }

  const lignes = Array.from(parProfil.entries())
    .map(([profil, valeurs]) => ({ profil, ...valeurs }))
    .sort((a, b) => a.profil.localeCompare(b.profil));

  const total = lignes.reduce(
    (acc, l) => ({
      attendusJ1: acc.attendusJ1 + l.attendusJ1,
      presentsJ1: acc.presentsJ1 + l.presentsJ1,
      attendusJ2: acc.attendusJ2 + l.attendusJ2,
      presentsJ2: acc.presentsJ2 + l.presentsJ2,
    }),
    { attendusJ1: 0, presentsJ1: 0, attendusJ2: 0, presentsJ2: 0 }
  );

  return NextResponse.json({ lignes, total });
}
