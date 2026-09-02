-- Les critères de notation sont désormais propres à chaque passage (le
-- passage 1 peut avoir des critères différents du passage 2), et le
-- nombre de points maximum de chaque passage devient réglable par
-- l'admin au lieu d'être fixé dans le code (50 et 100 par défaut).

alter table public.criteres_notation
  add column passage smallint not null default 1 check (passage in (1, 2));

alter table public.parametres_evenement
  add column points_max_passage1 numeric not null default 50 check (points_max_passage1 > 0);

alter table public.parametres_evenement
  add column points_max_passage2 numeric not null default 100 check (points_max_passage2 > 0);

-- Le plafond par passage (50/100) était figé dans la contrainte de la
-- migration précédente ; comme il devient réglable par l'admin, on relâche
-- la contrainte en base (elle ne vérifie plus que la non-négativité) et on
-- laisse l'application appliquer le plafond dynamique au moment de l'écriture.
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

alter table public.notes
  add constraint notes_valeur_check check (valeur >= 0);
