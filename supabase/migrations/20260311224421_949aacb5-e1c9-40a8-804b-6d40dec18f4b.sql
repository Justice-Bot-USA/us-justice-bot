ALTER TABLE public.case_merit_scores
  ADD COLUMN IF NOT EXISTS tribal_identity boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tribal_member boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tribe_name text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tribal_land_connection boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_tribal_resources boolean DEFAULT false;