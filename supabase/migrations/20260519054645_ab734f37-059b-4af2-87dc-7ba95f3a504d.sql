
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'attorney';

CREATE TABLE public.attorneys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  firm_name text,
  bar_number text,
  states_licensed text[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  contact_email text NOT NULL,
  phone text,
  website text,
  bio text,
  accepting_referrals boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active accepting attorneys"
  ON public.attorneys FOR SELECT
  USING (is_active = true AND accepting_referrals = true);

CREATE POLICY "Attorneys can view own profile"
  ON public.attorneys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Attorneys can insert own profile"
  ON public.attorneys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Attorneys can update own profile"
  ON public.attorneys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage attorneys"
  ON public.attorneys FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER attorneys_updated_at
  BEFORE UPDATE ON public.attorneys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.attorney_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  attorney_id uuid NOT NULL REFERENCES public.attorneys(id) ON DELETE CASCADE,
  case_id uuid,
  legal_area text,
  state text,
  complexity_score integer,
  message text,
  status text NOT NULL DEFAULT 'pending',
  attorney_response text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attorney_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users create own referrals"
  ON public.attorney_referrals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own referrals"
  ON public.attorney_referrals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Attorneys view received referrals"
  ON public.attorney_referrals FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.attorneys a WHERE a.id = attorney_referrals.attorney_id AND a.user_id = auth.uid()));

CREATE POLICY "Attorneys update received referrals"
  ON public.attorney_referrals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.attorneys a WHERE a.id = attorney_referrals.attorney_id AND a.user_id = auth.uid()));

CREATE POLICY "Admins manage referrals"
  ON public.attorney_referrals FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER attorney_referrals_updated_at
  BEFORE UPDATE ON public.attorney_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_attorney_referrals_attorney ON public.attorney_referrals(attorney_id);
CREATE INDEX idx_attorney_referrals_user ON public.attorney_referrals(user_id);
CREATE INDEX idx_attorneys_states ON public.attorneys USING GIN(states_licensed);
CREATE INDEX idx_attorneys_specialties ON public.attorneys USING GIN(specialties);
