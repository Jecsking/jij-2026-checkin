import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function JuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["jury"]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
        <Link href="/jury" className="flex items-center gap-2.5">
          <Image src="/logo/icone-jij.png" alt="JIJ 2026" width={28} height={28} className="h-7 w-7" />
          <span className="font-display text-sm font-bold text-fg">
            Jury — Hackathon JIJ 2026
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/compte" className="text-sm text-fg-muted hover:text-primary">
            Mon compte
          </Link>
          <DeconnexionBouton className="text-fg-muted" />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
