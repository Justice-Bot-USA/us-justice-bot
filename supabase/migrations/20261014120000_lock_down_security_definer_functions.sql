-- Lock down older SECURITY DEFINER functions that anyone could call through the public API
-- (found by the live check after the Toolkit deploy, and by the Supabase security advisor).
--
-- Supabase grants EXECUTE on new functions to anon and authenticated by default, so each of these
-- was callable with only the public anon key. Nothing in the app (src/) or in any deployed edge
-- function calls them through the API; RLS policies call has_role and is_verified_admin, always as
-- has_role(auth.uid(), ...) / is_verified_admin(auth.uid()).
--
-- What changes:
-- 1. has_role and is_verified_admin: callers coming through the API can only ask about themselves.
--    They stay executable, because RLS policies on tables that anon reads (forms, jurisdictions,
--    resource_links, ...) call has_role, and revoking it would break those reads. A call is
--    answered for any user only when there is no API request context (auth.jwt() is null: SQL run
--    directly, cron, migrations) or the caller is the service role (edge functions). This closes the
--    "is this account an admin?" probe while every policy keeps working. Both always return true or
--    false, never null (an anon caller has no auth.uid(), and NOT null would not deny in plpgsql).
-- 2. delete_user_activity_archive_tombstone: anon could call it with any admin's id as its
--    admin_user argument and mark activity-archive rows deleted. EXECUTE is now service role only,
--    and is_verified_admin (change 1) no longer vouches for an id that isn't the caller's own.
--    Live check before this migration: 0 tombstone rows, 0 archive rows marked deleted.
-- 3. get_user_role, get_ip_pepper, compute_ip_hash, calculate_case_merit_score: no API caller;
--    service role only. (compute_ip_hash is still used by the anonymize_ip_on_insert trigger, which
--    runs as its owner, so the trigger is unaffected.)
-- 4. admin_view_profiles, admin_view_profile_access_logs, admin_export_profiles: already raise
--    unless the caller is an admin; anon no longer gets to call them at all. Signed-in users keep
--    EXECUTE (AdminDashboardSimple calls admin_view_profiles).
-- 5. Trigger functions (handle_new_user, reject_profiles_email, anonymize_ip_on_insert): EXECUTE
--    revoked from API roles. Triggers don't check the caller's EXECUTE privilege, so they still run.
--
-- Run as one transaction (the CLI and apply_migration wrap it). Reversible by re-granting.


-- ---------------------------------------------------------------------------------------------
-- 1. Role checks answer API callers only about themselves
-- ---------------------------------------------------------------------------------------------

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.user_roles
      where user_id = _user_id
        and role = _role
    )
    and (
      _user_id = (select auth.uid())
      or (select auth.jwt()) is null
      or (select auth.jwt()) ->> 'role' = 'service_role'
    ),
    false
  )
$$;

create or replace function public.is_verified_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.user_roles ur
      where ur.user_id = uid
        and ur.role = 'admin'
    )
    and (
      uid = (select auth.uid())
      or (select auth.jwt()) is null
      or (select auth.jwt()) ->> 'role' = 'service_role'
    ),
    false
  )
$$;

-- is_verified_admin is only used by policies for the authenticated role.
revoke execute on function public.is_verified_admin(uuid) from public, anon;
grant execute on function public.is_verified_admin(uuid) to authenticated, service_role;


-- ---------------------------------------------------------------------------------------------
-- 2-3. Service role only
-- ---------------------------------------------------------------------------------------------

revoke execute on function public.delete_user_activity_archive_tombstone(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.delete_user_activity_archive_tombstone(uuid, uuid, text) to service_role;

revoke execute on function public.get_user_role(uuid) from public, anon, authenticated;
grant execute on function public.get_user_role(uuid) to service_role;

revoke execute on function public.get_ip_pepper() from public, anon, authenticated;
grant execute on function public.get_ip_pepper() to service_role;

revoke execute on function public.compute_ip_hash(text) from public, anon, authenticated;
grant execute on function public.compute_ip_hash(text) to service_role;

revoke execute on function public.calculate_case_merit_score(uuid) from public, anon, authenticated;
grant execute on function public.calculate_case_merit_score(uuid) to service_role;


-- ---------------------------------------------------------------------------------------------
-- 4. Admin functions: signed-in callers only (they still check for the admin role themselves)
-- ---------------------------------------------------------------------------------------------

revoke execute on function public.admin_view_profiles(uuid, integer, integer) from public, anon;
grant execute on function public.admin_view_profiles(uuid, integer, integer) to authenticated, service_role;

revoke execute on function public.admin_view_profile_access_logs(integer) from public, anon;
grant execute on function public.admin_view_profile_access_logs(integer) to authenticated, service_role;

revoke execute on function public.admin_export_profiles(text, jsonb) from public, anon;
grant execute on function public.admin_export_profiles(text, jsonb) to authenticated, service_role;


-- ---------------------------------------------------------------------------------------------
-- 5. Trigger functions: not callable through the API
-- ---------------------------------------------------------------------------------------------

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.reject_profiles_email() from public, anon, authenticated;
revoke execute on function public.anonymize_ip_on_insert() from public, anon, authenticated;
