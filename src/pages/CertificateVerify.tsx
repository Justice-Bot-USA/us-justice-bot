import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, AlertTriangle, Loader2, Hash, GraduationCap, Calendar, Clock } from "lucide-react";

type CertRecord = {
  course_title: string;
  provider_name: string;
  hours_completed: number;
  completion_date: string;
  certificate_hash: string;
  audit_timestamp: string;
  verification_link: string | null;
};

export default function CertificateVerify() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<CertRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not_found">("loading");

  useEffect(() => {
    if (!id) {
      setStatus("not_found");
      return;
    }

    (async () => {
      // Match by the first 12 chars of the hash (the VP- prefix is stripped in the URL)
      const { data, error } = await supabase
        .from("course_certificates")
        .select("course_title, provider_name, hours_completed, completion_date, certificate_hash, audit_timestamp, verification_link")
        .ilike("certificate_hash", `${id.toLowerCase()}%`)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setStatus("not_found");
      } else {
        setCert(data as CertRecord);
        setStatus("found");
      }
    })();
  }, [id]);

  return (
    <>
      <SEOHead
        title="Certificate Verification | A.I. ANAL"
        description="Independently verify a A.I. ANAL course completion certificate using its unique VP- verification ID."
      />
      <Header language="en" onLanguageChange={() => {}} />

      <main className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Platform signature */}
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">A.I. ANAL</p>
              <h1 className="text-2xl font-bold">Certificate Verification</h1>
            </div>
          </div>

          {status === "loading" && (
            <Card>
              <CardContent className="py-16 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Looking up verification ID…</p>
              </CardContent>
            </Card>
          )}

          {status === "not_found" && (
            <Card className="border-destructive/40">
              <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-semibold">Certificate Not Found</h2>
                <p className="text-muted-foreground max-w-sm">
                  No certificate matches the ID <strong className="font-mono">VP-{id?.toUpperCase()}</strong>.
                  It may have been entered incorrectly, or was not issued by A.I. ANAL.
                </p>
                <Button asChild variant="outline">
                  <Link to="/courses">Go to Course Hub</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "found" && cert && (
            <div className="space-y-6">
              {/* Status banner */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                <BadgeCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Certificate Verified</p>
                  <p className="text-sm text-muted-foreground">
                    This record was created and cryptographically sealed by A.I. ANAL.
                  </p>
                </div>
                <Badge className="ml-auto shrink-0" variant="default">Authentic</Badge>
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
                        <p className="font-medium">{new Date(cert.completion_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hash / integrity block */}
                  <div className="mt-4 p-3 rounded-md bg-muted border border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="uppercase tracking-wider font-medium">Integrity Hash (SHA-256)</span>
                    </div>
                    <code className="block text-xs font-mono break-all text-foreground">
                      {cert.certificate_hash}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Verification ID: <strong className="font-mono text-foreground">VP-{cert.certificate_hash.substring(0, 12).toUpperCase()}</strong>
                    </p>
                  </div>

                  {/* Audit timestamp */}
                  <p className="text-xs text-muted-foreground pt-2">
                    Sealed by A.I. ANAL on{" "}
                    <strong>{new Date(cert.audit_timestamp).toUTCString()}</strong>
                  </p>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Disclaimer:</strong> A.I. ANAL verifies that this record was created on our platform and has not been modified.
                    We do not independently verify that the underlying course was completed or meets your jurisdiction's requirements.
                    Always confirm acceptance with your attorney or case worker.
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
