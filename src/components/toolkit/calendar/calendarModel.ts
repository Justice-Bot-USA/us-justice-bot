// Pure helpers for the hearing calendar page: form values, checks on what was typed, the patch
// for an edit, the upcoming/past split and the mapping to the .ics builder.
//
// Rules (spec v2 §0.3): dates and times stay the 'yyyy-MM-dd' and 'HH:mm' strings the person
// typed. Nothing here works out, suggests, prefills, checks or compares a court date. The single
// comparison with today only decides which list an entry appears in (upcoming or "Past").

import { type IcsEvent } from "@/lib/calendar/ics";
import {
  formatLongDate,
  formatTime12,
  isValidDateString,
  isValidTimeString,
  timeZoneShortLabel,
  todayInZone,
} from "@/lib/calendar/dates";
import { normalizeTime } from "@/lib/toolkit/api";
import {
  ALARM_VALUES,
  DEFAULT_ALARMS,
  LIMITS,
  isAlarm,
  isTimeZone,
  type AlarmMinutes,
  type CalendarEventInsert,
  type CalendarEventPatch,
  type CalendarEventRow,
  type Kind,
  type TimeZone,
} from "@/lib/toolkit/types";

// ---------------------------------------------------------------------------------------------
// Form values
// ---------------------------------------------------------------------------------------------

export interface EventFormValues {
  caseId: string | null;
  kind: Kind;
  title: string;
  /** 'yyyy-MM-dd' from the date input, or "" */
  date: string;
  /** 'HH:mm' from the time input, or "" for no time */
  time: string;
  /** "" until the person picks one (or the case's state gives one) */
  timeZone: TimeZone | "";
  /** True while timeZone came from the linked case's state and the person has not changed it. */
  zoneFromCase: boolean;
  place: string;
  room: string;
  address: string;
  sourceNote: string;
  notes: string;
  alarms: AlarmMinutes[];
}

export type EventFormField = Exclude<keyof EventFormValues, "zoneFromCase">;
export type EventFormErrors = Partial<Record<EventFormField, string>>;

/** Order used to move focus to the first problem. */
export const FORM_FIELD_ORDER: EventFormField[] = [
  "caseId",
  "kind",
  "title",
  "date",
  "time",
  "timeZone",
  "place",
  "room",
  "address",
  "sourceNote",
  "notes",
  "alarms",
];

/** A blank form. The time zone is only filled in from a case's state (CA or NY); otherwise it is asked. */
export function emptyEventForm(caseDefaultZone: TimeZone | null = null): EventFormValues {
  return {
    caseId: null,
    kind: "hearing",
    title: "",
    date: "",
    time: "",
    timeZone: caseDefaultZone ?? "",
    zoneFromCase: Boolean(caseDefaultZone),
    place: "",
    room: "",
    address: "",
    sourceNote: "",
    notes: "",
    alarms: [...DEFAULT_ALARMS],
  };
}

/** The saved entry, for the edit form. */
export function eventFormFromRow(row: CalendarEventRow): EventFormValues {
  return {
    caseId: row.case_id ?? null,
    kind: row.kind,
    title: row.title,
    date: row.event_date,
    time: normalizeTime(row.start_time) ?? "",
    timeZone: isTimeZone(row.time_zone) ? row.time_zone : "",
    zoneFromCase: false,
    place: row.court_or_place ?? "",
    room: row.room ?? "",
    address: row.address ?? "",
    sourceNote: row.source_note ?? "",
    notes: row.notes ?? "",
    alarms: sortAlarms(row.alarms ?? []),
  };
}

/**
 * When the linked case changes on a new entry: take the new case's time zone only if the zone was
 * empty or came from the previous case. A zone the person chose is never replaced.
 */
export function applyCaseChange(
  values: EventFormValues,
  caseId: string | null,
  caseDefaultZone: TimeZone | null,
  mode: "add" | "edit",
): EventFormValues {
  const next = { ...values, caseId };
  if (mode === "add" && (values.zoneFromCase || values.timeZone === "")) {
    next.timeZone = caseDefaultZone ?? "";
    next.zoneFromCase = Boolean(caseDefaultZone);
  }
  return next;
}

export function sortAlarms(alarms: readonly number[]): AlarmMinutes[] {
  const set = new Set(alarms.filter(isAlarm));
  return ALARM_VALUES.filter((a) => set.has(a));
}

// ---------------------------------------------------------------------------------------------
// Checks on what was typed (format and length only; never whether a date is "right")
// ---------------------------------------------------------------------------------------------

/** Characters as Postgres char_length counts them. */
function charCount(value: string): number {
  return [...value].length;
}

const TEXT_LIMITS: { field: EventFormField; max: number }[] = [
  { field: "place", max: LIMITS.courtOrPlace },
  { field: "room", max: LIMITS.room },
  { field: "address", max: LIMITS.address },
  { field: "sourceNote", max: LIMITS.sourceNote },
  { field: "notes", max: LIMITS.eventNotes },
];

export function validateEventForm(values: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Type a title.";
  else if (charCount(title) > LIMITS.title) errors.title = `Use ${LIMITS.title} characters or fewer.`;

  const date = values.date.trim();
  if (!date) errors.date = "Type the date from your papers.";
  else if (!isValidDateString(date) || date < LIMITS.minDate || date > LIMITS.maxDate) {
    errors.date = "This date doesn't look right. Type it again from your papers.";
  }

  const time = values.time.trim();
  if (time && !isValidTimeString(time)) errors.time = "This time doesn't look right. Type it again, or leave it blank.";

  if (!values.timeZone || !isTimeZone(values.timeZone)) errors.timeZone = "Choose a time zone.";

  for (const { field, max } of TEXT_LIMITS) {
    const v = String(values[field] ?? "").trim();
    if (charCount(v) > max) errors[field] = `Use ${max} characters or fewer.`;
  }
  return errors;
}

export function firstErrorField(errors: EventFormErrors): EventFormField | null {
  return FORM_FIELD_ORDER.find((f) => errors[f]) ?? null;
}

// ---------------------------------------------------------------------------------------------
// Values to write
// ---------------------------------------------------------------------------------------------

export type EventWriteValues = Omit<CalendarEventInsert, "confirmed_at">;

const orNull = (v: string): string | null => {
  const t = v.trim();
  return t ? t : null;
};

/** Trimmed values for an insert (confirmed_at is added only after "This matches my papers"). */
export function eventWriteValues(values: EventFormValues): EventWriteValues {
  return {
    case_id: values.caseId,
    kind: values.kind,
    title: values.title.trim(),
    event_date: values.date.trim(),
    start_time: normalizeTime(values.time),
    time_zone: values.timeZone as TimeZone,
    court_or_place: orNull(values.place),
    room: orNull(values.room),
    address: orNull(values.address),
    source_note: orNull(values.sourceNote),
    notes: orNull(values.notes),
    alarms: sortAlarms(values.alarms),
  };
}

/** Only the columns the person changed. Empty when nothing changed. */
export function eventPatch(row: CalendarEventRow, values: EventFormValues): CalendarEventPatch {
  const next = eventWriteValues(values);
  const patch: CalendarEventPatch = {};
  if ((next.case_id ?? null) !== (row.case_id ?? null)) patch.case_id = next.case_id ?? null;
  if (next.kind !== row.kind) patch.kind = next.kind;
  if (next.title !== row.title) patch.title = next.title;
  if (next.event_date !== row.event_date) patch.event_date = next.event_date;
  if ((next.start_time ?? null) !== normalizeTime(row.start_time)) patch.start_time = next.start_time ?? null;
  if (next.time_zone !== row.time_zone) patch.time_zone = next.time_zone;
  if ((next.court_or_place ?? null) !== (row.court_or_place ?? null)) patch.court_or_place = next.court_or_place ?? null;
  if ((next.room ?? null) !== (row.room ?? null)) patch.room = next.room ?? null;
  if ((next.address ?? null) !== (row.address ?? null)) patch.address = next.address ?? null;
  if ((next.source_note ?? null) !== (row.source_note ?? null)) patch.source_note = next.source_note ?? null;
  if ((next.notes ?? null) !== (row.notes ?? null)) patch.notes = next.notes ?? null;
  const nextAlarms = sortAlarms(next.alarms ?? []);
  if (nextAlarms.join(",") !== sortAlarms(row.alarms ?? []).join(",")) patch.alarms = nextAlarms;
  return patch;
}

// ---------------------------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------------------------

/** Soonest first; all-day entries before timed ones on the same date. Plain string order. */
export function compareEvents(a: CalendarEventRow, b: CalendarEventRow): number {
  if (a.event_date !== b.event_date) return a.event_date < b.event_date ? -1 : 1;
  const at = normalizeTime(a.start_time) ?? "";
  const bt = normalizeTime(b.start_time) ?? "";
  if (at !== bt) return at < bt ? -1 : 1;
  return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0;
}

function safeToday(zone: string, now: Date): string {
  try {
    return todayInZone(zone, now);
  } catch {
    return todayInZone(Intl.DateTimeFormat().resolvedOptions().timeZone, now);
  }
}

/**
 * Upcoming (today and later in the entry's own time zone, soonest first) and past (most recent
 * first). An entry dated today stays in Upcoming all day.
 */
export function splitUpcomingPast(
  rows: readonly CalendarEventRow[],
  now: Date = new Date(),
): { upcoming: CalendarEventRow[]; past: CalendarEventRow[] } {
  const todayByZone = new Map<string, string>();
  const today = (zone: string) => {
    let t = todayByZone.get(zone);
    if (t === undefined) {
      t = safeToday(zone, now);
      todayByZone.set(zone, t);
    }
    return t;
  };
  const sorted = [...rows].sort(compareEvents);
  const upcoming = sorted.filter((r) => r.event_date >= today(r.time_zone));
  const past = sorted.filter((r) => r.event_date < today(r.time_zone)).reverse();
  return { upcoming, past };
}

/** "8:30 AM Pacific time", or "No time (all day)". Same words as the read-back. */
export function timeText(row: Pick<CalendarEventRow, "start_time" | "time_zone">): string {
  const t = normalizeTime(row.start_time);
  if (!t) return "No time (all day)";
  return `${formatTime12(t)} ${timeZoneShortLabel(row.time_zone)}`;
}

/** "Thursday, October 15, 2026" */
export function dateText(row: Pick<CalendarEventRow, "event_date">): string {
  return formatLongDate(row.event_date);
}

/** Room, place and address, in the order the read-back shows them. */
export function placeLines(row: Pick<CalendarEventRow, "room" | "court_or_place" | "address">): string[] {
  return [row.room, row.court_or_place, row.address].map((v) => (v ?? "").trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------------------------
// Calendar file
// ---------------------------------------------------------------------------------------------

/**
 * One entry for buildIcs: the typed title, date, time and zone, the place as LOCATION, the
 * person's notes as DESCRIPTION, their alerts, and ics_sequence so a re-import can replace the old
 * event. The case title, source note and case details are never included.
 */
export function toIcsEvent(row: CalendarEventRow): IcsEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.event_date,
    time: normalizeTime(row.start_time),
    timeZone: row.time_zone,
    location: placeLines(row).join(", ") || null,
    description: (row.notes ?? "").trim() || null,
    alarms: sortAlarms(row.alarms ?? []),
    sequence: row.ics_sequence ?? 0,
  };
}

/** Entries that can go in a calendar file (a known time zone and a real date). */
export function exportableEvents(rows: readonly CalendarEventRow[]): IcsEvent[] {
  return rows.filter((r) => isTimeZone(r.time_zone) && isValidDateString(r.event_date)).map(toIcsEvent);
}

/** File name for "Download all upcoming dates". Neutral on purpose: no titles and no dates. */
export const ALL_DATES_FILE_NAME = "my-dates.ics";
