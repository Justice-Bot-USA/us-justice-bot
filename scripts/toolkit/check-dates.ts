// Date checks for the Toolkit (engineering review important #11, item 3; spec v2 §0.3).
//
// Dates the person types are 'yyyy-MM-dd' strings. `new Date('yyyy-MM-dd')` reads them as UTC
// midnight, which shows the day before in California and New York, so the Toolkit never does it.
// This check:
// 1. runs once, in the parent process: a source gate that fails on new Date('yyyy-...') or
//    new Date(<something named like a date>) in the Toolkit folders, and on status words or
//    progress bars next to typed dates and hours in the calendar and class tracker;
// 2. re-runs itself under four device time zones (TZ=America/Los_Angeles, America/New_York,
//    Pacific/Kiritimati, Pacific/Pago_Pago) and checks that every day from 2024 through 2030
//    round-trips through the date helpers with the right weekday, and that "today" and the
//    upcoming/past split use the entry's own time zone, never the device's.
//
// Run with `npm run check:toolkit` (or `node scripts/toolkit/run-checks.mjs dates`).

import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COURT_TIME_ZONES,
  formatLongDate,
  formatShortDate,
  formatTime12,
  isCourtTimeZone,
  isValidDateString,
  nextDateString,
  parseDateString,
  parseTimeString,
  timeZoneShortLabel,
  todayInZone,
  weekdayName,
} from "@/lib/calendar/dates";
import { formatPlanDate } from "@/lib/toolkit/access";
import { needsReadBack, normalizeTime } from "@/lib/toolkit/api";
import type { CalendarEventRow } from "@/lib/toolkit/types";
import { splitUpcomingPast } from "@/components/toolkit/calendar/calendarModel";
import { dueDateNeedsReadBack, longDate } from "@/components/toolkit/classes/classModel";
import { createHarness, repoRoot, run } from "./harness";

const DEVICE_ZONES = ["America/Los_Angeles", "America/New_York", "Pacific/Kiritimati", "Pacific/Pago_Pago"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ---------------------------------------------------------------------------------------------
// 1. Source gate (parent only)
// ---------------------------------------------------------------------------------------------

/** Folders and files where typed dates are handled. */
const DATE_GATE_PATHS = [
  "src/pages/toolkit",
  "src/components/toolkit",
  "src/lib/toolkit",
  "src/lib/calendar",
  "src/lib/binder",
  "src/pages/account",
  "src/pages/CourseHub.tsx",
  "src/pages/CertificateVerify.tsx",
];

/** Where typed court dates and ordered hours are shown: no status words, counts or progress bars. */
const STATUS_GATE_PATHS = [
  "src/components/toolkit/calendar",
  "src/components/toolkit/classes",
  "src/pages/toolkit/CalendarPage.tsx",
  "src/pages/toolkit/ClassesPage.tsx",
  "src/pages/toolkit/ToolkitHub.tsx",
  "src/components/toolkit/DateReadBack.tsx",
];

/** new Date('2026-10-15') and friends: a date-only string literal. */
const LITERAL_DATE_RE = /new Date\(\s*["'`]\d{4}-\d{2}-\d{2}["'`]\s*\)/;
/** new Date(x.event_date), new Date(dueDate), Date.parse(row.due_date)...: one plain argument named like a date. */
const NAMED_DATE_RE = /(?:new Date|Date\.parse)\(\s*([\w$.?[\]'"]+)\s*\)/g;
const DATE_NAME_RE = /date|_on$|deadline|due/i;
/**
 * Columns whose names contain "date" but hold full timestamps (timestamptz), so parsing them is
 * right: subscriptions.start_date and subscriptions.end_date. Typed Toolkit dates (event_date,
 * due_date, document_date, session_date, proof_sent_on, completion_date) are never on this list.
 */
const TIMESTAMP_NAME_RE = /(^|\.)(start_date|end_date)$/;
const STATUS_WORD_RE = /\b(overdue|missed|past due|days left|hours left|hours remaining|days remaining|on track|behind schedule|days ago|in \d+ days)\b/i;
const STATUS_IMPORT_RE = /@\/components\/ui\/progress|\b(daysBetween|relativeDayLabel)\(/;

function listFiles(rel: string): string[] {
  const abs = path.join(repoRoot(), rel);
  const st = statSync(abs, { throwIfNoEntry: false });
  if (!st) return [];
  if (st.isFile()) return /\.(ts|tsx)$/.test(rel) ? [rel] : [];
  return readdirSync(abs).flatMap((name) => listFiles(path.join(rel, name)));
}

/** Lines of code, without whole-line comments (doc comments explain the rule and may quote it). */
function codeLines(rel: string): { n: number; text: string }[] {
  return readFileSync(path.join(repoRoot(), rel), "utf8")
    .split("\n")
    .map((text, i) => ({ n: i + 1, text }))
    .filter(({ text }) => !/^\s*(\/\/|\/\*|\*)/.test(text));
}

function dateGateHits(line: string): string[] {
  const hits: string[] = [];
  if (LITERAL_DATE_RE.test(line)) hits.push("date-only string passed to new Date");
  for (const m of line.matchAll(NAMED_DATE_RE)) {
    const arg = m[1];
    if (DATE_NAME_RE.test(arg) && !TIMESTAMP_NAME_RE.test(arg) && !/^Date\.(UTC|now)$/.test(arg)) hits.push(`${m[0]}: a typed date passed to the Date parser`);
  }
  return hits;
}

function sourceGate() {
  const t = createHarness("check-dates (source gate)");

  // The patterns themselves.
  for (const bad of [`new Date('2026-10-15')`, "new Date(row.event_date)", "new Date(dueDate)", "Date.parse(tracker.due_date)", "new Date(proof_sent_on)", 'new Date("2026-10-15")']) {
    t.ok(dateGateHits(bad).length > 0, `gate catches ${bad}`);
  }
  for (const fine of ["new Date()", "new Date(ms)", "new Date(Date.UTC(y, m - 1, d))", "new Date(cert.audit_timestamp)", "new Date(Number(bare[1]), 0, 1)", "new Date(row.created_at)", "Date.parse(latest.end_date)"]) {
    t.ok(dateGateHits(fine).length === 0, `gate allows ${fine}`);
  }
  t.ok(STATUS_WORD_RE.test("3 hours left") && STATUS_WORD_RE.test("Overdue") && STATUS_WORD_RE.test("in 3 days"), "status gate catches status words");
  t.ok(!STATUS_WORD_RE.test("onTracked") && !STATUS_WORD_RE.test("wasDismissed") && !STATUS_WORD_RE.test("Past"), "status gate allows onTracked, wasDismissed and Past");

  const dateFiles = DATE_GATE_PATHS.flatMap(listFiles);
  t.ok(dateFiles.length > 20, `date gate scans the Toolkit folders (${dateFiles.length} files)`);
  const dateHits: string[] = [];
  for (const rel of dateFiles) {
    for (const { n, text } of codeLines(rel)) for (const hit of dateGateHits(text)) dateHits.push(`${rel}:${n} ${hit}`);
  }
  t.ok(dateHits.length === 0, "no typed date goes through new Date() or Date.parse()", dateHits.join("\n       "));

  const statusFiles = STATUS_GATE_PATHS.flatMap(listFiles);
  t.ok(statusFiles.length > 10, `status gate scans the calendar and class tracker (${statusFiles.length} files)`);
  const statusHits: string[] = [];
  for (const rel of statusFiles) {
    for (const { n, text } of codeLines(rel)) {
      if (STATUS_WORD_RE.test(text) || STATUS_IMPORT_RE.test(text)) statusHits.push(`${rel}:${n} ${text.trim().slice(0, 100)}`);
    }
  }
  t.ok(statusHits.length === 0, "no overdue/missed/hours-left wording, day counts or progress bars next to typed dates and hours", statusHits.join("\n       "));
  return t;
}

// ---------------------------------------------------------------------------------------------
// 2. Date helpers (each device time zone)
// ---------------------------------------------------------------------------------------------

const pad = (n: number) => String(n).padStart(2, "0");

function row(o: Partial<CalendarEventRow>): CalendarEventRow {
  const now = "2026-10-01T00:00:00.000Z";
  return {
    id: "r",
    user_id: "u",
    case_id: null,
    kind: "hearing",
    title: "T",
    event_date: "2026-10-13",
    start_time: null,
    time_zone: "America/Los_Angeles",
    court_or_place: null,
    room: null,
    address: null,
    notes: null,
    source_note: null,
    alarms: [10080, 2880],
    confirmed_at: now,
    ics_sequence: 0,
    created_at: now,
    updated_at: now,
    ...o,
  } as CalendarEventRow;
}

function helperChecks(zone: string) {
  const t = createHarness(`check-dates (TZ=${zone})`);
  t.eq(Intl.DateTimeFormat().resolvedOptions().timeZone, zone, "device time zone is set for this run");

  // Every day from 2024-01-01 through 2030-12-31.
  let days = 0;
  const bad: string[] = [];
  const laWeekday = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "long" });
  for (let ms = Date.UTC(2024, 0, 1); ms <= Date.UTC(2030, 11, 31); ms += 86_400_000) {
    days++;
    const d = new Date(ms);
    const [y, m, day] = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
    const s = `${y}-${pad(m)}-${pad(day)}`;
    const next = new Date(ms + 86_400_000);
    const nextS = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
    const weekday = WEEKDAYS[d.getUTCDay()];
    const p = parseDateString(s);
    if (!p || p.year !== y || p.month !== m || p.day !== day) bad.push(`${s} parse`);
    if (weekdayName(s) !== weekday) bad.push(`${s} weekday ${weekdayName(s)}`);
    // Independent cross-check: the same calendar day in California, at 4 or 5 AM local time.
    if (laWeekday.format(new Date(ms + 12 * 3_600_000)) !== weekday) bad.push(`${s} Intl weekday`);
    if (formatLongDate(s) !== `${weekday}, ${MONTHS[m - 1]} ${day}, ${y}`) bad.push(`${s} long ${formatLongDate(s)}`);
    if (formatShortDate(s) !== `${MONTHS[m - 1].slice(0, 3)} ${day}, ${y}`) bad.push(`${s} short`);
    if (nextDateString(s) !== nextS) bad.push(`${s} next ${nextDateString(s)}`);
    if (longDate(s) !== formatLongDate(s)) bad.push(`${s} class tracker longDate`);
    if (formatPlanDate(s) !== `${MONTHS[m - 1]} ${day}, ${y}`) bad.push(`${s} plan date ${formatPlanDate(s)}`);
  }
  t.ok(days === 2557 && bad.length === 0, `every day 2024-2030 round-trips (${days} days): parse, weekday, long and short text, next day, plan date`, bad.slice(0, 5));
  t.eq(weekdayName("2026-10-15"), "Thursday", "weekdayName('2026-10-15') is Thursday");
  t.eq(formatLongDate("2026-11-01"), "Sunday, November 1, 2026", "the November 2026 clock-change day keeps its date");
  t.eq(formatLongDate("2026-03-08"), "Sunday, March 8, 2026", "the March 2026 clock-change day keeps its date");

  // Not real dates: refused, never "fixed".
  for (const s of ["2026-02-29", "2026-02-30", "2026-13-01", "2026-00-10", "2026-04-31", "1899-12-31", "2201-01-01", "2026-1-05", "10/15/2026", "2026-10-15T00:00", ""]) {
    t.ok(!isValidDateString(s) && parseDateString(s) === null, `refuses "${s}"`);
  }
  t.ok(isValidDateString("2028-02-29") && isValidDateString("2000-02-29") && !isValidDateString("2100-02-29"), "leap years: 2028 and 2000 yes, 2100 no");
  t.eq(formatLongDate("2026-02-30"), "2026-02-30", "an impossible date is shown as typed, not moved to another day");
  t.eq(nextDateString("2026-12-31"), "2027-01-01", "next day after New Year's Eve");
  t.eq(nextDateString("2028-02-28"), "2028-02-29", "next day in a leap February");

  // Times as typed.
  t.eq(parseTimeString("08:30:00"), { hour: 8, minute: 30 }, "time from Postgres (HH:mm:ss)");
  for (const s of ["24:00", "8:30", "12:60", "noon", ""]) t.ok(parseTimeString(s) === null, `refuses time "${s}"`);
  t.eq(["00:05", "08:00", "12:00", "12:30", "23:59"].map(formatTime12), ["12:05 AM", "8:00 AM", "12:00 PM", "12:30 PM", "11:59 PM"], "12-hour times");
  t.eq([normalizeTime("08:30:00"), normalizeTime(""), normalizeTime(null)], ["08:30", null, null], "normalizeTime");

  // Time zones.
  t.ok(COURT_TIME_ZONES.every((z) => isCourtTimeZone(z.value) && timeZoneShortLabel(z.value).endsWith("time")), "7 calendar zones with labels");
  t.ok(!isCourtTimeZone("Europe/Paris") && !isCourtTimeZone("UTC") && !isCourtTimeZone("Pacific/Kiritimati"), "zones outside the list are refused");

  // "Today" belongs to the entry's zone, never the device's.
  const instant = new Date("2026-10-14T06:30:00Z");
  t.eq(
    COURT_TIME_ZONES.map((z) => todayInZone(z.value, instant)),
    ["2026-10-13", "2026-10-14", "2026-10-14", "2026-10-14", "2026-10-13", "2026-10-13", "2026-10-13"],
    "todayInZone at 06:30 UTC: LA, NY, Chicago, Denver, Phoenix, Anchorage, Honolulu",
  );
  const split = splitUpcomingPast(
    [
      row({ id: "la", time_zone: "America/Los_Angeles" }),
      row({ id: "ny", time_zone: "America/New_York" }),
      row({ id: "hi", time_zone: "Pacific/Honolulu" }),
      row({ id: "old", event_date: "2026-10-01" }),
      row({ id: "older", event_date: "2026-09-01" }),
      row({ id: "fut2", event_date: "2026-12-01", start_time: "09:00:00" }),
      row({ id: "fut1", event_date: "2026-12-01" }),
    ],
    instant,
  );
  t.eq(split.upcoming.map((r) => r.id), ["la", "hi", "fut1", "fut2"], "upcoming: an entry dated today in its own zone stays upcoming all day");
  t.eq(split.past.map((r) => r.id), ["ny", "old", "older"], "past: most recent first");

  // Any change to the date, time or zone needs the read-back again.
  const base = row({ start_time: "08:30:00" });
  t.ok(needsReadBack(base, { event_date: "2026-10-14" }) && needsReadBack(base, { start_time: "09:00" }) && needsReadBack(base, { time_zone: "America/New_York" }), "date, time or zone change needs the read-back");
  t.ok(!needsReadBack(base, { start_time: "08:30" }) && !needsReadBack(base, { title: "New title" }) && !needsReadBack(base, {}), "same time or other fields don't");
  t.ok(dueDateNeedsReadBack(null, { dueDate: "2026-11-02" }) && dueDateNeedsReadBack({ due_date: "2026-11-02" }, { dueDate: "2026-11-03" }), "class due date: new or changed needs the read-back");
  t.ok(!dueDateNeedsReadBack({ due_date: "2026-11-02" }, { dueDate: "2026-11-02" }) && !dueDateNeedsReadBack({ due_date: "2026-11-02" }, { dueDate: "" }), "class due date: unchanged or cleared doesn't");
  return t;
}

async function main() {
  if (process.env.TOOLKIT_DATES_CHILD) {
    helperChecks(process.env.TZ ?? "").finish();
  }
  const gate = sourceGate();
  let childFailed = false;
  const self = fileURLToPath(import.meta.url);
  for (const zone of DEVICE_ZONES) {
    const child = spawnSync(process.execPath, [...process.execArgv, self], {
      stdio: "inherit",
      env: { ...process.env, TZ: zone, TOOLKIT_DATES_CHILD: "1" },
    });
    if (child.status !== 0) childFailed = true;
  }
  gate.ok(!childFailed, "date helpers pass under every device time zone");
  gate.finish();
}

run("check-dates", main);
