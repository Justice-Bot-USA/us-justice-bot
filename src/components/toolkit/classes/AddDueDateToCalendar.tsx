import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DateReadBack from "@/components/toolkit/DateReadBack";
import LockedFeature from "@/components/toolkit/LockedFeature";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALARMS, DEFAULT_ALARMS, LIMITS, TIME_ZONES, isTimeZone, labelFor, type ClassTrackerRow, type TimeZone } from "@/lib/toolkit/types";
import { confirmationStamp, insertCalendarEvent, toToolkitError } from "@/lib/toolkit/api";
import {
  dueDateCalendarValues,
  dueDateEntryStart,
  longDate,
  validateDueDateEntry,
  type DueDateEntryErrors,
  type DueDateEntryValues,
} from "./classModel";
import FormField from "./FormField";
import { describedBy, focusField, inputClass } from "./formHelpers";

type Step = "form" | "readback" | "locked" | "done";

export interface AddDueDateToCalendarProps {
  tracker: ClassTrackerRow;
  /** Pacific for a California case, Eastern for a New York case, otherwise null (the person chooses). */
  caseZone: TimeZone | null;
  userId: string;
  /** True when the person may try to add a calendar date (active plan, or the plan check failed). */
  canTryCreate: boolean;
  onAdded: () => void;
  onLocked: () => void;
  onClose: () => void;
}

const DEFAULT_ALERTS_TEXT = DEFAULT_ALARMS.map((a) => labelFor(ALARMS, a)).join(" and ");

/**
 * "Add the due date to my calendar": makes a hearing-calendar entry (kind "class") with the exact
 * due date the person typed for this class. It never makes up or changes a date, and the date is
 * read back ("This matches my papers") before it is saved.
 */
export default function AddDueDateToCalendar({
  tracker,
  caseZone,
  userId,
  canTryCreate,
  onAdded,
  onLocked,
  onClose,
}: AddDueDateToCalendarProps) {
  const p = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<Step>(canTryCreate ? "form" : "locked");
  const [values, setValues] = useState<DueDateEntryValues>(() => dueDateEntryStart(tracker, caseZone));
  const [errors, setErrors] = useState<DueDateEntryErrors>({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "readback") headingRef.current?.focus();
  }, [step]);

  const dueDate = tracker.due_date ?? "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateDueDateEntry(values);
    setErrors(found);
    if (found.title) return focusField(`${p}-title`);
    if (found.timeZone) return focusField(`${p}-timeZone`);
    setSaveError(null);
    setStep("readback");
  };

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setSaveError(null);
    try {
      await insertCalendarEvent(userId, { ...dueDateCalendarValues(tracker, values), confirmed_at: confirmationStamp() });
      onAdded();
      setStep("done");
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "locked") {
        setStep("locked");
        onLocked();
      } else {
        setSaveError(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const heading = (text: string) => (
    <h4 ref={headingRef} tabIndex={-1} className="text-base font-semibold focus:outline-none">
      {text}
    </h4>
  );

  if (step === "locked") {
    return (
      <div className="space-y-3 rounded-lg border p-4">
        {heading("Add the due date to my calendar")}
        <LockedFeature feature="calendar" />
        <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="space-y-3 rounded-lg border p-4" role="status">
        {heading("Added to your hearing calendar")}
        <p className="text-base">
          If the due date changes, change it in your hearing calendar too. To get alerts, open the hearing calendar and
          add the date to your phone's calendar.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="min-h-11">
            <Link to="/toolkit/calendar">Open hearing calendar</Link>
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (step === "readback") {
    return (
      <div className="space-y-3">
        <DateReadBack
          date={dueDate}
          label={values.title}
          onConfirm={() => void save()}
          onBack={() => {
            setSaveError(null);
            setStep("form");
          }}
          busy={busy}
        />
        {busy && (
          <p role="status" className="flex items-center gap-2 text-base text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Saving…
          </p>
        )}
        {saveError && (
          <p role="alert" className="text-base font-medium text-destructive">
            {saveError}
          </p>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-4 rounded-lg border p-4">
      {heading("Add the due date to my calendar")}
      <p className="text-base">
        <span className="block text-sm text-muted-foreground">The due date you typed</span>
        <span className="block font-semibold">{longDate(dueDate)}</span>
      </p>
      <p className="text-sm text-muted-foreground">
        It goes in your hearing calendar as an all-day date, with alerts {DEFAULT_ALERTS_TEXT}. You can change it there.
        Already added it? You don't need to add it again.
      </p>

      <FormField
        id={`${p}-title`}
        label="Title"
        hint={<p>If you add this date to your phone's calendar, this is the title it shows. It may appear on your lock screen.</p>}
        error={errors.title}
      >
        <Input
          id={`${p}-title`}
          value={values.title}
          onChange={(e) => {
            setValues({ ...values, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: undefined });
          }}
          maxLength={LIMITS.title}
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describedBy(`${p}-title`, true, errors.title)}
          className={inputClass}
          disabled={busy}
        />
      </FormField>

      <FormField
        id={`${p}-timeZone`}
        label="Time zone"
        hint={
          <p>
            {caseZone && values.timeZone === caseZone
              ? "Filled in from your case's state. Change it if the court or place is in a different time zone."
              : "Choose the time zone where the court or place is."}
          </p>
        }
        error={errors.timeZone}
      >
        <Select
          value={values.timeZone}
          onValueChange={(v) => {
            if (!isTimeZone(v)) return;
            setValues({ ...values, timeZone: v });
            if (errors.timeZone) setErrors({ ...errors, timeZone: undefined });
          }}
          disabled={busy}
        >
          <SelectTrigger
            id={`${p}-timeZone`}
            className={inputClass}
            aria-invalid={Boolean(errors.timeZone)}
            aria-describedby={describedBy(`${p}-timeZone`, true, errors.timeZone)}
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
      </FormField>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="min-h-11" disabled={busy}>
          Next: check it against your papers
        </Button>
        <Button type="button" variant="outline" className="min-h-11" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
