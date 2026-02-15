-- Fix 1: Add missing admin policy on case_sweeps
CREATE POLICY "Admins can manage all sweeps"
ON public.case_sweeps FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Make storage buckets private to enforce RLS
UPDATE storage.buckets SET public = false 
WHERE id IN ('evidence-files', 'case-documents', 'user-uploads');