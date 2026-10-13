// Plain-string date helpers for the hearing calendar and class tracker.
//
// Dates are stored and handled as 'yyyy-MM-dd' strings and times as 'HH:mm' strings, exactly as
// the person typed them from their court papers. Never pass them to `new Date('yyyy-MM-dd')`:
// that parses as UTC midnight and shows the day before in California and New York. Everything
// here works on the numbers directly, and nothing here computes a legal deadline.

// The calendar is organizing software, so it accepts any US time zone; legal content elsewhere on
// the site stays California and New York only.
export type CourtTimeZone =
  | "America/Los_Angeles"
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Phoenix"
  | "America/Anchorage"
  | "Pacific/Honolulu";

export const COURT_TIME_ZONES: { value: CourtTimeZone; label: string; state?: "CA" | "NY" }[] = [
  { value: "America/Los_Angeles", label: "Pacific time (California)", state: "CA" },
  { value: "America/New_York", label: "Eastern time (New York)", state: "NY" },
  { value: "America/Chicago", label: "Central time" },
  { value: "America/Denver", label: "Mountain time" },
  { value: "America/Phoenix", label: "Arizona time (no daylight saving)" },
  { value: "America/Anchorage", label: "Alaska time" },
  { value: "Pacific/Honolulu", label: "Hawaii time" },
];

export function isCourtTimeZone(value: string): value is CourtTimeZone {
  return COURT_TIME_ZONES.some((z) => z.value === value);
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Parses a 'yyyy-MM-dd' string into numbers, or null if it is not a real calendar date. */
export function parseDateString(value: string | null | undefined): DateParts | null {
  if (!value) return null;
  const m = DATE_RE.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1900 || year > 2200 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function isValidDateString(value: string | null | undefined): boolean {
  return parseDateString(value) !== null;
}

/** Parses an 'HH:mm' (24-hour) string, or returns null. Accepts 'HH:mm:ss' from Postgres time columns. */
export function parseTimeString(value: string | null | undefined): { hour: number; minute: number } | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 5);
  const m = TIME_RE.exec(trimmed);
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

export function isValidTimeString(value: string | null | undefined): boolean {
  return parseTimeString(value) !== null;
}

/** Day of the week for a date string, worked out on the calendar date itself (no time zone involved). */
export function weekdayName(value: string): string {
  const p = parseDateString(value);
  if (!p) return "";
  return WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
}

/** "Thursday, October 15, 2026" */
export function formatLongDate(value: string): string {
  const p = parseDateString(value);
  if (!p) return value;
  return `${weekdayName(value)}, ${MONTHS[p.month - 1]} ${p.day}, ${p.year}`;
}

/** "Oct 15, 2026" */
export function formatShortDate(value: string): string {
  const p = parseDateString(value);
  if (!p) return value;
  return `${MONTHS[p.month - 1].slice(0, 3)} ${p.day}, ${p.year}`;
}

/** "8:30 AM" */
export function formatTime12(value: string | null | undefined): string {
  const t = parseTimeString(value);
  if (!t) return "";
  const suffix = t.hour < 12 ? "AM" : "PM";
  const hour12 = t.hour % 12 === 0 ? 12 : t.hour % 12;
  return `${hour12}:${String(t.minute).padStart(2, "0")} ${suffix}`;
}

export function timeZoneShortLabel(zone: string): string {
  const labels: Record<string, string> = {
    "America/Los_Angeles": "Pacific time",
    "America/New_York": "Eastern time",
    "America/Chicago": "Central time",
    "America/Denver": "Mountain time",
    "America/Phoenix": "Arizona time",
    "America/Anchorage": "Alaska time",
    "Pacific/Honolulu": "Hawaii time",
  };
  return labels[zone] ?? zone;
}

/** Today's date as 'yyyy-MM-dd' in the given time zone. `now` is injectable for tests. */
export function todayInZone(zone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find((x) => x.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Whole days from `from` to `to` (both 'yyyy-MM-dd'); negative if `to` is earlier.
 * Do not show the result next to a date the person typed: the Toolkit never counts days to or
 * from a court date (spec v2 §0.3; past entries say only "Past").
 */
export function daysBetween(from: string, to: string): number | null {
  const a = parseDateString(from);
  const b = parseDateString(to);
  if (!a || !b) return null;
  const ms = Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day);
  return Math.round(ms / 86_400_000);
}

/** The next calendar date after a 'yyyy-MM-dd' string (for all-day DTEND). */
export function nextDateString(value: string): string {
  const p = parseDateString(value);
  if (!p) return value;
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day + 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/**
 * "in 3 days", "tomorrow", "today", "yesterday", "5 days ago".
 * Not used by the Toolkit pages, and must not be: relative labels against typed court dates are
 * not allowed (spec v2 §0.3).
 */
export function relativeDayLabel(value: string, today: string): string {
  const n = daysBetween(today, value);
  if (n === null) return "";
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n === -1) return "yesterday";
  return n > 0 ? `in ${n} days` : `${-n} days ago`;
}
