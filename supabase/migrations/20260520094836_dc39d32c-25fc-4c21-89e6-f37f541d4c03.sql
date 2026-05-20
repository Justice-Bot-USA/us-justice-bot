
-- attorneys
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='attorneys' AND cmd='SELECT' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.attorneys', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated users can view active accepting attorneys"
ON public.attorneys FOR SELECT TO authenticated
USING (is_active = true AND accepting_referrals = true);

CREATE POLICY "Attorneys can view their own profile"
ON public.attorneys FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- case_law_results (sweep_id is uuid; join via case_sweeps.case_id which is uuid)
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='case_law_results' AND cmd='SELECT' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.case_law_results', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can view case law results for their own sweeps"
ON public.case_law_results FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.case_sweeps cs
    WHERE cs.case_id = case_law_results.sweep_id
      AND cs.user_id = auth.uid()
  )
);

-- form_payments
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='form_payments' AND cmd IN ('INSERT','UPDATE') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.form_payments', p.policyname);
  END LOOP;
END $$;

-- juriscraper_opinions
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='juriscraper_opinions' AND cmd='SELECT' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.juriscraper_opinions', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated users can view opinions"
ON public.juriscraper_opinions FOR SELECT TO authenticated
USING (true);

-- payments
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND cmd IN ('INSERT','UPDATE') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.payments', p.policyname);
  END LOOP;
END $$;

-- subscriptions
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' AND cmd IN ('INSERT','UPDATE') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', p.policyname);
  END LOOP;
END $$;
