-- Chaque équipe passe deux fois devant le jury. Les 3 jurés notent chaque
-- passage séparément, avec les mêmes critères/pondérations dans les deux
-- cas. Le passage 1 est noté directement sur 50, le passage 2 directement
-- sur 100 : la note finale est leur SOMME (pas une moyenne), donc sur 150
-- au total — ex. 39/50 + 84/100 = 123/150.

-- 1) Retire l'ancienne contrainte de vérification sur "valeur" (0-10),
--    quel que soit son nom exact, avant d'en ajouter une nouvelle.
do $$
declare
  contrainte text;
begin
  select conname into contrainte
  from pg_constraint
  where conrelid = 'public.notes'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%valeur%';
  if contrainte is not null then
    execute format('alter table public.notes drop constraint %I', contrainte);
  end if;
end $$;

-- 2) Numéro de passage (1 ou 2).
alter table public.notes
  add column passage smallint not null default 1 check (passage in (1, 2));

-- 3) Plafond différent par passage : 50 pour le passage 1, 100 pour le 2.
alter table public.notes
  add constraint notes_valeur_check check (
    valeur >= 0
    and (
      (passage = 1 and valeur <= 50)
      or (passage = 2 and valeur <= 100)
    )
  );

-- 4) Un juré peut noter un même critère une fois par passage (retrouve
--    dynamiquement l'ancienne contrainte d'unicité à 3 colonnes pour la
--    remplacer par une à 4 colonnes).
do $$
declare
  contrainte text;
begin
  select conname into contrainte
  from pg_constraint
  where conrelid = 'public.notes'::regclass
    and contype = 'u'
    and array_length(conkey, 1) = 3;
  if contrainte is not null then
    execute format('alter table public.notes drop constraint %I', contrainte);
  end if;
end $$;

alter table public.notes
  add constraint notes_jure_equipe_critere_passage_key
  unique (jure_id, equipe_id, critere_id, passage);

-- 5) Classement : moyenne par passage (déjà sur 50 et 100 respectivement),
--    puis somme simple pour la note finale sur 150.
drop view if exists public.vue_classement;

create view public.vue_classement as
with scores_par_jure_passage as (
  select
    n.equipe_id,
    n.jure_id,
    n.passage,
    sum(n.valeur * c.poids) / nullif(sum(c.poids), 0) as score_pondere
  from public.notes n
  join public.criteres_notation c on c.id = n.critere_id
  group by n.equipe_id, n.jure_id, n.passage
),
scores_par_passage as (
  select
    equipe_id,
    passage,
    avg(score_pondere) as score_moyen,
    count(distinct jure_id) as nb_jures
  from scores_par_jure_passage
  group by equipe_id, passage
)
select
  e.id as equipe_id,
  e.nom,
  p1.score_moyen as score_passage1,
  coalesce(p1.nb_jures, 0) as nb_jures_passage1,
  p2.score_moyen as score_passage2,
  coalesce(p2.nb_jures, 0) as nb_jures_passage2,
  case
    when p1.score_moyen is null and p2.score_moyen is null then null
    else coalesce(p1.score_moyen, 0) + coalesce(p2.score_moyen, 0)
  end as score_final,
  greatest(coalesce(p1.nb_jures, 0), coalesce(p2.nb_jures, 0)) as nb_jures_ayant_note
from public.equipes e
left join scores_par_passage p1 on p1.equipe_id = e.id and p1.passage = 1
left join scores_par_passage p2 on p2.equipe_id = e.id and p2.passage = 2;
