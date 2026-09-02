import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";

const LIENS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/participants", label: "Participants" },
  { href: "/admin/campagnes", label: "Campagnes email" },
  { href: "/admin/checkin", label: "Check-in temps réel" },
  { href: "/admin/equipes", label: "Équipes hackathon" },
  { href: "/admin/criteres", label: "Critères de notation" },
  { href: "/admin/jury", label: "Jury" },
  { href: "/admin/classement", label: "Classement" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["admin"]);

  return (
    <div className="flex min-h-full flex-1">
      <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white p-4">
        <h2 className="mb-6 px-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
          JIJ 2026 — Admin
        </h2>
        <nav className="space-y-1">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-teal-50 hover:text-teal-800"
            >
              {lien.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-2 px-2">
          <Link
            href="/compte"
            className="block text-sm font-medium text-zinc-500 hover:text-teal-700"
          >
            Mon compte
          </Link>
          <DeconnexionBouton />
        </div>
      </aside>
      <main className="flex-1 bg-zinc-50 p-8">{children}</main>
    </div>
  );
}
