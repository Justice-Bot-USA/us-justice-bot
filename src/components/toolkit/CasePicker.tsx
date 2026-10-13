import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToolkitCases } from "@/lib/toolkit/cases";
import type { ToolkitCase } from "@/lib/toolkit/types";
import { cn } from "@/lib/utils";

/** Select value used for "Not linked to a case" (Radix Select needs a non-empty value; case ids are UUIDs). */
const NONE = "none";

export interface CasePickerProps {
  /** The chosen case id, or null for "Not linked to a case". */
  value: string | null;
  /** Called with the case id (or null) and the case row (or null). */
  onChange: (caseId: string | null, picked: ToolkitCase | null) => void;
  /** id for the trigger, so other labels can point at it. Generated when not passed. */
  id?: string;
  /** Visible label. Default "Case". */
  label?: string;
  /** Hide the label visually (it stays for screen readers). */
  hideLabel?: boolean;
  /** Text for the no-case choice. Default "Not linked to a case". */
  noneLabel?: string;
  /** Show archived cases (marked "archived") after open ones. Default true. */
  includeArchived?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Picks one of the person's own cases, or "Not linked to a case". */
export default function CasePicker({
  value,
  onChange,
  id,
  label = "Case",
  hideLabel = false,
  noneLabel = "Not linked to a case",
  includeArchived = true,
  disabled = false,
  className,
}: CasePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? `case-picker-${generatedId}`;
  const { cases, isLoading, error, byId } = useToolkitCases();
  const shown = includeArchived ? cases : cases.filter((c) => !c.archived_at);
  // Keep a linked case selectable even if it is archived and archived cases are hidden.
  const current = byId(value);
  const options = current && !shown.some((c) => c.id === current.id) ? [...shown, current] : shown;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={triggerId} className={cn("text-base", hideLabel && "sr-only")}>
        {label}
      </Label>
      <Select
        value={value ?? NONE}
        onValueChange={(next) => {
          if (next === NONE) onChange(null, null);
          else onChange(next, byId(next));
        }}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id={triggerId} className="min-h-11 text-base">
          <SelectValue placeholder={isLoading ? "Loading your cases…" : noneLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE} className="min-h-11 text-base">
            {noneLabel}
          </SelectItem>
          {options.map((c) => (
            <SelectItem key={c.id} value={c.id} className="min-h-11 text-base">
              {c.case_title}
              {c.archived_at ? " (archived)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-muted-foreground">
          We couldn't load your cases. You can still choose “{noneLabel}”.
        </p>
      )}
    </div>
  );
}
