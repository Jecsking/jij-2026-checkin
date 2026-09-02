# JIJ 2026 — Check-in & Hackathon

Plateforme d'organisation pour la **Journée Internationale de la Jeunesse 2026**
(Parlement des Jeunes du Bénin) : import des inscrits, campagnes d'email de
confirmation via Brevo, check-in QR code le jour J, et module de notation du
hackathon par un jury.

Stack : Next.js (App Router) · Supabase (Postgres + Auth) · Brevo (email
transactionnel) · déploiement Vercel.

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), créez un nouveau projet.
2. Dans **SQL Editor**, exécutez le contenu de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Il crée tout le schéma (participants, campagnes, équipes, jury, notes,
   classement) avec les policies RLS.
3. Dans **Project Settings → API**, récupérez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, jamais côté client)

## 2. Créer le compte Brevo

1. Sur [app.brevo.com](https://app.brevo.com), créez un compte et validez un
   expéditeur (email + nom).
2. Dans **Paramètres → Clés API**, créez une clé API → `BREVO_API_KEY`.

## 3. Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez :

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role (secrète, serveur uniquement) |
| `BREVO_API_KEY` | Clé API Brevo |
| `BREVO_SENDER_EMAIL` | Email expéditeur validé sur Brevo |
| `BREVO_SENDER_NAME` | Nom affiché comme expéditeur |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app (utilisée dans les liens de confirmation par email) |

## 4. Créer le premier compte admin

Les comptes ne peuvent pas s'auto-inscrire (aucune page de signup, par design).
Pour créer le tout premier admin :

1. Dashboard Supabase → **Authentication → Users → Add user** (email + mot de
   passe).
2. **SQL Editor**, en remplaçant `<uid>` par l'UID généré :

```sql
insert into public.profils_utilisateurs (id, role, nom_complet)
values ('<uid>', 'admin', 'Nom Prénom');
```

Les comptes staff (contrôle d'entrée) se créent de la même façon avec
`role = 'staff'`. Les comptes jury se créent directement depuis l'interface
admin (`/admin/jury`), qui génère un mot de passe temporaire et l'envoie par
email via Brevo.

## 5. Lancer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 6. Déployer sur Vercel

1. Poussez ce dépôt sur GitHub.
2. Importez-le dans Vercel.
3. Renseignez les mêmes variables d'environnement que `.env.local` dans les
   réglages du projet Vercel (Production + Preview).
4. Déployez. Mettez à jour `NEXT_PUBLIC_APP_URL` avec l'URL Vercel finale
   (obligatoire pour que les liens de confirmation envoyés par email soient
   corrects), puis redéployez.

## Fonctionnement des modules

- **Import** (`/admin/participants/import`) : accepte l'export du Google Form
  en `.xlsx` ou `.csv`. Les colonnes sont reconnues par mots-clés (résistant à
  de légères reformulations du formulaire), les emails déjà présents sont mis
  à jour plutôt que dupliqués.
- **Campagnes** (`/admin/campagnes`) : sélection d'un segment (profil, jour de
  participation, statut), envoi de l'email de confirmation via Brevo avec un
  lien à token unique par participant.
- **Confirmation** (`/confirmer/[token]`) : page publique, sans compte. Un
  clic confirme la présence, génère un QR code unique et l'envoie par email
  (avec pièce jointe PNG) en plus de l'afficher à l'écran.
- **Check-in** (`/staff/scan`) : scan caméra du QR code, marque la présence
  jour 1 ou jour 2, empêche les doublons. Dashboard temps réel dans
  `/admin/checkin`.
- **Hackathon** (`/admin/equipes`, `/admin/criteres`, `/admin/jury`, `/jury`,
  `/admin/classement`) : équipes et critères de notation créés manuellement
  par l'admin (aucune donnée pré-remplie), notation par les jurés (invisible
  entre jurés), classement calculé automatiquement (moyenne pondérée des
  critères, moyennée entre jurés), publication publique optionnelle sur
  `/classement` une fois le vote clôturé.

## Notes de conception

- Les membres d'équipe du hackathon sont saisis manuellement (table
  `membres_equipe`), indépendamment des inscrits JIJ.
- Les critères de notation sont entièrement configurables par l'admin (aucun
  critère par défaut) — libellé, poids, actif/inactif.
- Les emails de campagnes sont envoyés par lots de 8 en parallèle. Pour de
  très gros segments (plusieurs centaines de participants), la durée
  d'exécution par défaut de Vercel peut être limitante : filtrez en segments
  plus petits, ou augmentez le `maxDuration` de fonction selon votre plan
  Vercel.
