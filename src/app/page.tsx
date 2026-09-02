import Link from "next/link";
import { redirect } from "next/navigation";
import { getUtilisateurConnecte } from "@/lib/auth";

const DESTINATION_PAR_ROLE: Record<string, string> = {
  admin: "/admin",
  staff: "/staff/scan",
  jury: "/jury",
};

export default async function Home() {
  const connecte = await getUtilisateurConnecte();

  if (connecte?.profil) {
    redirect(DESTINATION_PAR_ROLE[connecte.profil.role] ?? "/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <h1 className="text-2xl font-semibold text-teal-800">
        Journée Internationale de la Jeunesse 2026
      </h1>
      <p className="mt-2 max-w-md text-zinc-600">
        Plateforme d&apos;organisation : check-in des participants et
        notation du hackathon.
      </p>
      <Link
        href="/login"
        className="mt-6 rounded-md bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800"
      >
        Se connecter
      </Link>
    </div>
  );
}
