import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import CasePicker from "@/components/toolkit/CasePicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALARMS, KINDS, LIMITS, TIME_ZONES, isKind, isTimeZone, type AlarmMinutes } from "@/lib/toolkit/types";
import {
  applyCaseChange,
  firstErrorField,
  sortAlarms,
  validateEventForm,
  type EventFormErrors,
  type EventFormField,
  type EventFormValues,
} from "./calendarModel";
import { ALERTS_HOW, ALERTS_QUALIFIER, ASK_IF_UNSURE, TIME_PERIOD_NOTE, TYPE_EXACTLY } from "./copy";

export interface EventFormProps {
  mode: "add" | "edit";
  values: EventFormValues;
  onChange: (next: EventFormValues) => void;
  /** Called only when what was typed has the right format. The page then shows the read-back or saves. */
  onSubmit: () => void;
  onCancel: () => void;
  busy?: boolean;
  /** A save problem to show above the buttons (for example "We couldn't reach the server"). */
  saveError?: string | null;
}

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, optional, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </Label>
      {children}
      {hint && (
        <div id={`${id}-hint`} className="space-y-1 text-sm text-muted-foreground">
          {hint}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby for a field: its hint (if any) and its error (if any). */
function describedBy(id: string, hasHint: boolean, error?: string): string | undefined {
  const ids = [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

const inputClass = "min-h-11 text-base md:text-base";

/**
 * Add or change a calendar date. Every value is typed by the person: nothing is suggested,
 * worked out or checked except that a date, time and time zone are present and readable.
 */
export default function EventForm({ mode, values, onChange, onSubmit, onCancel, busy = false, saveError }: EventFormProps) {
  const p = useId();
  const id = (field: EventFormField) => `${p}-${field}`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const set = <K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) => {
    const next = { ...values, [field]: value };
    if (field === "timeZone") next.zoneFromCase = false;
    onChange(next);
    if (errors[field as EventFormField]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as EventFormField];
        return copy;
      });
    }
  };

  const toggleAlarm = (minutes: AlarmMinutes, on: boolean) => {
    const current = new Set<number>(values.alarms);
    if (on) current.add(minutes);
    else current.delete(minutes);
    set("alarms", sortAlarms([...current]));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    const found = validateEventForm(values);
    setErrors(found);
    const first = firstErrorField(found);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    onSubmit();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-labelledby={`${p}-heading`}>
      <div>
        <h2 id={`${p}-heading`} ref={headingRef} tabIndex={-1} className="text-xl font-semibold focus:outline-none">
          {mode === "add" ? "Add a date" : "Change this date"}
        </h2>
        <p className="mt-1 text-base text-muted-foreground">Copy each detail from your court papers. {ASK_IF_UNSURE}</p>
      </div>

      <CasePicker
        id={id("caseId")}
        value={values.caseId}
        onChange={(caseId, picked) => onChange(applyCaseChange(values, caseId, picked?.defaultTimeZone ?? null, mode))}
        label="Case (optional)"
        disabled={busy}
      />

      <Field id={id("kind")} label="What kind of date is this?" error={errors.kind}>
        <Select value={values.kind} onValueChange={(v) => isKind(v) && set("kind", v)} disabled={busy}>
          <SelectTrigger id={id("kind")} className={inputClass} aria-invalid={Boolean(errors.kind)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KINDS.map((k) => (
              <SelectItem key={k.value} value={k.value} className="min-h-11 text-base">
                {k.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        id={id("title")}
        label="Title"
        hint={<p>If you add this date to your phone's calendar, this is the title it shows. It may appear on your lock screen.</p>}
        error={errors.title}
      >
        <Input
          id={id("title")}
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          maxLength={LIMITS.title}
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describedBy(id("title"), true, errors.title)}
          className={inputClass}
          disabled={busy}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={id("date")}
          label="Date"
          hint={
            <>
              <p>{TYPE_EXACTLY}</p>
              <p>{TIME_PERIOD_NOTE}</p>
            </>
          }
          error={errors.date}
        >
          <Input
            id={id("date")}
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            min={LIMITS.minDate}
            max={LIMITS.maxDate}
            required
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describedBy(id("date"), true, errors.date)}
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field
          id={id("time")}
          label="Time"
          optional
          hint={<p>Leave this blank if your papers don't give a time.</p>}
          error={errors.time}
        >
          <Input
            id={id("time")}
            type="time"
            value={values.time}
            onChange={(e) => set("time", e.target.value)}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={describedBy(id("time"), true, errors.time)}
            className={inputClass}
            disabled={busy}
          />
          {values.time && (
            <Button type="button" variant="outline" className="min-h-11" onClick={() => set("time", "")} disabled={busy}>
              Clear the time
            </Button>
          )}
        </Field>
      </div>

      <Field
        id={id("timeZone")}
        label="Time zone"
        hint={
          <p>
            {values.zoneFromCase
              ? "Filled in from your case's state. Change it if the court or place is in a different time zone."
              : "Choose the time zone where the court or place is."}
          </p>
        }
        error={errors.timeZone}
      >
        <Select
          value={values.timeZone}
          onValueChange={(v) => isTimeZone(v) && set("timeZone", v)}
          disabled={busy}
        >
          <SelectTrigger
            id={id("timeZone")}
            className={inputClass}
            aria-invalid={Boolean(errors.timeZone)}
            aria-describedby={describedBy(id("timeZone"), true, errors.timeZone)}
          >
            <SelectValue placeholder="Choose a time zone" />
          </SelectTrigger>
          <SelectContent>
            {TIME_ZONES.map((z) => (
              <SelectItem key={z.value} value={z.value} className="min-h-11 text-base">
                {z.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        id={id("place")}
        label="Court or place"
        optional
        hint={<p>For example: Superior Court of California, County of Alameda.</p>}
        error={errors.place}
      >
        <Input
          id={id("place")}
          value={values.place}
          onChange={(e) => set("place", e.target.value)}
          maxLength={LIMITS.courtOrPlace}
          autoComplete="off"
          aria-invalid={Boolean(errors.place)}
          aria-describedby={describedBy(id("place"), true, errors.place)}
          className={inputClass}
          disabled={busy}
        />
      </Field>

      <Field id={id("room")} label="Room or department" optional hint={<p>For example: Dept. 12.</p>} error={errors.room}>
        <Input
          id={id("room")}
          value={values.room}
          onChange={(e) => set("room", e.target.value)}
          maxLength={LIMITS.room}
          autoComplete="off"
          aria-invalid={Boolean(errors.room)}
          aria-describedby={describedBy(id("room"), true, errors.room)}
          className={inputClass}
          disabled={busy}
        />
      </Field>

      <Field id={id("address")} label="Address" optional error={errors.address}>
        <Textarea
          id={id("address")}
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          maxLength={LIMITS.address}
          rows={2}
          autoComplete="off"
          aria-invalid={Boolean(errors.address)}
          aria-describedby={describedBy(id("address"), false, errors.address)}
          className="text-base md:text-base"
          disabled={busy}
        />
      </Field>

      <Field
        id={id("sourceNote")}
        label="Where did this date come from?"
        optional
        hint={<p>For example: Notice of hearing, page 1. This stays in Justice Bot USA and is not put in the calendar file.</p>}
        error={errors.sourceNote}
      >
        <Input
          id={id("sourceNote")}
          value={values.sourceNote}
          onChange={(e) => set("sourceNote", e.target.value)}
          maxLength={LIMITS.sourceNote}
          autoComplete="off"
          aria-invalid={Boolean(errors.sourceNote)}
          aria-describedby={describedBy(id("sourceNote"), true, errors.sourceNote)}
          className={inputClass}
          disabled={busy}
        />
      </Field>

      <Field
        id={id("notes")}
        label="Notes"
        optional
        hint={<p>Notes go in the calendar file, unless you choose to leave court details out when you download it.</p>}
        error={errors.notes}
      >
        <Textarea
          id={id("notes")}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          maxLength={LIMITS.eventNotes}
          rows={4}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy(id("notes"), true, errors.notes)}
          className="text-base md:text-base"
          disabled={busy}
        />
      </Field>

      <fieldset className="space-y-2" aria-describedby={`${p}-alarms-hint`}>
        <legend id={id("alarms")} tabIndex={-1} className="text-base font-medium focus:outline-none">
          Alerts in your phone's calendar
        </legend>
        <div className="space-y-1">
          {ALARMS.map((a) => {
            const checkboxId = `${p}-alarm-${a.value}`;
            const checked = values.alarms.includes(a.value);
            return (
              <div key={a.value} className="flex min-h-11 items-center gap-3">
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={(state) => toggleAlarm(a.value, state === true)}
                  disabled={busy}
                  className="h-5 w-5"
                />
                <Label htmlFor={checkboxId} className="flex min-h-11 flex-1 cursor-pointer items-center text-base font-normal">
                  {a.label}
                </Label>
              </div>
            );
          })}
        </div>
        <div id={`${p}-alarms-hint`} className="space-y-1 text-sm text-muted-foreground">
          <p>{ALERTS_HOW}</p>
          <p>{ALERTS_QUALIFIER}</p>
        </div>
      </fieldset>

      {triedSubmit && hasErrors && (
        <p role="alert" className="text-base font-medium text-destructive">
          Please fix the items marked above.
        </p>
      )}
      {saveError && (
        <p role="alert" className="text-base font-medium text-destructive">
          {saveError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="min-h-11" disabled={busy}>
          {mode === "add" ? "Next: check it against your papers" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" className="min-h-11" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
