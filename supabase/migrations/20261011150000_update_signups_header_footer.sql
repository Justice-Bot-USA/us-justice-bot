-- The updates signup moved to the site header ("Get updates" next to Sign In) and the footer.
-- Old source values stay valid for rows already saved.
ALTER TABLE public.update_signups DROP CONSTRAINT IF EXISTS update_signups_source_check;
ALTER TABLE public.update_signups ADD CONSTRAINT update_signups_source_check
  CHECK (source IN ('header', 'footer', 'fill_form', 'fill_list', 'legal_center'));
