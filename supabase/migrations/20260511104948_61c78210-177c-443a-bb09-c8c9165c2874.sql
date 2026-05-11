
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('eleve', 'redacteur', 'admin');
CREATE TYPE public.commande_statut AS ENUM ('en_attente', 'en_cours', 'en_validation', 'livre', 'annule', 'refuse');
CREATE TYPE public.paiement_statut AS ENUM ('en_attente', 'paye');
CREATE TYPE public.redacteur_statut AS ENUM ('pending', 'actif', 'suspendu');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL DEFAULT '',
  prenom TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telephone TEXT,
  ecole TEXT,
  classe TEXT,
  niveau_etudes TEXT,
  matieres TEXT[] DEFAULT '{}',
  cv_url TEXT,
  statut public.redacteur_statut NOT NULL DEFAULT 'actif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- USER ROLES (séparée pour sécurité)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Security definer pour éviter recursion RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Trigger : à la création d'un user, créer profil + role depuis raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'eleve');

  INSERT INTO public.profiles (id, nom, prenom, email, telephone, ecole, classe, niveau_etudes, matieres, cv_url, statut)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'telephone',
    NEW.raw_user_meta_data->>'ecole',
    NEW.raw_user_meta_data->>'classe',
    NEW.raw_user_meta_data->>'niveau_etudes',
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'matieres')),
      '{}'::TEXT[]
    ),
    NEW.raw_user_meta_data->>'cv_url',
    CASE WHEN v_role = 'redacteur' THEN 'pending'::public.redacteur_statut ELSE 'actif'::public.redacteur_statut END
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger générique
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- COMMANDES
CREATE TABLE public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleve_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redacteur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  matiere TEXT NOT NULL,
  sujet TEXT NOT NULL,
  niveau TEXT NOT NULL,
  pages TEXT NOT NULL,
  plan TEXT,
  date_limite DATE NOT NULL,
  format_images BOOLEAN NOT NULL DEFAULT TRUE,
  format_physique TEXT NOT NULL DEFAULT 'numerique',
  adresse_livraison TEXT,
  fichier_reference_url TEXT,
  fichier_livrable_url TEXT,
  statut public.commande_statut NOT NULL DEFAULT 'en_attente',
  prix_total INTEGER NOT NULL,
  message_retour TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_commandes_eleve ON public.commandes(eleve_id);
CREATE INDEX idx_commandes_redacteur ON public.commandes(redacteur_id);
CREATE INDEX idx_commandes_statut ON public.commandes(statut);

CREATE TRIGGER touch_commandes BEFORE UPDATE ON public.commandes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Trigger : si statut passe à "livre", créer/mettre à jour le paiement rédacteur
CREATE OR REPLACE FUNCTION public.handle_commande_livree()
RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.statut = 'livre' AND (OLD.statut IS DISTINCT FROM 'livre') AND NEW.redacteur_id IS NOT NULL THEN
    INSERT INTO public.paiements_redacteurs (redacteur_id, commande_id, montant, statut)
    VALUES (NEW.redacteur_id, NEW.id, ROUND(NEW.prix_total * 0.6)::INTEGER, 'en_attente')
    ON CONFLICT (commande_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- NOTATIONS
CREATE TABLE public.notations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID NOT NULL UNIQUE REFERENCES public.commandes(id) ON DELETE CASCADE,
  eleve_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redacteur_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_globale SMALLINT NOT NULL CHECK (note_globale BETWEEN 1 AND 5),
  note_contenu SMALLINT CHECK (note_contenu BETWEEN 1 AND 5),
  note_structure SMALLINT CHECK (note_structure BETWEEN 1 AND 5),
  note_images SMALLINT CHECK (note_images BETWEEN 1 AND 5),
  note_delai SMALLINT CHECK (note_delai BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notations_redacteur ON public.notations(redacteur_id);

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
  auteur_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_commande ON public.messages(commande_id);

-- PAIEMENTS RÉDACTEURS
CREATE TABLE public.paiements_redacteurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  redacteur_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commande_id UUID NOT NULL UNIQUE REFERENCES public.commandes(id) ON DELETE CASCADE,
  montant INTEGER NOT NULL,
  statut public.paiement_statut NOT NULL DEFAULT 'en_attente',
  date_paiement TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_paiements_redacteur ON public.paiements_redacteurs(redacteur_id);

CREATE TRIGGER on_commande_livree
  AFTER UPDATE ON public.commandes
  FOR EACH ROW EXECUTE FUNCTION public.handle_commande_livree();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements_redacteurs ENABLE ROW LEVEL SECURITY;

-- profiles : tout authentifié peut lire (besoin pour profil public rédacteur), self update, admin tout
CREATE POLICY "profiles select all auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update self" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles update admin" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles : self read, admin all
CREATE POLICY "user_roles select self" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles admin all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- commandes
CREATE POLICY "commandes eleve select" ON public.commandes FOR SELECT TO authenticated
  USING (eleve_id = auth.uid() OR redacteur_id = auth.uid()
    OR (statut = 'en_attente' AND redacteur_id IS NULL AND public.has_role(auth.uid(), 'redacteur'))
    OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "commandes eleve insert" ON public.commandes FOR INSERT TO authenticated
  WITH CHECK (eleve_id = auth.uid() AND public.has_role(auth.uid(), 'eleve'));
CREATE POLICY "commandes update participants" ON public.commandes FOR UPDATE TO authenticated
  USING (eleve_id = auth.uid() OR redacteur_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    OR (statut = 'en_attente' AND redacteur_id IS NULL AND public.has_role(auth.uid(), 'redacteur')));

-- notations
CREATE POLICY "notations select all auth" ON public.notations FOR SELECT TO authenticated USING (true);
CREATE POLICY "notations insert eleve" ON public.notations FOR INSERT TO authenticated
  WITH CHECK (
    eleve_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.commandes c WHERE c.id = commande_id AND c.eleve_id = auth.uid() AND c.statut = 'livre')
  );

-- messages
CREATE POLICY "messages select participants" ON public.messages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.commandes c WHERE c.id = commande_id AND (c.eleve_id = auth.uid() OR c.redacteur_id = auth.uid()))
  );
CREATE POLICY "messages insert participants" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    auteur_id = auth.uid() AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (SELECT 1 FROM public.commandes c WHERE c.id = commande_id AND (c.eleve_id = auth.uid() OR c.redacteur_id = auth.uid()))
    )
  );

-- paiements
CREATE POLICY "paiements select self" ON public.paiements_redacteurs FOR SELECT TO authenticated
  USING (redacteur_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "paiements admin all" ON public.paiements_redacteurs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Realtime messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commandes;

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES
  ('cv-redacteurs', 'cv-redacteurs', false),
  ('references-eleves', 'references-eleves', false),
  ('livrables', 'livrables', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "cv upload self" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cv-redacteurs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "cv read self/admin" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cv-redacteurs' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "ref upload self" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'references-eleves' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "ref read participants" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'references-eleves');

CREATE POLICY "livrable upload redacteur" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'livrables' AND public.has_role(auth.uid(), 'redacteur'));
CREATE POLICY "livrable read auth" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'livrables');
