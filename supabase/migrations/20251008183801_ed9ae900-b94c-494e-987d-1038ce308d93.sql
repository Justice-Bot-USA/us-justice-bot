-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view legal sweep results" ON public.legal_sweep_results;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can view legal sweep results"
ON public.legal_sweep_results
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);