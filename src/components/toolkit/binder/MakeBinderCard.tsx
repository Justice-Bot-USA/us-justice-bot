import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileDown, Loader2, ShieldAlert } from "lucide-react";
import LockedFeature from "@/components/toolkit/LockedFeature";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseToolkitAccessResult } from "@/hooks/useToolkitAccess";
import type { BinderExcluded, BinderResult, BinderSourceFile } from "@/lib/binder/exportBinder";
import { BINDER_MAX_INPUT_BYTES, BINDER_MAX_PAGES, mayBeBinderFile, prepareFileForBinder } from "@/lib/binder/prepareFiles";
import { downloadFileBlob, fileLabel, isLinkRow, isStoredFile, signedDownloadUrl } from "@/lib/binder/storage";
import { canCreate } from "@/lib/toolkit/access";
import { toToolkitError } from "@/lib/toolkit/api";
import { SECTIONS, SECTION_LABELS, type CaseFileRow, type Section } from "@/lib/toolkit/types";
import ConfidentialNotice from "./ConfidentialNotice";

const ALL = "all";
const NO_SECTION = "none";
const MB = 1024 * 1024;

/** The person's local date as 'yyyy-MM-dd', built from the clock's parts (never parsed). */
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

interface Prepared {
  sources: BinderSourceFile[];
  /** Files the builder will download and try. */
  candidates: number;
  candidateBytes: number;
  /** Files that can't go in (saved links, Word and other types); listed on the Not included page. */
  skipped: number;
}

function prepare(rows: CaseFileRow[]): Prepared {
  let candidates = 0;
  let candidateBytes = 0;
  let skipped = 0;
  const sources = rows.map((row): BinderSourceFile => {
    const base = { name: fileLabel(row), section: row.section, documentDate: row.document_date, ref: row.id };
    if (isLinkRow(row)) {
      skipped += 1;
      return { ...base, skip: { code: "link" } };
    }
    if (!isStoredFile(row)) {
      skipped += 1;
      return { ...base, skip: { code: "other" } };
    }
    if (!mayBeBinderFile(row.file_type, row.file_name)) {
      skipped += 1;
      return { ...base, skip: { code: "not_supported" } };
    }
    candidates += 1;
    candidateBytes += Math.max(0, Number(row.file_size) || 0);
    // Downloaded only when the builder reaches this file, so one file is in memory at a time.
    return { ...base, load: async () => prepareFileForBinder(await downloadFileBlob(row)) };
  });
  return { sources, candidates, candidateBytes, skipped };
}

type Phase =
  | { kind: "idle" }
  | { kind: "building"; done: number; total: number }
  | { kind: "done"; result: Omit<BinderResult, "pdfBytes">; url: string; fileName: string }
  | { kind: "error" };

export interface MakeBinderCardProps {
  /** This case's files, in the person's order. */
  files: CaseFileRow[];
  /** The case title as the person typed it (printed on the cover). */
  caseTitle: string;
  access: UseToolkitAccessResult;
}

/** "Make my binder PDF" (Toolkit plan). Builds in the browser from the person's own files. */
export default function MakeBinderCard({ files, caseTitle, access }: MakeBinderCardProps) {
  const sectionId = useId();
  const numbersId = useId();
  const [which, setWhich] = useState<string>(ALL);
  const [noPageNumbers, setNoPageNumbers] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const urlRef = useRef<string | null>(null);

  // Stop a running build and free the PDF when leaving the page or switching case.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const sectionChoices = useMemo(() => {
    const present = new Set(files.map((f) => f.section ?? NO_SECTION));
    const choices: { value: string; label: string; count: number }[] = SECTIONS.filter((s) => present.has(s.value)).map((s) => ({
      value: s.value,
      label: s.label,
      count: files.filter((f) => f.section === s.value).length,
    }));
    if (present.has(NO_SECTION)) choices.push({ value: NO_SECTION, label: "No section", count: files.filter((f) => !f.section).length });
    return choices;
  }, [files]);

  const chosen = useMemo(
    () => (which === ALL ? files : files.filter((f) => (f.section ?? NO_SECTION) === which)),
    [files, which],
  );
  const prepared = useMemo(() => prepare(chosen), [chosen]);
  const tooBig = prepared.candidateBytes > BINDER_MAX_INPUT_BYTES;

  if (access.status === "loading") {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 pt-6 text-base text-muted-foreground" role="status">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Checking your plan…
        </CardContent>
      </Card>
    );
  }
  if (!canCreate(access)) return <LockedFeature feature="binder" />;

  function reset() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPhase({ kind: "idle" });
  }

  async function build() {
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase({ kind: "building", done: 0, total: prepared.sources.length });
    try {
      // pdf-lib is loaded only now, so the binder page itself stays small.
      const { buildBinderPdf } = await import("@/lib/binder/exportBinder");
      const generatedOn = localToday();
      const result = await buildBinderPdf({
        caseTitle,
        generatedOn,
        files: prepared.sources,
        pageNumbers: !noPageNumbers,
        maxPages: BINDER_MAX_PAGES,
        signal: controller.signal,
        onProgress: ({ done, total }) => setPhase({ kind: "building", done, total }),
      });
      if (controller.signal.aborted) return;
      const { pdfBytes, ...summary } = result;
      const url = URL.createObjectURL(new Blob([pdfBytes as BlobPart], { type: "application/pdf" }));
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      setPhase({ kind: "done", result: summary, url, fileName: `case-binder-${generatedOn}.pdf` });
    } catch (err) {
      if (controller.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
        setPhase({ kind: "idle" });
        return;
      }
      setPhase({ kind: "error" });
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  async function downloadOne(ref: string | undefined) {
    const row = files.find((f) => f.id === ref);
    if (!row) return;
    try {
      window.location.assign(await signedDownloadUrl(row));
    } catch (err) {
      toast.error(`We couldn't download this file. ${toToolkitError(err).message}`);
    }
  }

  const heading = (
    <CardHeader className="pb-3">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <FileDown className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        Make my binder PDF
      </h2>
    </CardHeader>
  );

  if (phase.kind === "building") {
    const pct = phase.total ? Math.round((phase.done / phase.total) * 100) : 0;
    return (
      <Card>
        {heading}
        <CardContent className="space-y-3 text-base">
          <p role="status" aria-live="polite">
            {phase.done < phase.total ? `Adding file ${phase.done + 1} of ${phase.total}…` : "Putting your binder together…"}
          </p>
          <Progress value={pct} aria-label="Binder progress" />
          <p className="text-muted-foreground">Keep this page open until it's done.</p>
          <Button type="button" variant="outline" className="min-h-11" onClick={() => abortRef.current?.abort()}>
            Stop
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase.kind === "done") {
    const { result } = phase;
    const secured = result.excluded.filter((e) => e.code === "secured");
    const others = result.excluded.filter((e) => e.code !== "secured");
    const row = (e: BinderExcluded, withReason: boolean) => {
      const canDownload = Boolean(files.find((f) => f.id === e.ref && isStoredFile(f)));
      return (
        <li key={`${e.ref ?? e.name}`} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="min-w-0 break-words">
            <span className="font-medium">{e.name}</span>
            {withReason && <span className="block text-sm text-muted-foreground">{e.reason}</span>}
          </span>
          {canDownload && (
            <Button type="button" variant="outline" className="min-h-11 shrink-0" onClick={() => void downloadOne(e.ref)}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download<span className="sr-only"> {e.name}</span>
            </Button>
          )}
        </li>
      );
    };
    return (
      <Card>
        {heading}
        <CardContent className="space-y-4 text-base">
          <p role="status" className="font-medium">
            Your binder is ready: {plural(result.included.length, "document", "documents")}, {plural(result.pageCount, "page", "pages")}.
          </p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <a href={phase.url} download={phase.fileName}>
              <Download className="mr-2 h-5 w-5" aria-hidden="true" />
              Download binder PDF
            </a>
          </Button>

          {secured.length > 0 && (
            <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-50">
              <p className="flex gap-2 font-medium">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {secured.length === 1
                  ? "1 PDF has security settings and can't be added; download it separately."
                  : `${secured.length} PDFs have security settings and can't be added; download them separately.`}
              </p>
              <ul className="space-y-2">{secured.map((e) => row(e, false))}</ul>
            </div>
          )}

          {others.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">
                {others.length === 1 ? "1 other file isn't in the binder:" : `${others.length} other files aren't in the binder:`}
              </p>
              <ul className="space-y-2">{others.map((e) => row(e, true))}</ul>
            </div>
          )}

          {result.excluded.length > 0 && (
            <p className="text-muted-foreground">Files that aren't in the binder are also listed on its last pages.</p>
          )}
          <p className="text-muted-foreground">
            Check every page before you print, share or hand in your binder. It isn't a court filing and isn't formatted to any
            court's rules.
          </p>
          <Button type="button" variant="outline" className="min-h-11" onClick={reset}>
            Make another binder
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Idle (or after an error).
  return (
    <Card>
      {heading}
      <CardContent className="space-y-4 text-base">
        <p>
          Puts this case's PDF, JPG and PNG files into one PDF, in the order shown above, with a cover page and a list of
          contents. Your PDFs keep their own page size; pictures go on letter-size pages.
        </p>
        <ConfidentialNotice place="binder" />

        {files.length === 0 ? (
          <p className="text-muted-foreground">Upload some files first. Then you can make a binder PDF of them.</p>
        ) : (
          <>
            {sectionChoices.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor={sectionId} className="text-base">
                  Which files?
                </Label>
                <Select value={which} onValueChange={setWhich}>
                  <SelectTrigger id={sectionId} className="min-h-11 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL} className="min-h-11 text-base">
                      All files ({files.length})
                    </SelectItem>
                    {sectionChoices.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="min-h-11 text-base">
                        {c.value === NO_SECTION ? c.label : SECTION_LABELS[c.value as Section]} only ({c.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <ul className="list-disc space-y-1 pl-5">
              {prepared.candidates === 0 ? (
                <li>None of these files can go in a binder PDF. Only PDF, JPG and PNG files can.</li>
              ) : (
                <li>{plural(prepared.candidates, "file", "files")} will be added if they can be read.</li>
              )}
              {prepared.candidates > 0 && prepared.skipped > 0 && (
                <li>
                  {prepared.skipped === 1
                    ? "1 file can't go in (only PDF, JPG and PNG files can). It will be listed at the end of the binder."
                    : `${prepared.skipped} files can't go in (only PDF, JPG and PNG files can). They will be listed at the end of the binder.`}
                </li>
              )}
              {prepared.candidates > 0 && (
                <li>PDFs with security settings can't be added. If you have any, we'll list them so you can download them separately.</li>
              )}
            </ul>

            {tooBig && (
              <p role="alert" className="rounded-lg border border-destructive/50 p-3 font-medium text-destructive">
                These files add up to {Math.round(prepared.candidateBytes / MB)} MB. One binder can be made from up to{" "}
                {Math.round(BINDER_MAX_INPUT_BYTES / MB)} MB of files.{" "}
                {sectionChoices.length > 1 ? "Choose one section at a time above." : "Move some files to another case or section first."}
              </p>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id={numbersId}
                checked={noPageNumbers}
                onCheckedChange={(v) => setNoPageNumbers(v === true)}
                className="mt-1 h-5 w-5"
              />
              <div>
                <Label htmlFor={numbersId} className="cursor-pointer text-base font-medium">
                  No page numbers
                </Label>
                <p className="text-sm text-muted-foreground">
                  With page numbers, each page of your documents is shrunk a little so the number doesn't cover anything.
                </p>
              </div>
            </div>

            {phase.kind === "error" && (
              <p role="alert" className="font-medium text-destructive">
                We couldn't make your binder. Please try again. If it keeps happening, make it one section at a time.
              </p>
            )}

            <Button
              type="button"
              className="min-h-11 w-full sm:w-auto"
              onClick={() => void build()}
              disabled={prepared.candidates === 0 || tooBig}
            >
              <FileDown className="mr-2 h-5 w-5" aria-hidden="true" />
              Make my binder PDF
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
