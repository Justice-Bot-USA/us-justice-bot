
-- Remove JWT-role-bypass policies; rely on has_role()/is_verified_admin() instead
DROP POLICY IF EXISTS "admin_all" ON public.payments;
CREATE POLICY "admin_all" ON public.payments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin_all" ON public.user_activity_logs_archive;

-- Tighten funnel_analytics insert policies
DROP POLICY IF EXISTS "Authenticated users can insert funnel analytics" ON public.funnel_analytics;
DROP POLICY IF EXISTS "Anonymous funnel analytics" ON public.funnel_analytics;

CREATE POLICY "Authenticated users can insert their own funnel analytics"
  ON public.funnel_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert anonymous funnel analytics"
  ON public.funnel_analytics
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
