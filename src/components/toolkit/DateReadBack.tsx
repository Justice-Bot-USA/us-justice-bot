import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  formatLongDate,
  formatTime12,
  isValidDateString,
  isValidTimeString,
  timeZoneShortLabel,
} from "@/lib/calendar/dates";
import { cn } from "@/lib/utils";

export interface DateReadBackProps {
  /** 'yyyy-MM-dd' exactly as typed. */
  date: string;
  /** 'HH:mm' as typed, or empty/null for no time. */
  time?: string | null;
  /** IANA zone, e.g. 'America/Los_Angeles'. Shown only with a time. */
  timeZone?: string | null;
  /** Court or place name. */
  place?: string | null;
  room?: string | null;
  address?: string | null;
  /** Optional line above the date, e.g. the entry title or "Due date". */
  label?: string | null;
  /** Heading. Default "Check this against your papers". */
  heading?: string;
  /** "This matches my papers": save, sending confirmed_at: confirmationStamp(). */
  onConfirm: () => void;
  /** "Go back and fix it": return to the form with the typed values kept. */
  onBack: () => void;
  /** Disables both buttons while saving. */
  busy?: boolean;
  className?: string;
}

/**
 * Reads a typed date back in words, with the weekday, so the person can compare it with their
 * court papers before it is saved. It only repeats what was typed: it never checks, adjusts or
 * suggests a date.
 */
export default function DateReadBack({
  date,
  time,
  timeZone,
  place,
  room,
  address,
  label,
  heading = "Check this against your papers",
  onConfirm,
  onBack,
  busy = false,
  className,
}: DateReadBackProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus here so screen readers announce the read-back when it appears.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const hasTime = Boolean(time && time.trim());
  const dateOk = isValidDateString(date);
  const timeOk = !hasTime || isValidTimeString(time);
  const valid = dateOk && timeOk;
  const placeLines = [room, place, address].map((v) => (v ?? "").trim()).filter(Boolean);

  return (
    <section
      role="group"
      aria-labelledby={headingId}
      className={cn("rounded-lg border-2 border-primary bg-card p-4 text-card-foreground sm:p-6", className)}
    >
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-lg font-semibold focus:outline-none">
        {heading}
      </h2>

      {valid ? (
        <>
          <p className="mt-1 text-base">Look at your court papers. Is everything below exactly the same?</p>
          <dl className="mt-4 space-y-3 text-base">
            {label && label.trim() && (
              <div>
                <dt className="text-sm text-muted-foreground">What</dt>
                <dd className="font-medium">{label}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-muted-foreground">Date</dt>
              <dd className="text-xl font-bold">{formatLongDate(date)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Time</dt>
              <dd className="font-medium">
                {hasTime
                  ? `${formatTime12(time)}${timeZone ? ` ${timeZoneShortLabel(timeZone)}` : ""}`
                  : `No time (all day)${timeZone ? `, ${timeZoneShortLabel(timeZone)}` : ""}`}
              </dd>
            </div>
            {placeLines.length > 0 && (
              <div>
                <dt className="text-sm text-muted-foreground">Place</dt>
                <dd className="font-medium">
                  {placeLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </>
      ) : (
        <p className="mt-2 text-base text-destructive">
          {dateOk ? "This time doesn't look right." : "This date doesn't look right."} Go back and fix it.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {valid && (
          <Button type="button" className="min-h-11" onClick={onConfirm} disabled={busy}>
            This matches my papers
          </Button>
        )}
        <Button type="button" variant="outline" className="min-h-11" onClick={onBack} disabled={busy}>
          Go back and fix it
        </Button>
      </div>
    </section>
  );
}
