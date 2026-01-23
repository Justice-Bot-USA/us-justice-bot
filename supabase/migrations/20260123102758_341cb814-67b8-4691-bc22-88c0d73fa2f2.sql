-- Jobs table is a backend-only queue table used by edge functions
-- It contains job type, status, and payload but no direct user reference
-- Only admins should be able to view jobs for monitoring purposes

CREATE POLICY "Admins can view all jobs"
  ON public.jobs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict all other operations - jobs are managed by service role in edge functions
CREATE POLICY "Deny public job modifications"
  ON public.jobs
  FOR ALL
  USING (false);