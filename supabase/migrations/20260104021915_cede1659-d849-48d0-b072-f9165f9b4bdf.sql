-- =============================================
-- SECURITY FIXES: Enable RLS, Make Storage Private
-- =============================================

-- 1. Enable RLS on case_law_results table
ALTER TABLE public.case_law_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for case_law_results
CREATE POLICY "Authenticated users can view case law results"
ON public.case_law_results
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage case law results"
ON public.case_law_results
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Make storage buckets private
UPDATE storage.buckets SET public = false WHERE id = 'evidence-files';
UPDATE storage.buckets SET public = false WHERE id = 'case-documents';
UPDATE storage.buckets SET public = false WHERE id = 'user-uploads';

-- 3. Add RLS policies for storage.objects to allow authenticated user access to their own files
-- Users can view their own files in evidence-files bucket
CREATE POLICY "Users can view own evidence files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'evidence-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload evidence files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'evidence-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own evidence files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'evidence-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own files in case-documents bucket
CREATE POLICY "Users can view own case documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'case-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload case documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own case documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'case-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own files in user-uploads bucket
CREATE POLICY "Users can view own user uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload to user uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own user uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can access all storage objects
CREATE POLICY "Admins can access all storage objects"
ON storage.objects FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Fix function search_path for functions that are missing it
CREATE OR REPLACE FUNCTION public.get_ip_pepper()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_setting('justicebot.ip_pepper', true);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_profiles_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.email IS NOT NULL THEN
    RAISE EXCEPTION 'Writing email into public.profiles is not allowed. Read emails from auth.users instead.';
  END IF;
  RETURN NEW;
END;
$function$;