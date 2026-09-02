import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabaseSession = await createClient();
  const {
    data: { user },
  } = await supabaseSession.auth.getUser();

  if (!user) {
    return NextResponse.json({ statut: "non_autorise" }, { status: 401 });
  }

  const { data: profil } = await supabaseSession
    .from("profils_utilisateurs")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profil || !["admin", "staff"].includes(profil.role)) {
    return NextResponse.json({ statut: "non_autorise" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const token = body?.token as string | undefined;
  const jour = body?.jour as string | undefined;

  if (!token || (jour !== "jour1" && jour !== "jour2")) {
    return NextResponse.json({ statut: "requete_invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: participant, error } = await supabase
    .from("participants")
    .select("*")
    .eq("token_qr", token)
    .maybeSingle();

  if (error || !participant) {
    return NextResponse.json({ statut: "non_reconnu" });
  }

  if (participant.statut !== "confirme") {
    return NextResponse.json({
      statut: "non_confirme",
      nomComplet: participant.nom_complet,
    });
  }

  const colonneCheckin =
    jour === "jour1" ? "date_checkin_jour1" : "date_checkin_jour2";

  if (participant[colonneCheckin]) {
    return NextResponse.json({
      statut: "deja_scanne",
      nomComplet: participant.nom_complet,
      profil: participant.profil,
      participation: participant.participation,
      horodatage: participant[colonneCheckin],
    });
  }

  const horodatage = new Date().toISOString();
  if (jour === "jour1") {
    await supabase
      .from("participants")
      .update({ date_checkin_jour1: horodatage })
      .eq("id", participant.id);
  } else {
    await supabase
      .from("participants")
      .update({ date_checkin_jour2: horodatage })
      .eq("id", participant.id);
  }

  const journeeNonPrevue =
    participant.participation !== "deux_jours" &&
    participant.participation !== jour;

  return NextResponse.json({
    statut: journeeNonPrevue ? "jour_non_prevu" : "ok",
    nomComplet: participant.nom_complet,
    profil: participant.profil,
    participation: participant.participation,
    horodatage,
  });
}
