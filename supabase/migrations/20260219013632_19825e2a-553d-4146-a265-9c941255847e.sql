
-- ══════════════════════════════════════════════════════════════════════════════
-- FIX 1: IP Anonymization trigger was never created (function existed, trigger didn't)
-- ══════════════════════════════════════════════════════════════════════════════

-- Create the trigger that calls the existing anonymize_ip_on_insert() function
CREATE TRIGGER anonymize_ip_before_insert
  BEFORE INSERT ON public.user_activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.anonymize_ip_on_insert();

-- Anonymize any existing plaintext IPs already stored in the table
UPDATE public.user_activity_logs
SET
  ip_address_hash = public.compute_ip_hash(ip_address::text),
  ip_address      = NULL,
  anonymized_at   = now()
WHERE ip_address IS NOT NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- FIX 2: legal_sweep_results — drop overly permissive policy, scope to owner
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop whichever version of the open policy exists
DROP POLICY IF EXISTS "Authenticated users can view legal sweep results" ON public.legal_sweep_results;
DROP POLICY IF EXISTS "Users can view legal sweep results"               ON public.legal_sweep_results;

-- Replace with owner-scoped policy via legal_sweeps.created_by
CREATE POLICY "Users can view their own sweep results"
ON public.legal_sweep_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.legal_sweeps ls
    WHERE ls.id = legal_sweep_results.sweep_id
      AND ls.created_by = auth.uid()
  )
);
