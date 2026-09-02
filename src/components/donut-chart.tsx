interface Segment {
  valeur: number;
  couleur: string;
}

export function DonutChart({
  segments,
  total,
  taille = 160,
  epaisseur = 18,
}: {
  segments: Segment[];
  total: number;
  taille?: number;
  epaisseur?: number;
}) {
  const rayon = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * rayon;
  let cumul = 0;

  return (
    <svg width={taille} height={taille} viewBox={`0 0 ${taille} ${taille}`}>
      <circle
        cx={taille / 2}
        cy={taille / 2}
        r={rayon}
        fill="none"
        stroke="var(--border)"
        strokeWidth={epaisseur}
      />
      {total > 0 &&
        segments.map((segment, i) => {
          if (segment.valeur <= 0) return null;
          const fraction = segment.valeur / total;
          const longueur = fraction * circonference;
          const decalage = -cumul * circonference;
          cumul += fraction;
          return (
            <circle
              key={i}
              cx={taille / 2}
              cy={taille / 2}
              r={rayon}
              fill="none"
              stroke={segment.couleur}
              strokeWidth={epaisseur}
              strokeDasharray={`${longueur} ${circonference - longueur}`}
              strokeDashoffset={decalage}
              transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
              strokeLinecap="butt"
            />
          );
        })}
    </svg>
  );
}
