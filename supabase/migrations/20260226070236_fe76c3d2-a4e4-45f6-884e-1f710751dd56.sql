
-- Table for users to save CourtListener search results for later reference
CREATE TABLE public.saved_court_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.case_merit_scores(id) ON DELETE SET NULL,
  source_id text,
  search_type text NOT NULL DEFAULT 'o',
  case_name text NOT NULL,
  court text,
  court_id text,
  date_filed text,
  date_argued text,
  docket_number text,
  suit_nature text,
  citation text,
  snippet text,
  absolute_url text,
  status text,
  author text,
  download_url text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_court_results ENABLE ROW LEVEL SECURITY;

-- Users can only access their own saved results
CREATE POLICY "Users can view own saved results"
  ON public.saved_court_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved results"
  ON public.saved_court_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved results"
  ON public.saved_court_results FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all saved results"
  ON public.saved_court_results FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast user lookups
CREATE INDEX idx_saved_court_results_user ON public.saved_court_results(user_id);
CREATE INDEX idx_saved_court_results_case ON public.saved_court_results(case_id);
