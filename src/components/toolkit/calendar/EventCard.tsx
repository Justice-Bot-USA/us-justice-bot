import { useId } from "react";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeTime } from "@/lib/toolkit/api";
import { ALARMS, KINDS, labelFor } from "@/lib/toolkit/types";
import type { CalendarEventRow } from "@/lib/toolkit/types";
import { dateText, placeLines, sortAlarms, timeText } from "./calendarModel";
import { PAST_LABEL } from "./copy";

export interface EventCardProps {
  row: CalendarEventRow;
  /** The linked case's title, if any (shown on screen only). */
  caseTitle?: string | null;
  /** The entry's date is before today. The only thing ever said about it is "Past". */
  isPast: boolean;
  onExport: (row: CalendarEventRow) => void;
  onEdit: (row: CalendarEventRow) => void;
  onDelete: (row: CalendarEventRow) => void;
}

/** One saved date: what the person typed, read back in words, with export, change and delete. */
export default function EventCard({ row, caseTitle, isPast, onExport, onEdit, onDelete }: EventCardProps) {
  const headingId = useId();
  const time = normalizeTime(row.start_time);
  const places = placeLines(row);
  const alarms = sortAlarms(row.alarms ?? []);
  const notes = (row.notes ?? "").trim();
  const source = (row.source_note ?? "").trim();

  return (
    <li>
      <Card>
        <CardContent className="space-y-3 p-4 text-base sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{labelFor(KINDS, row.kind)}</span>
            {isPast && (
              <Badge variant="secondary" className="text-sm">
                {PAST_LABEL}
              </Badge>
            )}
          </div>

          <h3 id={headingId} className="break-words text-lg font-semibold">
            {row.title}
          </h3>

          <p>
            <time dateTime={time ? `${row.event_date}T${time}` : row.event_date} className="block font-semibold">
              {dateText(row)}
            </time>
            <span className="block">{timeText(row)}</span>
          </p>

          {places.length > 0 && (
            <p className="break-words">
              {places.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          )}

          {caseTitle && (
            <p className="break-words text-sm text-muted-foreground">
              <span className="font-medium">Case:</span> {caseTitle}
            </p>
          )}
          {source && (
            <p className="break-words text-sm text-muted-foreground">
              <span className="font-medium">Where this date came from:</span> {source}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Alerts:</span>{" "}
            {alarms.length ? alarms.map((a) => labelFor(ALARMS, a)).join("; ") : "None"}
          </p>
          {notes && (
            <details className="text-sm">
              <summary className="flex min-h-11 cursor-pointer items-center font-medium">Notes</summary>
              <p className="whitespace-pre-wrap break-words">{notes}</p>
            </details>
          )}

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <Button type="button" className="min-h-11" onClick={() => onExport(row)}>
              <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add to my phone's calendar
              <span className="sr-only">: {row.title}</span>
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Change
              <span className="sr-only"> {row.title}</span>
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onDelete(row)}>
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete
              <span className="sr-only"> {row.title}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
