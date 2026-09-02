import "server-only";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { Participant } from "@/types/database";

export interface LigneImportee {
  email: string;
  nom_complet: string;
  telephone: string | null;
  sexe: string | null;
  age_saisi: string | null;
  commune: string | null;
  profil: string | null;
  participation: Participant["participation"];
  consentement_infos: boolean | null;
  autorisation_photos: boolean | null;
  engagement_reglement: boolean | null;
  horodatage_inscription: string | null;
  reponses_brutes: Record<string, string>;
}

function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

type Champ = keyof Omit<LigneImportee, "reponses_brutes" | "participation">;

const REGLES_ENTETES: Array<{ champ: Champ | "participation"; motsClefs: string[] }> = [
  { champ: "horodatage_inscription", motsClefs: ["horodateur"] },
  { champ: "email", motsClefs: ["mail"] },
  { champ: "nom_complet", motsClefs: ["nom et prenom", "nom complet", "nom, prenom"] },
  { champ: "sexe", motsClefs: ["sexe"] },
  { champ: "age_saisi", motsClefs: ["age"] },
  { champ: "telephone", motsClefs: ["whatsapp", "telephone", "numero"] },
  { champ: "commune", motsClefs: ["commune"] },
  { champ: "profil", motsClefs: ["profil"] },
  { champ: "participation", motsClefs: ["participerez"] },
  {
    champ: "consentement_infos",
    motsClefs: ["recevoir les informations", "recevoir les infos"],
  },
  {
    champ: "engagement_reglement",
    motsClefs: ["confirme ma participation"],
  },
  {
    champ: "autorisation_photos",
    motsClefs: ["autorise le parlement", "photos et videos", "autorisation"],
  },
];

function echapperRegex(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function contientMotEntier(norm: string, motClef: string): boolean {
  // Limites de mot pour éviter les faux positifs par sous-chaîne
  // (ex. "age" ne doit pas matcher dans "engage").
  return new RegExp(`\\b${echapperRegex(motClef)}\\b`).test(norm);
}

function trouverChampPourEntete(enTete: string): Champ | "participation" | null {
  const norm = normaliser(enTete);
  for (const regle of REGLES_ENTETES) {
    if (regle.motsClefs.some((mot) => contientMotEntier(norm, mot))) {
      return regle.champ;
    }
  }
  return null;
}

function mapperOuiNon(valeur: string | undefined): boolean | null {
  if (!valeur) return null;
  const norm = normaliser(valeur);
  if (norm.startsWith("oui")) return true;
  if (norm.startsWith("non")) return false;
  return null;
}

function mapperParticipation(
  valeur: string | undefined
): Participant["participation"] {
  if (!valeur) return null;
  const norm = normaliser(valeur);
  if (norm.includes("deux")) return "deux_jours";
  if (norm.includes("premier")) return "jour1";
  if (norm.includes("deuxieme") || norm.includes("second")) return "jour2";
  return null;
}

function convertirDateExcel(valeur: number): string {
  const millisecondesParJour = 24 * 60 * 60 * 1000;
  const epochExcel = Date.UTC(1899, 11, 30);
  return new Date(epochExcel + valeur * millisecondesParJour).toISOString();
}

function mapperHorodatage(valeur: unknown): string | null {
  if (valeur === null || valeur === undefined || valeur === "") return null;
  if (valeur instanceof Date) return valeur.toISOString();
  if (typeof valeur === "number") return convertirDateExcel(valeur);
  if (typeof valeur === "string") {
    const parsed = new Date(valeur);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

function construireLigne(
  enTetes: string[],
  valeurs: Record<string, unknown>
): LigneImportee | null {
  const parChamp: Record<string, string> = {};
  const brutes: Record<string, string> = {};
  let horodatageBrut: unknown = null;

  for (const enTete of enTetes) {
    const valeurBrute = valeurs[enTete];
    const champ = trouverChampPourEntete(enTete);
    const valeurTexte =
      valeurBrute === null || valeurBrute === undefined
        ? ""
        : String(valeurBrute).trim();

    if (champ === "horodatage_inscription") {
      horodatageBrut = valeurBrute;
    } else if (champ) {
      parChamp[champ] = valeurTexte;
    } else if (valeurTexte) {
      brutes[enTete.trim()] = valeurTexte;
    }
  }

  const email = parChamp["email"]?.toLowerCase().trim();
  const nomComplet = parChamp["nom_complet"]?.trim();
  if (!email || !nomComplet) return null;

  return {
    email,
    nom_complet: nomComplet,
    telephone: parChamp["telephone"] || null,
    sexe: parChamp["sexe"] || null,
    age_saisi: parChamp["age_saisi"] || null,
    commune: parChamp["commune"] || null,
    profil: parChamp["profil"] || null,
    participation: mapperParticipation(parChamp["participation"]),
    consentement_infos: mapperOuiNon(parChamp["consentement_infos"]),
    autorisation_photos: mapperOuiNon(parChamp["autorisation_photos"]),
    engagement_reglement: mapperOuiNon(parChamp["engagement_reglement"]),
    horodatage_inscription: mapperHorodatage(horodatageBrut),
    reponses_brutes: brutes,
  };
}

export async function parserFichierParticipants(
  fichier: File
): Promise<LigneImportee[]> {
  const nom = fichier.name.toLowerCase();
  const buffer = Buffer.from(await fichier.arrayBuffer());

  if (nom.endsWith(".csv")) {
    const texte = buffer.toString("utf-8");
    const resultat = Papa.parse<Record<string, string>>(texte, {
      header: true,
      skipEmptyLines: true,
    });
    const enTetes = resultat.meta.fields ?? [];
    return resultat.data
      .map((ligne) => construireLigne(enTetes, ligne))
      .filter((l): l is LigneImportee => l !== null);
  }

  const classeur = new ExcelJS.Workbook();
  // exceljs déclare un shim `Buffer` global (extends ArrayBuffer) qui entre en
  // conflit avec le Buffer générique de @types/node récent — cast nécessaire.
  await classeur.xlsx.load(buffer as unknown as Parameters<typeof classeur.xlsx.load>[0]);
  const feuille = classeur.worksheets[0];
  if (!feuille) return [];

  const lignesBrutes = feuille.getSheetValues();
  const enTetes = (lignesBrutes[1] as unknown[]).map((v) => String(v ?? "").trim());

  const lignes: LigneImportee[] = [];
  for (let i = 2; i < lignesBrutes.length; i++) {
    const ligneValeurs = lignesBrutes[i] as unknown[];
    if (!ligneValeurs) continue;
    const valeurs: Record<string, unknown> = {};
    enTetes.forEach((enTete, index) => {
      // getSheetValues renvoie un tableau 1-indexé (index 0 vide)
      valeurs[enTete] = ligneValeurs[index + 1];
    });
    const ligne = construireLigne(enTetes, valeurs);
    if (ligne) lignes.push(ligne);
  }

  return lignes;
}
