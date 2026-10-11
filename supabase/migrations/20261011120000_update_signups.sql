-- Email list for people who ask to hear about new forms and features (Phase 0 audience building).
-- No account needed. Visitors can insert; nobody but the service role can read.
-- `source` is deliberately coarse (a page type, never a form id or legal area): which form someone
-- was filling can reveal an eviction, divorce or criminal record.
CREATE TABLE IF NOT EXISTS public.update_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  state text CHECK (state IN ('CA', 'NY')),
  source text NOT NULL CHECK (source IN ('fill_form', 'fill_list', 'legal_center')),
  -- The exact sentence the person agreed to, so we can show what they signed up for.
  consent_text text NOT NULL CHECK (char_length(consent_text) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Set when someone asks to be removed. Anyone sending email must skip rows where this is set.
  unsubscribed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS update_signups_email_key ON public.update_signups (lower(email));

ALTER TABLE public.update_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can sign up for updates" ON public.update_signups;
CREATE POLICY "Anyone can sign up for updates"
  ON public.update_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (unsubscribed_at IS NULL);

-- No SELECT, UPDATE or DELETE policies: only the service role (dashboard, edge functions) reads or edits.
