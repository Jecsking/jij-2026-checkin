import Image from "next/image";
import Link from "next/link";
import { exigerRole } from "@/lib/auth";
import { DeconnexionBouton } from "@/components/deconnexion-bouton";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["staff", "admin"]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Image src="/logo/icone-jij.png" alt="JIJ 2026" width={28} height={28} className="h-7 w-7" />
          <h1 className="font-display text-sm font-bold text-fg">
            Contrôle d&apos;accès
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/compte" className="text-sm text-fg-muted hover:text-primary">
            Mon compte
          </Link>
          <DeconnexionBouton className="text-fg-muted" />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
