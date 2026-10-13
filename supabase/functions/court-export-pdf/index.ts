// Returns the signed-in person's own course records (certificates they saved in the Course Hub and
// listings saved to its older course list) so the browser can print "Your class records
// (self-reported)", and logs that an export was made.
//
// Everything in these records was typed or uploaded by the person. Nothing here checks a course,
// a certificate or a provider, and the output must never be described as verified, official or
// court-approved. (The function and table names still start with "court" for historical
// reasons; renaming them needs a deploy and a migration.)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REPORT_TITLE = "Your class records (self-reported)";
const REPORT_NOTE =
  "Made with Justice Bot USA from records the account holder entered. Justice Bot USA has not checked them with any course provider or court.";

/** A short reference for this export (not a security hash). */
function referenceFor(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").toUpperCase();
}

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

interface EnrollmentRow {
  enrolled_at: string | null;
  courses: { title: string | null; provider_name: string | null } | null;
}

interface CertificateRow {
  course_title: string;
  provider_name: string;
  hours_completed: number | null;
  completion_date: string;
  certificate_hash: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new HttpError(401, "Unauthorized");

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (authError || !user) throw new HttpError(401, "Unauthorized");

    let body: { userId?: unknown; caseId?: unknown };
    try {
      body = await req.json();
    } catch {
      throw new HttpError(400, "Bad request");
    }
    if (body.userId !== user.id) throw new HttpError(401, "Unauthorized");

    // Only log a case id that belongs to this person.
    let caseId: string | null = null;
    if (typeof body.caseId === "string" && body.caseId) {
      const { data: ownCase } = await supabase
        .from("case_merit_scores")
        .select("id")
        .eq("id", body.caseId)
        .eq("user_id", user.id)
        .maybeSingle();
      caseId = ownCase?.id ?? null;
    }

    // Listings saved to the Course Hub's older course list
    const { data: enrollments } = await supabase
      .from("course_enrollments")
      .select("enrolled_at, courses(title, provider_name)")
      .eq("user_id", user.id);

    // Certificates the person saved
    const { data: certificates } = await supabase
      .from("course_certificates")
      .select("course_title, provider_name, hours_completed, completion_date, certificate_hash")
      .eq("user_id", user.id);

    const now = new Date();
    const utcTimestamp = now.toISOString();
    const localTimestamp = now.toLocaleString("en-US", { timeZone: "America/New_York" });

    const report = {
      title: REPORT_TITLE,
      note: REPORT_NOTE,
      generatedAt: {
        utc: utcTimestamp,
        local: `${localTimestamp} ET`,
      },
      enrollments: ((enrollments ?? []) as unknown as EnrollmentRow[]).map((e) => ({
        courseTitle: e.courses?.title || "A course you saved",
        provider: e.courses?.provider_name || "",
        enrolledAt: e.enrolled_at,
      })),
      certificates: ((certificates ?? []) as CertificateRow[]).map((c) => ({
        courseTitle: c.course_title,
        provider: c.provider_name,
        hoursCompleted: c.hours_completed,
        completionDate: c.completion_date,
        certificateHash: c.certificate_hash,
      })),
    };

    const documentHash = `JB-${referenceFor(JSON.stringify({ userId: user.id, caseId, report }))}`;

    // Log that an export was made (counts only, no names).
    await supabase.from("court_export_logs").insert({
      user_id: user.id,
      case_id: caseId,
      export_type: "pdf",
      document_hash: documentHash,
      generation_timestamp_utc: utcTimestamp,
      generation_timestamp_local: localTimestamp,
      contents_summary: {
        enrollments_count: report.enrollments.length,
        certificates_count: report.certificates.length,
      },
    });

    return json({ success: true, documentHash, generatedAt: utcTimestamp, report });
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    // Details stay out of the response and the logs: records hold course and provider names.
    return json({ error: "We couldn't prepare your records. Please try again." }, 500);
  }
});
