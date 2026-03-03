
-- Add official URL columns to form_packages
ALTER TABLE public.form_packages
  ADD COLUMN IF NOT EXISTS official_form_page_url text,
  ADD COLUMN IF NOT EXISTS official_pdf_url text,
  ADD COLUMN IF NOT EXISTS official_directory_url text DEFAULT 'https://www.courts.ca.gov/rules-forms/court-forms';

-- Create tracks table
CREATE TABLE public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid NOT NULL REFERENCES public.issue_hubs(id) ON DELETE CASCADE,
  track_key text NOT NULL,
  title text NOT NULL,
  description text,
  when_to_use text,
  timeline_md text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(hub_id, track_key)
);

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tracks" ON public.tracks FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read active tracks" ON public.tracks FOR SELECT
  USING (is_active = true);

-- Create track_forms join table
CREATE TABLE public.track_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  form_id uuid NOT NULL REFERENCES public.form_packages(id) ON DELETE CASCADE,
  is_required boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(track_id, form_id)
);

ALTER TABLE public.track_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage track_forms" ON public.track_forms FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read track_forms" ON public.track_forms FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
