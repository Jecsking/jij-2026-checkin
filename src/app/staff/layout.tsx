import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["staff", "admin"]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
        <h1 className="text-sm font-semibold text-teal-800">
          JIJ 2026 — Contrôle d&apos;accès
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/compte" className="text-sm text-zinc-500 hover:text-teal-700">
            Mon compte
          </Link>
          <DeconnexionBouton />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
