-- Fix search_path for is_verified_admin function
CREATE OR REPLACE FUNCTION public.is_verified_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = uid AND ur.role = 'admin'
  );
$$;

-- Fix search_path for compute_ip_hash function (include extensions for digest)
CREATE OR REPLACE FUNCTION public.compute_ip_hash(ip text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
  SELECT encode(extensions.digest(ip || COALESCE(public.get_ip_pepper(), ''), 'sha256'), 'hex');
$$;

-- Fix search_path for anonymize_ip_on_insert function
CREATE OR REPLACE FUNCTION public.anonymize_ip_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  IF NEW.ip_address IS NOT NULL THEN
    NEW.ip_address_hash := public.compute_ip_hash(NEW.ip_address::text);
    NEW.ip_address := NULL;
    NEW.anonymized_at := now();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix search_path for delete_user_activity_archive_tombstone function
CREATE OR REPLACE FUNCTION public.delete_user_activity_archive_tombstone(admin_user uuid, target_id uuid, reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_verified_admin(admin_user) THEN
    RAISE EXCEPTION 'not a verified admin';
  END IF;

  INSERT INTO public.user_activity_archive_deletions(deleted_by, target_id, reason, details)
  VALUES (admin_user, target_id, reason, jsonb_build_object('caller', admin_user, 'ts', now()));

  UPDATE public.user_activity_logs_archive
  SET deleted_at = now(), deleted_by = admin_user
  WHERE id = target_id;
END;
$$;

-- Drop the profiles_email_backup table (security risk with PII)
DROP TABLE IF EXISTS public.profiles_email_backup CASCADE;

-- Recreate case_merit_scores RLS policies to ensure proper protection
DROP POLICY IF EXISTS "Users can view their own cases" ON public.case_merit_scores;
DROP POLICY IF EXISTS "Users can create their own cases" ON public.case_merit_scores;
DROP POLICY IF EXISTS "Users can update their own cases" ON public.case_merit_scores;
DROP POLICY IF EXISTS "Users can delete their own cases" ON public.case_merit_scores;

CREATE POLICY "Users can view their own cases" 
ON public.case_merit_scores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases" 
ON public.case_merit_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" 
ON public.case_merit_scores 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" 
ON public.case_merit_scores 
FOR DELETE 
USING (auth.uid() = user_id);

-- Recreate profiles RLS policies to ensure proper protection
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);