# Exposétché — Plan de build v1

Plateforme mobile-first élégante (midnight blue + gold) sur TanStack Router + Lovable Cloud (Supabase). Paiement FedaPay stubbé.

## 1. Backend (Lovable Cloud)

Activer Cloud puis créer via migration :

**Tables**
- `profiles` (id uuid PK = auth.uid, nom, prenom, email, telephone, ecole, classe, niveau_etudes, matieres text[], cv_url, statut text default 'actif' — pour rédacteurs : pending/actif/suspendu, created_at)
- `user_roles` (user_id, role enum: eleve|redacteur|admin) — séparée pour sécurité
- `commandes` (id, eleve_id, redacteur_id null, matiere, sujet, niveau, pages, plan, date_limite, format_images bool, format_physique text, adresse_livraison, fichier_reference_url, fichier_livrable_url, statut enum: en_attente|en_cours|en_validation|livre|annule|refuse, prix_total int, message_retour, created_at, updated_at)
- `notations` (id, commande_id unique, eleve_id, redacteur_id, note_globale, note_contenu, note_structure, note_images, note_delai, commentaire, created_at)
- `messages` (id, commande_id, auteur_id, contenu, created_at) — realtime
- `paiements_redacteurs` (id, redacteur_id, commande_id unique, montant, statut: en_attente|paye, date_paiement)

**Fonctions/triggers**
- `has_role(uid, role)` security definer
- `handle_new_user()` trigger sur auth.users → insert profile + role choisi via raw_user_meta_data
- Trigger sur `commandes` quand statut → 'livre' : insert paiements_redacteurs (montant = 60% prix_total)
- Contrainte : un rédacteur a max 3 commandes 'en_cours' (vérifié côté app + RLS check)

**RLS**
- profiles : self select/update ; admin tout ; rédacteurs profiles publics lisibles par tous (pour profil public)
- commandes : élève voit ses commandes ; rédacteur voit (statut=en_attente sans redacteur_id ET matiere ∈ ses matieres) OU (redacteur_id=self) ; admin tout
- notations : élève insert sur sa commande livrée non notée ; tout le monde lit (profil public)
- messages : participants commande + admin
- paiements : rédacteur lit ses paiements ; admin tout

**Storage buckets**
- `cv-redacteurs` (privé) — upload à l'inscription
- `references-eleves` (privé)
- `livrables` (privé, signed URLs)

## 2. Frontend (TanStack Router)

**Design system** (`src/styles.css`) : tokens midnight (#1a1a2e), gold (#FFD700), surfaces, radius doux, ombres élégantes. Inter font. Composants shadcn re-stylés.

**Composants partagés** (`src/components/shared/`) : Layout (header gold/midnight + sidebar mobile drawer), ProtectedRoute, RoleGuard, StatusBadge, StarRating, OrderCard, MissionCard, EmptyState, Skeleton.

**Auth**
- `/` landing pitch + CTA
- `/login`, `/register` (tabs eleve/redacteur, formulaire dynamique, upload CV pour rédacteur)
- Hook `useAuth` (Context) + `_authenticated.tsx` layout route avec beforeLoad redirect

**Routes par rôle** (sous `_authenticated`)
- `/eleve/dashboard`, `/eleve/nouvelle-commande` (4 étapes RHF+Zod), `/eleve/commande/$id` (détail + messagerie + notation), 
- `/redacteur/dashboard`, `/redacteur/missions`, `/redacteur/mission/$id`, `/redacteur/profil`, `/redacteur/paiements`
- `/admin/dashboard` (Recharts), `/admin/commandes`, `/admin/validation`, `/admin/redacteurs`, `/admin/paiements`

**Logique métier clé**
- Calcul prix dynamique (constants.ts)
- Paiement FedaPay = bouton stub "Confirmer paiement (démo)" qui crée la commande
- Soumission livrable rédacteur → statut en_validation
- Validation admin → statut livre + déblocage paiement
- Notation 1× par commande, étoiles + critères, après livraison
- Badges rédacteur calculés côté client à partir des notations
- Realtime Supabase pour messages

**Libs ajoutées** : react-hook-form, @hookform/resolvers, zod, react-hot-toast, recharts, date-fns

## 3. Stratégie de livraison
Tout en une vague. Ordre d'écriture : SQL → auth/types → layouts/design system → flux élève (commande complète) → flux rédacteur → flux admin → messagerie/realtime → polish.

## Notes techniques
- TanStack Router (pas RR v6) — `Link to=`, `createFileRoute`, file-based.
- Pas de FedaPay réel (stub). À brancher plus tard via edge function + secrets `FEDAPAY_PUBLIC_KEY`/`FEDAPAY_SECRET_KEY`.
- Mobile-first : sidebar = bottom nav sur mobile, drawer sur desktop.
- Profile.matieres est array text — pas un select séparé, simple multi-checkbox.
- Admin créé manuellement : assigner role admin via SQL après création du compte.

C'est volumineux mais cohérent. Approuvez et je code.
