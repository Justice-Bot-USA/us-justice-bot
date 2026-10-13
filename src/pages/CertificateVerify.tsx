import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { signInPath } from "@/lib/signIn";
import { formatLongDate } from "@/lib/calendar/dates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, Loader2, Hash, GraduationCap, Calendar, Clock } from "lucide-react";

type CertRecord = {
  course_title: string;
  provider_name: string;
  hours_completed: number;
  completion_date: string;
  certificate_hash: string;
  audit_timestamp: string;
  verification_link: string | null;
  metadata: { hash_source?: string; verification_id?: string } | null;
};

export default function CertificateVerify() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [cert, setCert] = useState<CertRecord | null>(null);
  // "unavailable": no record we can show (it may not exist, or it belongs to another account).
  const [status, setStatus] = useState<"loading" | "found" | "unavailable" | "invalid">("loading");

  // Reference IDs are shown as JB-XXXXXXXXXXXX (VP- before October 2026); links use the 12 characters alone.
  // Only an exact, complete 12-character hex ID is looked up: no partial or wildcard matching.
  const rawRef = (id ?? "").trim().replace(/^(vp|jb)-/i, "").toUpperCase();
  const ref = /^[0-9A-F]{12}$/.test(rawRef) ? rawRef : null;

  useEffect(() => {
    if (!ref) {
      setStatus("invalid");
      return;
    }
    if (authLoading) return;

    setStatus("loading");
    (async () => {
      // Exact match on the stored reference ID. Database rules let only the account that created a
      // record read it, so for anyone else this finds nothing.
      const { data, error } = await supabase
        .from("course_certificates")
        .select("course_title, provider_name, hours_completed, completion_date, certificate_hash, audit_timestamp, verification_link, metadata")
        .in("metadata->>verification_id", [`JB-${ref}`, `VP-${ref}`])
        .limit(2);

      // Show a record only when exactly one matches and its hash really starts with the ID.
      const match = data?.length === 1 && data[0].certificate_hash.toUpperCase().startsWith(ref) ? data[0] : null;
      if (error || !match) {
        setStatus("unavailable");
      } else {
        setCert(match as unknown as CertRecord);
        setStatus("found");
      }
    })();
  }, [ref, authLoading, user?.id]);

  const hashCoversFile = cert?.metadata?.hash_source === "file";

  return (
    <>
      <SEOHead
        title="Certificate Record Lookup | Justice Bot USA"
        description="Open a course certificate record you saved on Justice Bot USA, using its reference ID. Records are private to the account that created them, self-reported, and not verified with course providers."
      />
      <Header language="en" onLanguageChange={() => {}} />

      <main className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Platform signature */}
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Justice Bot USA</p>
              <h1 className="text-2xl font-bold">Certificate Record Lookup</h1>
            </div>
          </div>

          {status === "loading" && (
            <Card>
              <CardContent className="py-16 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Looking up reference ID…</p>
              </CardContent>
            </Card>
          )}

          {status === "invalid" && (
            <Card className="border-destructive/40">
              <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-semibold">Not a Valid Reference ID</h2>
                <p className="text-muted-foreground max-w-sm">
                  <strong className="font-mono break-all">{id?.toUpperCase()}</strong> is not a complete reference ID.
                  Reference IDs look like JB-1A2B3C4D5E6F: "JB-" (or "VP-") followed by exactly 12 letters and numbers.
                </p>
                <Button asChild variant="outline">
                  <Link to="/courses">Go to Course Hub</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "unavailable" && (
            <Card className="border-destructive/40">
              <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-semibold">We Can't Show This Record</h2>
                <p className="text-muted-foreground max-w-md">
                  We can't show a record for <strong className="font-mono">JB-{ref}</strong>. Certificate records are
                  private: only the account that saved a record can open it, while signed in. If you are not that
                  person, this page cannot show you the record, even if it exists. Ask the person for the certificate
                  the course provider gave them, or ask the provider directly.
                </p>
                <p className="text-muted-foreground max-w-md text-sm">
                  If you saved this record yourself, sign in to the same account and check the ID. It may also have
                  been typed incorrectly.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {!user && (
                    <Button asChild>
                      <Link to={signInPath()}>Sign In</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link to="/courses">Go to Course Hub</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "found" && cert && (
            <div className="space-y-6">
              {/* Status banner */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                <FileText className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Record found</p>
                  <p className="text-sm text-muted-foreground">
                    You saved this record on Justice Bot USA. Justice Bot USA has not checked it with the course provider, and it is visible only to your account.
                  </p>
                </div>
                <Badge className="ml-auto shrink-0" variant="outline">Self-reported</Badge>
              </div>

              {/* Certificate details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Certificate Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Course</p>
                      <p className="font-medium">{cert.course_title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Provider</p>
                      <p className="font-medium">{cert.provider_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Hours Completed</p>
                        <p className="font-medium">{cert.hours_completed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Completion Date</p>
                        {/* A plain 'yyyy-MM-dd' date: read from its numbers so it never shows the day before. */}
                        <p className="font-medium">{formatLongDate(cert.completion_date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hash block: what the hash covers depends on whether a file was attached */}
                  <div className="mt-4 p-3 rounded-md bg-muted border border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="uppercase tracking-wider font-medium">
                        {hashCoversFile ? "File Fingerprint (SHA-256)" : "Record Hash (SHA-256)"}
                      </span>
                    </div>
                    <code className="block text-xs font-mono break-all text-foreground">
                      {cert.certificate_hash}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      {hashCoversFile
                        ? "This is the SHA-256 of the exact file that was uploaded. Computing the SHA-256 of a copy of the file and getting the same value shows it is the same file. It does not show that the certificate itself is genuine."
                        : "This hash was made from the details typed in when the record was saved, not from a certificate file, so it does not verify any file."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reference ID: <strong className="font-mono text-foreground">{cert.metadata?.verification_id ?? `JB-${ref}`}</strong>
                      {" "}(IDs issued before October 2026 start with VP-)
                    </p>
                  </div>

                  {/* Audit timestamp */}
                  <p className="text-xs text-muted-foreground pt-2">
                    Saved on Justice Bot USA on{" "}
                    <strong>{new Date(cert.audit_timestamp).toUTCString()}</strong>
                  </p>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Disclaimer:</strong> This page shows a record you entered on Justice Bot USA.
                    We do not check that the course was completed, that the details are correct, or that the course meets your court's requirements.
                    Ask the course provider for proof of completion, and confirm acceptance with the court, your attorney, or your case worker.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
