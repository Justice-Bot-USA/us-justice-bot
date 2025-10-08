-- Create a secure function for admins to view profiles with automatic audit logging
CREATE OR REPLACE FUNCTION public.admin_view_profiles(
  p_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Log the admin access attempt
  INSERT INTO user_activity_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    'admin_view_profiles',
    'profiles',
    p_user_id,
    jsonb_build_object(
      'limit', p_limit,
      'offset', p_offset,
      'timestamp', NOW(),
      'specific_user_requested', p_user_id IS NOT NULL
    )
  );

  -- Return profiles based on filter
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE (p_user_id IS NULL OR p.user_id = p_user_id)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create a function to export profiles with strict logging (for bulk operations)
CREATE OR REPLACE FUNCTION public.admin_export_profiles(
  p_reason text,
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_export_count integer;
BEGIN
  -- Verify caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Require a reason for bulk exports
  IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 10 THEN
    RAISE EXCEPTION 'Export reason required (minimum 10 characters)';
  END IF;

  -- Count how many records will be exported
  SELECT COUNT(*) INTO v_export_count FROM profiles;

  -- Log the bulk export with reason
  INSERT INTO user_activity_logs (
    user_id,
    action,
    resource_type,
    details
  ) VALUES (
    auth.uid(),
    'admin_bulk_export_profiles',
    'profiles',
    jsonb_build_object(
      'reason', p_reason,
      'record_count', v_export_count,
      'timestamp', NOW(),
      'filters', p_filters,
      'severity', 'HIGH'
    )
  );

  -- Return all profiles (this is a sensitive operation)
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Create a function to view admin access logs (admins monitoring other admins)
CREATE OR REPLACE FUNCTION public.admin_view_profile_access_logs(
  p_days_back integer DEFAULT 30
)
RETURNS TABLE (
  log_id uuid,
  admin_user_id uuid,
  action text,
  accessed_at timestamp with time zone,
  details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Return audit logs for profile access
  RETURN QUERY
  SELECT 
    ual.id,
    ual.user_id,
    ual.action,
    ual.created_at,
    ual.details
  FROM user_activity_logs ual
  WHERE ual.resource_type = 'profiles'
    AND ual.action IN ('admin_view_profiles', 'admin_bulk_export_profiles')
    AND ual.created_at >= NOW() - (p_days_back || ' days')::interval
  ORDER BY ual.created_at DESC;
END;
$$;

-- Add comments documenting the security pattern
COMMENT ON FUNCTION public.admin_view_profiles IS 
'Secure function for admin access to user profiles with automatic audit logging. Use this instead of direct SELECT queries on profiles table to maintain audit trail.';

COMMENT ON FUNCTION public.admin_export_profiles IS 
'Secure function for bulk profile exports requiring justification. All exports are logged with HIGH severity for security monitoring.';

COMMENT ON FUNCTION public.admin_view_profile_access_logs IS 
'View audit logs of admin access to profiles for security monitoring and compliance.';