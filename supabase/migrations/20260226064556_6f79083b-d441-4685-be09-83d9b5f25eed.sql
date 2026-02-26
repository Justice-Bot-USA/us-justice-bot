
-- Table to store court opinions ingested from Juriscraper
CREATE TABLE public.juriscraper_opinions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  court_id text NOT NULL,
  court_name text,
  case_name text NOT NULL,
  docket_number text,
  citation text,
  date_filed date,
  date_argued date,
  status text DEFAULT 'scraped',
  opinion_type text,
  author_judge text,
  per_curiam boolean DEFAULT false,
  opinion_text text,
  opinion_url text,
  download_url text,
  source_url text,
  precedential_status text,
  jurisdiction text,
  state text,
  nature_of_suit text,
  raw_metadata jsonb DEFAULT '{}'::jsonb,
  ingested_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  scrape_session_id text,
  CONSTRAINT unique_court_docket UNIQUE (court_id, docket_number, opinion_url)
);

-- Index for common queries
CREATE INDEX idx_juriscraper_opinions_court ON public.juriscraper_opinions (court_id);
CREATE INDEX idx_juriscraper_opinions_date ON public.juriscraper_opinions (date_filed DESC);
CREATE INDEX idx_juriscraper_opinions_state ON public.juriscraper_opinions (state);
CREATE INDEX idx_juriscraper_opinions_jurisdiction ON public.juriscraper_opinions (jurisdiction);
CREATE INDEX idx_juriscraper_opinions_session ON public.juriscraper_opinions (scrape_session_id);

-- Full text search index on case_name
CREATE INDEX idx_juriscraper_opinions_case_name_trgm ON public.juriscraper_opinions USING gin (to_tsvector('english', case_name));

-- Enable RLS
ALTER TABLE public.juriscraper_opinions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage juriscraper opinions"
  ON public.juriscraper_opinions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can read opinions (public legal data)
CREATE POLICY "Authenticated users can view opinions"
  ON public.juriscraper_opinions FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_juriscraper_opinions_updated_at
  BEFORE UPDATE ON public.juriscraper_opinions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ingestion log table to track scrape sessions
CREATE TABLE public.juriscraper_ingest_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  court_id text NOT NULL,
  opinions_received integer DEFAULT 0,
  opinions_inserted integer DEFAULT 0,
  opinions_updated integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  status text DEFAULT 'running',
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.juriscraper_ingest_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ingest logs"
  ON public.juriscraper_ingest_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read ingest logs"
  ON public.juriscraper_ingest_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
