// Structural checks for the hearing calendar's .ics files (src/lib/calendar/ics.ts), per the
// engineering review (important #11, item 2) and RFC 5545:
// - CRLF line endings only, at most 75 octets per physical line, folds never split a character;
// - after unfolding: balanced components, every TZID used has a VTIMEZONE, every VEVENT has UID,
//   DTSTAMP and DTSTART, every TRIGGER is a plain relative duration;
// - TEXT escaping round-trips for backslash, semicolon, comma and newlines;
// - dates go in exactly as typed (no shifting), including the 2026 DST change days, and all-day
//   DTEND is the next calendar day (2026-12-31 -> 20270101, 2028-02-28 -> 20280229);
// - the static VTIMEZONE rules give the same UTC offset as the time zone database for 2024-2030;
// - "Leave court details out" leaves the title, place and notes out of the file;
// - the alert and time zone lists match the database CHECK constraints in the Toolkit migration.
//
// Run with `npm run check:toolkit` (or `node scripts/toolkit/run-checks.mjs ics`).

import { readFileSync } from "node:fs";
import path from "node:path";
import { ALARM_CHOICES, MORNING_OF, alarmTrigger, buildIcs, escapeIcsText, foldIcsLine, icsFileName, type IcsEvent } from "@/lib/calendar/ics";
import { COURT_TIME_ZONES, type CourtTimeZone, nextDateString } from "@/lib/calendar/dates";
import { ALARM_VALUES, DEFAULT_ALARMS, TIME_ZONE_VALUES } from "@/lib/toolkit/types";
import { createHarness, repoRoot, run } from "./harness";

const t = createHarness("check-ics");
const MIGRATION = "supabase/migrations/20261013120000_toolkit.sql";
const TRIGGER_RE = /^-?P(\d+D)?(T(\d+H)?(\d+M)?)?$/;
const FIXED_NOTE = "Typed by you in Justice Bot USA. Check your court papers: court dates can change.";

// ---------------------------------------------------------------------------------------------
// Small RFC 5545 reader (just enough for what buildIcs writes)
// ---------------------------------------------------------------------------------------------

interface Prop {
  name: string;
  params: Record<string, string>;
  value: string;
}

interface Component {
  type: string;
  props: Prop[];
  children: Component[];
}

const enc = new TextEncoder();

function unfold(text: string): string[] {
  const lines = text.replace(/\r\n[ \t]/g, "").split("\r\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function parseProp(line: string): Prop | null {
  const m = /^([A-Za-z0-9-]+)((?:;[^:;]+=[^:;]*)*):(.*)$/.exec(line);
  if (!m) return null;
  const params: Record<string, string> = {};
  for (const part of m[2].split(";").filter(Boolean)) {
    const at = part.indexOf("=");
    params[part.slice(0, at).toUpperCase()] = part.slice(at + 1);
  }
  return { name: m[1].toUpperCase(), params, value: m[3] };
}

/** Parses unfolded lines into a component tree; returns null (and fails a check) if unbalanced. */
function parseTree(lines: string[], label: string): Component | null {
  const root: Component = { type: "ROOT", props: [], children: [] };
  const stack: Component[] = [root];
  for (const line of lines) {
    const prop = parseProp(line);
    if (!prop) {
      t.ok(false, `${label}: every content line parses (name, params, value)`, line);
      return null;
    }
    const top = stack[stack.length - 1];
    if (prop.name === "BEGIN") {
      const child: Component = { type: prop.value, props: [], children: [] };
      top.children.push(child);
      stack.push(child);
    } else if (prop.name === "END") {
      if (top.type !== prop.value || stack.length === 1) {
        t.ok(false, `${label}: BEGIN/END balanced`, `END:${prop.value} closes ${top.type}`);
        return null;
      }
      stack.pop();
    } else {
      top.props.push(prop);
    }
  }
  t.ok(stack.length === 1, `${label}: every BEGIN has an END`);
  return root;
}

const propsNamed = (c: Component, name: string) => c.props.filter((p) => p.name === name);
const one = (c: Component, name: string) => {
  const list = propsNamed(c, name);
  return list.length === 1 ? list[0] : null;
};
const childrenOf = (c: Component, type: string) => c.children.filter((x) => x.type === type);

/** Unescapes an RFC 5545 TEXT value; null if it holds an unescaped ';' or ',' or a bad escape. */
function unescapeText(value: string): string | null {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "\\") {
      const next = value[++i];
      if (next === "\\" || next === ";" || next === ",") out += next;
      else if (next === "n" || next === "N") out += "\n";
      else return null;
    } else if (ch === ";" || ch === ",") {
      return null;
    } else {
      out += ch;
    }
  }
  return out;
}

/** Minutes of an RFC 5545 duration (D/H/M only); null if it is not one. */
function durationMinutes(value: string): number | null {
  const m = /^(-)?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(value);
  if (!m || value === "P" || value === "-P" || /T$/.test(value)) return null;
  const minutes = Number(m[2] ?? 0) * 1440 + Number(m[3] ?? 0) * 60 + Number(m[4] ?? 0);
  return m[1] ? -minutes : minutes;
}

/** Runs the physical-line rules on a whole file. */
function checkPhysical(text: string, label: string) {
  t.ok(text.endsWith("\r\n"), `${label}: ends with CRLF`);
  const physical = text.split("\r\n");
  physical.pop();
  t.ok(physical.every((l) => !l.includes("\r") && !l.includes("\n")), `${label}: CRLF only (no bare CR or LF)`);
  const tooLong = physical.filter((l) => enc.encode(l).length > 75);
  t.ok(tooLong.length === 0, `${label}: every physical line is at most 75 octets`, tooLong.slice(0, 2));
  const decoder = new TextDecoder("utf-8", { fatal: true });
  t.ok(physical.every((l) => decoder.decode(enc.encode(l)) === l), `${label}: folds never split a character`);
  t.ok(physical.every((l) => l.length > 0), `${label}: no empty lines`);
}

// ---------------------------------------------------------------------------------------------
// Time zone math: the file's VTIMEZONE rules against the time zone database (Intl)
// ---------------------------------------------------------------------------------------------

interface Wall {
  y: number;
  mo: number;
  d: number;
  h: number;
  mi: number;
}
const wallMs = (w: Wall) => Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi);

/** UTC offset in minutes of `zone` at the UTC instant `utcMs`, from the time zone database. */
function intlOffset(zone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return (Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute")) - utcMs) / 60000;
}

/** Offset in minutes for a local wall time, from the time zone database (not near a change). */
function intlOffsetAtWall(zone: string, w: Wall): number {
  const local = wallMs(w);
  let offset = intlOffset(zone, local);
  offset = intlOffset(zone, local - offset * 60000);
  return intlOffset(zone, local - offset * 60000);
}

const parseOffset = (v: string) => {
  const m = /^([+-])(\d{2})(\d{2})$/.exec(v);
  return m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : NaN;
};

/** The nth weekday (0 = Sunday) of a month, as a day number. */
function nthWeekday(year: number, month: number, n: number, weekday: number): number {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
}

interface Observance {
  offsetTo: number;
  onset: (year: number) => number | null;
}

/** Reads a VTIMEZONE's STANDARD/DAYLIGHT parts into onset rules (local wall time, ms). */
function observances(tz: Component): Observance[] {
  const out: Observance[] = [];
  for (const part of tz.children) {
    const start = one(part, "DTSTART")?.value ?? "";
    const sm = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(start);
    const offsetTo = parseOffset(one(part, "TZOFFSETTO")?.value ?? "");
    if (!sm || Number.isNaN(offsetTo)) continue;
    const [sy, smo, sd, sh, smi] = [1, 2, 3, 4, 5].map((i) => Number(sm[i]));
    const rrule = one(part, "RRULE")?.value;
    if (!rrule) {
      out.push({ offsetTo, onset: (year) => (year >= sy ? Date.UTC(sy, smo - 1, sd, sh, smi) : null) });
      continue;
    }
    const rule = Object.fromEntries(rrule.split(";").map((kv) => kv.split("=")));
    const bm = Number(rule.BYMONTH);
    const bd = /^(-?\d)SU$/.exec(rule.BYDAY ?? "");
    if (rule.FREQ !== "YEARLY" || !bm || !bd || Number(bd[1]) < 1) continue;
    out.push({ offsetTo, onset: (year) => (year >= sy ? Date.UTC(year, bm - 1, nthWeekday(year, bm, Number(bd[1]), 0), sh, smi) : null) });
  }
  return out;
}

/** Offset in minutes the file's VTIMEZONE gives for a local wall time. */
function vtimezoneOffset(obs: Observance[], w: Wall): number | null {
  const at = wallMs(w);
  let best: { onset: number; offset: number } | null = null;
  for (const o of obs) {
    for (const year of [w.y - 1, w.y]) {
      const onset = o.onset(year);
      if (onset !== null && onset <= at && (!best || onset > best.onset)) best = { onset, offset: o.offsetTo };
    }
  }
  return best ? best.offset : null;
}

// ---------------------------------------------------------------------------------------------

const NOW = new Date("2026-10-13T17:04:05.678Z");
const STAMP = "20261013T170405Z";

function expectedTriggerMinutes(alarm: number, time: string | null | undefined): number {
  const m = /^(\d{2}):(\d{2})/.exec(time ?? "");
  if (!m) return alarm === MORNING_OF ? 480 : -(Math.max(1, Math.round(alarm / 1440)) * 1440 - 480);
  if (alarm !== MORNING_OF) return -alarm;
  const sinceEight = Number(m[1]) * 60 + Number(m[2]) - 480;
  return -(sinceEight > 0 ? sinceEight : 60);
}

/** Checks one calendar file against the events it was built from. */
function checkFile(text: string, events: IcsEvent[], label: string, opts: { private?: boolean } = {}) {
  checkPhysical(text, label);
  const tree = parseTree(unfold(text), label);
  if (!tree) return;
  t.ok(tree.children.length === 1 && tree.children[0].type === "VCALENDAR", `${label}: one VCALENDAR`);
  const cal = tree.children[0];
  t.eq(one(cal, "VERSION")?.value, "2.0", `${label}: VERSION:2.0`);
  t.ok(/Quorex Solutions\/\/Justice Bot USA/.test(one(cal, "PRODID")?.value ?? ""), `${label}: PRODID names Quorex Solutions and Justice Bot USA`);

  const valid = events.filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && nextDateString(e.date) !== e.date);
  const vevents = childrenOf(cal, "VEVENT");
  t.eq(vevents.length, valid.length, `${label}: one VEVENT per valid entry (invalid dates skipped)`);

  // Time zones: exactly the zones of timed entries, each defined once and each used.
  const tzids = childrenOf(cal, "VTIMEZONE").map((z) => one(z, "TZID")?.value ?? "");
  const usedZones = new Set<string>();
  for (const ev of vevents) {
    const tz = one(ev, "DTSTART")?.params.TZID;
    if (tz) usedZones.add(tz);
  }
  t.ok([...usedZones].every((z) => tzids.includes(z)), `${label}: every TZID used has a VTIMEZONE`, { usedZones: [...usedZones], tzids });
  t.ok(tzids.every((z) => usedZones.has(z)) && new Set(tzids).size === tzids.length, `${label}: each VTIMEZONE is used and defined once`);

  const uids = new Set<string>();
  vevents.forEach((ev, i) => {
    const src = valid[i];
    const tag = `${label} #${i + 1}`;
    const uid = one(ev, "UID")?.value;
    t.eq(uid, `${src.id}@justicebot-usa.com`, `${tag}: UID is the row id`);
    if (uid) uids.add(uid);
    t.eq(one(ev, "DTSTAMP")?.value, STAMP, `${tag}: one DTSTAMP in UTC`);
    t.eq(one(ev, "SEQUENCE")?.value, String(Math.max(0, Math.floor(src.sequence ?? 0))), `${tag}: SEQUENCE carries the edit count`);
    const start = one(ev, "DTSTART");
    t.ok(start !== null, `${tag}: exactly one DTSTART`);
    const compact = src.date.replace(/-/g, "");
    if (src.time) {
      const hhmm = src.time.slice(0, 5).replace(":", "");
      t.eq([start?.params.TZID, start?.value], [src.timeZone, `${compact}T${hhmm}00`], `${tag}: timed DTSTART is the typed date and time in its zone (no shifting)`);
      t.ok(!one(ev, "DTEND"), `${tag}: timed entry uses DURATION, not DTEND`);
      t.eq(durationMinutes(one(ev, "DURATION")?.value ?? ""), src.durationMinutes ?? 60, `${tag}: DURATION`);
    } else {
      t.eq([start?.params.VALUE, start?.value], ["DATE", compact], `${tag}: all-day DTSTART is the typed date`);
      const end = one(ev, "DTEND");
      t.eq([end?.params.VALUE, end?.value], ["DATE", nextDateString(src.date).replace(/-/g, "")], `${tag}: all-day DTEND is the next calendar day`);
      t.ok(!one(ev, "DURATION"), `${tag}: all-day entry has no DURATION`);
    }

    const summary = unescapeText(one(ev, "SUMMARY")?.value ?? "");
    const location = one(ev, "LOCATION");
    const description = unescapeText(one(ev, "DESCRIPTION")?.value ?? "");
    if (opts.private) {
      t.eq(summary, "Appointment", `${tag}: private file says "Appointment"`);
      t.ok(!location, `${tag}: private file has no LOCATION`);
      t.eq(description, FIXED_NOTE, `${tag}: private file has no notes`);
    } else {
      const lf = (v: string) => v.replace(/\r\n|\r/g, "\n");
      t.eq(summary, lf(src.title), `${tag}: SUMMARY round-trips through escaping`);
      if (src.location) t.eq(unescapeText(location?.value ?? ""), lf(src.location), `${tag}: LOCATION round-trips`);
      else t.ok(!location, `${tag}: no LOCATION when none was typed`);
      const notes = src.description ? `${src.description.replace(/\r\n|\r/g, "\n")}\n\n${FIXED_NOTE}` : FIXED_NOTE;
      t.eq(description, notes, `${tag}: DESCRIPTION is the notes plus the fixed reminder line`);
    }

    const alarms = childrenOf(ev, "VALARM");
    const wanted = [...new Set(src.alarms ?? [])].sort((a, b) => b - a);
    t.eq(alarms.length, wanted.length, `${tag}: one VALARM per chosen alert`);
    alarms.forEach((alarm, k) => {
      const trigger = one(alarm, "TRIGGER")?.value ?? "";
      t.eq(one(alarm, "ACTION")?.value, "DISPLAY", `${tag}: VALARM ACTION:DISPLAY`);
      t.ok(one(alarm, "DESCRIPTION") !== null, `${tag}: VALARM has a DESCRIPTION`);
      t.ok(TRIGGER_RE.test(trigger), `${tag}: TRIGGER is a plain relative duration`, trigger);
      t.eq(durationMinutes(trigger), expectedTriggerMinutes(wanted[k], src.time), `${tag}: TRIGGER for ${wanted[k]} minutes`);
      if (opts.private) t.eq(unescapeText(one(alarm, "DESCRIPTION")?.value ?? ""), "Reminder: Appointment", `${tag}: private alert text`);
    });
  });
  t.eq(uids.size, vevents.length, `${label}: UIDs are unique`);
}

async function main() {
  // --- Lists match the database CHECK constraints -------------------------------------------
  const sql = readFileSync(path.join(repoRoot(), MIGRATION), "utf8");
  const zoneCheck = /time_zone text not null\s+check \(time_zone in \(([^)]*)\)\)/.exec(sql)?.[1] ?? "";
  const sqlZones = [...zoneCheck.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  t.eq(sqlZones, COURT_TIME_ZONES.map((z) => z.value), "time zones: dates.ts list equals the case_calendar_events CHECK");
  t.eq([...TIME_ZONE_VALUES], sqlZones, "time zones: toolkit/types list equals the CHECK");
  const alarmCheck = /alarms <@ '\{([\d,]+)\}'::smallint\[\]/.exec(sql)?.[1] ?? "";
  const alarmDefault = /alarms smallint\[\] not null default '\{([\d,]+)\}'/.exec(sql)?.[1] ?? "";
  t.eq(alarmCheck.split(",").map(Number), ALARM_CHOICES.map((a) => a.minutes), "alerts: ALARM_CHOICES equal the alarms CHECK");
  t.eq([...ALARM_VALUES], ALARM_CHOICES.map((a) => a.minutes), "alerts: toolkit/types ALARM_VALUES equal ALARM_CHOICES");
  t.eq(alarmDefault.split(",").map(Number), DEFAULT_ALARMS, "alerts: DEFAULT_ALARMS equal the column default");

  // --- Escaping and folding helpers ---------------------------------------------------------
  const tricky = 'Hearing; Dept. 5, Room "A" \\ back\\slash\nsecond line\r\nthird\rfourth';
  t.eq(unescapeText(escapeIcsText(tricky)), tricky.replace(/\r\n|\r/g, "\n"), "escapeIcsText round-trips \\ ; , and newlines");
  t.ok(!/[\r\n]/.test(escapeIcsText(tricky)), "escapeIcsText leaves no raw newline");
  const longLine = `SUMMARY:${"Audiencia 法院 😀 ".repeat(12)}`;
  const folded = foldIcsLine(longLine);
  t.ok(folded.split("\r\n").every((l) => enc.encode(l).length <= 75), "foldIcsLine: 75 octets per line with multi-byte text");
  t.eq(folded.replace(/\r\n /g, ""), longLine, "foldIcsLine: unfolding restores the line");
  t.ok(folded.split("\r\n").slice(1).every((l) => l.startsWith(" ")), "foldIcsLine: continuation lines start with one space");
  t.eq(foldIcsLine("SHORT:x"), "SHORT:x", "foldIcsLine leaves short lines alone");

  // --- Triggers -------------------------------------------------------------------------------
  for (const { minutes } of ALARM_CHOICES) {
    for (const time of [null, "06:30", "08:00", "08:01", "13:45", "23:59"]) {
      const trig = alarmTrigger(minutes, time);
      t.ok(TRIGGER_RE.test(trig), `alarmTrigger(${minutes}, ${time}) is a plain duration`, trig);
      t.eq(durationMinutes(trig), expectedTriggerMinutes(minutes, time), `alarmTrigger(${minutes}, ${time}) minutes`);
    }
  }

  // --- A full file ---------------------------------------------------------------------------
  const allAlarms = ALARM_CHOICES.map((a) => a.minutes);
  const events: IcsEvent[] = [
    // DST change days, both launch zones, timed (after the change) and all-day.
    { id: "dst-la-spring", title: "Hearing", date: "2026-03-08", time: "09:00", timeZone: "America/Los_Angeles", alarms: allAlarms, sequence: 0 },
    { id: "dst-la-fall", title: "Hearing", date: "2026-11-01", time: "09:00", timeZone: "America/Los_Angeles", alarms: [MORNING_OF], sequence: 2 },
    { id: "dst-ny-spring", title: "Hearing", date: "2026-03-08", time: "09:00", timeZone: "America/New_York", alarms: [1440] },
    { id: "dst-ny-fall", title: "Hearing", date: "2026-11-01", time: "07:15", timeZone: "America/New_York", alarms: [MORNING_OF, 10080] },
    { id: "dst-la-allday", title: "Papers due", date: "2026-03-08", timeZone: "America/Los_Angeles", alarms: allAlarms },
    { id: "dst-ny-allday", title: "Papers due", date: "2026-11-01", timeZone: "America/New_York", alarms: [10080, 2880] },
    // Year and leap-day ends.
    { id: "nye", title: "New Year's Eve", date: "2026-12-31", timeZone: "America/Chicago", alarms: [] },
    { id: "leap-eve", title: "Feb 28", date: "2028-02-28", timeZone: "America/Denver" },
    { id: "leap-day", title: "Leap day", date: "2028-02-29", timeZone: "America/Denver" },
    { id: "no-leap", title: "Not a leap year", date: "2027-02-28", timeZone: "America/Denver" },
    // Every zone, timed; awkward text; edits; a custom length.
    { id: "chi", title: tricky, date: "2027-01-04", time: "13:30", timeZone: "America/Chicago", location: "Room 5, 1 Main St; Floor 2", description: "Bring 3 copies,\nand ID", alarms: [2880, 2880, 10080], sequence: 7 },
    { id: "den", title: "Mediación 法院 😀 ".repeat(6), date: "2027-06-15", time: "00:00", timeZone: "America/Denver", durationMinutes: 90, alarms: [MORNING_OF] },
    { id: "phx", title: "Phoenix", date: "2027-07-01", time: "10:00", timeZone: "America/Phoenix", alarms: [1440], sequence: -3 },
    { id: "akd", title: "Anchorage", date: "2027-12-20", time: "16:00", timeZone: "America/Anchorage" },
    { id: "hnl", title: "Honolulu", date: "2028-01-10", time: "08:00", timeZone: "Pacific/Honolulu", alarms: [MORNING_OF] },
    // Not real dates: skipped, never "fixed".
    { id: "bad-1", title: "Bad", date: "2026-02-30", timeZone: "America/Los_Angeles" },
    { id: "bad-2", title: "Bad", date: "10/15/2026", timeZone: "America/Los_Angeles" },
  ];
  const ics = buildIcs(events, NOW);
  checkFile(ics, events, "file");
  t.ok(ics.includes("DTEND;VALUE=DATE:20270101") && ics.includes("DTEND;VALUE=DATE:20280229") && ics.includes("DTEND;VALUE=DATE:20280301") && ics.includes("DTEND;VALUE=DATE:20270301"),
    "all-day DTEND: 2026-12-31 -> 20270101, 2028-02-28 -> 20280229, 2028-02-29 -> 20280301, 2027-02-28 -> 20270301");
  t.ok(!ics.includes("Bad"), "entries with impossible dates are left out, not changed");

  // --- VTIMEZONE rules agree with the time zone database -----------------------------------
  const allZones = COURT_TIME_ZONES.map((z) => z.value);
  const zoneFile = buildIcs(allZones.map((zone, i) => ({ id: `z${i}`, title: "x", date: "2027-05-05", time: "12:00", timeZone: zone })), NOW);
  const zoneTree = parseTree(unfold(zoneFile), "zones");
  const vtz = new Map<string, Observance[]>();
  for (const z of childrenOf(zoneTree?.children[0] ?? { type: "", props: [], children: [] }, "VTIMEZONE")) {
    vtz.set(one(z, "TZID")?.value ?? "", observances(z));
  }
  t.eq([...vtz.keys()].sort(), [...allZones].sort(), "every calendar time zone has a VTIMEZONE");
  let compared = 0;
  const mismatches: string[] = [];
  for (const zone of allZones) {
    const obs = vtz.get(zone) ?? [];
    for (let y = 2024; y <= 2030; y++) {
      const samples: Wall[] = [];
      for (let mo = 1; mo <= 12; mo++) for (const d of [1, 10, 20]) samples.push({ y, mo, d, h: 12, mi: 0 });
      // Either side of the US change days (never inside the skipped or repeated hour).
      const spring = nthWeekday(y, 3, 2, 0);
      const fall = nthWeekday(y, 11, 1, 0);
      for (const [mo, d] of [[3, spring], [11, fall]]) {
        samples.push({ y, mo, d, h: 0, mi: 30 }, { y, mo, d, h: 4, mi: 0 }, { y, mo, d, h: 9, mi: 0 });
        samples.push({ y, mo, d: d - 1, h: 23, mi: 30 }, { y, mo, d: d + 1, h: 0, mi: 30 });
      }
      for (const w of samples) {
        compared++;
        const fromFile = vtimezoneOffset(obs, w);
        const fromDb = intlOffsetAtWall(zone, w);
        if (fromFile !== fromDb) mismatches.push(`${zone} ${w.y}-${w.mo}-${w.d} ${w.h}:${w.mi} file ${fromFile} db ${fromDb}`);
      }
    }
  }
  t.ok(compared > 1000 && mismatches.length === 0, `VTIMEZONE offsets equal the time zone database (${compared} wall times, 2024-2030)`, mismatches.slice(0, 5));
  const offsetIn = (zone: CourtTimeZone, w: Wall) => vtimezoneOffset(vtz.get(zone) ?? [], w);
  t.eq(
    [
      offsetIn("America/Los_Angeles", { y: 2026, mo: 3, d: 8, h: 9, mi: 0 }),
      offsetIn("America/Los_Angeles", { y: 2026, mo: 11, d: 1, h: 9, mi: 0 }),
      offsetIn("America/New_York", { y: 2026, mo: 3, d: 8, h: 9, mi: 0 }),
      offsetIn("America/New_York", { y: 2026, mo: 11, d: 1, h: 9, mi: 0 }),
    ],
    [-420, -480, -240, -300],
    "2026 change days at 9:00 AM: LA -07:00 then -08:00, NY -04:00 then -05:00",
  );

  // --- "Leave court details out" ---------------------------------------------------------
  const secret = [
    { id: "p1", title: "Custody hearing Smith v. Smith", date: "2026-11-02", time: "08:30", timeZone: "America/Los_Angeles" as const, location: "Family Court Dept. 12", description: "Bring the restraining order", alarms: [10080, MORNING_OF] },
    { id: "p2", title: "Probation check-in", date: "2026-11-03", timeZone: "America/New_York" as const, location: "Probation office", description: "Case 26-CR-123", alarms: [2880] },
  ];
  const privateIcs = buildIcs(secret, NOW, { private: true });
  checkFile(privateIcs, secret, "private file", { private: true });
  const unfolded = unfold(privateIcs).join("\n");
  for (const word of ["Custody", "Smith", "Family Court", "restraining", "Probation", "26-CR-123"]) {
    t.ok(!unfolded.includes(word), `private file never contains "${word}"`);
  }

  // --- File names --------------------------------------------------------------------------
  t.eq(icsFileName("Court date: Smith v. Jones", "2026-10-15"), "court-date-smith-v-jones-2026-10-15.ics", "icsFileName slug");
  t.eq(icsFileName("Custody hearing", "2026-10-15", true), "appointment-2026-10-15.ics", "icsFileName with details left out says appointment");
  t.eq(icsFileName("!!!", "2026-10-15"), "court-date-2026-10-15.ics", "icsFileName falls back to court-date");
  t.ok(/^[a-z0-9-]{1,40}-2026-10-15\.ics$/.test(icsFileName("x".repeat(200), "2026-10-15")), "icsFileName slug is short and safe");

  t.finish();
}

run("check-ics", main);
