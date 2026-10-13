import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Loader2, Plus } from "lucide-react";
import ToolkitLayout from "@/components/toolkit/ToolkitLayout";
import LockedFeature from "@/components/toolkit/LockedFeature";
import DateReadBack from "@/components/toolkit/DateReadBack";
import EventForm from "@/components/toolkit/calendar/EventForm";
import EventCard from "@/components/toolkit/calendar/EventCard";
import ExportDialog, { type ExportTarget } from "@/components/toolkit/calendar/ExportDialog";
import DeleteEventDialog from "@/components/toolkit/calendar/DeleteEventDialog";
import CalendarNotice, { type CalendarNoticeKind } from "@/components/toolkit/calendar/CalendarNotice";
import {
  emptyEventForm,
  eventFormFromRow,
  eventPatch,
  eventWriteValues,
  splitUpcomingPast,
  type EventFormValues,
} from "@/components/toolkit/calendar/calendarModel";
import { ASK_IF_UNSURE, CHECK_AGAINST_PAPERS } from "@/components/toolkit/calendar/copy";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { DATES_ARE_YOURS } from "@/lib/billingDisclosure";
import {
  confirmationStamp,
  deleteCalendarEvent,
  insertCalendarEvent,
  listCalendarEvents,
  needsReadBack,
  toToolkitError,
  toolkitKeys,
  updateCalendarEvent,
} from "@/lib/toolkit/api";
import { useToolkitCases } from "@/lib/toolkit/cases";
import type { CalendarEventPatch, CalendarEventRow } from "@/lib/toolkit/types";

// Hearing calendar (spec v2 §3.3, addendum item 12).
//
// - Dates, times and places are only what the person typed. Nothing is worked out, suggested,
//   prefilled, checked or compared, except that an entry dated before today is listed under
//   "Past" (and is called nothing else).
// - Adding a date needs the Toolkit plan (the database refuses it otherwise). Seeing, changing,
//   deleting and downloading saved dates never does.
// - Every new date, and every change to a date, time or time zone, goes through the read-back
//   ("This matches my papers") before it is saved; confirmed_at is only sent after that.
// - Privacy: no titles, notes or places go to the console or analytics.

type Step = "form" | "readback" | "locked";

type Editor =
  | { mode: "add"; values: EventFormValues; step: Step }
  | { mode: "edit"; row: CalendarEventRow; values: EventFormValues; step: Step };

interface Notice {
  kind: CalendarNoticeKind;
  /** The saved or changed entry, for its download button. */
  row?: CalendarEventRow;
}

function CalendarBody() {
  const { user } = useAuth();
  const userId = user?.id;
  const access = useToolkitAccess();
  const queryClient = useQueryClient();
  const { byId } = useToolkitCases();

  const eventsQuery = useQuery({
    queryKey: toolkitKeys.calendar(userId),
    queryFn: () => listCalendarEvents(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [exportTarget, setExportTarget] = useState<ExportTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarEventRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  const noticeRef = useRef<HTMLHeadingElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  // True between a successful delete and the dialog closing, so the dialog doesn't try to return
  // focus to the deleted entry's button.
  const justDeleted = useRef(false);
  // Set when a form closes or a delete finishes, so focus moves to the message or the list.
  const [focusAfterRender, setFocusAfterRender] = useState(0);

  const rows = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);
  const { upcoming, past } = useMemo(() => splitUpcomingPast(rows), [rows]);

  // Creating needs an active plan. If the plan check itself failed, let the person try: the
  // database makes the real decision and the page shows LockedFeature if it says no.
  const canTryAdd = access.status === "active" || (access.status !== "loading" && Boolean(access.checkFailed));

  useEffect(() => {
    if (!focusAfterRender || editor) return;
    (noticeRef.current ?? listHeadingRef.current)?.focus();
  }, [focusAfterRender, editor]);

  const backToList = (nextNotice: Notice | null) => {
    setSaveError(null);
    setNotice(nextNotice);
    setEditor(null);
    setFocusAfterRender((n) => n + 1);
  };

  const putInCache = (row: CalendarEventRow) => {
    const key = toolkitKeys.calendar(userId);
    queryClient.setQueryData<CalendarEventRow[]>(key, (old) => [...(old ?? []).filter((r) => r.id !== row.id), row]);
    void queryClient.invalidateQueries({ queryKey: key });
    void queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) });
  };

  const removeFromCache = (id: string) => {
    const key = toolkitKeys.calendar(userId);
    queryClient.setQueryData<CalendarEventRow[]>(key, (old) => (old ?? []).filter((r) => r.id !== id));
    void queryClient.invalidateQueries({ queryKey: key });
    void queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) });
  };

  const startAdd = () => {
    if (!canTryAdd) return;
    setNotice(null);
    setSaveError(null);
    setEditor({ mode: "add", values: emptyEventForm(null), step: "form" });
  };

  const startEdit = (row: CalendarEventRow) => {
    setNotice(null);
    setSaveError(null);
    setEditor({ mode: "edit", row, values: eventFormFromRow(row), step: "form" });
  };

  const askDelete = (row: CalendarEventRow) => {
    setDeleteError(null);
    setDeleteTarget(row);
  };

  const setStep = (step: Step) => setEditor((ed) => (ed ? { ...ed, step } : ed));

  const saveNew = async (values: EventFormValues) => {
    if (!userId) return;
    setSaving(true);
    setSaveError(null);
    try {
      const created = await insertCalendarEvent(userId, { ...eventWriteValues(values), confirmed_at: confirmationStamp() });
      putInCache(created);
      backToList({ kind: "saved", row: created });
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "locked") {
        setStep("locked");
        void access.refresh();
      } else {
        setSaveError(e.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveChange = async (row: CalendarEventRow, patch: CalendarEventPatch, confirmed: boolean) => {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateCalendarEvent(row.id, confirmed ? { ...patch, confirmed_at: confirmationStamp() } : patch);
      putInCache(updated);
      backToList({ kind: "changed", row: updated });
    } catch (err) {
      const e = toToolkitError(err);
      // The database asks for the read-back again when a date, time or time zone changed.
      if (e.kind === "needs_confirmation") setStep("readback");
      if (e.kind === "not_found") void eventsQuery.refetch();
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const submitForm = () => {
    if (!editor) return;
    setSaveError(null);
    if (editor.mode === "add") {
      setStep("readback");
      return;
    }
    const patch = eventPatch(editor.row, editor.values);
    if (Object.keys(patch).length === 0) {
      backToList({ kind: "no_changes" });
      return;
    }
    if (needsReadBack(editor.row, patch)) setStep("readback");
    else void saveChange(editor.row, patch, false);
  };

  const confirmReadBack = () => {
    if (!editor || saving) return;
    if (editor.mode === "add") void saveNew(editor.values);
    else void saveChange(editor.row, eventPatch(editor.row, editor.values), true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // false means it was already gone; either way it is no longer saved.
      await deleteCalendarEvent(deleteTarget.id);
      removeFromCache(deleteTarget.id);
      justDeleted.current = true;
      setDeleteTarget(null);
      setNotice({ kind: "deleted" });
      setFocusAfterRender((n) => n + 1);
    } catch (err) {
      setDeleteError(toToolkitError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  // ---------------------------------------------------------------------------------------------
  // Add or change a date
  // ---------------------------------------------------------------------------------------------

  if (editor) {
    if (editor.step === "locked") {
      return (
        <div className="space-y-4">
          <LockedFeature feature="calendar" />
          <Button type="button" variant="outline" className="min-h-11" onClick={() => backToList(null)}>
            Back to my dates
          </Button>
        </div>
      );
    }

    if (editor.step === "readback") {
      const v = editor.values;
      return (
        <div className="space-y-4">
          <DateReadBack
            date={v.date}
            time={v.time || null}
            timeZone={v.timeZone || null}
            place={v.place}
            room={v.room}
            address={v.address}
            label={v.title}
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

    return (
      <EventForm
        mode={editor.mode}
        values={editor.values}
        onChange={(values) => setEditor((ed) => (ed ? { ...ed, values } : ed))}
        onSubmit={submitForm}
        onCancel={() => backToList(null)}
        busy={saving}
        saveError={saveError}
      />
    );
  }

  // ---------------------------------------------------------------------------------------------
  // Saved dates
  // ---------------------------------------------------------------------------------------------

  const caseTitle = (row: CalendarEventRow) => byId(row.case_id)?.case_title ?? null;
  const exportOne = (row: CalendarEventRow) => setExportTarget({ kind: "one", row });

  let list: ReactNode;
  if (eventsQuery.isPending) {
    list = (
      <p role="status" className="flex items-center gap-2 py-4 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading your dates…
      </p>
    );
  } else if (eventsQuery.error) {
    list = (
      <div className="space-y-3 rounded-lg border p-4 text-base">
        <p role="alert">We couldn't load your dates. {toToolkitError(eventsQuery.error).message}</p>
        <Button type="button" variant="outline" className="min-h-11" onClick={() => void eventsQuery.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else {
    list = (
      <div className="space-y-8">
        <section aria-labelledby="upcoming-heading" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="upcoming-heading" ref={listHeadingRef} tabIndex={-1} className="text-xl font-semibold focus:outline-none">
              Upcoming dates
            </h2>
            {upcoming.length > 0 && (
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => setExportTarget({ kind: "all", rows: upcoming })}
              >
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Download all upcoming dates
              </Button>
            )}
          </div>
          {upcoming.length > 0 ? (
            <ul className="space-y-4">
              {upcoming.map((row) => (
                <EventCard
                  key={row.id}
                  row={row}
                  caseTitle={caseTitle(row)}
                  isPast={false}
                  onExport={exportOne}
                  onEdit={startEdit}
                  onDelete={askDelete}
                />
              ))}
            </ul>
          ) : (
            <p className="text-base text-muted-foreground">
              {rows.length === 0 ? "You haven't saved any dates yet." : "No upcoming dates."}
            </p>
          )}
        </section>

        {past.length > 0 && (
          <section aria-labelledby="past-heading" className="space-y-4">
            <h2 id="past-heading" className="text-xl font-semibold">
              Past dates
            </h2>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full sm:w-auto"
              aria-expanded={showPast}
              aria-controls="past-list"
              onClick={() => setShowPast((s) => !s)}
            >
              {showPast ? "Hide past dates" : `Show past dates (${past.length})`}
            </Button>
            {showPast && (
              <ul id="past-list" className="space-y-4">
                {past.map((row) => (
                  <EventCard
                    key={row.id}
                    row={row}
                    caseTitle={caseTitle(row)}
                    isPast
                    onExport={exportOne}
                    onEdit={startEdit}
                    onDelete={askDelete}
                  />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    );
  }

  const noticeRow = notice?.row;

  return (
    <div className="space-y-6">
      <section aria-label="About your dates" className="space-y-2 rounded-lg border bg-muted/40 p-4 text-base">
        <p>{DATES_ARE_YOURS}</p>
        <p>
          {CHECK_AGAINST_PAPERS} {ASK_IF_UNSURE}
        </p>
      </section>

      {notice && (
        <CalendarNotice
          ref={noticeRef}
          kind={notice.kind}
          onDownload={noticeRow ? () => exportOne(noticeRow) : undefined}
          onDismiss={() => {
            setNotice(null);
            listHeadingRef.current?.focus();
          }}
        />
      )}

      {access.status === "loading" ? (
        <Button type="button" className="min-h-11 w-full sm:w-auto" disabled>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a date
        </Button>
      ) : canTryAdd ? (
        <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={startAdd}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a date
        </Button>
      ) : (
        <LockedFeature feature="calendar" />
      )}

      {list}

      <ExportDialog target={exportTarget} onClose={() => setExportTarget(null)} />
      <DeleteEventDialog
        row={deleteTarget}
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
      />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <ToolkitLayout
      title="Hearing calendar"
      description="Keep the court dates you type in, and add them to your phone's calendar. Private to your account."
      intro="Keep the court dates you type in, and add them to your phone's calendar."
    >
      <CalendarBody />
    </ToolkitLayout>
  );
}
