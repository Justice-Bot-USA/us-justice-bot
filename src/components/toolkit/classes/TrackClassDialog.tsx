import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LockedFeature from "@/components/toolkit/LockedFeature";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { signInPath } from "@/lib/signIn";
import { insertClassTracker, toToolkitError } from "@/lib/toolkit/api";
import type { ClassTrackerRow } from "@/lib/toolkit/types";
import { trackerFromCourse, type CourseForTracking } from "./classModel";
import { PROVIDER_NOTE, TRACK_SAVES } from "./copy";

export interface TrackClassDialogProps {
  /** The listing to track; null closes the dialog. */
  course: CourseForTracking | null;
  onClose: () => void;
  /** Called with the new class record after it is saved. */
  onTracked: (row: ClassTrackerRow) => void;
}

type Phase = "ready" | "saving" | "done" | "locked";

function TrackClassBody({ course, onClose, onTracked }: { course: CourseForTracking; onClose: () => void; onTracked: (row: ClassTrackerRow) => void }) {
  const { user, loading: authLoading } = useAuth();
  const access = useToolkitAccess();
  const [phase, setPhase] = useState<Phase>("ready");
  const [error, setError] = useState<string | null>(null);

  // Check the plan first. If the check itself failed, let the person try: the database decides.
  const canTry = access.status === "active" || (access.status !== "loading" && Boolean(access.checkFailed));

  const track = async () => {
    if (!user) return;
    setPhase("saving");
    setError(null);
    try {
      const row = await insertClassTracker(user.id, trackerFromCourse(course));
      onTracked(row);
      setPhase("done");
    } catch (err) {
      const e = toToolkitError(err);
      if (e.kind === "locked") {
        setPhase("locked");
        void access.refresh();
      } else {
        setPhase("ready");
        setError(e.message);
      }
    }
  };

  let body;
  if (authLoading || (user && access.status === "loading")) {
    body = (
      <p role="status" className="flex items-center gap-2 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Checking your plan…
      </p>
    );
  } else if (!user) {
    body = (
      <div className="space-y-3">
        <p className="text-base">Sign in to track classes. Your class records are private to your account.</p>
        <Button asChild className="min-h-11 w-full sm:w-auto">
          <Link to={signInPath("/courses")}>Sign in</Link>
        </Button>
      </div>
    );
  } else if (phase === "done") {
    body = (
      <div className="space-y-3" role="status">
        <p className="text-base font-medium">Added to your class tracker.</p>
        <p className="text-base">Open it to type in the hours, the due date and anything else from your own papers.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="min-h-11">
            <Link to="/toolkit/classes">Open class tracker</Link>
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  } else if (phase === "locked" || !canTry) {
    body = (
      <div className="space-y-3">
        <LockedFeature feature="classes" />
        <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  } else {
    body = (
      <div className="space-y-3">
        <p className="text-base">{TRACK_SAVES}</p>
        {error && (
          <p role="alert" className="text-base font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="min-h-11" onClick={() => void track()} disabled={phase === "saving"}>
            {phase === "saving" ? "Adding…" : "Add to my class tracker"}
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={onClose} disabled={phase === "saving"}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle className="text-xl">Track this class</DialogTitle>
        <DialogDescription asChild>
          <div className="space-y-1 text-base text-foreground">
            <p className="break-words font-semibold">{course.title}</p>
            {course.provider_name && <p className="break-words text-muted-foreground">{course.provider_name}</p>}
          </div>
        </DialogDescription>
      </DialogHeader>
      <p className="rounded-lg border bg-muted/40 p-3 text-base">{PROVIDER_NOTE}</p>
      {body}
    </>
  );
}

/**
 * "Track this class" from a Course Hub listing. Checks the plan first and shows the plan note
 * instead when there is none. Saves only the class name, provider and link (never hours or dates).
 */
export default function TrackClassDialog({ course, onClose, onTracked }: TrackClassDialogProps) {
  return (
    <Dialog open={course !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-lg">
        {course && <TrackClassBody key={course.id} course={course} onClose={onClose} onTracked={onTracked} />}
      </DialogContent>
    </Dialog>
  );
}
