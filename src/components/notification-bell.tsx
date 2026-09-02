export function NotificationBell({ nombre }: { nombre: number }) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {nombre > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-gold px-1 text-[10px] font-bold text-brand-navy-deep">
          {nombre > 9 ? "9+" : nombre}
        </span>
      )}
    </div>
  );
}
