import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, ExternalLink, CheckCircle2, Clock, BookOpen, Shield, AlertTriangle, FileDown } from "lucide-react";
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

const ACCEPTANCE_LABEL_STYLES: Record<string, { bg: string; icon: typeof Shield }> = {
  "Court-Ordered (External Provider Required)": { bg: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
  "Commonly Accepted in Some Jurisdictions": { bg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700", icon: Shield },
  "Supplementary / Skill-Building": { bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700", icon: BookOpen },
};

const STATE_FILTER_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
];

export default function CourseHub() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (user) fetchEnrollments();
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
      const { data, error } = await supabase.functions.invoke("court-export-pdf", {
        body: { userId: user.id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Court export generated successfully.");
      }
    } catch {
      toast.error("Export failed. Please try again.");
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
        title="Course Hub | Veritas Path"
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
              <span>Veritas Path does not create course content. We provide infrastructure for tracking and accountability.</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-muted border-b">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This is legal information, not legal advice. Course acceptance varies by jurisdiction. 
              Veritas Path records participation and preserves proof — we do not determine compliance. 
              Consult your attorney or case worker for specific requirements.
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

            {/* Browse */}
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
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{course.title}</CardTitle>
                          </div>
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
                              <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.hours_required} hours</p>
                            )}
                            {course.jurisdictions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {course.jurisdictions.map(j => (
                                  <Badge key={j} variant="outline" className="text-xs">{j}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
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
                              ) : (
                                "Enroll"
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* My Courses */}
            <TabsContent value="my-courses">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to view your enrolled courses.</p>
                    <Button asChild><Link to="/auth">Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : myEnrolledCourses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
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

            {/* Certificates */}
            <TabsContent value="certificates">
              {!user ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to view your certificates.</p>
                    <Button asChild><Link to="/auth">Sign In</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Completion certificates from external providers will appear here once courses are completed. 
                      Each certificate includes provider name, course title, hours completed, completion date, and a unique verification ID.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
