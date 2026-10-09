import { useState, useEffect, useRef } from "react";
import { signInPath } from '@/lib/signIn';
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap, ExternalLink, CheckCircle2, Clock, BookOpen, Shield,
  AlertTriangle, FileDown, Upload, BadgeCheck, Loader2, FileText, Hash,
} from "lucide-react";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";

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
  official_registry_url: string | null;
  recognition_source: string | null;
};

type Enrollment = {
  id: string;
  course_id: string;
  case_id: string | null;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
  hours_completed: number | null;
};

type Certificate = {
  id: string;
  course_title: string;
  provider_name: string;
  hours_completed: number;
  completion_date: string;
  certificate_hash: string;
  certificate_file_path: string | null;
  verification_link: string | null;
  audit_timestamp: string;
  certificate_url: string | null;
};

const ACCEPTANCE_LABEL_STYLES: Record<string, { bg: string; icon: typeof Shield }> = {
  "Court-Ordered (External Provider Required)": {
    bg: "bg-destructive/10 text-destructive border-destructive/30",
    icon: AlertTriangle,
  },
  "Commonly Accepted in Some Jurisdictions": {
    bg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    icon: Shield,
  },
  "Supplementary / Skill-Building": {
    bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    icon: BookOpen,
  },
};

const STATE_REGISTRY = {
  CA: {
    // No statewide list exists; each county court publishes its own approved providers.
    label: "CA Courts — find your county court's list",
    url: "https://www.courts.ca.gov/find-my-court.htm",
    flag: "🏛",
  },
  TX: {
    label: "TX Attorney General",
    url: "https://www.oag.texas.gov/child-support/services-parents/parent-education-family-stabilization-course",
    flag: "⚖️",
  },
  FL: {
    label: "FL Supreme Court",
    url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Law/Parent-Education",
    flag: "🏛",
  },
};

const STATE_FILTER_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
];

// Generate a SHA-256 hash in browser
async function sha256(data: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function CourseHub() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { user } = useAuth();

  // Certificate upload state
  const [uploadingCert, setUploadingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    course_title: "",
    provider_name: "",
    hours_completed: "",
    completion_date: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrollments();
      fetchCertificates();
    }
  }, [user]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("title");
    if (!error && data) setCourses(data as unknown as Course[]);
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("user_id", user.id);
    if (data) setEnrollments(data as unknown as Enrollment[]);
  };

  const fetchCertificates = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("course_certificates")
      .select("id, course_title, provider_name, hours_completed, completion_date, certificate_hash, certificate_file_path, verification_link, audit_timestamp, certificate_url")
      .eq("user_id", user.id)
      .order("audit_timestamp", { ascending: false });
    if (data) setCertificates(data as unknown as Certificate[]);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("Please sign in to enroll in courses.");
      return;
    }
    const existing = enrollments.find(e => e.course_id === courseId);
    if (existing) {
      toast.info("You are already enrolled in this course.");
      return;
    }
    const { error } = await supabase.from("course_enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      status: "enrolled",
    } as any);
    if (error) {
      toast.error("Failed to enroll. Please try again.");
    } else {
      toast.success("Enrolled successfully!");
      fetchEnrollments();
    }
  };

  const handleExportPdf = async () => {
    if (!user) {
      toast.error("Please sign in to export.");
      return;
    }
    try {
      // Call edge function for audit logging — it returns the structured report
      const { data, error } = await supabase.functions.invoke("court-export-pdf", {
        body: { userId: user.id },
      });
      if (error) throw error;

      const report = data?.report;
      if (!report) throw new Error("No report data returned");

      // Generate real PDF client-side using jsPDF
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 18;
      let y = margin;

      const addLine = (text: string, size = 10, bold = false, color: [number,number,number] = [30,30,30]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, pageW - margin * 2);
        if (y + lines.length * (size * 0.4 + 1) > 270) {
          doc.addPage();
          y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * (size * 0.4 + 1) + 1;
      };

      const addDivider = () => {
        y += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      };

      // Header
      doc.setFillColor(15, 52, 96);
      doc.rect(0, 0, pageW, 28, "F");
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Justice Bot USA — Court Accountability Report", margin, 12);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Generated by Justice Bot USA  |  Not legal advice", margin, 20);
      y = 36;

      addLine("Document Hash", 9, false, [120, 120, 120]);
      addLine(data.documentHash, 9, true, [30, 30, 30]);
      addLine(`Generated (UTC): ${new Date(report.generatedAt.utc).toUTCString()}`, 9);
      addLine(`Generated (ET):  ${report.generatedAt.local}`, 9);
      y += 4;
      addDivider();

      // Enrollments
      addLine("Course Enrollments", 13, true);
      y += 2;
      if (!report.enrollments?.length) {
        addLine("No enrollments on record.", 10, false, [120, 120, 120]);
      } else {
        report.enrollments.forEach((e: any, i: number) => {
          addLine(`${i + 1}. ${e.courseTitle}`, 11, true);
          addLine(`   Provider: ${e.provider} | Status: ${e.status}`, 10);
          addLine(`   Enrolled: ${new Date(e.enrolledAt).toLocaleDateString()}${e.completedAt ? `  |  Completed: ${new Date(e.completedAt).toLocaleDateString()}` : ""}`, 10);
          addLine(`   Acceptance: ${e.acceptanceLabel}`, 10);
          y += 2;
        });
      }
      addDivider();

      // Certificates
      addLine("Uploaded Certificates", 13, true);
      y += 2;
      if (!report.certificates?.length) {
        addLine("No certificates on record.", 10, false, [120, 120, 120]);
      } else {
        report.certificates.forEach((c: any, i: number) => {
          addLine(`${i + 1}. ${c.courseTitle}`, 11, true);
          addLine(`   Provider: ${c.provider} | Hours: ${c.hoursCompleted}`, 10);
          addLine(`   Completion Date: ${new Date(c.completionDate).toLocaleDateString()}`, 10);
          addLine(`   Verification ID: VP-${c.certificateHash?.substring(0, 12).toUpperCase()}`, 10, true);
          if (c.verificationLink) addLine(`   Verify at: ${c.verificationLink}`, 9, false, [60, 100, 180]);
          y += 2;
        });
      }
      addDivider();

      // Footer
      addLine("This document was generated by Justice Bot USA and is intended for informational purposes only.", 8, false, [120, 120, 120]);
      addLine("Justice Bot USA does not determine legal compliance. Consult your attorney for specific requirements.", 8, false, [120, 120, 120]);

      // Save
      doc.save(`JusticeBotUSA-CourseReport-${data.documentHash}.pdf`);
      toast.success("Court export PDF downloaded successfully.");
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error("Export failed. Please try again.");
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
    const file = fileInputRef.current?.files?.[0];

    setUploadingCert(true);
    try {
      // Generate SHA-256 hash from cert metadata + timestamp — unique per upload
      const rawContent = `${user.id}|${course_title}|${provider_name}|${completion_date}|${Date.now()}`;
      const hash = await sha256(rawContent);
      const verificationId = hash.substring(0, 12).toUpperCase();

      let certUrl: string | null = null;
      let filePath: string | null = null;

      // Upload file to private storage bucket
      if (file) {
        const ext = file.name.split(".").pop();
        filePath = `${user.id}/certificates/${verificationId}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("user-uploads")
          .upload(filePath, file, { upsert: true });
        if (uploadError) {
          console.warn("File upload error (non-fatal):", uploadError.message);
        } else {
          // Private bucket — use a signed URL (1 year expiry)
          const { data: signedData } = await supabase.storage
            .from("user-uploads")
            .createSignedUrl(filePath, 60 * 60 * 24 * 365);
          certUrl = signedData?.signedUrl || null;
        }
      }

      // Try to find a matching enrollment to link (optional — enrollment_id is now nullable)
      const matchedEnrollment = enrollments.find(e => {
        const course = courses.find(c => c.id === e.course_id);
        return (
          course?.provider_name.toLowerCase().includes(provider_name.toLowerCase()) ||
          course?.title.toLowerCase().includes(course_title.toLowerCase())
        );
      });

      const { error: insertError } = await supabase.from("course_certificates").insert({
        user_id: user.id,
        enrollment_id: matchedEnrollment?.id || null,
        course_title,
        provider_name,
        hours_completed: parseFloat(hours_completed),
        completion_date,
        certificate_hash: hash,
        certificate_url: certUrl,
        certificate_file_path: filePath,
        verification_link: `https://us-justice-bot.lovable.app/verify/${verificationId}`,
        audit_timestamp: new Date().toISOString(),
        metadata: {
          verification_id: `VP-${verificationId}`,
          upload_source: "manual",
          file_uploaded: !!file,
        },
      } as any);

      if (insertError) throw insertError;

      toast.success(`Certificate stored! Verification ID: VP-${verificationId}`);
      setCertForm({ course_title: "", provider_name: "", hours_completed: "", completion_date: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchCertificates();
    } catch (err: any) {
      console.error("Certificate upload error:", err);
      toast.error(err.message || "Failed to store certificate. Please try again.");
    } finally {
      setUploadingCert(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    if (stateFilter !== "all" && !c.jurisdictions.includes(stateFilter)) return false;
    if (typeFilter !== "all" && c.course_type !== typeFilter) return false;
    return true;
  });

  const myEnrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));

  return (
    <>
      <SEOHead
        title="Course Hub | Justice Bot USA"
        description="Access court-adjacent parenting and reunification courses from verified external providers. Track enrollment, completion, and certificates."
      />
      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Course Hub</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Access parenting education and reunification courses from verified external providers.
              Track enrollment, completion, and maintain auditable records for court or agency review.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Shield className="w-4 h-4" />
              <span>Justice Bot USA does not create course content. We provide infrastructure for tracking and accountability.</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-muted border-b">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Course acceptance varies by jurisdiction. Justice Bot USA records participation and preserves proof —
              we do not determine compliance. Consult your attorney or case worker for specific requirements.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="browse" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="browse">Browse Courses</TabsTrigger>
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>
              {user && (
                <Button variant="outline" size="sm" onClick={handleExportPdf}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Court Export (PDF)
                </Button>
              )}
            </div>

            {/* ── Browse ── */}
            <TabsContent value="browse" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_FILTER_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
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

              {/* Acceptance Label Legend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Acceptance Labels</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {Object.entries(ACCEPTANCE_LABEL_STYLES).map(([label, style]) => {
                    const Icon = style.icon;
                    return (
                      <div key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${style.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {label}
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
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Courses Available Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      We are actively onboarding verified course providers for California, Texas, and Florida.
                      Check back soon or contact support for updates.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map(course => {
                    const labelStyle = ACCEPTANCE_LABEL_STYLES[course.acceptance_label];
                    const LabelIcon = labelStyle?.icon || Shield;
                    const isEnrolled = enrollments.some(e => e.course_id === course.id);

                    return (
                      <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit ${labelStyle?.bg || ''}`}>
                            <LabelIcon className="w-3 h-3" />
                            {course.acceptance_label}
                          </div>
                          <CardDescription className="mt-2">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end gap-3">
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>Provider:</strong> {course.provider_name}</p>
                            {course.hours_required && (
                              <p className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {course.hours_required} hours
                              </p>
                            )}
                            {course.jurisdictions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {course.jurisdictions.map(j => (
                                  <Badge key={j} variant="outline" className="text-xs">{j}</Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Official Registry Badge */}
                          {course.jurisdictions.map(j => {
                            const reg = STATE_REGISTRY[j as keyof typeof STATE_REGISTRY];
                            if (!reg) return null;
                            return (
                              <a
                                key={j}
                                href={reg.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                              >
                                <BadgeCheck className="w-3.5 h-3.5" />
                                {reg.flag} Verified on {reg.label} Official List
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>
                            );
                          })}

                          <div className="flex gap-2 mt-2">
                            {course.lms_launch_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={course.lms_launch_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                  Provider Site
                                </a>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={isEnrolled ? "secondary" : "default"}
                              onClick={() => handleEnroll(course.id)}
                              disabled={isEnrolled}
                            >
                              {isEnrolled ? (
                                <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Enrolled</>
                              ) : "Track This Course"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── My Courses ── */}
            <TabsContent value="my-courses">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to view your enrolled courses.</p>
                    <Button asChild><Link to={signInPath()}>Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : myEnrolledCourses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't tracked any courses yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myEnrolledCourses.map(course => {
                    const enrollment = enrollments.find(e => e.course_id === course.id);
                    return (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <CardDescription>{course.provider_name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Badge variant={enrollment?.status === 'completed' ? 'default' : 'secondary'}>
                              {enrollment?.status || 'enrolled'}
                            </Badge>
                            {enrollment?.hours_completed != null && (
                              <span className="text-sm text-muted-foreground">
                                {enrollment.hours_completed} / {course.hours_required || '?'} hours
                              </span>
                            )}
                          </div>
                          {course.lms_launch_url && (
                            <Button size="sm" variant="outline" className="mt-3" asChild>
                              <a href={course.lms_launch_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                Continue on Provider Site
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── Certificates ── */}
            <TabsContent value="certificates" className="space-y-6">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to manage your certificates.</p>
                    <Button asChild><Link to={signInPath()}>Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Upload Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Completion Certificate
                      </CardTitle>
                      <CardDescription>
                        Store your course completion certificate here. Justice Bot USA generates a unique verification ID
                        and immutable audit timestamp — court-ready proof of participation.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Course Title *</label>
                          <Input
                            placeholder="e.g. Children in Between"
                            value={certForm.course_title}
                            onChange={e => setCertForm(f => ({ ...f, course_title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Provider Name *</label>
                          <Input
                            placeholder="e.g. Center for Divorce Education"
                            value={certForm.provider_name}
                            onChange={e => setCertForm(f => ({ ...f, provider_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Hours Completed *</label>
                          <Input
                            type="number"
                            placeholder="e.g. 6"
                            value={certForm.hours_completed}
                            onChange={e => setCertForm(f => ({ ...f, hours_completed: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Completion Date *</label>
                          <Input
                            type="date"
                            value={certForm.completion_date}
                            onChange={e => setCertForm(f => ({ ...f, completion_date: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Certificate File (optional)</label>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={fileInputRef}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">PDF or image. Max 20MB. Stored securely in your private records.</p>
                      </div>
                      <Button onClick={handleCertificateUpload} disabled={uploadingCert} className="w-full sm:w-auto">
                        {uploadingCert ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Storing Certificate...</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" /> Store Certificate & Generate Verification ID</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Certificate List */}
                  {certificates.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center">
                        <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No certificates stored yet. Upload your first certificate above.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Your Stored Certificates</h3>
                      {certificates.map(cert => (
                        <Card key={cert.id} className="border-primary/30">
                          <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <BadgeCheck className="w-5 h-5 text-primary" />
                                  <h4 className="font-semibold">{cert.course_title}</h4>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                  <p><strong>Provider:</strong> {cert.provider_name}</p>
                                  <p><strong>Hours:</strong> {cert.hours_completed}</p>
                                  <p><strong>Completed:</strong> {new Date(cert.completion_date).toLocaleDateString()}</p>
                                  <p><strong>Logged:</strong> {new Date(cert.audit_timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                  <code className="text-xs text-muted-foreground font-mono">
                                    VP-{cert.certificate_hash.substring(0, 12).toUpperCase()}
                                  </code>
                                  <Badge variant="outline" className="text-xs text-primary border-primary/40">
                                    Verified
                                  </Badge>
                                  <button
                                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                                    onClick={() => {
                                      navigator.clipboard.writeText(`VP-${cert.certificate_hash.substring(0, 12).toUpperCase()}`);
                                      toast.success("Verification ID copied!");
                                    }}
                                  >
                                    Copy ID
                                  </button>
                                </div>
                                {cert.verification_link && (
                                  <p className="text-xs text-muted-foreground">
                                    Verify at:{" "}
                                    <a href={cert.verification_link} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">
                                      {cert.verification_link}
                                    </a>
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                {cert.certificate_file_path && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      const { data } = await supabase.storage
                                        .from("user-uploads")
                                        .createSignedUrl(cert.certificate_file_path!, 300);
                                      if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                                      else toast.error("Could not retrieve file.");
                                    }}
                                  >
                                    <FileText className="w-3.5 h-3.5 mr-1" />
                                    View File
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
