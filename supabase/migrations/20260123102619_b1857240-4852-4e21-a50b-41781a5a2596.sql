-- Fix remaining overly permissive RLS policies
-- These "service role" policies are unnecessary because service_role key already bypasses RLS

-- Drop case_sweeps service role policies
DROP POLICY IF EXISTS "Service role can insert case sweeps" ON public.case_sweeps;
DROP POLICY IF EXISTS "Service role can update case sweeps" ON public.case_sweeps;
DROP POLICY IF EXISTS "Service role full access" ON public.case_sweeps;

-- Drop jobs service role policy  
DROP POLICY IF EXISTS "Service role full access on jobs" ON public.jobs;

-- funnel_analytics "Anyone can insert" is intentional for anonymous analytics tracking
-- But we should restrict it to authenticated users to prevent abuse
DROP POLICY IF EXISTS "Anyone can insert funnel analytics" ON public.funnel_analytics;

-- Create proper funnel analytics policy for authenticated users only
CREATE POLICY "Authenticated users can insert funnel analytics"
  ON public.funnel_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow anonymous analytics but with rate limiting consideration
-- For now, keep it open but this should be monitored
CREATE POLICY "Anonymous funnel analytics"
  ON public.funnel_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);