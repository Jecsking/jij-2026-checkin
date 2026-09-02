import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";

export default async function JuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["jury"]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <Link href="/jury" className="text-sm font-semibold text-teal-800">
          Jury — Hackathon JIJ 2026
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/compte" className="text-sm text-zinc-500 hover:text-teal-700">
            Mon compte
          </Link>
          <DeconnexionBouton />
        </div>
      </header>
      <main className="flex-1 bg-zinc-50 p-6">{children}</main>
    </div>
  );
}
