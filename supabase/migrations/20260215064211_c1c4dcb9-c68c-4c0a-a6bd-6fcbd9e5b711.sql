
-- =============================================
-- US Forms Catalog System
-- =============================================

-- 1) Jurisdictions table
CREATE TABLE public.jurisdictions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL DEFAULT 'US',
  code text NOT NULL UNIQUE,       -- e.g. US-CA, US-NY, US-FED
  name text NOT NULL,              -- e.g. California, Federal
  short_code text,                 -- e.g. CA, NY, FED
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jurisdictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read jurisdictions"
  ON public.jurisdictions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage jurisdictions"
  ON public.jurisdictions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Form Sources table (official hubs to scrape/sync from)
CREATE TABLE public.form_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL DEFAULT 'US',
  jurisdiction_code text NOT NULL REFERENCES public.jurisdictions(code),
  source_name text NOT NULL,
  source_url text NOT NULL,
  source_type text NOT NULL DEFAULT 'court_website', -- court_website, federal_agency, legal_aid
  category text,                   -- family, small-claims, criminal, immigration, etc.
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  sync_status text DEFAULT 'pending', -- pending, syncing, synced, error
  sync_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.form_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read form sources"
  ON public.form_sources FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage form sources"
  ON public.form_sources FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3) Forms table (individual forms synced from sources)
CREATE TABLE public.forms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL DEFAULT 'US',
  jurisdiction_code text NOT NULL REFERENCES public.jurisdictions(code),
  source_id uuid REFERENCES public.form_sources(id),
  form_number text,                -- e.g. FL-100, I-589
  title text NOT NULL,
  description text,
  category text,                   -- family, small-claims, criminal, immigration
  subcategory text,
  url text,                        -- direct link to form PDF/page
  file_type text,                  -- pdf, doc, docx, html
  fee_amount text,                 -- e.g. "$435", "Free"
  fee_waiver_available boolean DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(jurisdiction_code, form_number)
);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forms"
  ON public.forms FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage forms"
  ON public.forms FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_forms_jurisdiction ON public.forms(jurisdiction_code);
CREATE INDEX idx_forms_country ON public.forms(country);
CREATE INDEX idx_forms_category ON public.forms(category);
CREATE INDEX idx_form_sources_jurisdiction ON public.form_sources(jurisdiction_code);
CREATE INDEX idx_jurisdictions_country ON public.jurisdictions(country);

-- Updated_at triggers
CREATE TRIGGER update_jurisdictions_updated_at
  BEFORE UPDATE ON public.jurisdictions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_sources_updated_at
  BEFORE UPDATE ON public.form_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
