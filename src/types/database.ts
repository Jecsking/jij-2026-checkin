export type RoleUtilisateur = "admin" | "staff" | "jury";
export type StatutParticipant = "inscrit" | "email_envoye" | "confirme";
export type Participation = "jour1" | "jour2" | "deux_jours";
export type StatutBrevo = "envoye" | "echec";

export type Participant = {
  id: string;
  horodatage_inscription: string | null;
  nom_complet: string;
  email: string;
  telephone: string | null;
  sexe: string | null;
  age_saisi: string | null;
  commune: string | null;
  commune_normalisee: string | null;
  profil: string | null;
  participation: Participation | null;
  consentement_infos: boolean | null;
  autorisation_photos: boolean | null;
  engagement_reglement: boolean | null;
  reponses_brutes: Record<string, unknown>;
  statut: StatutParticipant;
  token_confirmation: string | null;
  token_qr: string | null;
  date_envoi_email: string | null;
  date_confirmation: string | null;
  date_checkin_jour1: string | null;
  date_checkin_jour2: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailEnvoye = {
  id: string;
  participant_id: string;
  type: string;
  date_envoi: string;
  statut_brevo: StatutBrevo;
  brevo_message_id: string | null;
  erreur: string | null;
};

export type Equipe = {
  id: string;
  nom: string;
  description: string | null;
  created_at: string;
};

export type MembreEquipe = {
  id: string;
  equipe_id: string;
  nom_complet: string;
  email: string | null;
  telephone: string | null;
  role: string | null;
  created_at: string;
};

export type CritereNotation = {
  id: string;
  libelle: string;
  description: string | null;
  poids: number;
  ordre: number;
  actif: boolean;
  created_at: string;
};

export type Jure = {
  id: string;
  compte_auth_id: string | null;
  nom_complet: string;
  email: string;
  created_at: string;
};

export type Passage = 1 | 2;

export type Note = {
  id: string;
  jure_id: string;
  equipe_id: string;
  critere_id: string;
  passage: Passage;
  valeur: number;
  created_at: string;
  updated_at: string;
};

export type ParametresEvenement = {
  id: number;
  votes_clotures: boolean;
  classement_publie: boolean;
  updated_at: string;
};

export type ProfilUtilisateur = {
  id: string;
  role: RoleUtilisateur;
  nom_complet: string | null;
  super_admin: boolean;
  created_at: string;
};

export type VueClassement = {
  equipe_id: string;
  nom: string;
  score_passage1: number | null;
  nb_jures_passage1: number;
  score_passage2: number | null;
  nb_jures_passage2: number;
  score_final: number | null;
  nb_jures_ayant_note: number;
};

export type Database = {
  public: {
    Tables: {
      participants: {
        Row: Participant;
        Insert: Partial<Participant> & { nom_complet: string; email: string };
        Update: Partial<Participant>;
        Relationships: [];
      };
      emails_envoyes: {
        Row: EmailEnvoye;
        Insert: Partial<EmailEnvoye> & {
          participant_id: string;
          type: string;
          statut_brevo: StatutBrevo;
        };
        Update: Partial<EmailEnvoye>;
        Relationships: [
          {
            foreignKeyName: "emails_envoyes_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "participants";
            referencedColumns: ["id"];
          },
        ];
      };
      equipes: {
        Row: Equipe;
        Insert: Partial<Equipe> & { nom: string };
        Update: Partial<Equipe>;
        Relationships: [];
      };
      membres_equipe: {
        Row: MembreEquipe;
        Insert: Partial<MembreEquipe> & {
          equipe_id: string;
          nom_complet: string;
        };
        Update: Partial<MembreEquipe>;
        Relationships: [
          {
            foreignKeyName: "membres_equipe_equipe_id_fkey";
            columns: ["equipe_id"];
            isOneToOne: false;
            referencedRelation: "equipes";
            referencedColumns: ["id"];
          },
        ];
      };
      criteres_notation: {
        Row: CritereNotation;
        Insert: Partial<CritereNotation> & { libelle: string };
        Update: Partial<CritereNotation>;
        Relationships: [];
      };
      jures: {
        Row: Jure;
        Insert: Partial<Jure> & { nom_complet: string; email: string };
        Update: Partial<Jure>;
        Relationships: [];
      };
      notes: {
        Row: Note;
        Insert: Partial<Note> & {
          jure_id: string;
          equipe_id: string;
          critere_id: string;
          passage: Passage;
          valeur: number;
        };
        Update: Partial<Note>;
        Relationships: [
          {
            foreignKeyName: "notes_jure_id_fkey";
            columns: ["jure_id"];
            isOneToOne: false;
            referencedRelation: "jures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_equipe_id_fkey";
            columns: ["equipe_id"];
            isOneToOne: false;
            referencedRelation: "equipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_critere_id_fkey";
            columns: ["critere_id"];
            isOneToOne: false;
            referencedRelation: "criteres_notation";
            referencedColumns: ["id"];
          },
        ];
      };
      parametres_evenement: {
        Row: ParametresEvenement;
        Insert: Partial<ParametresEvenement>;
        Update: Partial<ParametresEvenement>;
        Relationships: [];
      };
      profils_utilisateurs: {
        Row: ProfilUtilisateur;
        Insert: Partial<ProfilUtilisateur> & {
          id: string;
          role: RoleUtilisateur;
        };
        Update: Partial<ProfilUtilisateur>;
        Relationships: [];
      };
    };
    Views: {
      vue_classement: {
        Row: VueClassement;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};
