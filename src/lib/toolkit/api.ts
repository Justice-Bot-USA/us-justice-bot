// Typed reads and writes for the Toolkit tables, using the app's Supabase client.
//
// Every function throws a ToolkitApiError on failure. Its `kind` tells the page what to show:
// - 'locked': the database refused a new row because the person has no active plan (Postgres
//   42501). Show <LockedFeature>. Changing or deleting existing rows is never locked.
// - 'needs_confirmation': a calendar date, time or time zone changed without a new confirmed_at.
//   Show the read-back again (<DateReadBack>) and resend with confirmed_at: confirmationStamp().
// - 'invalid', 'not_found', 'signed_out', 'network', 'unknown': show `message`.
//
// Privacy: nothing here logs. Never pass titles, file names, class names or notes to analytics or
// the console.

import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toolkitKeys } from "./access";
import {
  CASE_FILE_EDITABLE_COLUMNS,
  type CalendarEventInsert,
  type CalendarEventPatch,
  type CalendarEventRow,
  type CaseFileInsert,
  type CaseFilePatch,
  type CaseFileRow,
  type ClassSessionInsert,
  type ClassSessionPatch,
  type ClassSessionRow,
  type ClassTrackerInsert,
  type ClassTrackerPatch,
  type ClassTrackerRow,
} from "./types";

export { toolkitKeys };

// ---------------------------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------------------------

export type ToolkitErrorKind = "locked" | "needs_confirmation" | "invalid" | "not_found" | "signed_out" | "network" | "unknown";

export const TOOLKIT_ERROR_MESSAGES: Record<ToolkitErrorKind, string> = {
  locked: "Adding something new needs an active Toolkit plan. You can still see, change and delete what you already saved.",
  needs_confirmation: "You changed the date, time or time zone. Please check it against your papers again before saving.",
  invalid: "Something here can't be saved. Check what you typed and try again.",
  not_found: "We couldn't find that. It may have been deleted.",
  signed_out: "Please sign in again.",
  network: "We couldn't reach the server. Check your connection and try again.",
  unknown: "Something went wrong. Please try again.",
};

export class ToolkitApiError extends Error {
  readonly kind: ToolkitErrorKind;
  /** The Postgres or PostgREST error code, when there is one (for example '42501'). */
  readonly code?: string;

  constructor(kind: ToolkitErrorKind, code?: string, message: string = TOOLKIT_ERROR_MESSAGES[kind]) {
    super(message);
    this.name = "ToolkitApiError";
    this.kind = kind;
    this.code = code;
  }
}

const INVALID_CODES = new Set(["23503", "23514", "23502", "23505", "22P02", "22007", "22008", "22003", "22001", "22023"]);

/** Turns any thrown value or Supabase error into a ToolkitApiError. */
export function toToolkitError(err: unknown): ToolkitApiError {
  if (err instanceof ToolkitApiError) return err;
  const e = (err ?? {}) as Partial<PostgrestError> & { message?: string; status?: number };
  const code = typeof e.code === "string" && e.code ? e.code : undefined;
  const message = typeof e.message === "string" ? e.message : "";

  if (code === "42501") return new ToolkitApiError("locked", code);
  if (code === "P0001" && message.includes("date_changed_requires_confirmation")) {
    return new ToolkitApiError("needs_confirmation", code);
  }
  if (code && INVALID_CODES.has(code)) return new ToolkitApiError("invalid", code);
  if (code === "PGRST116") return new ToolkitApiError("not_found", code);
  if ((code && code.startsWith("PGRST3")) || e.status === 401 || /jwt/i.test(message)) {
    return new ToolkitApiError("signed_out", code);
  }
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return new ToolkitApiError("network", code);
  }
  return new ToolkitApiError("unknown", code);
}

export function isLockedError(err: unknown): boolean {
  return toToolkitError(err).kind === "locked";
}

export function isNeedsConfirmationError(err: unknown): boolean {
  return toToolkitError(err).kind === "needs_confirmation";
}

type Result<T> = { data: T | null; error: PostgrestError | null };

async function run<T>(query: PromiseLike<Result<T>>): Promise<T> {
  let res: Result<T>;
  try {
    res = await query;
  } catch (err) {
    throw toToolkitError(err);
  }
  if (res.error) throw toToolkitError(res.error);
  if (res.data === null || res.data === undefined) throw new ToolkitApiError("not_found");
  return res.data;
}

async function runCount(query: PromiseLike<{ count: number | null; error: PostgrestError | null }>): Promise<number> {
  let res: { count: number | null; error: PostgrestError | null };
  try {
    res = await query;
  } catch (err) {
    throw toToolkitError(err);
  }
  if (res.error) throw toToolkitError(res.error);
  return res.count ?? 0;
}

/** Drops keys whose value is undefined so PostgREST only sets what the caller passed. */
function defined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function omit<T extends object>(obj: T, keys: readonly string[]): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k))) as Partial<T>;
}

// ---------------------------------------------------------------------------------------------
// Dates and times
// ---------------------------------------------------------------------------------------------

/**
 * The value to send as confirmed_at, only right after the person chose "This matches my papers".
 * The database replaces it with its own clock, so a wrong phone clock does not matter.
 */
export function confirmationStamp(): string {
  return new Date().toISOString();
}

/** 'HH:mm:ss' from Postgres to 'HH:mm'; empty to null. */
export function normalizeTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = /^(\d{2}):(\d{2})/.exec(value.trim());
  return m ? `${m[1]}:${m[2]}` : null;
}

/** True when a patch changes the date, time or time zone of an entry (so the read-back must be shown again). */
export function needsReadBack(row: Pick<CalendarEventRow, "event_date" | "start_time" | "time_zone">, patch: CalendarEventPatch): boolean {
  if (patch.event_date !== undefined && patch.event_date !== row.event_date) return true;
  if (patch.start_time !== undefined && normalizeTime(patch.start_time) !== normalizeTime(row.start_time)) return true;
  if (patch.time_zone !== undefined && patch.time_zone !== row.time_zone) return true;
  return false;
}

// ---------------------------------------------------------------------------------------------
// Binder files (case_files). Organizing is free for everyone.
// ---------------------------------------------------------------------------------------------

const asCaseFile = (row: unknown) => row as CaseFileRow;

/**
 * The person's files, in their chosen order (sort_order, then upload time).
 * caseId: undefined = all files, null = files not linked to a case, string = one case.
 */
export async function listCaseFiles(userId: string, opts: { caseId?: string | null } = {}): Promise<CaseFileRow[]> {
  let q = supabase.from("case_files").select("*").eq("user_id", userId);
  if (opts.caseId === null) q = q.is("case_id", null);
  else if (typeof opts.caseId === "string") q = q.eq("case_id", opts.caseId);
  const rows = await run(
    q.order("sort_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: true }),
  );
  return rows.map(asCaseFile);
}

/** Records an uploaded object. file_path must start with "{userId}/". */
export async function insertCaseFile(userId: string, input: CaseFileInsert): Promise<CaseFileRow> {
  const row = await run(
    supabase
      .from("case_files")
      .insert({ ...defined(input), user_id: userId } as CaseFileInsert & { user_id: string })
      .select("*")
      .single(),
  );
  return asCaseFile(row);
}

/** Changes organizing fields only (display_name, document_date, section, sort_order, notes, case_id, description, tags). */
export async function updateCaseFile(id: string, patch: CaseFilePatch): Promise<CaseFileRow> {
  const allowed = Object.fromEntries(
    Object.entries(defined(patch)).filter(([k]) => (CASE_FILE_EDITABLE_COLUMNS as readonly string[]).includes(k)),
  );
  if (Object.keys(allowed).length === 0) throw new ToolkitApiError("invalid");
  const row = await run(supabase.from("case_files").update(allowed).eq("id", id).select("*").single());
  return asCaseFile(row);
}

/**
 * Deletes the row only. Remove the stored object first (src/lib/binder/storage.ts), confirm it is
 * gone, then call this. Returns false if no row was deleted.
 */
export async function deleteCaseFileRow(id: string): Promise<boolean> {
  const rows = await run(supabase.from("case_files").delete().eq("id", id).select("id"));
  return rows.length > 0;
}

// ---------------------------------------------------------------------------------------------
// Hearing calendar (case_calendar_events). New entries need a plan; changes and deletes never do.
// ---------------------------------------------------------------------------------------------

function asCalendarEvent(row: unknown): CalendarEventRow {
  const r = row as CalendarEventRow;
  return { ...r, start_time: normalizeTime(r.start_time), alarms: [...(r.alarms ?? [])] };
}

/** Every entry, soonest first (all-day entries before timed ones on the same date). */
export async function listCalendarEvents(userId: string): Promise<CalendarEventRow[]> {
  const rows = await run(
    supabase
      .from("case_calendar_events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true, nullsFirst: true })
      .order("created_at", { ascending: true }),
  );
  return rows.map(asCalendarEvent);
}

/** Needs an active plan ('locked' otherwise) and a confirmed_at from the read-back. */
export async function insertCalendarEvent(userId: string, input: CalendarEventInsert): Promise<CalendarEventRow> {
  if (!input.confirmed_at) throw new ToolkitApiError("needs_confirmation");
  const values = {
    ...defined(input),
    start_time: normalizeTime(input.start_time),
    user_id: userId,
  } as CalendarEventInsert & { user_id: string };
  const row = await run(supabase.from("case_calendar_events").insert(values).select("*").single());
  return asCalendarEvent(row);
}

/**
 * Always allowed for the owner. A change to event_date, start_time or time_zone must include
 * confirmed_at: confirmationStamp() after the read-back, or this throws 'needs_confirmation'.
 * The database bumps ics_sequence on every change.
 */
export async function updateCalendarEvent(id: string, patch: CalendarEventPatch): Promise<CalendarEventRow> {
  const values = omit(defined(patch), ["id", "user_id", "created_at", "updated_at", "ics_sequence"]) as CalendarEventPatch;
  if ("start_time" in values) values.start_time = normalizeTime(values.start_time);
  if (Object.keys(values).length === 0) throw new ToolkitApiError("invalid");
  const row = await run(supabase.from("case_calendar_events").update(values).eq("id", id).select("*").single());
  return asCalendarEvent(row);
}

export async function deleteCalendarEvent(id: string): Promise<boolean> {
  const rows = await run(supabase.from("case_calendar_events").delete().eq("id", id).select("id"));
  return rows.length > 0;
}

// ---------------------------------------------------------------------------------------------
// Class tracker (class_trackers, class_sessions). New records need a plan; changes and deletes never do.
// ---------------------------------------------------------------------------------------------

const asTracker = (row: unknown) => row as ClassTrackerRow;
const asSession = (row: unknown) => row as ClassSessionRow;

export async function listClassTrackers(userId: string): Promise<ClassTrackerRow[]> {
  const rows = await run(
    supabase.from("class_trackers").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
  );
  return rows.map(asTracker);
}

/** Needs an active plan ('locked' otherwise). Never prefill hours or dates. */
export async function insertClassTracker(userId: string, input: ClassTrackerInsert): Promise<ClassTrackerRow> {
  const row = await run(
    supabase
      .from("class_trackers")
      .insert({ ...defined(input), user_id: userId } as ClassTrackerInsert & { user_id: string })
      .select("*")
      .single(),
  );
  return asTracker(row);
}

export async function updateClassTracker(id: string, patch: ClassTrackerPatch): Promise<ClassTrackerRow> {
  const values = omit(defined(patch), ["id", "user_id", "created_at", "updated_at"]) as ClassTrackerPatch;
  if (Object.keys(values).length === 0) throw new ToolkitApiError("invalid");
  const row = await run(supabase.from("class_trackers").update(values).eq("id", id).select("*").single());
  return asTracker(row);
}

/** Deletes the class record and its sessions. */
export async function deleteClassTracker(id: string): Promise<boolean> {
  const rows = await run(supabase.from("class_trackers").delete().eq("id", id).select("id"));
  return rows.length > 0;
}

/** Sessions for one class (or all classes), oldest first. */
export async function listClassSessions(userId: string, trackerId?: string): Promise<ClassSessionRow[]> {
  let q = supabase.from("class_sessions").select("*").eq("user_id", userId);
  if (trackerId) q = q.eq("tracker_id", trackerId);
  const rows = await run(q.order("session_date", { ascending: true }).order("created_at", { ascending: true }));
  return rows.map(asSession);
}

/** Needs an active plan ('locked' otherwise). tracker_id must be one of the person's own classes. */
export async function insertClassSession(userId: string, input: ClassSessionInsert): Promise<ClassSessionRow> {
  const row = await run(
    supabase
      .from("class_sessions")
      .insert({ ...defined(input), user_id: userId } as ClassSessionInsert & { user_id: string })
      .select("*")
      .single(),
  );
  return asSession(row);
}

export async function updateClassSession(id: string, patch: ClassSessionPatch): Promise<ClassSessionRow> {
  const values = omit(defined(patch), ["id", "user_id", "created_at", "updated_at"]) as ClassSessionPatch;
  if (Object.keys(values).length === 0) throw new ToolkitApiError("invalid");
  const row = await run(supabase.from("class_sessions").update(values).eq("id", id).select("*").single());
  return asSession(row);
}

export async function deleteClassSession(id: string): Promise<boolean> {
  const rows = await run(supabase.from("class_sessions").delete().eq("id", id).select("id"));
  return rows.length > 0;
}

// ---------------------------------------------------------------------------------------------
// Counts for the Toolkit hub
// ---------------------------------------------------------------------------------------------

export interface ToolkitCounts {
  files: number;
  calendarEvents: number;
  classTrackers: number;
}

export async function countToolkitItems(userId: string): Promise<ToolkitCounts> {
  const [files, calendarEvents, classTrackers] = await Promise.all([
    runCount(supabase.from("case_files").select("id", { count: "exact", head: true }).eq("user_id", userId)),
    runCount(supabase.from("case_calendar_events").select("id", { count: "exact", head: true }).eq("user_id", userId)),
    runCount(supabase.from("class_trackers").select("id", { count: "exact", head: true }).eq("user_id", userId)),
  ]);
  return { files, calendarEvents, classTrackers };
}
