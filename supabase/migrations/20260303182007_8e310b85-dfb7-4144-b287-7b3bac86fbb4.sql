
-- Warrant lookup resources table (state-specific official links)
CREATE TABLE IF NOT EXISTS public.warrant_lookup_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text NOT NULL,
  state_slug text NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'official',
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_warrant_lookup_state_slug ON public.warrant_lookup_resources (state_slug);
CREATE INDEX IF NOT EXISTS idx_warrant_lookup_state_code ON public.warrant_lookup_resources (state_code);

-- RLS
ALTER TABLE public.warrant_lookup_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active warrant resources"
  ON public.warrant_lookup_resources FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage warrant resources"
  ON public.warrant_lookup_resources FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed California
INSERT INTO public.warrant_lookup_resources (state_code, state_slug, label, url, description, category, sort_order)
VALUES
  ('CA', 'california', 'California Courts – Find My Court', 'https://www.courts.ca.gov/find-my-court.htm', 'Official directory to locate your county court site and contact info.', 'courts', 10),
  ('CA', 'california', 'California Courts – Court Forms Directory (Official)', 'https://courts.ca.gov/rules-forms/court-forms', 'Search official Judicial Council forms by number, title, topic, or category.', 'official', 20),
  ('CA', 'california', 'California Sheriffs'' Association – Sheriff Directory', 'https://www.calsheriffs.org/sheriffs-directory', 'Find your county sheriff office website and contact info.', 'sheriff', 30),
  ('CA', 'california', 'CA Self-Help – Criminal Cases Overview', 'https://selfhelp.courts.ca.gov/criminal', 'Overview of criminal case procedures, rights, and court appearances.', 'rights', 40);

-- Seed Texas
INSERT INTO public.warrant_lookup_resources (state_code, state_slug, label, url, description, category, sort_order)
VALUES
  ('TX', 'texas', 'Texas Judicial Branch – Courts Directory', 'https://www.txcourts.gov/courts/', 'Find county courts and official contact/portal links.', 'courts', 10),
  ('TX', 'texas', 'Texas Sheriffs'' Association', 'https://www.txsheriffs.org/', 'Find your county sheriff office in Texas.', 'sheriff', 20),
  ('TX', 'texas', 'Texas Courts – Forms', 'https://www.txcourts.gov/rules-forms/', 'Official Texas court forms directory.', 'official', 30);

-- Seed Georgia
INSERT INTO public.warrant_lookup_resources (state_code, state_slug, label, url, description, category, sort_order)
VALUES
  ('GA', 'georgia', 'Georgia Sheriffs'' Association', 'https://www.georgiasheriffs.org/', 'Find your county sheriff in Georgia.', 'sheriff', 10),
  ('GA', 'georgia', 'Georgia Courts – Case Search', 'https://ody.dekalbcountyga.gov/portal/Home/Dashboard/29', 'Search Georgia court case records (varies by county).', 'courts', 20);

-- Seed Florida
INSERT INTO public.warrant_lookup_resources (state_code, state_slug, label, url, description, category, sort_order)
VALUES
  ('FL', 'florida', 'Florida Sheriffs'' Association', 'https://www.flsheriffs.org/sheriffs-offices', 'Find your county sheriff office in Florida.', 'sheriff', 10),
  ('FL', 'florida', 'Florida Courts', 'https://www.flcourts.gov/', 'Florida state courts portal.', 'courts', 20);

-- Seed Arizona
INSERT INTO public.warrant_lookup_resources (state_code, state_slug, label, url, description, category, sort_order)
VALUES
  ('AZ', 'arizona', 'Arizona Sheriffs'' Association', 'https://www.azsheriffs.org/', 'Find your county sheriff in Arizona.', 'sheriff', 10),
  ('AZ', 'arizona', 'AZ Courts – Public Access', 'https://www.azcourts.gov/AZCourts/PublicAccess', 'Arizona court records public access portal.', 'courts', 20);
