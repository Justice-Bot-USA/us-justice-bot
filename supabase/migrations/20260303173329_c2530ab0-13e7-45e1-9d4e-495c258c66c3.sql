
-- Issue Hubs: the top-level topic pages (e.g., custody-visitation)
CREATE TABLE public.issue_hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL, -- e.g. 'family', 'housing', 'employment'
  title text NOT NULL,
  summary text,
  icon text, -- lucide icon name
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.issue_hubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active issue hubs"
  ON public.issue_hubs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage issue hubs"
  ON public.issue_hubs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Issue Sections: content blocks within a hub (learn/do/help/forms/timeline)
CREATE TABLE public.issue_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid NOT NULL REFERENCES public.issue_hubs(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('learn', 'do', 'help', 'forms', 'timeline')),
  title text NOT NULL,
  content_md text, -- markdown content
  sort_order integer NOT NULL DEFAULT 0,
  jurisdiction_code text, -- NULL = applies to all jurisdictions
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.issue_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active issue sections"
  ON public.issue_sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage issue sections"
  ON public.issue_sections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Resource Links: external links tied to hubs (official sources, legal aid, etc.)
CREATE TABLE public.resource_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid NOT NULL REFERENCES public.issue_hubs(id) ON DELETE CASCADE,
  jurisdiction_code text, -- NULL = applies everywhere
  label text NOT NULL,
  url text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general', -- 'official', 'legal-aid', 'self-help', 'emergency', 'form'
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active resource links"
  ON public.resource_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage resource links"
  ON public.resource_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Triage Flows: decision tree JSON schema for routing users
CREATE TABLE public.triage_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid NOT NULL REFERENCES public.issue_hubs(id) ON DELETE CASCADE,
  jurisdiction_code text, -- NULL = universal flow
  title text NOT NULL,
  description text,
  flow_schema jsonb NOT NULL DEFAULT '[]'::jsonb, -- questions + routing rules
  is_active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.triage_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active triage flows"
  ON public.triage_flows FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage triage flows"
  ON public.triage_flows FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Form Packages: jurisdiction-specific form bundles for an issue
CREATE TABLE public.form_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid NOT NULL REFERENCES public.issue_hubs(id) ON DELETE CASCADE,
  jurisdiction_code text NOT NULL,
  form_number text NOT NULL,
  form_name text NOT NULL,
  description text,
  url text, -- direct link to PDF/form
  instructions_md text, -- when/how to use
  category text DEFAULT 'general', -- 'start', 'respond', 'order', 'emergency', 'attachment'
  sort_order integer NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hub_id, jurisdiction_code, form_number)
);

ALTER TABLE public.form_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active form packages"
  ON public.form_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage form packages"
  ON public.form_packages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_issue_hubs_updated_at
  BEFORE UPDATE ON public.issue_hubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_issue_sections_updated_at
  BEFORE UPDATE ON public.issue_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_links_updated_at
  BEFORE UPDATE ON public.resource_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_triage_flows_updated_at
  BEFORE UPDATE ON public.triage_flows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_packages_updated_at
  BEFORE UPDATE ON public.form_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_issue_sections_hub ON public.issue_sections(hub_id);
CREATE INDEX idx_resource_links_hub ON public.resource_links(hub_id);
CREATE INDEX idx_triage_flows_hub ON public.triage_flows(hub_id);
CREATE INDEX idx_form_packages_hub_jurisdiction ON public.form_packages(hub_id, jurisdiction_code);
