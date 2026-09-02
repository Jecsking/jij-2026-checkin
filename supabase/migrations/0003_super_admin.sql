-- Les comptes admin ne peuvent plus, par défaut, gérer l'équipe (créer/
-- supprimer d'autres comptes) : seuls les "super admin" le peuvent. Les
-- admins déjà existants conservent cette capacité (migrés à true) ; tout
-- nouveau compte admin créé après cette migration démarre à false, sauf
-- case cochée explicitement à la création.

alter table public.profils_utilisateurs
  add column super_admin boolean not null default false;

update public.profils_utilisateurs
  set super_admin = true
  where role = 'admin';
