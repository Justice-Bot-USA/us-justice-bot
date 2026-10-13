// Shared Toolkit types and choice lists. Every list here is identical to a CHECK constraint in
// supabase/migrations/20261013120000_toolkit.sql; change both together.
//
// Dates are 'yyyy-MM-dd' strings and times are 'HH:mm' strings, exactly as the person typed them.
// Never pass them to new Date('yyyy-MM-dd'); use the helpers in src/lib/calendar/dates.ts.

import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { ALARM_CHOICES, MORNING_OF } from "@/lib/calendar/ics";
import { COURT_TIME_ZONES, type CourtTimeZone } from "@/lib/calendar/dates";

export interface Choice<T extends string | number> {
  value: T;
  label: string;
}

// ---------------------------------------------------------------------------------------------
// Calendar entry kinds (case_calendar_events.kind)
// ---------------------------------------------------------------------------------------------

export const KIND_VALUES = ["hearing", "appointment", "due_date", "class", "other"] as const;
export type Kind = (typeof KIND_VALUES)[number];

export const KINDS: readonly Choice<Kind>[] = [
  { value: "hearing", label: "Hearing" },
  { value: "appointment", label: "Appointment" },
  { value: "due_date", label: "Due date (from your papers)" },
  { value: "class", label: "Class" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------------------------
// Binder sections (case_files.section)
// ---------------------------------------------------------------------------------------------

export const SECTION_VALUES = ["court_papers", "evidence", "letters", "money", "photos", "other"] as const;
export type Section = (typeof SECTION_VALUES)[number];

/**
 * The single source of the section words, so the screen and the binder PDF say the same thing.
 * src/lib/binder/exportBinder.ts imports and re-exports this object (the other way round would
 * pull pdf-lib, about 520 KB, into every page that uses these lists).
 */
export const SECTION_LABELS: Record<Section, string> = {
  court_papers: "Court papers",
  evidence: "Evidence",
  letters: "Letters and messages",
  money: "Money and receipts",
  photos: "Photos",
  other: "Other",
};

export const SECTIONS: readonly Choice<Section>[] = SECTION_VALUES.map((value) => ({
  value,
  label: SECTION_LABELS[value],
}));

// ---------------------------------------------------------------------------------------------
// Class tracker (class_trackers.ordered_by and class_trackers.status)
// ---------------------------------------------------------------------------------------------

export const ORDERED_BY_VALUES = ["court", "probation", "agency", "dmv", "bankruptcy", "self", "other"] as const;
export type OrderedBy = (typeof ORDERED_BY_VALUES)[number];

export const ORDERED_BY: readonly Choice<OrderedBy>[] = [
  { value: "court", label: "A court" },
  { value: "probation", label: "Probation" },
  { value: "agency", label: "A government agency" },
  { value: "dmv", label: "DMV" },
  { value: "bankruptcy", label: "Bankruptcy case" },
  { value: "self", label: "I chose to take it" },
  { value: "other", label: "Someone else" },
];

export const STATUS_VALUES = ["not_started", "in_progress", "finished", "proof_sent"] as const;
export type ClassStatus = (typeof STATUS_VALUES)[number];

/** The person's own record of where they are. Never set or changed by the app. */
export const STATUSES: readonly Choice<ClassStatus>[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "finished", label: "Finished (your record)" },
  { value: "proof_sent", label: "Proof sent to the court" },
];

// ---------------------------------------------------------------------------------------------
// Calendar alerts (case_calendar_events.alarms) and time zones (case_calendar_events.time_zone)
// ---------------------------------------------------------------------------------------------

export const ALARM_VALUES = [10080, 2880, 1440, MORNING_OF] as const;
export type AlarmMinutes = (typeof ALARM_VALUES)[number];

/** Same list and labels as the .ics builder. */
export const ALARMS: readonly Choice<AlarmMinutes>[] = ALARM_CHOICES.map((a) => ({
  value: a.minutes as AlarmMinutes,
  label: a.label,
}));

/** The database default for new entries: 1 week before and 2 days before. */
export const DEFAULT_ALARMS: AlarmMinutes[] = [10080, 2880];

export type TimeZone = CourtTimeZone;

export const TIME_ZONE_VALUES: readonly TimeZone[] = COURT_TIME_ZONES.map((z) => z.value);

export const TIME_ZONES: readonly Choice<TimeZone>[] = COURT_TIME_ZONES.map((z) => ({
  value: z.value,
  label: z.label,
}));

// ---------------------------------------------------------------------------------------------
// Length and number limits (same as the CHECK constraints)
// ---------------------------------------------------------------------------------------------

export const LIMITS = {
  // case_files
  displayName: 200,
  fileNotes: 2000,
  // case_calendar_events
  title: 140,
  courtOrPlace: 200,
  room: 100,
  address: 300,
  eventNotes: 2000,
  sourceNote: 280,
  // class_trackers
  className: 140,
  orderWording: 2000,
  dueDateSource: 280,
  providerName: 200,
  providerUrl: 2000,
  proofSentHow: 280,
  trackerNotes: 2000,
  /** numeric(5,1) */
  requiredHoursMax: 9999.9,
  // class_sessions
  sessionNotes: 2000,
  /** numeric(4,1) */
  sessionHoursMax: 999.9,
  // every date column
  minDate: "1900-01-01",
  maxDate: "2200-12-31",
} as const;

/** class_trackers.provider_url must match this (https only, no spaces). */
export const PROVIDER_URL_PATTERN = /^https:\/\/[^\s]+$/;

// ---------------------------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------------------------

export const isKind = (v: unknown): v is Kind => typeof v === "string" && (KIND_VALUES as readonly string[]).includes(v);
export const isSection = (v: unknown): v is Section =>
  typeof v === "string" && (SECTION_VALUES as readonly string[]).includes(v);
export const isOrderedBy = (v: unknown): v is OrderedBy =>
  typeof v === "string" && (ORDERED_BY_VALUES as readonly string[]).includes(v);
export const isClassStatus = (v: unknown): v is ClassStatus =>
  typeof v === "string" && (STATUS_VALUES as readonly string[]).includes(v);
export const isAlarm = (v: unknown): v is AlarmMinutes =>
  typeof v === "number" && (ALARM_VALUES as readonly number[]).includes(v);
export const isTimeZone = (v: unknown): v is TimeZone =>
  typeof v === "string" && (TIME_ZONE_VALUES as readonly string[]).includes(v);

/** Label for a stored value, or the value itself if it is not in the list. */
export function labelFor<T extends string | number>(choices: readonly Choice<T>[], value: T | null | undefined): string {
  if (value === null || value === undefined) return "";
  return choices.find((c) => c.value === value)?.label ?? String(value);
}

// ---------------------------------------------------------------------------------------------
// Row types (database rows with the CHECK-constrained columns narrowed)
// ---------------------------------------------------------------------------------------------

type CaseFileDb = Tables<"case_files">;
type CalendarEventDb = Tables<"case_calendar_events">;
type ClassTrackerDb = Tables<"class_trackers">;
type ClassSessionDb = Tables<"class_sessions">;

/** A binder file. file_path is "{uid}/..." in bucket_name; rows whose file_path starts with http are links, not files. */
export type CaseFileRow = Omit<CaseFileDb, "section"> & { section: Section | null };

/** A calendar entry. start_time is normalized to 'HH:mm' (or null for all day) by api.ts. */
export type CalendarEventRow = Omit<CalendarEventDb, "kind" | "time_zone" | "alarms"> & {
  kind: Kind;
  time_zone: TimeZone;
  alarms: AlarmMinutes[];
};

export type ClassTrackerRow = Omit<ClassTrackerDb, "ordered_by" | "status"> & {
  ordered_by: OrderedBy | null;
  status: ClassStatus;
};

export type ClassSessionRow = ClassSessionDb;

/** The only columns the Toolkit reads from case_merit_scores (never the legacy AI fields). */
export interface ToolkitCase {
  id: string;
  case_title: string;
  state: string;
  archived_at: string | null;
  /** From the case's state: Pacific for California, Eastern for New York, otherwise null (ask). */
  defaultTimeZone: TimeZone | null;
}

// ---------------------------------------------------------------------------------------------
// Write shapes. user_id comes from the signed-in user in api.ts; id, created_at, updated_at and
// ics_sequence are set by the database.
// ---------------------------------------------------------------------------------------------

/** Columns a client may change on case_files (all others fail with 42501). */
export const CASE_FILE_EDITABLE_COLUMNS = [
  "display_name",
  "document_date",
  "section",
  "sort_order",
  "notes",
  "case_id",
  "description",
  "tags",
] as const;
export type CaseFileEditableColumn = (typeof CASE_FILE_EDITABLE_COLUMNS)[number];

export type CaseFileInsert = Omit<TablesInsert<"case_files">, "id" | "user_id" | "created_at" | "updated_at" | "section"> & {
  section?: Section | null;
};
export type CaseFilePatch = Partial<Omit<Pick<TablesUpdate<"case_files">, CaseFileEditableColumn>, "section">> & {
  section?: Section | null;
};

type CalendarDbInsert = TablesInsert<"case_calendar_events">;
export type CalendarEventInsert = Omit<
  CalendarDbInsert,
  "id" | "user_id" | "created_at" | "updated_at" | "ics_sequence" | "kind" | "time_zone" | "alarms"
> & {
  kind: Kind;
  time_zone: TimeZone;
  alarms?: AlarmMinutes[];
  /** Required: send new Date().toISOString() only after "This matches my papers". The server stamps its own time. */
  confirmed_at: string;
};
/**
 * A change to event_date, start_time or time_zone must include a new confirmed_at (after the
 * read-back is shown again), or the database refuses it ('needs_confirmation').
 */
export type CalendarEventPatch = Partial<CalendarEventInsert>;

type TrackerDbInsert = TablesInsert<"class_trackers">;
export type ClassTrackerInsert = Omit<
  TrackerDbInsert,
  "id" | "user_id" | "created_at" | "updated_at" | "ordered_by" | "status"
> & {
  ordered_by?: OrderedBy | null;
  status?: ClassStatus;
};
export type ClassTrackerPatch = Partial<ClassTrackerInsert>;

type SessionDbInsert = TablesInsert<"class_sessions">;
export type ClassSessionInsert = Omit<SessionDbInsert, "id" | "user_id" | "created_at" | "updated_at">;
export type ClassSessionPatch = Partial<ClassSessionInsert>;
