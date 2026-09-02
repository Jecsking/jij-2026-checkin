/**
 * Le champ "Commune de Résidence" du formulaire est en texte libre : la même
 * ville y apparaît sous des dizaines de graphies (accents, tirets, casse,
 * fautes de frappe). Cette table canonicalise les réponses observées vers un
 * nom de ville unique, pour que les filtres/campagnes par ville soient
 * exploitables. Alimentée à partir des réponses réelles de la JIJ 2026 —
 * une nouvelle graphie inconnue retombe sur le texte normalisé tel quel.
 */

function normaliserClef(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’\-/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ALIAS_COMMUNES: Record<string, string> = {
  "ab calavi": "Abomey-Calavi",
  "abomey calavi": "Abomey-Calavi",
  "calavi": "Abomey-Calavi",
  "calavi tankpe": "Abomey-Calavi",
  "calavi tokan": "Abomey-Calavi",
  "calavie": "Abomey-Calavi",
  "cocotomey tokpa": "Abomey-Calavi",
  "commune d abomey calavi": "Abomey-Calavi",
  "godomey": "Abomey-Calavi",

  "cotonou": "Cotonou",
  "contonou": "Cotonou",
  "cotinou": "Cotonou",
  "cotpnou": "Cotonou",
  "aibatin cotonou": "Cotonou",
  "cadjehoun": "Cotonou",
  "littoral": "Cotonou",

  "porto novo": "Porto-Novo",
  "porto": "Porto-Novo",

  "adja ouere": "Adja-Ouèrè",
  "adjara": "Adjarra",
  "adjarra": "Adjarra",
  "d adjarra": "Adjarra",
  "adjohoun": "Adjohoun",
  "agbangnizoun": "Agbangnizoun",
  "aguegues": "Aguégués",
  "akpro misserete": "Akpro-Missérété",
  "misserete": "Akpro-Missérété",
  "allada": "Allada",
  "aplahoue": "Aplahoué",
  "athieme": "Athiémé",
  "avrankou": "Avrankou",
  "bassila": "Bassila",
  "bohicon": "Bohicon",
  "bonou": "Bonou",
  "bopa": "Bopa",
  "cobly": "Cobly",
  "come": "Comé",
  "dangbo": "Dangbo",
  "dassa": "Dassa-Zoumè",
  "dassa zoume": "Dassa-Zoumè",
  "djidja": "Djidja",
  "djougou": "Djougou",
  "glazoue": "Glazoué",
  "gogounou": "Gogounou",
  "ifangni": "Ifangni",
  "kandi": "Kandi",
  "ketou": "Kétou",
  "lalo": "Lalo",
  "lokossa": "Lokossa",
  "natitingou": "Natitingou",
  "ouake": "Ouaké",
  "ouesse": "Ouèssè",
  "ouesse wogoudo": "Ouèssè",
  "ouidah": "Ouidah",
  "pahou": "Ouidah",
  "ouinhi": "Ouinhi",
  "parakou": "Parakou",
  "perere": "Pèrèrè",
  "pobe": "Pobè",
  "sakete": "Sakété",
  "savalou": "Savalou",
  "save": "Savè",
  "seme": "Sèmè-Kpodji",
  "seme kpodji": "Sèmè-Kpodji",
  "seme podji": "Sèmè-Kpodji",
  "so ava": "Sô-Ava",
  "tchaourou": "Tchaourou",
  "toffo": "Toffo",
  "tori bossito": "Tori-Bossito",
  "toviklin": "Toviklin",
  "za kpota": "Za-Kpota",
  "ze": "Zè",

  // Réponses au niveau département (pas de commune précise) — regroupées
  // à part plutôt que rattachées arbitrairement à une commune.
  "atlantic": "Atlantique (département)",
  "atlantique": "Atlantique (département)",
  "oueme": "Ouémé (département)",
  "plateau": "Plateau (département)",
  "zou": "Zou (département)",

  // Réponses à deux villes — gardées telles quelles, ne pas fusionner.
  "ifangni sakete": "Ifangni / Sakété",
  "parakou cotonou": "Parakou / Cotonou",
  "porto novo cotonou": "Porto-Novo / Cotonou",
};

/**
 * Renvoie un nom de ville canonique pour l'affichage et le filtrage.
 * Si la graphie n'est pas reconnue, renvoie le texte normalisé (Title Case)
 * tel quel plutôt que de le rejeter.
 */
export function canonicaliserCommune(brut: string | null | undefined): string | null {
  if (!brut || !brut.trim()) return null;
  const clef = normaliserClef(brut);
  if (!clef) return null;
  if (ALIAS_COMMUNES[clef]) return ALIAS_COMMUNES[clef];

  return clef
    .split(" ")
    .map((mot) => mot.charAt(0).toUpperCase() + mot.slice(1))
    .join(" ");
}
