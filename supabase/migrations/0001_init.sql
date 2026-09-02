-- JIJ 2026 — schéma initial : participants, campagnes email, check-in, hackathon (équipes/jury/notation)

create extension if not exists pgcrypto;

-- =========================================================================
-- Rôles applicatifs (admin / staff entrée / jury), liés à auth.users
-- =========================================================================
create table public.profils_utilisateurs (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'staff', 'jury')),
  nom_complet text,
  created_at timestamptz not null default now()
);

create or replace function public.role_actuel()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profils_utilisateurs where id = auth.uid();
$$;

-- =========================================================================
-- Participants JIJ 2026 (import du formulaire Google Form)
-- =========================================================================
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  horodatage_inscription timestamptz,
  nom_complet text not null,
  email text not null,
  telephone text,
  sexe text,
  age_saisi text,
  commune text,
  profil text,
  participation text check (participation in ('jour1', 'jour2', 'deux_jours')),
  consentement_infos boolean,
  autorisation_photos boolean,
  engagement_reglement boolean,
  reponses_brutes jsonb not null default '{}'::jsonb,
  statut text not null default 'inscrit'
    check (statut in ('inscrit', 'email_envoye', 'confirme')),
  token_confirmation text unique,
  token_qr text unique,
  date_envoi_email timestamptz,
  date_confirmation timestamptz,
  date_checkin_jour1 timestamptz,
  date_checkin_jour2 timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index participants_email_unique_idx on public.participants (lower(trim(email)));
create index participants_statut_idx on public.participants (statut);
create index participants_profil_idx on public.participants (profil);
create index participants_participation_idx on public.participants (participation);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger participants_set_updated_at
  before update on public.participants
  for each row execute function public.set_updated_at();

-- Historique des emails envoyés (Brevo)
create table public.emails_envoyes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  type text not null,
  date_envoi timestamptz not null default now(),
  statut_brevo text not null check (statut_brevo in ('envoye', 'echec')),
  brevo_message_id text,
  erreur text
);

create index emails_envoyes_participant_idx on public.emails_envoyes (participant_id);

-- =========================================================================
-- Hackathon : équipes (table vide au départ, remplie manuellement par l'admin)
-- =========================================================================
create table public.equipes (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Membres d'équipe : table indépendante des participants JIJ (saisie manuelle admin)
create table public.membres_equipe (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid not null references public.equipes(id) on delete cascade,
  nom_complet text not null,
  email text,
  telephone text,
  role text,
  created_at timestamptz not null default now()
);

create index membres_equipe_equipe_idx on public.membres_equipe (equipe_id);

-- Critères de notation, configurables par l'admin
create table public.criteres_notation (
  id uuid primary key default gen_random_uuid(),
  libelle text not null,
  description text,
  poids numeric not null default 1 check (poids > 0),
  ordre integer not null default 0,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

-- Jurés, liés à un compte Supabase Auth
create table public.jures (
  id uuid primary key default gen_random_uuid(),
  compte_auth_id uuid unique references auth.users(id) on delete set null,
  nom_complet text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Notes : jure x équipe x critère
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  jure_id uuid not null references public.jures(id) on delete cascade,
  equipe_id uuid not null references public.equipes(id) on delete cascade,
  critere_id uuid not null references public.criteres_notation(id) on delete cascade,
  valeur numeric not null check (valeur >= 0 and valeur <= 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jure_id, equipe_id, critere_id)
);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

create index notes_equipe_idx on public.notes (equipe_id);
create index notes_jure_idx on public.notes (jure_id);

-- Paramètres globaux de l'événement (ligne unique)
create table public.parametres_evenement (
  id integer primary key default 1 check (id = 1),
  votes_clotures boolean not null default false,
  classement_publie boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.parametres_evenement (id) values (1);

create trigger parametres_evenement_set_updated_at
  before update on public.parametres_evenement
  for each row execute function public.set_updated_at();

-- Vue de classement : moyenne (entre jurés) des scores pondérés par critère
create view public.vue_classement as
with scores_par_jure as (
  select
    n.equipe_id,
    n.jure_id,
    sum(n.valeur * c.poids) / nullif(sum(c.poids), 0) as score_pondere
  from public.notes n
  join public.criteres_notation c on c.id = n.critere_id
  group by n.equipe_id, n.jure_id
)
select
  e.id as equipe_id,
  e.nom,
  avg(s.score_pondere) as score_final,
  count(distinct s.jure_id) as nb_jures_ayant_note
from public.equipes e
left join scores_par_jure s on s.equipe_id = e.id
group by e.id, e.nom;

-- =========================================================================
-- RLS
-- =========================================================================
alter table public.profils_utilisateurs enable row level security;
alter table public.participants enable row level security;
alter table public.emails_envoyes enable row level security;
alter table public.equipes enable row level security;
alter table public.membres_equipe enable row level security;
alter table public.criteres_notation enable row level security;
alter table public.jures enable row level security;
alter table public.notes enable row level security;
alter table public.parametres_evenement enable row level security;

-- profils_utilisateurs : admin gère tout, chacun voit son propre rôle
create policy "admin_all_profils" on public.profils_utilisateurs
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "self_select_profil" on public.profils_utilisateurs
  for select using (id = auth.uid());

-- participants : admin (tout), staff (lecture seule) — les écritures publiques/checkin passent par des routes API en service role
create policy "admin_all_participants" on public.participants
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "staff_select_participants" on public.participants
  for select using (public.role_actuel() in ('admin', 'staff'));

-- emails_envoyes : admin uniquement
create policy "admin_all_emails" on public.emails_envoyes
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');

-- equipes : admin (tout), jury (lecture seule pour noter)
create policy "admin_all_equipes" on public.equipes
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "jury_select_equipes" on public.equipes
  for select using (public.role_actuel() in ('admin', 'jury'));

-- membres_equipe : admin uniquement
create policy "admin_all_membres_equipe" on public.membres_equipe
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');

-- criteres_notation : admin (tout), jury (lecture des critères actifs)
create policy "admin_all_criteres" on public.criteres_notation
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "jury_select_criteres_actifs" on public.criteres_notation
  for select using (public.role_actuel() = 'jury' and actif = true);

-- jures : admin (tout), chaque juré voit sa propre fiche
create policy "admin_all_jures" on public.jures
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "self_select_jure" on public.jures
  for select using (compte_auth_id = auth.uid());

-- notes : admin (tout), juré (lecture/écriture de ses propres notes, tant que le vote n'est pas clôturé)
create policy "admin_all_notes" on public.notes
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "jury_select_notes_propres" on public.notes
  for select using (
    jure_id in (select id from public.jures where compte_auth_id = auth.uid())
  );
create policy "jury_insert_notes_propres" on public.notes
  for insert with check (
    jure_id in (select id from public.jures where compte_auth_id = auth.uid())
    and not (select votes_clotures from public.parametres_evenement where id = 1)
  );
create policy "jury_update_notes_propres" on public.notes
  for update using (
    jure_id in (select id from public.jures where compte_auth_id = auth.uid())
    and not (select votes_clotures from public.parametres_evenement where id = 1)
  ) with check (
    jure_id in (select id from public.jures where compte_auth_id = auth.uid())
  );

-- parametres_evenement : admin (tout), staff/jury (lecture)
create policy "admin_all_parametres" on public.parametres_evenement
  for all using (public.role_actuel() = 'admin') with check (public.role_actuel() = 'admin');
create policy "lecture_parametres" on public.parametres_evenement
  for select using (public.role_actuel() in ('admin', 'staff', 'jury'));
