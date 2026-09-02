import { redirect } from "next/navigation";
import { getUtilisateurConnecte } from "@/lib/auth";
import { ChangerMotDePasse } from "@/components/changer-mot-de-passe";

export default async function ComptePage() {
  const connecte = await getUtilisateurConnecte();
  if (!connecte) redirect("/login");

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-xl font-semibold text-fg">Mon compte</h1>
      <p className="mt-1 text-sm text-fg-muted">{connecte.user.email}</p>
      <div className="mt-6">
        <ChangerMotDePasse />
      </div>
    </div>
  );
}
