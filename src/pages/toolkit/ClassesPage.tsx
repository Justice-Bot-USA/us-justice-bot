import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FileDown, Loader2, Plus } from "lucide-react";
import ToolkitLayout from "@/components/toolkit/ToolkitLayout";
import LockedFeature from "@/components/toolkit/LockedFeature";
import DateReadBack from "@/components/toolkit/DateReadBack";
import ClassForm from "@/components/toolkit/classes/ClassForm";
import ClassCard from "@/components/toolkit/classes/ClassCard";
import ConfirmDeleteDialog from "@/components/toolkit/classes/ConfirmDeleteDialog";
import { useClassData } from "@/components/toolkit/classes/useClassData";
import {
  classFormFromRow,
  classPatch,
  classWriteValues,
  dueDateNeedsReadBack,
  emptyClassForm,
  type ClassFormValues,
} from "@/components/toolkit/classes/classModel";
import { ONLY_THE_COURT, SELF_REPORTED } from "@/components/toolkit/classes/copy";
import { useBinderFiles } from "@/components/toolkit/binder/useBinderFiles";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { DATES_ARE_YOURS } from "@/lib/billingDisclosure";
import { fileLabel } from "@/lib/binder/storage";
import { todayInZone } from "@/lib/calendar/dates";
import { deleteClassTracker, insertClassTracker, toToolkitError, toolkitKeys, updateClassTracker } from "@/lib/toolkit/api";
import { useToolkitCases } from "@/lib/toolkit/cases";
import type { ClassTrackerPatch, ClassTrackerRow } from "@/lib/toolkit/types";

// Class tracker (spec v2 §3.4, v1 §3.4, addendum items 16-17).
//
// - Hours, dates and requirements are only what the person typed. Nothing is worked out,
//   suggested, prefilled, checked or compared. "Hours you logged" (the person's own session hours
//   added up) and "Hours you typed from your order" sit side by side with nothing between them.
// - Adding a class record or logging a session needs the Toolkit plan (the database refuses it
//   otherwise). Seeing, changing, deleting and downloading records never does.
// - A typed due date is read back ("This matches my papers") before it is saved, and again
//   whenever it changes.
// - Privacy: class names, notes and case titles never go to the console or analytics.

type Step = "form" | "readback" | "locked";

type Editor =
  | { mode: "add"; values: ClassFormValues; step: Step }
  | { mode: "edit"; row: ClassTrackerRow; values: ClassFormValues; step: Step };

type NoticeKind = "added" | "changed" | "deleted" | "no_changes";

const NOTICE_TEXT: Record<NoticeKind, string> = {
  added: "Class saved.",
  changed: "Changes saved.",
  deleted: "Class deleted.",
  no_changes: "Nothing changed.",
};

/** Today's date on this device, for the PDF's file name only. */
function localToday(): string {
  try {
    return todayInZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return todayInZone("America/New_York");
  }
}

function ClassesBody() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const access = useToolkitAccess();
  const queryClient = useQueryClient();
  const { byId } = useToolkitCases();
  const data = useClassData(userId);
  const binder = useBinderFiles(userId);

  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeKind | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassTrackerRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  // Set when a form closes or a delete finishes, so focus moves to the message or the list.
  const [focusAfterRender, setFocusAfterRender] = useState(0);

  const noticeRef = useRef<HTMLParagraphElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  // True between a successful delete and the dialog closing, so focus doesn't go back to the
  // deleted class's button.
  const justDeleted = useRef(false);
  // Keep showing the class while the delete dialog animates closed.
  const lastDelete = useRef<ClassTrackerRow | null>(null);
  if (deleteTarget) lastDelete.current = deleteTarget;
  const shownDelete = deleteTarget ?? lastDelete.current;

  // Creating needs an active plan. If the plan check itself failed, let the person try: the
  // database makes the real decision and the page shows LockedFeature if it says no.
  const canTryCreate = access.status === "active" || (access.status !== "loading" && Boolean(access.checkFailed));

  const fileById = useMemo(() => new Map(binder.files.map((f) => [f.id, f])), [binder.files]);

  useEffect(() => {
    if (!focusAfterRender || editor) return;
    (noticeRef.current ?? listHeadingRef.current)?.focus();
  }, [focusAfterRender, editor]);

  if (!userId) return null;

  const backToList = (next: NoticeKind | null) => {
    setSaveError(null);
    setNotice(next);
    setEditor(null);
    setFocusAfterRender((n) => n + 1);
  };

  const refreshAccess = () => void access.refresh();

  const calendarAdded = () => {
    void queryClient.invalidateQueries({ queryKey: toolkitKeys.calendar(userId) });
    void queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) });
  };

  const setStep = (step: Step) => setEditor((ed) => (ed ? { ...ed, step } : ed));

  const saveNew = async (values: ClassFormValues) => {
    setSaving(true);
    setSaveError(null);
    try {
      data.putTracker(await insertClassTracker(userId, classWriteValues(values)));
      backToList("added");
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "locked") {
        setStep("locked");
        refreshAccess();
      } else {
        setSaveError(e.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveChange = async (row: ClassTrackerRow, patch: ClassTrackerPatch) => {
    setSaving(true);
    setSaveError(null);
    try {
      data.putTracker(await updateClassTracker(row.id, patch));
      backToList("changed");
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "not_found") data.refetch();
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const submitForm = () => {
    if (!editor) return;
    setSaveError(null);
    if (editor.mode === "add") {
      if (dueDateNeedsReadBack(null, editor.values)) setStep("readback");
      else void saveNew(editor.values);
      return;
    }
    const patch = classPatch(editor.row, editor.values);
    if (Object.keys(patch).length === 0) {
      backToList("no_changes");
      return;
    }
    if (dueDateNeedsReadBack(editor.row, editor.values)) setStep("readback");
    else void saveChange(editor.row, patch);
  };

  const confirmReadBack = () => {
    if (!editor || saving) return;
    if (editor.mode === "add") void saveNew(editor.values);
    else void saveChange(editor.row, classPatch(editor.row, editor.values));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // false means it was already gone; either way it is no longer saved.
      await deleteClassTracker(deleteTarget.id);
      data.removeTracker(deleteTarget.id);
      justDeleted.current = true;
      setDeleteTarget(null);
      setNotice("deleted");
      setFocusAfterRender((n) => n + 1);
    } catch (err) {
      setDeleteError(toToolkitError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  const downloadPdf = async () => {
    setPdfBusy(true);
    setPdfError(null);
    try {
      const { buildClassRecordsPdf, classRecordsFileName, saveBlob } = await import("@/components/toolkit/classes/recordsPdf");
      const blob = await buildClassRecordsPdf({
        classes: data.trackers.map((tracker) => {
          const proof = tracker.proof_file_id ? fileById.get(tracker.proof_file_id) : undefined;
          return { tracker, sessions: data.sessionsFor(tracker.id), proofFileLabel: proof ? fileLabel(proof) : null };
        }),
        generatedAt: new Date().toISOString(),
      });
      saveBlob(blob, classRecordsFileName(localToday()));
    } catch {
      setPdfError("We couldn't make the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  // ---------------------------------------------------------------------------------------------
  // Add or change a class
  // ---------------------------------------------------------------------------------------------

  if (editor) {
    if (editor.step === "locked") {
      return (
        <div className="space-y-4">
          <LockedFeature feature="classes" />
          <Button type="button" variant="outline" className="min-h-11" onClick={() => backToList(null)}>
            Back to my classes
          </Button>
        </div>
      );
    }

    if (editor.step === "readback") {
      return (
        <div className="space-y-4">
          <DateReadBack
            date={editor.values.dueDate}
            label={`Due date for ${editor.values.className.trim()}`}
            onConfirm={confirmReadBack}
            onBack={() => {
              setSaveError(null);
              setStep("form");
            }}
            busy={saving}
          />
          {saving && (
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

    const willReadBack = dueDateNeedsReadBack(editor.mode === "edit" ? editor.row : null, editor.values);
    return (
      <ClassForm
        mode={editor.mode}
        values={editor.values}
        onChange={(values) => setEditor((ed) => (ed ? { ...ed, values } : ed))}
        onSubmit={submitForm}
        onCancel={() => backToList(null)}
        submitLabel={willReadBack ? "Next: check the due date" : editor.mode === "add" ? "Save class" : "Save changes"}
        busy={saving}
        saveError={saveError}
      />
    );
  }

  // ---------------------------------------------------------------------------------------------
  // Saved classes
  // ---------------------------------------------------------------------------------------------

  let list: ReactNode;
  if (data.isLoading) {
    list = (
      <p role="status" className="flex items-center gap-2 py-4 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading your classes…
      </p>
    );
  } else if (data.error) {
    list = (
      <div className="space-y-3 rounded-lg border p-4 text-base">
        <p role="alert">We couldn't load your classes. {data.error.message}</p>
        <Button type="button" variant="outline" className="min-h-11" onClick={data.refetch}>
          Try again
        </Button>
      </div>
    );
  } else if (data.trackers.length === 0) {
    list = <p className="text-base text-muted-foreground">You haven't saved any classes yet.</p>;
  } else {
    list = (
      <ul className="space-y-4">
        {data.trackers.map((tracker) => {
          const linked = byId(tracker.case_id);
          return (
            <ClassCard
              key={tracker.id}
              tracker={tracker}
              sessions={data.sessionsFor(tracker.id)}
              caseTitle={linked?.case_title ?? null}
              caseZone={linked?.defaultTimeZone ?? null}
              userId={userId}
              files={binder.files}
              filesLoading={binder.isLoading}
              canTryCreate={canTryCreate}
              onTrackerSaved={data.putTracker}
              onSessionSaved={data.putSession}
              onSessionDeleted={data.removeSession}
              onEdit={(row) => {
                setNotice(null);
                setSaveError(null);
                setEditor({ mode: "edit", row, values: classFormFromRow(row), step: "form" });
              }}
              onDelete={(row) => {
                setDeleteError(null);
                setDeleteTarget(row);
              }}
              onLocked={refreshAccess}
              onCalendarAdded={calendarAdded}
            />
          );
        })}
      </ul>
    );
  }

  const deleteSessions = shownDelete ? data.sessionsFor(shownDelete.id).length : 0;

  return (
    <div className="space-y-6">
      <section aria-label="About your classes" className="space-y-2 rounded-lg border bg-muted/40 p-4 text-base">
        <p className="font-medium">{ONLY_THE_COURT}</p>
        <p>{SELF_REPORTED}</p>
        <p>{DATES_ARE_YOURS}</p>
      </section>

      {notice && (
        <div className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p ref={noticeRef} tabIndex={-1} role="status" className="text-base font-medium focus:outline-none">
            {NOTICE_TEXT[notice]}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 self-start sm:self-auto"
            onClick={() => {
              setNotice(null);
              listHeadingRef.current?.focus();
            }}
          >
            Dismiss
          </Button>
        </div>
      )}

      {access.status === "loading" ? (
        <Button type="button" className="min-h-11 w-full sm:w-auto" disabled>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a class
        </Button>
      ) : canTryCreate ? (
        <Button
          type="button"
          className="min-h-11 w-full sm:w-auto"
          onClick={() => {
            setNotice(null);
            setSaveError(null);
            setEditor({ mode: "add", values: emptyClassForm(), step: "form" });
          }}
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a class
        </Button>
      ) : (
        <LockedFeature feature="classes" />
      )}

      <section aria-labelledby="classes-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="classes-heading" ref={listHeadingRef} tabIndex={-1} className="text-xl font-semibold focus:outline-none">
            Your classes
          </h2>
          {data.trackers.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full sm:w-auto"
              onClick={() => void downloadPdf()}
              disabled={pdfBusy}
            >
              {pdfBusy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Download my class records (PDF)
            </Button>
          )}
        </div>
        {data.trackers.length > 0 && (
          <p className="text-sm text-muted-foreground">The PDF lists what you typed here. Notes you added are not included.</p>
        )}
        {pdfError && (
          <p role="alert" className="text-base font-medium text-destructive">
            {pdfError}
          </p>
        )}
        {list}
      </section>

      <p className="text-base">
        Looking for a class? The{" "}
        <Link to="/courses" className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">
          Course Hub
        </Link>{" "}
        lists some outside providers. Check with your court before you sign up.
      </p>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete this class?"
        busy={deleting}
        error={deleteError}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
        onCloseAutoFocus={(event) => {
          if (!justDeleted.current) return;
          justDeleted.current = false;
          event.preventDefault();
          (noticeRef.current ?? listHeadingRef.current)?.focus();
        }}
      >
        {shownDelete && <p className="break-words font-semibold">{shownDelete.class_name}</p>}
        <p>
          {deleteSessions > 0
            ? `This deletes the class record, its ${deleteSessions === 1 ? "1 logged session" : `${deleteSessions} logged sessions`} and its proof details from Justice Bot USA.`
            : "This deletes the class record and its proof details from Justice Bot USA."}{" "}
          Files in your case binder and dates in your hearing calendar are not deleted.
        </p>
      </ConfirmDeleteDialog>
    </div>
  );
}

export default function ClassesPage() {
  return (
    <ToolkitLayout
      title="Class tracker"
      description="Keep track of classes you were told to take: hours, dates and proof, as you type them in. Private to your account."
      intro="Keep track of classes you were told to take: hours, dates and proof, as you type them in."
    >
      <ClassesBody />
    </ToolkitLayout>
  );
}
