// Builds .ics calendar files (RFC 5545) so a person can put the court dates they typed into their
// own phone or computer calendar, with alerts. The dates go in exactly as typed: nothing here
// computes, adjusts or suggests a date.

import { type CourtTimeZone, nextDateString, parseDateString, parseTimeString } from "./dates";

/** Alert choices, in minutes before the event. MORNING_OF means 8:00 AM local on the day itself. */
export const MORNING_OF = 0;
export const ALARM_CHOICES: { minutes: number; label: string }[] = [
  { minutes: 10080, label: "1 week before" },
  { minutes: 2880, label: "2 days before" },
  { minutes: 1440, label: "1 day before" },
  { minutes: MORNING_OF, label: "Morning of (8 AM, or 1 hour before an earlier start)" },
];

export interface IcsEvent {
  /** Stable id (the database row id), so re-importing updates the same calendar entry. */
  id: string;
  title: string;
  /** 'yyyy-MM-dd' as typed by the person. */
  date: string;
  /** 'HH:mm' as typed, or empty for an all-day entry. */
  time?: string | null;
  timeZone: CourtTimeZone;
  durationMinutes?: number;
  location?: string | null;
  description?: string | null;
  /** Minutes before; see ALARM_CHOICES. */
  alarms?: number[];
  /** Bumped on every edit so calendar apps replace the old entry when the file is imported again. */
  sequence?: number;
}

export interface IcsOptions {
  /** Leave court details out: the title becomes "Appointment" and the place and notes are dropped. */
  private?: boolean;
}

const CRLF = "\r\n";

function dstZone(tzid: string, std: string, dst: string, stdName: string, dstName: string): string[] {
  return [
    "BEGIN:VTIMEZONE",
    `TZID:${tzid}`,
    "BEGIN:DAYLIGHT",
    `TZOFFSETFROM:${std}`,
    `TZOFFSETTO:${dst}`,
    `TZNAME:${dstName}`,
    "DTSTART:20070311T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    `TZOFFSETFROM:${dst}`,
    `TZOFFSETTO:${std}`,
    `TZNAME:${stdName}`,
    "DTSTART:20071104T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
}

function fixedZone(tzid: string, offset: string, name: string): string[] {
  return [
    "BEGIN:VTIMEZONE",
    `TZID:${tzid}`,
    "BEGIN:STANDARD",
    `TZOFFSETFROM:${offset}`,
    `TZOFFSETTO:${offset}`,
    `TZNAME:${name}`,
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
}

// US rules in force since 2007. Arizona (outside the Navajo Nation) and Hawaii do not observe DST.
const VTIMEZONES: Record<CourtTimeZone, string[]> = {
  "America/Los_Angeles": dstZone("America/Los_Angeles", "-0800", "-0700", "PST", "PDT"),
  "America/New_York": dstZone("America/New_York", "-0500", "-0400", "EST", "EDT"),
  "America/Chicago": dstZone("America/Chicago", "-0600", "-0500", "CST", "CDT"),
  "America/Denver": dstZone("America/Denver", "-0700", "-0600", "MST", "MDT"),
  "America/Phoenix": fixedZone("America/Phoenix", "-0700", "MST"),
  "America/Anchorage": dstZone("America/Anchorage", "-0900", "-0800", "AKST", "AKDT"),
  "Pacific/Honolulu": fixedZone("Pacific/Honolulu", "-1000", "HST"),
};

/** Escapes a TEXT value (RFC 5545 section 3.3.11). */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/** Folds a content line to at most 75 octets per line without splitting a UTF-8 character. */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  let limit = 75;
  for (const ch of line) {
    const bytes = encoder.encode(ch).length;
    if (currentBytes + bytes > limit) {
      out.push(current);
      current = "";
      currentBytes = 0;
      limit = 74; // continuation lines start with one space
    }
    current += ch;
    currentBytes += bytes;
  }
  out.push(current);
  return out.join(CRLF + " ");
}

function compactDate(value: string): string {
  return value.replace(/-/g, "");
}

function utcStamp(now: Date): string {
  return now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function durationText(totalMinutes: number, negative: boolean): string {
  const sign = negative ? "-" : "";
  let m = Math.abs(Math.round(totalMinutes));
  const days = Math.floor(m / 1440);
  m -= days * 1440;
  const hours = Math.floor(m / 60);
  const minutes = m - hours * 60;
  let out = `${sign}P`;
  if (days) out += `${days}D`;
  if (hours || minutes || !days) {
    out += "T";
    if (hours) out += `${hours}H`;
    if (minutes || (!hours && !days)) out += `${minutes}M`;
  }
  return out;
}

/** The TRIGGER value for one alert, relative to the event start. */
export function alarmTrigger(alarmMinutes: number, startTime: string | null | undefined): string {
  const t = parseTimeString(startTime);
  if (!t) {
    // All-day entries start at local midnight: put every alert at 8:00 AM.
    if (alarmMinutes === MORNING_OF) return "PT8H";
    const daysBefore = Math.max(1, Math.round(alarmMinutes / 1440));
    return durationText(daysBefore * 1440 - 8 * 60, true);
  }
  if (alarmMinutes === MORNING_OF) {
    const minutesAfterEight = t.hour * 60 + t.minute - 8 * 60;
    return durationText(minutesAfterEight > 0 ? minutesAfterEight : 60, true);
  }
  return durationText(alarmMinutes, true);
}

function eventLines(ev: IcsEvent, stamp: string, opts: IcsOptions): string[] {
  const title = opts.private ? "Appointment" : ev.title;
  const lines = ["BEGIN:VEVENT", `UID:${ev.id}@justicebot-usa.com`, `DTSTAMP:${stamp}`, `SEQUENCE:${Math.max(0, Math.floor(ev.sequence ?? 0))}`];
  const hasTime = parseTimeString(ev.time) !== null;
  if (hasTime) {
    const t = parseTimeString(ev.time)!;
    const hhmm = `${String(t.hour).padStart(2, "0")}${String(t.minute).padStart(2, "0")}00`;
    lines.push(`DTSTART;TZID=${ev.timeZone}:${compactDate(ev.date)}T${hhmm}`);
    lines.push(`DURATION:${durationText(ev.durationMinutes ?? 60, false)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${compactDate(ev.date)}`);
    lines.push(`DTEND;VALUE=DATE:${compactDate(nextDateString(ev.date))}`);
  }
  lines.push(`SUMMARY:${escapeIcsText(title)}`);
  if (ev.location && !opts.private) lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
  const description = [opts.private ? null : ev.description, "Typed by you in Justice Bot USA. Check your court papers: court dates can change."]
    .filter(Boolean)
    .join("\n\n");
  lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  for (const alarm of [...new Set(ev.alarms ?? [])].sort((a, b) => b - a)) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(`Reminder: ${title}`)}`,
      `TRIGGER:${alarmTrigger(alarm, ev.time)}`,
      "END:VALARM",
    );
  }
  lines.push("END:VEVENT");
  return lines;
}

/** Builds one .ics file holding the given entries. Entries with an invalid date are skipped. */
export function buildIcs(events: IcsEvent[], now: Date = new Date(), opts: IcsOptions = {}): string {
  const valid = events.filter((ev) => parseDateString(ev.date) !== null);
  const stamp = utcStamp(now);
  const zones = [...new Set(valid.filter((ev) => parseTimeString(ev.time) !== null).map((ev) => ev.timeZone))];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quorex Solutions//Justice Bot USA Toolkit//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...zones.flatMap((z) => VTIMEZONES[z]),
    ...valid.flatMap((ev) => eventLines(ev, stamp, opts)),
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join(CRLF) + CRLF;
}

/** A safe download file name such as "court-date-2026-10-15.ics". */
export function icsFileName(title: string, date: string, isPrivate = false): string {
  const slug = (isPrivate ? "appointment" : title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "court-date";
  return `${slug}-${date}.ics`;
}
