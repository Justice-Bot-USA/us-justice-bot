import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { signInPath } from "@/lib/signIn";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap, ExternalLink, CheckCircle2, Clock, BookOpen, Shield,
  AlertTriangle, FileDown, Upload, Loader2, FileText, Hash,
} from "lucide-react";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import TrackClassDialog from "@/components/toolkit/classes/TrackClassDialog";
import { useClassData } from "@/components/toolkit/classes/useClassData";
import { PROVIDER_NOTE } from "@/components/toolkit/classes/copy";
import { statusLabel, type CourseForTracking } from "@/components/toolkit/classes/classModel";
import { formatLongDate, todayInZone } from "@/lib/calendar/dates";
import { listCaseFiles } from "@/lib/toolkit/api";
import type { CaseFileRow } from "@/lib/toolkit/types";

type Course = {
  id: string;
  title: string;
  description: string | null;
  provider_name: string;
  provider_url: string | null;
  course_type: string;
  acceptance_label: string;
  jurisdictions: string[];
  hours_required: number | null;
  lms_launch_url: string | null;
  lms_type: string | null;
};

/** Rows in the Course Hub's older course list (course_enrollments). Nothing adds to it any more. */
type SavedCourse = {
  id: string;
  course_id: string;
  enrolled_at: string;
};

type Certificate = {
  id: string;
  course_title: string;
  provider_name: string;
  hours_completed: number;
  completion_date: string;
  certificate_hash: string;
  certificate_file_path: string | null;
  audit_timestamp: string;
};

/** Shape of court-export-pdf's report (only the parts used here). */
type ExportReport = {
  enrollments?: { courseTitle?: string; provider?: string; enrolledAt?: string | null }[];
  certificates?: { courseTitle?: string; provider?: string; hoursCompleted?: number | null; completionDate?: string; certificateHash?: string }[];
};

// Keys are the acceptance_label values stored in the database (a CHECK constraint fixes them).
// The display text describes the kind of course only: we have not checked any course with a court.
const ACCEPTANCE_LABEL_STYLES: Record<string, { display: string; bg: string; icon: typeof Shield }> = {
  "Court-Ordered (External Provider Required)": {
    display: "Your court may name the providers it accepts",
    bg: "bg-destructive/10 text-destructive border-destructive/30",
    icon: AlertTriangle,
  },
  "Commonly Accepted in Some Jurisdictions": {
    display: "Parent education: check with your court",
    bg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    icon: Shield,
  },
  "Supplementary / Skill-Building": {
    display: "Supplementary / Skill-Building",
    bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    icon: BookOpen,
  },
};

const acceptanceDisplay = (label: string) => ACCEPTANCE_LABEL_STYLES[label]?.display ?? label;

const STATE_REGISTRY = {
  CA: {
    // No statewide list exists; each county court publishes its own approved providers.
    label: "California Courts (your county court)",
    url: "https://www.courts.ca.gov/find-my-court.htm",
  },
};

// Live only in California and New York; no New York courses are listed yet.
const LIVE_JURISDICTIONS = ["CA", "NY"];
const liveJurisdictions = (course: Course) => course.jurisdictions.filter(j => LIVE_JURISDICTIONS.includes(j));

const STATE_FILTER_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "CA", label: "California" },
];

const MAX_CERT_FILE_BYTES = 20 * 1024 * 1024;
const CERT_FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const CERT_FILE_EXTENSIONS = /\.(pdf|jpe?g|png)$/i;

/**
 * The page that shows a saved certificate record (only the account that saved it can open it).
 * Its route is /records/:id (App.tsx; old /verify/:id links redirect there).
 */
const RECORD_PAGE_PATH = "/records/";

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");

// Generate a SHA-256 hash in browser
async function sha256(data: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)));
}

// SHA-256 of the file's exact bytes, so anyone holding the file can recompute and compare it.
async function sha256File(file: File): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", await file.arrayBuffer()));
}

const referenceId = (hash: string) => `JB-${hash.substring(0, 12).toUpperCase()}`;

/** Today's date on this device, for a file name only. */
function localToday(): string {
  try {
    return todayInZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return todayInZone("America/New_York");
  }
}

export default function CourseHub() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [stateFilter, setStateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [trackTarget, setTrackTarget] = useState<CourseForTracking | null>(null);
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // Class tracker records (the person's own). Reading them is free; adding one needs the Toolkit.
  const classes = useClassData(userId);

  const coursesQuery = useQuery({
    queryKey: ["course-hub", "courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("is_active", true).order("title");
      if (error) throw error;
      return (data ?? []) as unknown as Course[];
    },
    staleTime: 5 * 60_000,
  });

  const savedCoursesQuery = useQuery({
    queryKey: ["course-hub", "saved-courses", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("course_enrollments").select("id, course_id, enrolled_at").eq("user_id", userId as string);
      if (error) throw error;
      return (data ?? []) as SavedCourse[];
    },
    enabled: Boolean(userId),
  });

  const certificatesQuery = useQuery({
    queryKey: ["course-hub", "certificates", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_certificates")
        .select("id, course_title, provider_name, hours_completed, completion_date, certificate_hash, certificate_file_path, audit_timestamp")
        .eq("user_id", userId as string)
        .order("audit_timestamp", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Certificate[];
    },
    enabled: Boolean(userId),
  });

  const courses = coursesQuery.data ?? [];
  const loading = coursesQuery.isPending;
  const savedCourses = savedCoursesQuery.data ?? [];
  const certificates = certificatesQuery.data ?? [];

  // Certificate upload state
  const [uploadingCert, setUploadingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    course_title: "",
    provider_name: "",
    hours_completed: "",
    completion_date: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPdf = async () => {
    if (!user) {
      toast.error("Please sign in to download your records.");
      return;
    }
    setExporting(true);
    try {
      // The function records that an export was made and returns the certificates and the older
      // course list. Class tracker records come from the person's own rows.
      const { data, error } = await supabase.functions.invoke("court-export-pdf", {
        body: { userId: user.id },
      });
      if (error) throw error;
      const report = (data?.report ?? null) as ExportReport | null;
      if (!report) throw new Error("no report");

      let files: CaseFileRow[] = [];
      try {
        files = await listCaseFiles(user.id);
      } catch {
        files = [];
      }
      const fileById = new Map(files.map(f => [f.id, f]));
      const { buildClassRecordsPdf, classRecordsFileName, saveBlob } = await import("@/components/toolkit/classes/recordsPdf");
      const { fileLabel } = await import("@/lib/binder/storage");

      const blob = await buildClassRecordsPdf({
        classes: classes.trackers.map(tracker => {
          const proof = tracker.proof_file_id ? fileById.get(tracker.proof_file_id) : undefined;
          return { tracker, sessions: classes.sessionsFor(tracker.id), proofFileLabel: proof ? fileLabel(proof) : null };
        }),
        certificates: (report.certificates ?? []).map(c => ({
          courseTitle: c.courseTitle ?? "",
          provider: c.provider ?? "",
          hours: c.hoursCompleted ?? null,
          completionDate: c.completionDate ?? "",
          referenceId: c.certificateHash ? referenceId(c.certificateHash) : "",
        })),
        savedCourses: (report.enrollments ?? []).map(e => ({
          courseTitle: e.courseTitle ?? "",
          provider: e.provider ?? "",
          addedAt: e.enrolledAt ?? null,
        })),
        reference: typeof data?.documentHash === "string" ? data.documentHash : null,
        generatedAt: new Date().toISOString(),
      });
      saveBlob(blob, classRecordsFileName(localToday()));
      toast.success("Your records PDF is downloading.");
    } catch {
      toast.error("We couldn't make the PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleCertificateUpload = async () => {
    if (!user) {
      toast.error("Please sign in to upload certificates.");
      return;
    }
    const { course_title, provider_name, hours_completed, completion_date } = certForm;
    if (!course_title || !provider_name || !hours_completed || !completion_date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const hours = Number(hours_completed);
    if (!Number.isFinite(hours) || hours < 0) {
      toast.error("Type the hours as a number, like 6 or 1.5.");
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (file && file.size > MAX_CERT_FILE_BYTES) {
      toast.error("That file is larger than 20 MB. Please choose a smaller file.");
      return;
    }
    if (file && !CERT_FILE_TYPES.has(file.type) && !CERT_FILE_EXTENSIONS.test(file.name)) {
      toast.error("Choose a PDF, JPG or PNG file.");
      return;
    }

    setUploadingCert(true);
    let uploadedPath: string | null = null;
    try {
      // With a file, the hash is the SHA-256 of the file's bytes (its fingerprint). Without one, it
      // covers only the typed-in details plus a timestamp, so it says nothing about any file.
      const hash = file
        ? await sha256File(file)
        : await sha256(`${user.id}|${course_title}|${provider_name}|${completion_date}|${Date.now()}`);
      const verificationId = hash.substring(0, 12).toUpperCase();

      // The reference ID comes from the hash, so the same file saved twice would get the same ID.
      const duplicate = certificates.find(c => c.certificate_hash === hash);
      if (duplicate) {
        toast.info(`You already saved this file. Reference ID: JB-${verificationId}`);
        return;
      }

      // Upload the file to private storage. No long-lived link is saved: "View File" makes a
      // fresh 5-minute link each time.
      if (file) {
        const ext = (file.name.split(".").pop() ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 5) || "pdf";
        const path = `${user.id}/certificates/${verificationId}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("user-uploads")
          .upload(path, file, { upsert: true });
        // Don't save a record that points to a file we don't have.
        if (uploadError) throw new Error("upload");
        uploadedPath = path;
      }

      const { error: insertError } = await supabase.from("course_certificates").insert({
        user_id: user.id,
        enrollment_id: null,
        course_title,
        provider_name,
        hours_completed: hours,
        completion_date,
        certificate_hash: hash,
        certificate_url: null,
        certificate_file_path: uploadedPath,
        verification_link: null,
        audit_timestamp: new Date().toISOString(),
        metadata: {
          verification_id: `JB-${verificationId}`,
          upload_source: "manual",
          file_uploaded: !!uploadedPath,
          // "file": certificate_hash is the SHA-256 of the uploaded file. "details": typed-in details only.
          hash_source: file ? "file" : "details",
        },
      });

      if (insertError) {
        // Don't leave a stored file with no record pointing to it.
        if (uploadedPath) await supabase.storage.from("user-uploads").remove([uploadedPath]);
        uploadedPath = null;
        throw insertError;
      }

      toast.success(`Certificate saved. Reference ID: JB-${verificationId}`);
      setCertForm({ course_title: "", provider_name: "", hours_completed: "", completion_date: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      void certificatesQuery.refetch();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message === "upload"
          ? "We couldn't upload the file. Please try again."
          : "We couldn't save the certificate. Please try again.",
      );
    } finally {
      setUploadingCert(false);
    }
  };

  // The courses migration hides Texas- and Florida-only rows; this keeps them out even before it runs.
  const filteredCourses = courses.filter(c => {
    if (liveJurisdictions(c).length === 0) return false;
    if (stateFilter !== "all" && !c.jurisdictions.includes(stateFilter)) return false;
    if (typeFilter !== "all" && c.course_type !== typeFilter) return false;
    return true;
  });

  // Listings saved to the older course list, shown with the listing if it is still active.
  const mySavedCourses = savedCourses.map(saved => ({
    saved,
    course: courses.find(c => c.id === saved.course_id) ?? null,
  }));

  const trackedCourseIds = new Set(classes.trackers.map(t => t.course_id).filter(Boolean));

  return (
    <>
      <SEOHead
        title="Course Hub | Justice Bot USA"
        description="Find parenting and co-parenting courses offered by outside providers, and keep copies of your course certificates. We don't check providers or certificates; ask your court which classes it accepts."
      />
      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10" aria-hidden="true" />
              <h1 className="text-3xl md:text-4xl font-bold">Course Hub</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Find parenting and co-parenting courses offered by outside providers, and keep copies of your
              certificates. Check with your court that a course is accepted.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>Justice Bot USA does not create course content and is not a course provider. We help you keep your own records.</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-muted border-b">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Justice Bot USA does not verify that you finished a course, and we don't know whether a
              course meets your court order. Before you sign up, confirm with your court or caseworker that the course is accepted
              and ask how to give them proof that you finished it. We only keep the records you enter.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="browse" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="h-auto flex-wrap">
                <TabsTrigger value="browse" className="min-h-11">Browse Courses</TabsTrigger>
                <TabsTrigger value="my-classes" className="min-h-11">My Classes</TabsTrigger>
                <TabsTrigger value="certificates" className="min-h-11">Certificates</TabsTrigger>
              </TabsList>
              {user && (
                <Button type="button" variant="outline" className="min-h-11" onClick={() => void handleExportPdf()} disabled={exporting || classes.isLoading}>
                  {exporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileDown className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  Download my records (PDF)
                </Button>
              )}
            </div>

            {/* ── Browse ── */}
            <TabsContent value="browse" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-48 min-h-11" aria-label="Filter by state">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_FILTER_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48 min-h-11" aria-label="Filter by type">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="parenting">Parenting</SelectItem>
                    <SelectItem value="reunification">Reunification</SelectItem>
                    <SelectItem value="supplementary">Supplementary</SelectItem>
                    <SelectItem value="skill-building">Skill-Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course category legend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Course Categories</CardTitle>
                  <CardDescription className="text-xs">
                    These describe the kind of course. They don't mean a court has approved it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {Object.entries(ACCEPTANCE_LABEL_STYLES).map(([label, style]) => {
                    const Icon = style.icon;
                    return (
                      <div key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${style.bg}`}>
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                        {style.display}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
              ) : filteredCourses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">No Courses Available Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No courses are listed yet. Ask your court or case worker which course providers it accepts.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map(course => {
                    const labelStyle = ACCEPTANCE_LABEL_STYLES[course.acceptance_label];
                    const LabelIcon = labelStyle?.icon || Shield;
                    const isTracked = trackedCourseIds.has(course.id);

                    return (
                      <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit ${labelStyle?.bg || ''}`}>
                            <LabelIcon className="w-3 h-3" aria-hidden="true" />
                            {acceptanceDisplay(course.acceptance_label)}
                          </div>
                          <CardDescription className="mt-2">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end gap-3">
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>Provider:</strong> {course.provider_name}</p>
                            {course.hours_required && (
                              <p className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Length listed by the provider: {course.hours_required} hours
                              </p>
                            )}
                            {liveJurisdictions(course).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {liveJurisdictions(course).map(j => (
                                  <Badge key={j} variant="outline" className="text-xs">{j}</Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">{PROVIDER_NOTE}</p>

                          {/* Where to check which providers a court accepts */}
                          {liveJurisdictions(course).map(j => {
                            const reg = STATE_REGISTRY[j as keyof typeof STATE_REGISTRY];
                            if (!reg) return null;
                            return (
                              <a
                                key={j}
                                href={reg.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                              >
                                Check {reg.label} for accepted providers
                                <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                              </a>
                            );
                          })}

                          <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:flex-wrap">
                            {course.lms_launch_url && (
                              <Button variant="outline" className="min-h-11" asChild>
                                <a href={course.lms_launch_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                  Provider Site
                                </a>
                              </Button>
                            )}
                            {isTracked ? (
                              <Button variant="secondary" className="min-h-11" asChild>
                                <Link to="/toolkit/classes">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                  In your class tracker
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                className="min-h-11"
                                onClick={() =>
                                  setTrackTarget({
                                    id: course.id,
                                    title: course.title,
                                    provider_name: course.provider_name,
                                    provider_url: course.provider_url,
                                    lms_launch_url: course.lms_launch_url,
                                  })
                                }
                              >
                                Track this class
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── My Classes ── */}
            <TabsContent value="my-classes" className="space-y-4">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to see the classes you're tracking.</p>
                    <Button asChild className="min-h-11"><Link to={signInPath()}>Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardContent className="space-y-3 pt-6 text-base">
                      <p>
                        Your classes are in your class tracker. There you can log sessions and hours, add the due date from
                        your papers, and record your proof. Adding a class needs the Toolkit plan; seeing, changing and
                        deleting the ones you saved is free.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tracking a class does not sign you up with the provider, and Justice Bot USA does not verify that you
                        finished it. Confirm with your court or caseworker that the class meets your order.
                      </p>
                      <Button asChild className="min-h-11 w-full sm:w-auto">
                        <Link to="/toolkit/classes">Open class tracker</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {classes.isLoading ? (
                    <div className="text-center py-6 text-muted-foreground">Loading your classes...</div>
                  ) : classes.trackers.length === 0 ? (
                    <p className="text-muted-foreground">You aren't tracking any classes yet.</p>
                  ) : (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {classes.trackers.map(tracker => (
                        <li key={tracker.id}>
                          <Card>
                            <CardContent className="space-y-2 pt-6">
                              <Badge variant="secondary">{statusLabel(tracker.status)}</Badge>
                              <p className="font-semibold break-words">{tracker.class_name}</p>
                              {tracker.provider_name && (
                                <p className="text-sm text-muted-foreground break-words">{tracker.provider_name}</p>
                              )}
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  )}

                  {mySavedCourses.length > 0 && (
                    <section className="space-y-3 pt-4" aria-labelledby="saved-courses-heading">
                      <h2 id="saved-courses-heading" className="text-lg font-semibold">Courses you saved before the class tracker</h2>
                      <p className="text-sm text-muted-foreground">
                        These are kept as you saved them and are included when you download your records.
                      </p>
                      <ul className="grid gap-4 md:grid-cols-2">
                        {mySavedCourses.map(({ saved, course }) => (
                          <li key={saved.id}>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">{course?.title ?? "A course you saved"}</CardTitle>
                                <CardDescription>
                                  {course?.provider_name ?? "This course is no longer listed in Course Hub."}
                                </CardDescription>
                              </CardHeader>
                              {course?.lms_launch_url && (
                                <CardContent>
                                  <Button variant="outline" className="min-h-11" asChild>
                                    <a href={course.lms_launch_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                      Provider Site
                                    </a>
                                  </Button>
                                </CardContent>
                              )}
                            </Card>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              )}
            </TabsContent>

            {/* ── Certificates ── */}
            <TabsContent value="certificates" className="space-y-6">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to manage your certificates.</p>
                    <Button asChild className="min-h-11"><Link to={signInPath()}>Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Upload Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" aria-hidden="true" />
                        Upload Completion Certificate
                      </CardTitle>
                      <CardDescription>
                        Keep a copy of your course completion certificate here. We record when you added it and give it a
                        reference ID. If you attach the file, the reference ID comes from the file's SHA-256 fingerprint, so
                        anyone with the same file can check it is unchanged; it does not show the certificate is genuine.
                        This is your own record, not verification from the course provider; your court may require the
                        provider's original certificate. To use a certificate as proof in your class tracker, upload it to
                        your case binder.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="cert-course-title" className="text-sm font-medium">Course Title *</Label>
                          <Input
                            id="cert-course-title"
                            className="min-h-11 text-base md:text-sm"
                            placeholder="e.g. Children in Between"
                            value={certForm.course_title}
                            onChange={e => setCertForm(f => ({ ...f, course_title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cert-provider" className="text-sm font-medium">Provider Name *</Label>
                          <Input
                            id="cert-provider"
                            className="min-h-11 text-base md:text-sm"
                            placeholder="e.g. Center for Divorce Education"
                            value={certForm.provider_name}
                            onChange={e => setCertForm(f => ({ ...f, provider_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cert-hours" className="text-sm font-medium">Hours Completed *</Label>
                          <Input
                            id="cert-hours"
                            className="min-h-11 text-base md:text-sm"
                            type="number"
                            min={0}
                            step="0.1"
                            inputMode="decimal"
                            placeholder="e.g. 6"
                            value={certForm.hours_completed}
                            onChange={e => setCertForm(f => ({ ...f, hours_completed: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cert-date" className="text-sm font-medium">Completion Date *</Label>
                          <Input
                            id="cert-date"
                            className="min-h-11 text-base md:text-sm"
                            type="date"
                            value={certForm.completion_date}
                            onChange={e => setCertForm(f => ({ ...f, completion_date: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cert-file" className="text-sm font-medium">Certificate File (optional)</Label>
                        <Input
                          id="cert-file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          ref={fileInputRef}
                          className="cursor-pointer min-h-11"
                          aria-describedby="cert-file-hint"
                        />
                        <p id="cert-file-hint" className="text-xs text-muted-foreground">
                          PDF, JPG or PNG, up to 20 MB. Stored in private storage linked to your account.
                        </p>
                      </div>
                      <Button type="button" onClick={() => void handleCertificateUpload()} disabled={uploadingCert} className="w-full sm:w-auto min-h-11">
                        {uploadingCert ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Saving Certificate...</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" aria-hidden="true" /> Save Certificate</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Certificate List */}
                  {certificates.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center">
                        <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
                        <p className="text-muted-foreground">No certificates stored yet. Upload your first certificate above.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Your Stored Certificates</h3>
                      {certificates.map(cert => {
                        const ref = referenceId(cert.certificate_hash);
                        return (
                          <Card key={cert.id} className="border-primary/30">
                            <CardContent className="pt-5">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                                    <h4 className="font-semibold break-words">{cert.course_title}</h4>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                    <p><strong>Provider:</strong> {cert.provider_name}</p>
                                    <p><strong>Hours:</strong> {cert.hours_completed}</p>
                                    <p><strong>Completed:</strong> {formatLongDate(cert.completion_date)}</p>
                                    <p><strong>Logged:</strong> {new Date(cert.audit_timestamp).toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <Hash className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                                    <code className="text-xs text-muted-foreground font-mono">{ref}</code>
                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                      Self-reported
                                    </Badge>
                                    <button
                                      type="button"
                                      className="inline-flex min-h-11 items-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                                      onClick={() => {
                                        void navigator.clipboard.writeText(ref).then(
                                          () => toast.success("Reference ID copied."),
                                          () => toast.error("We couldn't copy it. Select the ID and copy it yourself."),
                                        );
                                      }}
                                    >
                                      Copy ID
                                    </button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Record page (only you can open it, while signed in):{" "}
                                    <Link
                                      to={`${RECORD_PAGE_PATH}${cert.certificate_hash.substring(0, 12).toUpperCase()}`}
                                      className="inline-flex min-h-11 items-center underline text-primary hover:text-primary/80"
                                    >
                                      Open record page
                                    </Link>
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                  {cert.certificate_file_path && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="min-h-11"
                                      onClick={async () => {
                                        // Open the tab during the tap so phones don't block it.
                                        const win = window.open("", "_blank");
                                        const { data } = await supabase.storage
                                          .from("user-uploads")
                                          .createSignedUrl(cert.certificate_file_path!, 300);
                                        if (data?.signedUrl) {
                                          if (win) {
                                            win.opener = null;
                                            win.location.href = data.signedUrl;
                                          } else {
                                            window.location.assign(data.signedUrl);
                                          }
                                        } else {
                                          win?.close();
                                          toast.error("We couldn't open the file. Please try again.");
                                        }
                                      }}
                                    >
                                      <FileText className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                      View File
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TrackClassDialog
        course={trackTarget}
        onClose={() => setTrackTarget(null)}
        onTracked={classes.putTracker}
      />

      <Footer />
    </>
  );
}
