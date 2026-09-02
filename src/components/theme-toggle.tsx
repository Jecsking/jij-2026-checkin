"use client";

export function ThemeToggle({ className = "" }: { className?: string }) {
  function basculer() {
    const nouveauSombre = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nouveauSombre);
    try {
      localStorage.setItem("theme", nouveauSombre ? "dark" : "light");
    } catch {
      // stockage indisponible, on continue sans persister
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label="Changer de thème"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px] dark:hidden"
      >
        <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2 1 1 0 0 0-1.36-1.19A10.1 10.1 0 1 0 22 15.1a1 1 0 0 0-.36-2.1Z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="hidden h-[18px] w-[18px] dark:block"
      >
        <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 12a1 1 0 0 1 1 1V19a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.5 12a1 1 0 0 1 1-1H7a1 1 0 1 1 0 2H5.5a1 1 0 0 1-1-1Zm12 0a1 1 0 0 1 1-1H19a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM6.34 6.34a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L6.34 7.76a1 1 0 0 1 0-1.42Zm8.85 8.85a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41Zm1.41-9.9a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM8.81 15.19a1 1 0 0 1 0 1.41L7.75 17.66a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
      </svg>
    </button>
  );
}
