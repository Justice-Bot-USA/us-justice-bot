-- Toolkit plan (PR 2): entitlement check, binder columns on case_files, hearing calendar,
-- class tracker, billing consent and notice records, removal of blanket admin access to people's
-- files and cases, and removal of one course listing.
--
-- Spec: toolkit-spec-v2.md §2 as amended by toolkit-spec-v3-addendum.md (engineering review SQL).
--
-- How to apply: as one transaction. The Supabase CLI and apply_migration already wrap each
-- migration file in a transaction, so this file has no BEGIN/COMMIT; if you run it by hand, use
-- `psql --single-transaction -f`. Nothing here needs to run outside a transaction.
-- Needs PostgreSQL 15 or later (ON DELETE SET NULL (column), UNIQUE NULLS NOT DISTINCT).
--
-- Rules this schema enforces:
-- * A lapsed or never-subscribed person can always read, change and delete their own rows. Only
--   INSERT into case_calendar_events, class_trackers and class_sessions needs an active plan.
-- * Every reference to another row (case, proof file, tracker) must point at the same person's row
--   (composite foreign keys on (id, user_id)).
-- * Dates are stored exactly as typed (date columns, 'yyyy-MM-dd'). Nothing here computes a legal
--   date, hour count or requirement.
-- * Billing consent and notice records outlive account deletion (user_id ON DELETE SET NULL, with
--   email and Stripe id snapshots). Keep them at least until max(created_at + 3 years, plan end + 1
--   year) (Cal. Bus. & Prof. Code 17602(a)(6)). Only the service role writes them.
-- * moddatetime is not installed: updated_at is kept by public.update_updated_at_column().


-- ---------------------------------------------------------------------------------------------
-- 1. Entitlement
-- ---------------------------------------------------------------------------------------------

-- The caller's own Toolkit access. Used by the client (rpc('my_toolkit_access')) and by RLS, so
-- the UI and the database always agree. Two days of grace after end_date cover a late renewal
-- webhook. Admins have access for testing.
create or replace function public.my_toolkit_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.subscriptions s
      where s.user_id = (select auth.uid())
        and s.status = 'active'
        and s.end_date > now() - interval '2 days'
    )
    or public.has_role((select auth.uid()), 'admin'::public.app_role),
    false
  );
$$;

comment on function public.my_toolkit_access() is
  'True when the signed-in caller has an active Toolkit subscription (2 days of grace after end_date) or is an admin. Used by RLS and the client.';

revoke execute on function public.my_toolkit_access() from public, anon;
grant execute on function public.my_toolkit_access() to authenticated, service_role;

-- Same check for any user id. Edge functions only: it would let a caller probe other people's
-- subscription and admin status.
create or replace function public.has_toolkit_access(_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.subscriptions s
      where s.user_id = _uid
        and s.status = 'active'
        and s.end_date > now() - interval '2 days'
    )
    or public.has_role(_uid, 'admin'::public.app_role),
    false
  );
$$;

comment on function public.has_toolkit_access(uuid) is
  'Service role only. Same rule as my_toolkit_access() for a given user id.';

revoke execute on function public.has_toolkit_access(uuid) from public, anon, authenticated;
grant execute on function public.has_toolkit_access(uuid) to service_role;


-- ---------------------------------------------------------------------------------------------
-- 2. subscriptions: fields the webhook fills for the cancel page and billing notices
-- ---------------------------------------------------------------------------------------------

alter table public.subscriptions
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_started_at timestamptz;

comment on column public.subscriptions.paypal_subscription_id is
  'Holds the Stripe subscription id (sub_...). Unique so the webhook can upsert on it.';
comment on column public.subscriptions.cancel_at_period_end is
  'Mirrors Stripe: true once the person has cancelled; the plan stays active until end_date.';
comment on column public.subscriptions.stripe_started_at is
  'Stripe subscription start_date (start_date on this table is the row insert time).';

-- A full constraint (not a partial index) so PostgREST upserts can use onConflict. 0 rows today.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.subscriptions'::regclass and conname = 'subscriptions_stripe_id_key'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_stripe_id_key unique (paypal_subscription_id);
  end if;
end
$$;


-- ---------------------------------------------------------------------------------------------
-- 3. Same-owner keys for composite foreign keys
-- ---------------------------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_merit_scores'::regclass and conname = 'case_merit_scores_id_user_id_key'
  ) then
    alter table public.case_merit_scores
      add constraint case_merit_scores_id_user_id_key unique (id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_id_user_id_key'
  ) then
    alter table public.case_files
      add constraint case_files_id_user_id_key unique (id, user_id);
  end if;
end
$$;


-- ---------------------------------------------------------------------------------------------
-- 4. case_files: binder organizing fields (free for everyone)
-- ---------------------------------------------------------------------------------------------

alter table public.case_files
  add column if not exists display_name text,
  add column if not exists document_date date,
  add column if not exists section text,
  add column if not exists sort_order integer,
  add column if not exists notes text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_display_name_check'
  ) then
    alter table public.case_files
      add constraint case_files_display_name_check
        check (display_name is null or (char_length(display_name) <= 200 and btrim(display_name) <> ''));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_document_date_check'
  ) then
    alter table public.case_files
      add constraint case_files_document_date_check
        check (document_date is null or document_date between date '1900-01-01' and date '2200-12-31');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_section_check'
  ) then
    alter table public.case_files
      add constraint case_files_section_check
        check (section is null or section in ('court_papers', 'evidence', 'letters', 'money', 'photos', 'other'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_notes_check'
  ) then
    alter table public.case_files
      add constraint case_files_notes_check
        check (notes is null or char_length(notes) <= 2000);
  end if;

  -- A file can only be linked to one of its owner's own cases. 0 cross-user links live, so the
  -- constraint is added NOT VALID and then validated (a failure here means a cross-user link exists).
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_files'::regclass and conname = 'case_files_case_owner_fkey'
  ) then
    alter table public.case_files
      add constraint case_files_case_owner_fkey
        foreign key (case_id, user_id)
        references public.case_merit_scores (id, user_id)
        on delete set null (case_id)
        not valid;
  end if;
end
$$;

alter table public.case_files validate constraint case_files_case_owner_fkey;

create index if not exists case_files_user_case_idx on public.case_files (user_id, case_id);

-- Replace the UPDATE policy (it had no WITH CHECK). Organizing is free, so no entitlement check.
drop policy if exists "Users can update their own case files" on public.case_files;
drop policy if exists case_files_update_own on public.case_files;
create policy case_files_update_own
  on public.case_files
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Clients may change only the organizing columns. file_path, bucket_name, file_size, file_type,
-- file_name and user_id stay as uploaded (an update to them fails with 42501).
revoke update on public.case_files from anon, authenticated;
grant update (display_name, document_date, section, sort_order, notes, case_id, description, tags)
  on public.case_files to authenticated;


-- ---------------------------------------------------------------------------------------------
-- 5. Hearing calendar
-- ---------------------------------------------------------------------------------------------

create table public.case_calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  case_id uuid,
  kind text not null
    check (kind in ('hearing', 'appointment', 'due_date', 'class', 'other')),
  title text not null
    check (char_length(title) <= 140 and btrim(title) <> ''),
  event_date date not null
    check (event_date between date '1900-01-01' and date '2200-12-31'),
  start_time time without time zone,
  time_zone text not null
    check (time_zone in (
      'America/Los_Angeles', 'America/New_York', 'America/Chicago', 'America/Denver',
      'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu'
    )),
  court_or_place text check (char_length(court_or_place) <= 200),
  room text check (char_length(room) <= 100),
  address text check (char_length(address) <= 300),
  notes text check (char_length(notes) <= 2000),
  source_note text check (char_length(source_note) <= 280),
  -- Minutes before the event; 0 = morning of (see src/lib/calendar/ics.ts ALARM_CHOICES).
  alarms smallint[] not null default '{10080,2880}'
    check (alarms <@ '{10080,2880,1440,0}'::smallint[] and cardinality(alarms) <= 4),
  -- When the person last confirmed the read-back ("This matches my papers"). Set by the trigger
  -- below to the server time whenever the client sends a new value.
  confirmed_at timestamptz not null
    check (confirmed_at <= now() + interval '5 minutes'),
  -- SEQUENCE for the .ics file; bumped by the trigger on every change so calendar apps replace
  -- the old event when the file is imported again.
  ics_sequence integer not null default 0 check (ics_sequence >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint case_calendar_events_case_owner_fkey
    foreign key (case_id, user_id)
    references public.case_merit_scores (id, user_id)
    on delete set null (case_id)
);

comment on table public.case_calendar_events is
  'Dates the person typed from their own court papers. Never computed, suggested or prefilled.';
comment on column public.case_calendar_events.kind is
  'due_date is shown as "Due date (from your papers)".';

create index case_calendar_events_user_date_idx on public.case_calendar_events (user_id, event_date);
create index case_calendar_events_case_idx on public.case_calendar_events (case_id);

-- Keeps id/user_id/created_at fixed, stamps confirmed_at with the server time, refuses a change of
-- date, time or time zone unless the read-back was confirmed again (a new confirmed_at in the same
-- update), and bumps ics_sequence on any change.
create or replace function public.cce_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.ics_sequence := 0;
    if new.confirmed_at is not null then
      new.confirmed_at := now();
    end if;
    new.created_at := now();
    new.updated_at := now();
    return new;
  end if;

  new.id := old.id;
  new.user_id := old.user_id;
  new.created_at := old.created_at;

  if new.confirmed_at is distinct from old.confirmed_at and new.confirmed_at is not null then
    new.confirmed_at := now();
  end if;

  if (new.event_date, new.start_time, new.time_zone)
       is distinct from (old.event_date, old.start_time, old.time_zone)
     and new.confirmed_at is not distinct from old.confirmed_at then
    raise exception 'date_changed_requires_confirmation'
      using errcode = 'P0001',
            hint = 'Show the date read-back again and send a new confirmed_at with the change.';
  end if;

  if (new.kind, new.title, new.event_date, new.start_time, new.time_zone, new.court_or_place,
      new.room, new.address, new.notes, new.source_note, new.alarms, new.case_id)
     is distinct from
     (old.kind, old.title, old.event_date, old.start_time, old.time_zone, old.court_or_place,
      old.room, old.address, old.notes, old.source_note, old.alarms, old.case_id) then
    new.ics_sequence := old.ics_sequence + 1;
  else
    new.ics_sequence := old.ics_sequence;
  end if;

  new.updated_at := now();
  return new;
end
$$;

drop trigger if exists cce_before_write on public.case_calendar_events;
create trigger cce_before_write
  before insert or update on public.case_calendar_events
  for each row execute function public.cce_before_write();

alter table public.case_calendar_events enable row level security;

drop policy if exists cce_select_own on public.case_calendar_events;
create policy cce_select_own
  on public.case_calendar_events
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists cce_insert_own_with_plan on public.case_calendar_events;
create policy cce_insert_own_with_plan
  on public.case_calendar_events
  for insert
  to authenticated
  with check (user_id = (select auth.uid()) and (select public.my_toolkit_access()));

-- Editing is always allowed (a lapsed person must be able to fix a wrong or changed date).
drop policy if exists cce_update_own on public.case_calendar_events;
create policy cce_update_own
  on public.case_calendar_events
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists cce_delete_own on public.case_calendar_events;
create policy cce_delete_own
  on public.case_calendar_events
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.case_calendar_events from anon;
grant select, insert, update, delete on public.case_calendar_events to authenticated;


-- ---------------------------------------------------------------------------------------------
-- 6. Class tracker
-- ---------------------------------------------------------------------------------------------

create table public.class_trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  case_id uuid,
  class_name text not null
    check (char_length(class_name) <= 140 and btrim(class_name) <> ''),
  ordered_by text
    check (ordered_by in ('court', 'probation', 'agency', 'dmv', 'bankruptcy', 'self', 'other')),
  -- Typed by the person from their order. Never compared or computed against.
  order_wording text check (char_length(order_wording) <= 2000),
  required_hours numeric(5,1) check (required_hours >= 0),
  due_date date check (due_date between date '1900-01-01' and date '2200-12-31'),
  due_date_source text check (char_length(due_date_source) <= 280),
  provider_name text check (char_length(provider_name) <= 200),
  provider_url text
    check (provider_url ~ '^https://[^\s]+$' and char_length(provider_url) <= 2000),
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'finished', 'proof_sent')),
  proof_file_id uuid,
  proof_sent_on date check (proof_sent_on between date '1900-01-01' and date '2200-12-31'),
  proof_sent_how text check (char_length(proof_sent_how) <= 280),
  notes text check (char_length(notes) <= 2000),
  course_id uuid references public.courses (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_trackers_id_user_id_key unique (id, user_id),
  constraint class_trackers_case_owner_fkey
    foreign key (case_id, user_id)
    references public.case_merit_scores (id, user_id)
    on delete set null (case_id),
  constraint class_trackers_proof_owner_fkey
    foreign key (proof_file_id, user_id)
    references public.case_files (id, user_id)
    on delete set null (proof_file_id)
);

comment on table public.class_trackers is
  'Classes the person was told to take, as they typed them in. Never compared against hours or dates.';

create index class_trackers_user_idx on public.class_trackers (user_id, created_at);
create index class_trackers_case_idx on public.class_trackers (case_id);
create index class_trackers_proof_idx on public.class_trackers (proof_file_id);
create index class_trackers_course_idx on public.class_trackers (course_id);

drop trigger if exists class_trackers_updated_at on public.class_trackers;
create trigger class_trackers_updated_at
  before update on public.class_trackers
  for each row execute function public.update_updated_at_column();

alter table public.class_trackers enable row level security;

drop policy if exists class_trackers_select_own on public.class_trackers;
create policy class_trackers_select_own
  on public.class_trackers
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists class_trackers_insert_own_with_plan on public.class_trackers;
create policy class_trackers_insert_own_with_plan
  on public.class_trackers
  for insert
  to authenticated
  with check (user_id = (select auth.uid()) and (select public.my_toolkit_access()));

drop policy if exists class_trackers_update_own on public.class_trackers;
create policy class_trackers_update_own
  on public.class_trackers
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists class_trackers_delete_own on public.class_trackers;
create policy class_trackers_delete_own
  on public.class_trackers
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.class_trackers from anon;
grant select, insert, update, delete on public.class_trackers to authenticated;

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null,
  -- Denormalized for RLS. Policies check user_id, never tracker ownership; the composite key below
  -- makes a session under someone else's tracker impossible.
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_date date not null
    check (session_date between date '1900-01-01' and date '2200-12-31'),
  hours numeric(4,1) check (hours >= 0),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_sessions_tracker_owner_fkey
    foreign key (tracker_id, user_id)
    references public.class_trackers (id, user_id)
    on delete cascade
);

create index class_sessions_user_tracker_idx on public.class_sessions (user_id, tracker_id, session_date);
create index class_sessions_tracker_idx on public.class_sessions (tracker_id);

drop trigger if exists class_sessions_updated_at on public.class_sessions;
create trigger class_sessions_updated_at
  before update on public.class_sessions
  for each row execute function public.update_updated_at_column();

alter table public.class_sessions enable row level security;

drop policy if exists class_sessions_select_own on public.class_sessions;
create policy class_sessions_select_own
  on public.class_sessions
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists class_sessions_insert_own_with_plan on public.class_sessions;
create policy class_sessions_insert_own_with_plan
  on public.class_sessions
  for insert
  to authenticated
  with check (user_id = (select auth.uid()) and (select public.my_toolkit_access()));

drop policy if exists class_sessions_update_own on public.class_sessions;
create policy class_sessions_update_own
  on public.class_sessions
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists class_sessions_delete_own on public.class_sessions;
create policy class_sessions_delete_own
  on public.class_sessions
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.class_sessions from anon;
grant select, insert, update, delete on public.class_sessions to authenticated;


-- ---------------------------------------------------------------------------------------------
-- 7. Billing consent and notice records (service role writes only)
-- ---------------------------------------------------------------------------------------------

create table public.billing_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  -- Snapshots kept after account deletion.
  email text,
  stripe_customer_id text,
  subscription_id text,
  checkout_session_id text,
  disclosure_version text not null,
  disclosure_sha256 text not null check (disclosure_sha256 ~ '^[0-9a-f]{64}$'),
  checkout_custom_text_version text,
  price_id text not null,
  amount_cents integer not null check (amount_cents > 0),
  "interval" text not null,
  auto_renew_consent boolean not null,
  tos_consent boolean not null,
  notice_channel text not null default 'email' check (notice_channel in ('email')),
  locale text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_consents_both_consents_check check (auto_renew_consent and tos_consent)
);

comment on table public.billing_consents is
  'Automatic renewal consent records (Cal. Bus. & Prof. Code 17602(a)(6)). Service role writes; owner can read. Keep until max(created_at + 3 years, plan end + 1 year), even after account deletion.';

create index billing_consents_user_idx on public.billing_consents (user_id);
create index billing_consents_subscription_idx on public.billing_consents (subscription_id);
create index billing_consents_session_idx on public.billing_consents (checkout_session_id);

drop trigger if exists billing_consents_updated_at on public.billing_consents;
create trigger billing_consents_updated_at
  before update on public.billing_consents
  for each row execute function public.update_updated_at_column();

alter table public.billing_consents enable row level security;

revoke all on public.billing_consents from anon;
revoke insert, update, delete, truncate, references, trigger on public.billing_consents from authenticated;
grant select on public.billing_consents to authenticated;

drop policy if exists billing_consents_select_own on public.billing_consents;
create policy billing_consents_select_own
  on public.billing_consents
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create table public.billing_notices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  subscription_id text not null,
  kind text not null
    check (kind in ('acknowledgment', 'annual_reminder', 'price_change', 'cancellation')),
  -- Required for annual_reminder (the anniversary's year); null for acknowledgment and
  -- cancellation. For a future price_change, use the change's effective year.
  reminder_year integer check (reminder_year between 2000 and 2200),
  status text not null default 'queued'
    check (status in ('queued', 'sending', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  sent_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One acknowledgment and one cancellation notice per subscription, one annual reminder per year.
  constraint billing_notices_once unique nulls not distinct (subscription_id, kind, reminder_year),
  constraint billing_notices_annual_year_check
    check (kind <> 'annual_reminder' or reminder_year is not null)
);

comment on table public.billing_notices is
  'Billing emails the automatic renewal laws require. Service role only. Keep with billing_consents.';

create index billing_notices_retry_idx on public.billing_notices (status, updated_at);
create index billing_notices_user_idx on public.billing_notices (user_id);

drop trigger if exists billing_notices_updated_at on public.billing_notices;
create trigger billing_notices_updated_at
  before update on public.billing_notices
  for each row execute function public.update_updated_at_column();

alter table public.billing_notices enable row level security;

revoke all on public.billing_notices from anon, authenticated;


-- ---------------------------------------------------------------------------------------------
-- 8. Service-role helpers for the billing-notices and delete-my-data edge functions
-- ---------------------------------------------------------------------------------------------

-- Active subscriptions that have not been cancelled and whose yearly anniversary (Stripe start
-- date, or row start date if missing) falls within the next _window_days days (UTC), with no
-- annual_reminder notice created in the last 300 days. Billing dates only; nothing legal.
create or replace function public.billing_due_annual_reminders(_window_days integer default 7)
returns table (
  subscription_id text,
  user_id uuid,
  stripe_customer_id text,
  started_at timestamptz,
  anniversary date,
  reminder_year integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with today as (
    select (now() at time zone 'UTC')::date as d
  ),
  active_subs as (
    select
      s.paypal_subscription_id as sub_id,
      s.user_id as uid,
      s.stripe_customer_id as customer_id,
      coalesce(s.stripe_started_at, s.start_date) as started
    from public.subscriptions s
    where s.status = 'active'
      and s.cancel_at_period_end = false
      and s.end_date > now()
      and s.paypal_subscription_id is not null
  ),
  candidates as (
    select
      a.sub_id,
      a.uid,
      a.customer_id,
      a.started,
      ((a.started at time zone 'UTC')::date + make_interval(years => y.n))::date as anniv
    from active_subs a
    cross join today t
    cross join lateral generate_series(
      greatest(1, extract(year from t.d)::int - extract(year from (a.started at time zone 'UTC'))::int),
      greatest(1, extract(year from t.d)::int - extract(year from (a.started at time zone 'UTC'))::int) + 1
    ) as y(n)
  )
  select
    c.sub_id,
    c.uid,
    c.customer_id,
    c.started,
    c.anniv,
    extract(year from c.anniv)::int
  from candidates c
  cross join today t
  where c.anniv >= t.d
    and c.anniv <= t.d + greatest(0, least(coalesce(_window_days, 7), 31))
    and not exists (
      select 1
      from public.billing_notices b
      where b.subscription_id = c.sub_id
        and b.kind = 'annual_reminder'
        and b.created_at > now() - interval '300 days'
    );
$$;

revoke execute on function public.billing_due_annual_reminders(integer) from public, anon, authenticated;
grant execute on function public.billing_due_annual_reminders(integer) to service_role;

-- Every stored object under a person's folder, for delete-my-data (removed through the Storage
-- API in batches, never by deleting storage.objects rows).
create or replace function public.list_user_storage_objects(_uid uuid)
returns table (bucket_id text, name text)
language sql
stable
security definer
set search_path = ''
as $$
  select o.bucket_id, o.name
  from storage.objects o
  where _uid is not null
    and o.bucket_id = any (array['evidence-files', 'user-uploads', 'case-documents'])
    and (storage.foldername(o.name))[1] = _uid::text
  order by o.bucket_id, o.name;
$$;

revoke execute on function public.list_user_storage_objects(uuid) from public, anon, authenticated;
grant execute on function public.list_user_storage_objects(uuid) to service_role;


-- ---------------------------------------------------------------------------------------------
-- 9. Privacy fix: no blanket admin access to people's files, file rows or cases
-- ---------------------------------------------------------------------------------------------

drop policy if exists "Admins can access all storage objects" on storage.objects;
drop policy if exists "Admins can view all case files" on public.case_files;
drop policy if exists "Admins can view all merit scores" on public.case_merit_scores;

-- Counts for the admin analytics page, without access to the rows themselves.
create or replace function public.admin_case_file_count()
returns bigint
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role((select auth.uid()), 'admin'::public.app_role) then
    raise exception 'admin only' using errcode = '42501';
  end if;
  return (select count(*) from public.case_files);
end
$$;

revoke execute on function public.admin_case_file_count() from public, anon;
grant execute on function public.admin_case_file_count() to authenticated, service_role;

-- Case counts: one 'total' row (label 'all'), then one row per month ('YYYY-MM', UTC), per
-- legal_area and per state ('Unknown' when empty). No titles, descriptions or user ids.
create or replace function public.admin_case_stats()
returns table (dimension text, label text, case_count bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role((select auth.uid()), 'admin'::public.app_role) then
    raise exception 'admin only' using errcode = '42501';
  end if;

  return query
    select 'total'::text, 'all'::text, count(*)::bigint
    from public.case_merit_scores
    union all
    select 'month'::text, to_char(c.created_at at time zone 'UTC', 'YYYY-MM'), count(*)::bigint
    from public.case_merit_scores c
    group by 2
    union all
    select 'legal_area'::text, coalesce(nullif(btrim(c.legal_area), ''), 'Unknown'), count(*)::bigint
    from public.case_merit_scores c
    group by 2
    union all
    select 'state'::text, coalesce(nullif(btrim(c.state), ''), 'Unknown'), count(*)::bigint
    from public.case_merit_scores c
    group by 2;
end
$$;

revoke execute on function public.admin_case_stats() from public, anon;
grant execute on function public.admin_case_stats() to authenticated, service_role;


-- ---------------------------------------------------------------------------------------------
-- 10. Course listing removal
-- ---------------------------------------------------------------------------------------------

-- Flagged by review as mislabeled and legally risky. Hidden, not deleted.
update public.courses
set is_active = false,
    updated_at = now()
where title ilike 'High Road to Reunification%'
  and is_active = true;
