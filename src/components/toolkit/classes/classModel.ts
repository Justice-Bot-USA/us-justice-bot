// Pure helpers for the class tracker: form values, checks on what was typed, the values to write,
// hours formatting and the Course Hub prefill.
//
// Rules (spec v2 §0.3, §3.4): hours and dates are only what the person typed. Nothing here works
// out, suggests, prefills, checks or compares a requirement, an hour count or a date. The single
// sum is "Hours you logged" (the hours the person typed for their own sessions, added up), and it
// is never compared with the hours typed from the order: no difference, percentage, progress bar,
// colour change, "hours left", "overdue" or "missed".
//
// Dates stay 'yyyy-MM-dd' strings; they are never passed to new Date('yyyy-MM-dd').

import { formatLongDate, isValidDateString } from "@/lib/calendar/dates";
import {
  DEFAULT_ALARMS,
  LIMITS,
  ORDERED_BY,
  PROVIDER_URL_PATTERN,
  STATUSES,
  isClassStatus,
  isOrderedBy,
  isTimeZone,
  labelFor,
  type CalendarEventInsert,
  type ClassSessionInsert,
  type ClassSessionPatch,
  type ClassSessionRow,
  type ClassStatus,
  type ClassTrackerInsert,
  type ClassTrackerPatch,
  type ClassTrackerRow,
  type OrderedBy,
  type TimeZone,
} from "@/lib/toolkit/types";

// ---------------------------------------------------------------------------------------------
// Small text helpers
// ---------------------------------------------------------------------------------------------

/** Characters as Postgres char_length counts them (code points). */
export function charCount(value: string): number {
  return [...value].length;
}

/** The first `max` characters (code points), so a clipped value never splits an emoji. */
export function clip(value: string, max: number): string {
  const chars = [...value];
  return chars.length <= max ? value : chars.slice(0, max).join("");
}

const orNull = (v: string): string | null => {
  const t = v.trim();
  return t ? t : null;
};

const tooLong = (max: number) => `Use ${max} characters or fewer.`;

function checkLength<F extends string>(errors: Partial<Record<F, string>>, field: F, value: string, max: number) {
  if (charCount(value.trim()) > max) errors[field] = tooLong(max);
}

function checkDate(value: string): boolean {
  const d = value.trim();
  return isValidDateString(d) && d >= LIMITS.minDate && d <= LIMITS.maxDate;
}

// ---------------------------------------------------------------------------------------------
// Hours (typed by the person; numeric(5,1) for the order's hours, numeric(4,1) per session)
// ---------------------------------------------------------------------------------------------

/** value is null for "no hours" (or when there is an error); error is set when the text can't be read. */
export interface HoursResult {
  value: number | null;
  error?: string;
}

const HOURS_RE = /^(\d*)(?:[.,](\d*))?$/;

/**
 * Reads hours as typed ("2", "1.5", "1,5", ".5"). Empty means no hours. At most one decimal
 * place, because the database keeps one (it would otherwise round silently).
 */
export function parseHours(text: string, max: number): HoursResult {
  const t = text.trim();
  if (!t) return { value: null };
  const m = HOURS_RE.exec(t);
  if (!m || (m[1] === "" && (m[2] ?? "") === "")) return { value: null, error: "Type a number, like 2 or 1.5." };
  const whole = m[1] || "0";
  const fraction = (m[2] ?? "").replace(/0+$/, "");
  if (fraction.length > 1) return { value: null, error: "Use one decimal place at most, like 1.5." };
  const value = Number(`${whole}.${fraction || "0"}`);
  if (!Number.isFinite(value)) return { value: null, error: "Type a number, like 2 or 1.5." };
  if (value > max) return { value: null, error: `Use a number up to ${formatHours(max)}.` };
  return { value };
}

/** Tenths of an hour, so adding never drifts (0.1 + 0.2). */
function tenths(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10) : null;
}

/** "6", "1.5" */
export function formatHours(value: number | string | null | undefined): string {
  const t = tenths(value);
  if (t === null) return "";
  return t % 10 === 0 ? String(t / 10) : (t / 10).toFixed(1);
}

/** "1 hour", "2.5 hours" */
export function hoursText(value: number | string | null | undefined): string {
  const t = tenths(value);
  if (t === null) return "";
  return `${formatHours(value)} ${t === 10 ? "hour" : "hours"}`;
}

/** The hours the person typed for their sessions, added up (sessions with no hours count as 0). */
export function sumLoggedHours(sessions: readonly Pick<ClassSessionRow, "hours">[]): number {
  return sessions.reduce((sum, s) => sum + (tenths(s.hours) ?? 0), 0) / 10;
}

// ---------------------------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------------------------

/** The link if it is an https link the database accepts, else null. */
export function safeProviderUrl(value: string | null | undefined): string | null {
  const t = (value ?? "").trim();
  return t && PROVIDER_URL_PATTERN.test(t) && charCount(t) <= LIMITS.providerUrl ? t : null;
}

// ---------------------------------------------------------------------------------------------
// Class form
// ---------------------------------------------------------------------------------------------

export interface ClassFormValues {
  caseId: string | null;
  className: string;
  orderedBy: OrderedBy | "";
  orderWording: string;
  /** As typed, for example "12" or "1.5"; "" for none. */
  requiredHours: string;
  /** 'yyyy-MM-dd' from the date input, or "" */
  dueDate: string;
  dueDateSource: string;
  providerName: string;
  providerUrl: string;
  status: ClassStatus;
  notes: string;
}

export type ClassFormField = keyof ClassFormValues;
export type ClassFormErrors = Partial<Record<ClassFormField, string>>;

/** Order used to move focus to the first problem. */
export const CLASS_FIELD_ORDER: ClassFormField[] = [
  "caseId",
  "className",
  "orderedBy",
  "orderWording",
  "requiredHours",
  "dueDate",
  "dueDateSource",
  "providerName",
  "providerUrl",
  "status",
  "notes",
];

/** A blank form. Nothing is filled in. */
export function emptyClassForm(): ClassFormValues {
  return {
    caseId: null,
    className: "",
    orderedBy: "",
    orderWording: "",
    requiredHours: "",
    dueDate: "",
    dueDateSource: "",
    providerName: "",
    providerUrl: "",
    status: "not_started",
    notes: "",
  };
}

/** The saved record, for the edit form. */
export function classFormFromRow(row: ClassTrackerRow): ClassFormValues {
  return {
    caseId: row.case_id ?? null,
    className: row.class_name,
    orderedBy: isOrderedBy(row.ordered_by) ? row.ordered_by : "",
    orderWording: row.order_wording ?? "",
    requiredHours: formatHours(row.required_hours),
    dueDate: row.due_date ?? "",
    dueDateSource: row.due_date_source ?? "",
    providerName: row.provider_name ?? "",
    providerUrl: row.provider_url ?? "",
    status: isClassStatus(row.status) ? row.status : "not_started",
    notes: row.notes ?? "",
  };
}

/** Format and length only; never whether hours or a date are "right". */
export function validateClassForm(values: ClassFormValues): ClassFormErrors {
  const errors: ClassFormErrors = {};
  const name = values.className.trim();
  if (!name) errors.className = "Type the name of the class.";
  else checkLength(errors, "className", name, LIMITS.className);

  checkLength(errors, "orderWording", values.orderWording, LIMITS.orderWording);

  const hours = parseHours(values.requiredHours, LIMITS.requiredHoursMax);
  if (hours.error) errors.requiredHours = hours.error;

  if (values.dueDate.trim() && !checkDate(values.dueDate)) {
    errors.dueDate = "This date doesn't look right. Type it again from your papers, or leave it blank.";
  }
  checkLength(errors, "dueDateSource", values.dueDateSource, LIMITS.dueDateSource);
  checkLength(errors, "providerName", values.providerName, LIMITS.providerName);

  const url = values.providerUrl.trim();
  if (url) {
    if (charCount(url) > LIMITS.providerUrl) errors.providerUrl = tooLong(LIMITS.providerUrl);
    else if (!PROVIDER_URL_PATTERN.test(url)) errors.providerUrl = "Type the full link, starting with https://";
  }

  if (!isClassStatus(values.status)) errors.status = "Choose where you are with this class.";
  checkLength(errors, "notes", values.notes, LIMITS.trackerNotes);
  return errors;
}

export function firstClassError(errors: ClassFormErrors): ClassFormField | null {
  return CLASS_FIELD_ORDER.find((f) => errors[f]) ?? null;
}

/** Trimmed values for an insert. Call only after validateClassForm found nothing. */
export function classWriteValues(values: ClassFormValues): ClassTrackerInsert {
  const hours = parseHours(values.requiredHours, LIMITS.requiredHoursMax);
  return {
    case_id: values.caseId,
    class_name: values.className.trim(),
    ordered_by: values.orderedBy || null,
    order_wording: orNull(values.orderWording),
    required_hours: hours.value,
    due_date: orNull(values.dueDate),
    due_date_source: orNull(values.dueDateSource),
    provider_name: orNull(values.providerName),
    provider_url: orNull(values.providerUrl),
    status: values.status,
    notes: orNull(values.notes),
  };
}

/** Only the columns the person changed (status is changed on the card, not here). Empty when nothing changed. */
export function classPatch(row: ClassTrackerRow, values: ClassFormValues): ClassTrackerPatch {
  const next = classWriteValues(values);
  const patch: ClassTrackerPatch = {};
  if ((next.case_id ?? null) !== (row.case_id ?? null)) patch.case_id = next.case_id ?? null;
  if (next.class_name !== row.class_name) patch.class_name = next.class_name;
  if ((next.ordered_by ?? null) !== (row.ordered_by ?? null)) patch.ordered_by = next.ordered_by ?? null;
  if ((next.order_wording ?? null) !== (row.order_wording ?? null)) patch.order_wording = next.order_wording ?? null;
  if (tenths(next.required_hours) !== tenths(row.required_hours)) patch.required_hours = next.required_hours ?? null;
  if ((next.due_date ?? null) !== (row.due_date ?? null)) patch.due_date = next.due_date ?? null;
  if ((next.due_date_source ?? null) !== (row.due_date_source ?? null)) patch.due_date_source = next.due_date_source ?? null;
  if ((next.provider_name ?? null) !== (row.provider_name ?? null)) patch.provider_name = next.provider_name ?? null;
  if ((next.provider_url ?? null) !== (row.provider_url ?? null)) patch.provider_url = next.provider_url ?? null;
  if ((next.notes ?? null) !== (row.notes ?? null)) patch.notes = next.notes ?? null;
  return patch;
}

/**
 * True when a due date was typed (new record) or changed to another date (edit), so it must be
 * read back before saving. Clearing a due date needs no read-back.
 */
export function dueDateNeedsReadBack(row: Pick<ClassTrackerRow, "due_date"> | null, values: Pick<ClassFormValues, "dueDate">): boolean {
  const typed = values.dueDate.trim();
  if (!typed) return false;
  return row ? typed !== (row.due_date ?? "") : true;
}

// ---------------------------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------------------------

export interface SessionFormValues {
  /** 'yyyy-MM-dd', typed (never prefilled), or "" */
  date: string;
  hours: string;
  notes: string;
}

export type SessionFormField = keyof SessionFormValues;
export type SessionFormErrors = Partial<Record<SessionFormField, string>>;

export const SESSION_FIELD_ORDER: SessionFormField[] = ["date", "hours", "notes"];

export function emptySessionForm(): SessionFormValues {
  return { date: "", hours: "", notes: "" };
}

export function sessionFormFromRow(row: ClassSessionRow): SessionFormValues {
  return { date: row.session_date, hours: formatHours(row.hours), notes: row.notes ?? "" };
}

export function validateSessionForm(values: SessionFormValues): SessionFormErrors {
  const errors: SessionFormErrors = {};
  if (!values.date.trim()) errors.date = "Type the date of the session.";
  else if (!checkDate(values.date)) errors.date = "This date doesn't look right. Type it again.";
  const hours = parseHours(values.hours, LIMITS.sessionHoursMax);
  if (hours.error) errors.hours = hours.error;
  checkLength(errors, "notes", values.notes, LIMITS.sessionNotes);
  return errors;
}

export function sessionWriteValues(trackerId: string, values: SessionFormValues): ClassSessionInsert {
  const hours = parseHours(values.hours, LIMITS.sessionHoursMax);
  return {
    tracker_id: trackerId,
    session_date: values.date.trim(),
    hours: hours.value,
    notes: orNull(values.notes),
  };
}

export function sessionPatch(row: ClassSessionRow, values: SessionFormValues): ClassSessionPatch {
  const next = sessionWriteValues(row.tracker_id, values);
  const patch: ClassSessionPatch = {};
  if (next.session_date !== row.session_date) patch.session_date = next.session_date;
  if (tenths(next.hours) !== tenths(row.hours)) patch.hours = next.hours ?? null;
  if ((next.notes ?? null) !== (row.notes ?? null)) patch.notes = next.notes ?? null;
  return patch;
}

/** Oldest first, by the typed date (plain string order), then when it was logged. */
export function compareSessions(a: ClassSessionRow, b: ClassSessionRow): number {
  if (a.session_date !== b.session_date) return a.session_date < b.session_date ? -1 : 1;
  return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0;
}

/** Sessions grouped by class, each list oldest first. */
export function sessionsByTracker(sessions: readonly ClassSessionRow[]): Map<string, ClassSessionRow[]> {
  const map = new Map<string, ClassSessionRow[]>();
  for (const s of [...sessions].sort(compareSessions)) {
    const list = map.get(s.tracker_id);
    if (list) list.push(s);
    else map.set(s.tracker_id, [s]);
  }
  return map;
}

// ---------------------------------------------------------------------------------------------
// Proof
// ---------------------------------------------------------------------------------------------

export interface ProofFormValues {
  /** A case_files id from the person's binder, or null. */
  fileId: string | null;
  /** 'yyyy-MM-dd' as typed, or "" */
  sentOn: string;
  sentHow: string;
}

export type ProofFormField = keyof ProofFormValues;
export type ProofFormErrors = Partial<Record<ProofFormField, string>>;

export function proofFormFromRow(row: ClassTrackerRow): ProofFormValues {
  return { fileId: row.proof_file_id ?? null, sentOn: row.proof_sent_on ?? "", sentHow: row.proof_sent_how ?? "" };
}

export function validateProofForm(values: ProofFormValues): ProofFormErrors {
  const errors: ProofFormErrors = {};
  if (values.sentOn.trim() && !checkDate(values.sentOn)) {
    errors.sentOn = "This date doesn't look right. Type it again, or leave it blank.";
  }
  checkLength(errors, "sentHow", values.sentHow, LIMITS.proofSentHow);
  return errors;
}

export function proofPatch(row: ClassTrackerRow, values: ProofFormValues): ClassTrackerPatch {
  const patch: ClassTrackerPatch = {};
  if ((values.fileId ?? null) !== (row.proof_file_id ?? null)) patch.proof_file_id = values.fileId ?? null;
  const sentOn = orNull(values.sentOn);
  if (sentOn !== (row.proof_sent_on ?? null)) patch.proof_sent_on = sentOn;
  const sentHow = orNull(values.sentHow);
  if (sentHow !== (row.proof_sent_how ?? null)) patch.proof_sent_how = sentHow;
  return patch;
}

// ---------------------------------------------------------------------------------------------
// "Add the due date to my calendar"
// ---------------------------------------------------------------------------------------------

export interface DueDateEntryValues {
  /** The calendar title; starts as the class name and the person can change it. */
  title: string;
  /** Filled in only from a California or New York case; otherwise the person chooses. */
  timeZone: TimeZone | "";
}

export type DueDateEntryErrors = Partial<Record<keyof DueDateEntryValues, string>>;

export function dueDateEntryStart(row: Pick<ClassTrackerRow, "class_name">, caseZone: TimeZone | null): DueDateEntryValues {
  return { title: clip(row.class_name.trim(), LIMITS.title), timeZone: caseZone ?? "" };
}

export function validateDueDateEntry(values: DueDateEntryValues): DueDateEntryErrors {
  const errors: DueDateEntryErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Type a title.";
  else if (charCount(title) > LIMITS.title) errors.title = tooLong(LIMITS.title);
  if (!values.timeZone || !isTimeZone(values.timeZone)) errors.timeZone = "Choose a time zone.";
  return errors;
}

/**
 * The calendar entry for a class's due date: kind 'class', the same typed date (never a new
 * one), all day, the default alerts, and where the date came from. confirmed_at is added only
 * after "This matches my papers".
 */
export function dueDateCalendarValues(
  row: Pick<ClassTrackerRow, "due_date" | "due_date_source" | "case_id">,
  values: DueDateEntryValues,
): Omit<CalendarEventInsert, "confirmed_at"> {
  return {
    kind: "class",
    title: values.title.trim(),
    event_date: row.due_date ?? "",
    start_time: null,
    time_zone: values.timeZone as TimeZone,
    case_id: row.case_id ?? null,
    source_note: orNull(row.due_date_source ?? ""),
    alarms: [...DEFAULT_ALARMS],
  };
}

// ---------------------------------------------------------------------------------------------
// Course Hub: "Track this class"
// ---------------------------------------------------------------------------------------------

export interface CourseForTracking {
  id: string;
  title: string;
  provider_name: string | null;
  provider_url: string | null;
  lms_launch_url: string | null;
}

/**
 * The only things copied from a Course Hub listing: the class name, the provider's name, an
 * https link to the class (or the provider) and the listing id. Never hours, dates or
 * requirements: the course's own length is the provider's, not the order's.
 */
export function trackerFromCourse(course: CourseForTracking): ClassTrackerInsert {
  return {
    class_name: clip(course.title.trim(), LIMITS.className) || "Class",
    provider_name: orNull(clip((course.provider_name ?? "").trim(), LIMITS.providerName)),
    provider_url: safeProviderUrl(course.lms_launch_url) ?? safeProviderUrl(course.provider_url),
    course_id: course.id,
  };
}

// ---------------------------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------------------------

export const statusLabel = (status: string | null | undefined) =>
  labelFor(STATUSES, isClassStatus(status) ? status : "not_started");

export const orderedByLabel = (value: string | null | undefined) => (isOrderedBy(value) ? labelFor(ORDERED_BY, value) : "");

/** "Thursday, October 15, 2026", or "" for no date. */
export const longDate = (value: string | null | undefined) => (value ? formatLongDate(value) : "");
