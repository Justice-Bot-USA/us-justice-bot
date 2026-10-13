import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ToolkitLayout from "@/components/toolkit/ToolkitLayout";
import CasePicker from "@/components/toolkit/CasePicker";
import BinderUploader from "@/components/toolkit/binder/BinderUploader";
import BinderFileList from "@/components/toolkit/binder/BinderFileList";
import MakeBinderCard from "@/components/toolkit/binder/MakeBinderCard";
import DeleteAllFilesCard from "@/components/toolkit/binder/DeleteAllFilesCard";
import { useBinderFiles } from "@/components/toolkit/binder/useBinderFiles";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { useToolkitCases } from "@/lib/toolkit/cases";

const NOT_LINKED_LABEL = "Files not linked to a case";
const UNTITLED_BINDER = "My documents";

/**
 * /toolkit/binder: upload, view, rename, organize, download and delete your files (free for
 * everyone), and make one binder PDF of a case's files (Toolkit plan).
 *
 * Privacy: case titles, file names and notes are shown only on this screen. Nothing here sends
 * them to analytics or the console, and the route carries no identifying query parameters. A page
 * that links here for one case (CaseJourney) passes its id in router state ({ caseId }), which
 * stays out of the URL.
 */
export default function BinderPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const access = useToolkitAccess();
  const { cases, isLoading: casesLoading, byId } = useToolkitCases();
  const binder = useBinderFiles(userId);
  const location = useLocation();
  const requestedCaseId = (location.state as { caseId?: unknown } | null)?.caseId;

  // undefined until a default is picked; null means "not linked to a case".
  const [caseId, setCaseId] = useState<string | null | undefined>(undefined);

  // Start on the case the previous page asked for, when it is one of the person's cases. Otherwise
  // start on the first open case that has files, else the first open case, else unlinked files.
  useEffect(() => {
    if (caseId !== undefined || casesLoading || !userId) return;
    const requested = typeof requestedCaseId === "string" ? cases.find((c) => c.id === requestedCaseId) : undefined;
    if (requested) {
      setCaseId(requested.id);
      return;
    }
    if (binder.isLoading) return;
    const withFiles = new Set(binder.files.map((f) => f.case_id).filter(Boolean));
    const open = cases.filter((c) => !c.archived_at);
    const first = open.find((c) => withFiles.has(c.id)) ?? cases.find((c) => withFiles.has(c.id)) ?? open[0] ?? null;
    const unlinkedOnly = binder.files.length > 0 && binder.files.every((f) => !f.case_id);
    setCaseId(unlinkedOnly ? null : (first?.id ?? null));
  }, [caseId, casesLoading, binder.isLoading, binder.files, cases, userId, requestedCaseId]);

  const selectedId = caseId ?? null;
  const selectedCase = byId(selectedId);
  const caseFiles = useMemo(
    () => binder.files.filter((f) => (f.case_id ?? null) === selectedId),
    [binder.files, selectedId],
  );
  const unlinkedCount = useMemo(() => binder.files.filter((f) => !f.case_id).length, [binder.files]);
  const destinationLabel = selectedCase ? selectedCase.case_title : NOT_LINKED_LABEL;

  return (
    <ToolkitLayout
      title="Case binder"
      description="Keep your case papers in one place, in the order you want, and make one PDF of them."
      intro="Keep your papers for each case in one place, in the order you want. Uploading, organizing, downloading and deleting your files is free."
    >
      {userId && (
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-2 pt-6">
              <CasePicker
                value={selectedId}
                onChange={(id) => setCaseId(id)}
                label="Which case?"
                noneLabel={NOT_LINKED_LABEL}
                disabled={caseId === undefined && (casesLoading || binder.isLoading)}
              />
              {!binder.isLoading && (
                <p className="text-sm text-muted-foreground">
                  {caseFiles.length === 1 ? "1 file here." : `${caseFiles.length} files here.`}
                  {selectedId && unlinkedCount > 0
                    ? ` You also have ${unlinkedCount === 1 ? "1 file" : `${unlinkedCount} files`} not linked to a case.`
                    : ""}
                </p>
              )}
            </CardContent>
          </Card>

          <BinderUploader
            userId={userId}
            caseId={selectedId}
            destinationLabel={destinationLabel}
            onUploaded={() => void binder.invalidate()}
          />

          <BinderFileList
            files={caseFiles}
            isLoading={binder.isLoading}
            loadError={binder.error ? binder.error.message : null}
            onRetry={binder.refetch}
            onSave={binder.save}
            onMove={(index, direction) => binder.move(caseFiles, index, direction)}
            onDeleted={(id) => binder.forget([id])}
          />

          <MakeBinderCard
            key={selectedId ?? "not-linked"}
            files={caseFiles}
            caseTitle={selectedCase?.case_title ?? UNTITLED_BINDER}
            access={access}
          />

          <DeleteAllFilesCard userId={userId} files={binder.files} onDone={binder.invalidate} />
        </div>
      )}
    </ToolkitLayout>
  );
}
