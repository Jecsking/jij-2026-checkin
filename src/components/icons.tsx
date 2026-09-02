import type { SVGProps } from "react";

function Icone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function IconeTableauDeBord(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icone>
  );
}

export function IconeParticipants(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.5" />
      <path d="M15.8 14.2c2.9.4 5.2 2.5 5.2 5.8" />
    </Icone>
  );
}

export function IconeCampagnes(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </Icone>
  );
}

export function IconeCheckin(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M15 15h2.5v2.5" />
      <path d="M21 21l-3.2-3.2" />
    </Icone>
  );
}

export function IconeEquipes(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <circle cx="8.5" cy="7.5" r="3" />
      <circle cx="16" cy="8.5" r="2.4" />
      <path d="M2.8 19.5c0-3.4 2.7-5.7 5.7-5.7s5.7 2.3 5.7 5.7" />
      <path d="M14.6 14.3c2.6.3 4.6 2.2 4.6 5.2" />
    </Icone>
  );
}

export function IconeCriteres(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <path d="M4 6h11" />
      <path d="M4 12h7" />
      <path d="M4 18h11" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="14" cy="18" r="2" />
    </Icone>
  );
}

export function IconeJury(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <path d="M12 3l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7z" />
    </Icone>
  );
}

export function IconeClassement(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <path d="M7 21V10M12 21V3M17 21v-7" />
    </Icone>
  );
}

export function IconeParametres(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Icone>
  );
}

export function IconeStaff(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2.2" />
      <path d="M5.5 17c.5-2.2 2.1-3.4 3.5-3.4s3 1.2 3.5 3.4" />
      <path d="M14.5 9h4" />
      <path d="M14.5 12.5h4" />
    </Icone>
  );
}

export function IconeAjouterInvite(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M18.5 8v6" />
      <path d="M15.5 11h6" />
    </Icone>
  );
}

export function IconeDeconnexion(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icone>
  );
}

export function IconeCompte(props: SVGProps<SVGSVGElement>) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c0-4.1 3.4-6.8 7.5-6.8s7.5 2.7 7.5 6.8" />
    </Icone>
  );
}
