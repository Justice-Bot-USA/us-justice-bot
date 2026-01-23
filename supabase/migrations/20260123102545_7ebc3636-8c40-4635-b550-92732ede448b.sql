-- Fix overly permissive RLS policies on case_merit_scores
-- Drop the service role policies that use 'true' (these should be handled by service_role key bypassing RLS)
DROP POLICY IF EXISTS "Service role can insert merit scores" ON public.case_merit_scores;
DROP POLICY IF EXISTS "Service role can update merit scores" ON public.case_merit_scores;

-- Clean up redundant profiles policies (keep the cleaner versions)
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;

-- Add proper admin policy for profiles using has_role
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));