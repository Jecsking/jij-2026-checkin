-- Ville canonique dérivée de la commune en texte libre du formulaire,
-- pour permettre un filtrage/segmentation de campagnes par ville fiable.
alter table public.participants
  add column commune_normalisee text;

create index participants_commune_normalisee_idx
  on public.participants (commune_normalisee);
