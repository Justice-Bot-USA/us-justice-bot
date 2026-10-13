import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import LockedFeature, { NOT_FOR_SALE_YET } from "@/components/toolkit/LockedFeature";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCheckoutStatus } from "@/hooks/useCheckoutStatus";
import { TOOLKIT_PRICE_LABEL } from "@/lib/billingDisclosure";
import { deleteClassSession, insertClassSession, toToolkitError, updateClassSession } from "@/lib/toolkit/api";
import { LIMITS, type ClassSessionRow, type ClassTrackerRow } from "@/lib/toolkit/types";
import {
  SESSION_FIELD_ORDER,
  emptySessionForm,
  hoursText,
  longDate,
  sessionFormFromRow,
  sessionPatch,
  sessionWriteValues,
  validateSessionForm,
  type SessionFormErrors,
  type SessionFormField,
  type SessionFormValues,
} from "./classModel";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { SESSIONS_LOCKED } from "./copy";
import FormField from "./FormField";
import { describedBy, focusField, inputClass, textareaClass } from "./formHelpers";

interface SessionFormProps {
  mode: "add" | "edit";
  values: SessionFormValues;
  onChange: (next: SessionFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
  busy: boolean;
  saveError: string | null;
}

function SessionForm({ mode, values, onChange, onSubmit, onCancel, busy, saveError }: SessionFormProps) {
  const p = useId();
  const id = (field: SessionFormField) => `${p}-${field}`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<SessionFormErrors>({});

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const set = <K extends SessionFormField>(field: K, value: SessionFormValues[K]) => {
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
    const found = validateSessionForm(values);
    setErrors(found);
    const first = SESSION_FIELD_ORDER.find((f) => found[f]);
    if (first) {
      focusField(id(first));
      return;
    }
    onSubmit();
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4" aria-labelledby={`${p}-heading`}>
      <h5 id={`${p}-heading`} ref={headingRef} tabIndex={-1} className="text-base font-semibold focus:outline-none">
        {mode === "add" ? "Log a session" : "Change this session"}
      </h5>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={id("date")} label="Date of the session" error={errors.date}>
          <Input
            id={id("date")}
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            min={LIMITS.minDate}
            max={LIMITS.maxDate}
            required
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describedBy(id("date"), false, errors.date)}
            className={inputClass}
            disabled={busy}
          />
        </FormField>

        <FormField
          id={id("hours")}
          label="Hours"
          optional
          hint={<p>For example: 2 or 1.5.</p>}
          error={errors.hours}
        >
          <Input
            id={id("hours")}
            value={values.hours}
            onChange={(e) => set("hours", e.target.value)}
            inputMode="decimal"
            autoComplete="off"
            maxLength={6}
            aria-invalid={Boolean(errors.hours)}
            aria-describedby={describedBy(id("hours"), true, errors.hours)}
            className={inputClass}
            disabled={busy}
          />
        </FormField>
      </div>

      <FormField id={id("notes")} label="Notes" optional error={errors.notes}>
        <Textarea
          id={id("notes")}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          maxLength={LIMITS.sessionNotes}
          rows={2}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy(id("notes"), false, errors.notes)}
          className={textareaClass}
          disabled={busy}
        />
      </FormField>

      {saveError && (
        <p role="alert" className="text-base font-medium text-destructive">
          {saveError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="min-h-11" disabled={busy}>
          {busy ? "Saving…" : "Save session"}
        </Button>
        <Button type="button" variant="outline" className="min-h-11" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

type Editor = { mode: "add"; values: SessionFormValues } | { mode: "edit"; row: ClassSessionRow; values: SessionFormValues };

export interface SessionLogProps {
  tracker: ClassTrackerRow;
  sessions: ClassSessionRow[];
  userId: string;
  /** True when the person may try to log a new session (active plan, or the plan check failed). */
  canTryCreate: boolean;
  onSaved: (row: ClassSessionRow) => void;
  onDeleted: (id: string) => void;
  /** The database said logging a new session needs the plan. */
  onLocked: () => void;
}

/** The sessions the person logged for one class. Changing and deleting them is always free. */
export default function SessionLog({ tracker, sessions, userId, canTryCreate, onSaved, onDeleted, onLocked }: SessionLogProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const checkout = useCheckoutStatus();
  const [deleteTarget, setDeleteTarget] = useState<ClassSessionRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const justDeleted = useRef(false);
  // Keep showing the session while the dialog animates closed.
  const lastDelete = useRef<ClassSessionRow | null>(null);
  if (deleteTarget) lastDelete.current = deleteTarget;
  const shownDelete = deleteTarget ?? lastDelete.current;

  const close = () => {
    setEditor(null);
    setSaveError(null);
    // Let the form unmount first, then return focus to the list.
    setTimeout(() => headingRef.current?.focus(), 0);
  };

  const save = async () => {
    if (!editor) return;
    setBusy(true);
    setSaveError(null);
    try {
      if (editor.mode === "add") {
        const row = await insertClassSession(userId, sessionWriteValues(tracker.id, editor.values));
        onSaved(row);
      } else {
        const patch = sessionPatch(editor.row, editor.values);
        if (Object.keys(patch).length > 0) onSaved(await updateClassSession(editor.row.id, patch));
      }
      close();
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "locked") {
        setEditor(null);
        setLocked(true);
        onLocked();
      } else {
        setSaveError(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteClassSession(deleteTarget.id);
      onDeleted(deleteTarget.id);
      justDeleted.current = true;
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(toToolkitError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h4 id={headingId} ref={headingRef} tabIndex={-1} className="text-base font-semibold focus:outline-none">
        Sessions you logged
      </h4>

      {sessions.length === 0 ? (
        <p className="text-base text-muted-foreground">No sessions logged yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {sessions.map((s) => {
            const notes = (s.notes ?? "").trim();
            const hours = hoursText(s.hours);
            return (
              <li key={s.id} className="space-y-2 p-3">
                <p>
                  <time dateTime={s.session_date} className="block font-medium">
                    {longDate(s.session_date)}
                  </time>
                  <span className="block text-muted-foreground">{hours || "No hours typed"}</span>
                </p>
                {notes && (
                  <details className="text-sm">
                    <summary className="flex min-h-11 cursor-pointer items-center font-medium">Notes</summary>
                    <p className="whitespace-pre-wrap break-words">{notes}</p>
                  </details>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    disabled={busy || Boolean(editor)}
                    onClick={() => {
                      setSaveError(null);
                      setEditor({ mode: "edit", row: s, values: sessionFormFromRow(s) });
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                    Change
                    <span className="sr-only"> the session on {longDate(s.session_date)}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    disabled={busy || Boolean(editor)}
                    onClick={() => {
                      setDeleteError(null);
                      setDeleteTarget(s);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Delete
                    <span className="sr-only"> the session on {longDate(s.session_date)}</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editor ? (
        <SessionForm
          mode={editor.mode}
          values={editor.values}
          onChange={(values) => setEditor((ed) => (ed ? { ...ed, values } : ed))}
          onSubmit={() => void save()}
          onCancel={close}
          busy={busy}
          saveError={saveError}
        />
      ) : locked ? (
        <div className="space-y-3">
          <LockedFeature feature="classes" />
          <Button type="button" variant="outline" className="min-h-11" onClick={() => setLocked(false)}>
            Close
          </Button>
        </div>
      ) : canTryCreate ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full sm:w-auto"
          onClick={() => {
            setSaveError(null);
            setEditor({ mode: "add", values: emptySessionForm() });
          }}
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Log a session
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          {SESSIONS_LOCKED}{" "}
          {checkout.data === true ? (
            <Link to="/pricing" className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">
              Get the Toolkit — {TOOLKIT_PRICE_LABEL} a month
            </Link>
          ) : checkout.isPending ? null : (
            NOT_FOR_SALE_YET
          )}
        </p>
      )}

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete this session?"
        busy={deleting}
        error={deleteError}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
        onCloseAutoFocus={(event) => {
          if (!justDeleted.current) return;
          justDeleted.current = false;
          event.preventDefault();
          headingRef.current?.focus();
        }}
      >
        {shownDelete && (
          <p>
            <span className="block font-semibold">{longDate(shownDelete.session_date)}</span>
            <span className="block">{hoursText(shownDelete.hours) || "No hours typed"}</span>
          </p>
        )}
        <p>This deletes the session from Justice Bot USA.</p>
      </ConfirmDeleteDialog>
    </section>
  );
}
