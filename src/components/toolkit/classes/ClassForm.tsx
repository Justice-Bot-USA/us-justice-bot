import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import CasePicker from "@/components/toolkit/CasePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TIME_PERIOD_NOTE } from "@/components/toolkit/calendar/copy";
import { LIMITS, ORDERED_BY, STATUSES, isClassStatus, isOrderedBy } from "@/lib/toolkit/types";
import {
  firstClassError,
  validateClassForm,
  type ClassFormErrors,
  type ClassFormField,
  type ClassFormValues,
} from "./classModel";
import { ONLY_THE_COURT, PROVIDER_NOTE } from "./copy";
import FormField from "./FormField";
import { describedBy, focusField, inputClass, textareaClass } from "./formHelpers";

/** Select value for "no answer" (Radix Select needs a non-empty value). */
const NONE = "none";

export interface ClassFormProps {
  mode: "add" | "edit";
  values: ClassFormValues;
  onChange: (next: ClassFormValues) => void;
  /** Called only when what was typed has the right format. The page then reads back the due date or saves. */
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  busy?: boolean;
  saveError?: string | null;
}

/**
 * Add or change a class record. Every value is typed by the person: nothing is suggested, worked
 * out or checked except that numbers, dates and links are readable and not too long.
 */
export default function ClassForm({ mode, values, onChange, onSubmit, onCancel, submitLabel, busy = false, saveError }: ClassFormProps) {
  const p = useId();
  const id = (field: ClassFormField) => `${p}-${field}`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<ClassFormErrors>({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const set = <K extends ClassFormField>(field: K, value: ClassFormValues[K]) => {
    onChange({ ...values, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    const found = validateClassForm(values);
    setErrors(found);
    const first = firstClassError(found);
    if (first) {
      focusField(id(first));
      return;
    }
    onSubmit();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-labelledby={`${p}-heading`}>
      <div>
        <h2 id={`${p}-heading`} ref={headingRef} tabIndex={-1} className="text-xl font-semibold focus:outline-none">
          {mode === "add" ? "Add a class" : "Change this class"}
        </h2>
        <p className="mt-1 text-base text-muted-foreground">
          Copy the details from your order or letter. Leave out anything you don't know. {ONLY_THE_COURT}
        </p>
      </div>

      <CasePicker
        id={id("caseId")}
        value={values.caseId}
        onChange={(caseId) => set("caseId", caseId)}
        label="Case (optional)"
        disabled={busy}
      />

      <FormField
        id={id("className")}
        label="Name of the class"
        hint={<p>Use the name on your order, or the provider's name for it.</p>}
        error={errors.className}
      >
        <Input
          id={id("className")}
          value={values.className}
          onChange={(e) => set("className", e.target.value)}
          maxLength={LIMITS.className}
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.className)}
          aria-describedby={describedBy(id("className"), true, errors.className)}
          className={inputClass}
          disabled={busy}
        />
      </FormField>

      <FormField id={id("orderedBy")} label="Who told you to take this class?" optional error={errors.orderedBy}>
        <Select
          value={values.orderedBy || NONE}
          onValueChange={(v) => set("orderedBy", isOrderedBy(v) ? v : "")}
          disabled={busy}
        >
          <SelectTrigger id={id("orderedBy")} className={inputClass} aria-invalid={Boolean(errors.orderedBy)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE} className="min-h-11 text-base">
              Leave blank
            </SelectItem>
            {ORDERED_BY.map((o) => (
              <SelectItem key={o.value} value={o.value} className="min-h-11 text-base">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        id={id("orderWording")}
        label="What your order says about the class"
        optional
        hint={<p>Copy the words from your order or letter, if you have them.</p>}
        error={errors.orderWording}
      >
        <Textarea
          id={id("orderWording")}
          value={values.orderWording}
          onChange={(e) => set("orderWording", e.target.value)}
          maxLength={LIMITS.orderWording}
          rows={4}
          aria-invalid={Boolean(errors.orderWording)}
          aria-describedby={describedBy(id("orderWording"), true, errors.orderWording)}
          className={textareaClass}
          disabled={busy}
        />
      </FormField>

      <FormField
        id={id("requiredHours")}
        label="Hours your order gives"
        optional
        hint={<p>Type the number of hours from your order or letter, if it gives one. Leave this blank if it doesn't.</p>}
        error={errors.requiredHours}
      >
        <Input
          id={id("requiredHours")}
          value={values.requiredHours}
          onChange={(e) => set("requiredHours", e.target.value)}
          inputMode="decimal"
          autoComplete="off"
          maxLength={8}
          aria-invalid={Boolean(errors.requiredHours)}
          aria-describedby={describedBy(id("requiredHours"), true, errors.requiredHours)}
          className={`${inputClass} max-w-[12rem]`}
          disabled={busy}
        />
      </FormField>

      <FormField
        id={id("dueDate")}
        label="Due date"
        optional
        hint={
          <>
            <p>Type the date exactly as it appears on your papers. Leave this blank if they don't give one.</p>
            <p>{TIME_PERIOD_NOTE}</p>
          </>
        }
        error={errors.dueDate}
      >
        <Input
          id={id("dueDate")}
          type="date"
          value={values.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
          min={LIMITS.minDate}
          max={LIMITS.maxDate}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={describedBy(id("dueDate"), true, errors.dueDate)}
          className={`${inputClass} max-w-xs`}
          disabled={busy}
        />
        {values.dueDate && (
          <Button type="button" variant="outline" className="min-h-11" onClick={() => set("dueDate", "")} disabled={busy}>
            Clear the due date
          </Button>
        )}
      </FormField>

      <FormField
        id={id("dueDateSource")}
        label="Where did this date come from?"
        optional
        hint={<p>For example: Court order, page 2.</p>}
        error={errors.dueDateSource}
      >
        <Input
          id={id("dueDateSource")}
          value={values.dueDateSource}
          onChange={(e) => set("dueDateSource", e.target.value)}
          maxLength={LIMITS.dueDateSource}
          autoComplete="off"
          aria-invalid={Boolean(errors.dueDateSource)}
          aria-describedby={describedBy(id("dueDateSource"), true, errors.dueDateSource)}
          className={inputClass}
          disabled={busy}
        />
      </FormField>

      <FormField id={id("providerName")} label="Who gives the class" optional error={errors.providerName}>
        <Input
          id={id("providerName")}
          value={values.providerName}
          onChange={(e) => set("providerName", e.target.value)}
          maxLength={LIMITS.providerName}
          autoComplete="off"
          aria-invalid={Boolean(errors.providerName)}
          aria-describedby={describedBy(id("providerName"), false, errors.providerName)}
          className={inputClass}
          disabled={busy}
        />
      </FormField>

      <FormField
        id={id("providerUrl")}
        label="Their website"
        optional
        hint={
          <>
            <p>The full link, starting with https://</p>
            <p>{PROVIDER_NOTE}</p>
          </>
        }
        error={errors.providerUrl}
      >
        <Input
          id={id("providerUrl")}
          type="url"
          inputMode="url"
          value={values.providerUrl}
          onChange={(e) => set("providerUrl", e.target.value)}
          maxLength={LIMITS.providerUrl}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="https://"
          aria-invalid={Boolean(errors.providerUrl)}
          aria-describedby={describedBy(id("providerUrl"), true, errors.providerUrl)}
          className={inputClass}
          disabled={busy}
        />
      </FormField>

      {mode === "add" && (
        <FormField id={id("status")} label="Where are you with this class?" error={errors.status}>
          <Select value={values.status} onValueChange={(v) => isClassStatus(v) && set("status", v)} disabled={busy}>
            <SelectTrigger id={id("status")} className={inputClass} aria-invalid={Boolean(errors.status)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="min-h-11 text-base">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}

      <FormField id={id("notes")} label="Notes" optional error={errors.notes}>
        <Textarea
          id={id("notes")}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          maxLength={LIMITS.trackerNotes}
          rows={3}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy(id("notes"), false, errors.notes)}
          className={textareaClass}
          disabled={busy}
        />
      </FormField>

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
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" className="min-h-11" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
