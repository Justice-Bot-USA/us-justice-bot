import { useId, useState } from "react";
import { CalendarPlus, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toToolkitError, updateClassTracker } from "@/lib/toolkit/api";
import {
  STATUSES,
  isClassStatus,
  type CaseFileRow,
  type ClassSessionRow,
  type ClassTrackerRow,
  type TimeZone,
} from "@/lib/toolkit/types";
import AddDueDateToCalendar from "./AddDueDateToCalendar";
import { formatHours, longDate, orderedByLabel, safeProviderUrl, statusLabel, sumLoggedHours } from "./classModel";
import { DUE_DATE_LABEL, DUE_DATE_SOURCE_LABEL, HOURS_FROM_ORDER_LABEL, HOURS_LOGGED_LABEL } from "./copy";
import ProofSection from "./ProofSection";
import SessionLog from "./SessionLog";

export interface ClassCardProps {
  tracker: ClassTrackerRow;
  sessions: ClassSessionRow[];
  /** The linked case's title (shown on screen only). */
  caseTitle: string | null;
  /** The linked case's starting time zone for the calendar (CA or NY only). */
  caseZone: TimeZone | null;
  userId: string;
  files: CaseFileRow[];
  filesLoading: boolean;
  /** True when the person may try to add something new (active plan, or the plan check failed). */
  canTryCreate: boolean;
  onTrackerSaved: (row: ClassTrackerRow) => void;
  onSessionSaved: (row: ClassSessionRow) => void;
  onSessionDeleted: (id: string) => void;
  onEdit: (row: ClassTrackerRow) => void;
  onDelete: (row: ClassTrackerRow) => void;
  /** The database said adding something new needs the plan. */
  onLocked: () => void;
  onCalendarAdded: () => void;
}

/**
 * One class record: what the person typed, read back plainly, with their sessions and proof.
 * The two hours lines are shown side by side with the same look; nothing is worked out between
 * them, and no status, colour or icon changes with them.
 */
export default function ClassCard({
  tracker,
  sessions,
  caseTitle,
  caseZone,
  userId,
  files,
  filesLoading,
  canTryCreate,
  onTrackerSaved,
  onSessionSaved,
  onSessionDeleted,
  onEdit,
  onDelete,
  onLocked,
  onCalendarAdded,
}: ClassCardProps) {
  const statusId = useId();
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusNote, setStatusNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const providerUrl = safeProviderUrl(tracker.provider_url);
  const orderedBy = orderedByLabel(tracker.ordered_by);
  const orderWording = (tracker.order_wording ?? "").trim();
  const notes = (tracker.notes ?? "").trim();
  const source = (tracker.due_date_source ?? "").trim();
  const providerName = (tracker.provider_name ?? "").trim();
  const hasOrderHours = tracker.required_hours !== null && tracker.required_hours !== undefined;

  const changeStatus = async (value: string) => {
    if (!isClassStatus(value) || value === tracker.status) return;
    setStatusBusy(true);
    setStatusNote(null);
    try {
      onTrackerSaved(await updateClassTracker(tracker.id, { status: value }));
      setStatusNote({ ok: true, text: "Saved." });
    } catch (err) {
      setStatusNote({ ok: false, text: toToolkitError(err).message });
    } finally {
      setStatusBusy(false);
    }
  };

  return (
    <li>
      <Card>
        <CardContent className="space-y-5 p-4 text-base sm:p-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-sm">
              {statusLabel(tracker.status)}
            </Badge>
            <h3 className="break-words text-lg font-semibold">{tracker.class_name}</h3>
          </div>

          <dl className="space-y-2">
            {caseTitle && (
              <div>
                <dt className="text-sm text-muted-foreground">Case</dt>
                <dd className="break-words">{caseTitle}</dd>
              </div>
            )}
            {orderedBy && (
              <div>
                <dt className="text-sm text-muted-foreground">Who told you to take it</dt>
                <dd>{orderedBy}</dd>
              </div>
            )}
            {tracker.due_date && (
              <div>
                <dt className="text-sm text-muted-foreground">{DUE_DATE_LABEL}</dt>
                <dd>
                  <time dateTime={tracker.due_date} className="font-semibold">
                    {longDate(tracker.due_date)}
                  </time>
                </dd>
              </div>
            )}
            {source && (
              <div>
                <dt className="text-sm text-muted-foreground">{DUE_DATE_SOURCE_LABEL}</dt>
                <dd className="break-words">{source}</dd>
              </div>
            )}
            {(providerName || providerUrl) && (
              <div>
                <dt className="text-sm text-muted-foreground">Who gives the class</dt>
                <dd className="break-words">
                  {providerName && <span className="block">{providerName}</span>}
                  {providerUrl && (
                    <a
                      href={providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      // The person typed this link; keep it away from page-wide click listeners (analytics).
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex min-h-11 items-center gap-1 font-medium text-primary underline underline-offset-4"
                    >
                      Their website
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </dd>
              </div>
            )}
          </dl>

          <dl className="grid gap-3 rounded-lg border bg-muted/40 p-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">{HOURS_LOGGED_LABEL}</dt>
              <dd className="text-lg font-semibold">{formatHours(sumLoggedHours(sessions))}</dd>
            </div>
            {hasOrderHours && (
              <div>
                <dt className="text-sm text-muted-foreground">{HOURS_FROM_ORDER_LABEL}</dt>
                <dd className="text-lg font-semibold">{formatHours(tracker.required_hours)}</dd>
              </div>
            )}
          </dl>

          {orderWording && (
            <details>
              <summary className="flex min-h-11 cursor-pointer items-center font-medium">What your order says</summary>
              <p className="whitespace-pre-wrap break-words">{orderWording}</p>
            </details>
          )}
          {notes && (
            <details>
              <summary className="flex min-h-11 cursor-pointer items-center font-medium">Notes</summary>
              <p className="whitespace-pre-wrap break-words">{notes}</p>
            </details>
          )}

          <div className="space-y-2">
            <Label htmlFor={statusId} className="text-base font-medium">
              Where you are with this class
            </Label>
            <Select value={isClassStatus(tracker.status) ? tracker.status : "not_started"} onValueChange={(v) => void changeStatus(v)} disabled={statusBusy}>
              <SelectTrigger id={statusId} className="min-h-11 text-base sm:max-w-xs">
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
            <p className="text-sm text-muted-foreground">This is your own record. Changes save right away.</p>
            {statusNote && (
              <p
                role={statusNote.ok ? "status" : "alert"}
                className={statusNote.ok ? "text-sm text-muted-foreground" : "text-sm font-medium text-destructive"}
              >
                {statusNote.text}
              </p>
            )}
          </div>

          <SessionLog
            tracker={tracker}
            sessions={sessions}
            userId={userId}
            canTryCreate={canTryCreate}
            onSaved={onSessionSaved}
            onDeleted={onSessionDeleted}
            onLocked={onLocked}
          />

          <ProofSection tracker={tracker} files={files} filesLoading={filesLoading} onSaved={onTrackerSaved} />

          {calendarOpen && tracker.due_date && (
            <AddDueDateToCalendar
              tracker={tracker}
              caseZone={caseZone}
              userId={userId}
              canTryCreate={canTryCreate}
              onAdded={onCalendarAdded}
              onLocked={onLocked}
              onClose={() => setCalendarOpen(false)}
            />
          )}

          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:flex-wrap">
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onEdit(tracker)}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Change details
              <span className="sr-only"> of {tracker.class_name}</span>
            </Button>
            {tracker.due_date && !calendarOpen && (
              <Button type="button" variant="outline" className="min-h-11" onClick={() => setCalendarOpen(true)}>
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add the due date to my calendar
              </Button>
            )}
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onDelete(tracker)}>
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete
              <span className="sr-only"> {tracker.class_name}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
