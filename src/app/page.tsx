import Image from "next/image";
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
    <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 text-center">
      <Image
        src="/logo/icone-jij.png"
        alt="JIJ 2026"
        width={96}
        height={96}
        priority
        className="h-24 w-24"
      />
      <h1 className="font-display mt-4 text-3xl font-bold text-fg">
        Journée Internationale de la Jeunesse 2026
      </h1>
      <p className="mt-2 max-w-md text-fg-muted">
        Plateforme d&apos;organisation : check-in des participants et
        notation du hackathon.
      </p>
      <Link
        href="/login"
        className="mt-6 rounded-full bg-primary px-6 py-2.5 font-medium text-primary-fg transition-colors hover:bg-primary-hover"
      >
        Se connecter
      </Link>
    </div>
  );
}
