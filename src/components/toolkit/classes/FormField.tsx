import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export interface FormFieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

/** A labelled field with an optional hint and error, linked by id for screen readers. */
export default function FormField({ id, label, optional, hint, error, children }: FormFieldProps) {
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
