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
  { href: "/admin/equipe", label: "Équipe" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export const NAV_ITEMS_HOTESSE: NavItem[] = [
  { href: "/staff/scan", label: "Scanner", exact: true },
  { href: "/staff/participants", label: "Participants" },
];

export const NAV_ITEMS_JURY: NavItem[] = [
  { href: "/jury", label: "Tableau de bord", exact: true },
];

/**
 * Le préfixe seul (pathname.startsWith(href)) ferait matcher "/admin/equipe"
 * (Équipe) sur "/admin/equipes" (Équipes hackathon). On exige une frontière
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
