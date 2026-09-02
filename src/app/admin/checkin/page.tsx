import { StatsCheckin } from "./stats-view";

export default function CheckinDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">
        Check-in en temps réel
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Mise à jour automatique toutes les 5 secondes.
      </p>
      <div className="mt-6">
        <StatsCheckin />
      </div>
    </div>
  );
}
