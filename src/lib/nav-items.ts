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
  { href: "/admin/jury", label: "Jury" },
  { href: "/admin/classement", label: "Classement" },
  { href: "/admin/parametres", label: "Paramètres" },
];
