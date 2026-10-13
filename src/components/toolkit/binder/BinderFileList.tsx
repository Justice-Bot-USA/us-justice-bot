import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Download, Eye, FileImage, FileText, File as FileIcon, Link2, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortDate } from "@/lib/calendar/dates";
import { mayBeBinderFile } from "@/lib/binder/prepareFiles";
import { deleteBinderFile, fileLabel, isLinkRow, isStoredFile, signedDownloadUrl, signedViewUrl } from "@/lib/binder/storage";
import { toToolkitError } from "@/lib/toolkit/api";
import { SECTION_LABELS, type CaseFilePatch, type CaseFileRow } from "@/lib/toolkit/types";
import EditFileDialog from "./EditFileDialog";
import { formatBytes } from "./useBinderFiles";

export interface BinderFileListProps {
  files: CaseFileRow[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onSave: (id: string, patch: CaseFilePatch) => Promise<unknown>;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
  /** Called with the id of a file whose row was deleted. */
  onDeleted: (id: string) => void;
}

function iconFor(file: CaseFileRow) {
  if (isLinkRow(file)) return Link2;
  const type = (file.file_type ?? "").toLowerCase();
  if (type.startsWith("image/")) return FileImage;
  if (type === "application/pdf") return FileText;
  return FileIcon;
}

function FileCard({
  file,
  index,
  count,
  onEdit,
  onMove,
  onDeleted,
}: {
  file: CaseFileRow;
  index: number;
  count: number;
  onEdit: () => void;
  onMove: (direction: -1 | 1) => Promise<void>;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState<"" | "view" | "download" | "move" | "delete">("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const label = fileLabel(file);
  const Icon = iconFor(file);
  const stored = isStoredFile(file);
  const link = isLinkRow(file);
  const safeLink = link && /^https:\/\//i.test(file.file_path);
  const details = [
    file.section ? SECTION_LABELS[file.section] : "",
    file.document_date ? `Dated ${formatShortDate(file.document_date)}` : "",
    stored ? formatBytes(file.file_size) : "",
  ].filter(Boolean);

  async function view() {
    // Open the tab now, while the tap still counts, then point it at the file (phones block late pop-ups).
    const win = window.open("", "_blank");
    setBusy("view");
    try {
      const url = await signedViewUrl(file);
      if (win) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch (err) {
      win?.close();
      toast.error(`We couldn't open this file. ${toToolkitError(err).message}`);
    } finally {
      setBusy("");
    }
  }

  async function download() {
    setBusy("download");
    try {
      // The link tells the browser to save the file, so this page stays open.
      window.location.assign(await signedDownloadUrl(file));
    } catch (err) {
      toast.error(`We couldn't download this file. ${toToolkitError(err).message}`);
    } finally {
      setBusy("");
    }
  }

  async function move(direction: -1 | 1) {
    setBusy("move");
    try {
      await onMove(direction);
    } catch (err) {
      toast.error(`We couldn't change the order. ${toToolkitError(err).message}`);
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    setBusy("delete");
    try {
      const outcome = await deleteBinderFile(file);
      if (outcome === "deleted") {
        toast.success("File deleted.");
        onDeleted();
      } else {
        toast.error("We couldn't delete the stored copy of this file, so it is still in your binder. Please try again.");
      }
    } catch (err) {
      toast.error(`We couldn't delete this file. ${toToolkitError(err).message}`);
    } finally {
      setBusy("");
      setConfirmDelete(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-6 shrink-0 text-right font-semibold text-muted-foreground" aria-hidden="true">
            {index + 1}.
          </span>
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="break-words font-semibold">{label}</p>
            {file.display_name && file.display_name.trim() !== file.file_name && (
              <p className="break-all text-sm text-muted-foreground">File: {file.file_name}</p>
            )}
            {details.length > 0 && <p className="text-sm text-muted-foreground">{details.join(" · ")}</p>}
            {file.notes && <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm">{file.notes}</p>}
            {link && <p className="text-sm text-muted-foreground">A saved link to a file stored somewhere else.</p>}
            {stored && !mayBeBinderFile(file.file_type, file.file_name) && (
              <p className="text-sm text-muted-foreground">Can't go in a binder PDF (only PDF, JPG and PNG can).</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {stored && (
            <>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => void view()} disabled={Boolean(busy)}>
                {busy === "view" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Eye className="mr-2 h-4 w-4" aria-hidden="true" />}
                View<span className="sr-only"> {label}</span>
              </Button>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => void download()} disabled={Boolean(busy)}>
                {busy === "download" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Download<span className="sr-only"> {label}</span>
              </Button>
            </>
          )}
          {safeLink && (
            <Button asChild variant="outline" className="min-h-11">
              <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Open link<span className="sr-only"> {label}</span>
              </a>
            </Button>
          )}
          <Button type="button" variant="outline" className="min-h-11" onClick={onEdit} disabled={Boolean(busy)}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit details<span className="sr-only"> for {label}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-11 p-0"
            onClick={() => void move(-1)}
            disabled={Boolean(busy) || index === 0}
            aria-label={`Move ${label} up`}
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-11 p-0"
            onClick={() => void move(1)}
            disabled={Boolean(busy) || index === count - 1}
            aria-label={`Move ${label} down`}
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
            disabled={Boolean(busy)}
          >
            {busy === "delete" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />}
            Delete<span className="sr-only"> {label}</span>
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={confirmDelete} onOpenChange={(open) => busy !== "delete" && setConfirmDelete(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription className="break-words text-base">
              “{label}” will be deleted from your account for good. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="min-h-11" disabled={busy === "delete"}>
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              className="min-h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy === "delete"}
              onClick={(e) => {
                e.preventDefault();
                void remove();
              }}
            >
              {busy === "delete" && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Delete file
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

/** One case's files, in the person's chosen order, with view, download, edit, reorder and delete. */
export default function BinderFileList({ files, isLoading, loadError, onRetry, onSave, onMove, onDeleted }: BinderFileListProps) {
  const [editing, setEditing] = useState<CaseFileRow | null>(null);

  return (
    <section aria-labelledby="binder-files-heading" className="space-y-3">
      <h2 id="binder-files-heading" className="text-xl font-semibold">
        Files{files.length > 0 ? ` (${files.length})` : ""}
      </h2>
      {files.length > 1 && (
        <p className="text-base text-muted-foreground">Use the arrows to put your files in the order you want. A binder PDF uses this order.</p>
      )}

      {isLoading ? (
        <p className="flex items-center gap-2 text-base text-muted-foreground" role="status">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading your files…
        </p>
      ) : loadError ? (
        <div className="rounded-lg border p-4 text-base" role="alert">
          <p>We couldn't load your files. {loadError}</p>
          <Button type="button" variant="outline" className="mt-2 min-h-11" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : files.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-base text-muted-foreground">No files here yet. Upload a PDF, JPG or PNG above.</p>
      ) : (
        <ol className="space-y-3">
          {files.map((file, i) => (
            <li key={file.id}>
              <FileCard
                file={file}
                index={i}
                count={files.length}
                onEdit={() => setEditing(file)}
                onMove={(direction) => onMove(i, direction)}
                onDeleted={() => onDeleted(file.id)}
              />
            </li>
          ))}
        </ol>
      )}

      <EditFileDialog file={editing} onClose={() => setEditing(null)} onSave={onSave} />
    </section>
  );
}
