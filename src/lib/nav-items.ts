export interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/participants", label: "Participants" },
  { href: "/admin/campagnes", label: "Campagnes email" },
  { href: "/admin/checkin", label: "Check-in temps réel" },
  { href: "/admin/equipes", label: "Équipes" },
  { href: "/admin/criteres", label: "Critères de notation" },
  { href: "/admin/classement", label: "Classement" },
  { href: "/admin/equipe", label: "Staff" },
  { href: "/admin/parametres", label: "Paramètres" },
];

/**
 * Le préfixe seul (pathname.startsWith(href)) ferait matcher "/admin/equipe"
 * (Staff) sur "/admin/equipes" (Équipes hackathon). On exige une frontière
 * de segment : égalité exacte ou suivi d'un "/".
 */
export function estActif(
  pathname: string,
  href: string,
  exact = false
): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
