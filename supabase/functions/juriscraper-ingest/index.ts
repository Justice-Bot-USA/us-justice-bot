import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-ingest-api-key",
};

interface OpinionPayload {
  court_id: string;
  court_name?: string;
  case_name: string;
  docket_number?: string;
  citation?: string;
  date_filed?: string;
  date_argued?: string;
  opinion_type?: string;
  author_judge?: string;
  per_curiam?: boolean;
  opinion_text?: string;
  opinion_url?: string;
  download_url?: string;
  source_url?: string;
  precedential_status?: string;
  jurisdiction?: string;
  state?: string;
  nature_of_suit?: string;
  raw_metadata?: Record<string, unknown>;
}

interface IngestRequest {
  session_id: string;
  court_id: string;
  opinions: OpinionPayload[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate via API key header (for machine-to-machine from Juriscraper service)
    const apiKey = req.headers.get("x-ingest-api-key");
    const expectedKey = Deno.env.get("JURISCRAPER_INGEST_KEY");

    if (!expectedKey) {
      return new Response(
        JSON.stringify({ error: "Ingestion endpoint not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!apiKey || apiKey !== expectedKey) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (req.method === "GET") {
      // Health check / stats endpoint
      const { count } = await supabase
        .from("juriscraper_opinions")
        .select("*", { count: "exact", head: true });

      const { data: recentSessions } = await supabase
        .from("juriscraper_ingest_logs")
        .select("session_id, court_id, opinions_inserted, status, started_at")
        .order("started_at", { ascending: false })
        .limit(5);

      return new Response(
        JSON.stringify({ total_opinions: count ?? 0, recent_sessions: recentSessions ?? [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: IngestRequest = await req.json();

    if (!body.session_id || !body.court_id || !Array.isArray(body.opinions) || body.opinions.length === 0) {
      return new Response(
        JSON.stringify({ error: "Required: session_id, court_id, opinions[]" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create ingest log entry
    const { data: logEntry, error: logError } = await supabase
      .from("juriscraper_ingest_logs")
      .insert({
        session_id: body.session_id,
        court_id: body.court_id,
        opinions_received: body.opinions.length,
        status: "running",
      })
      .select("id")
      .single();

    if (logError) {
      console.error("Failed to create ingest log:", logError);
    }

    let inserted = 0;
    let updated = 0;
    const errors: Array<{ index: number; error: string; case_name: string }> = [];

    // Process opinions in batches of 50
    const batchSize = 50;
    for (let i = 0; i < body.opinions.length; i += batchSize) {
      const batch = body.opinions.slice(i, i + batchSize);

      const rows = batch.map((op) => ({
        court_id: body.court_id,
        court_name: op.court_name ?? null,
        case_name: op.case_name,
        docket_number: op.docket_number ?? null,
        citation: op.citation ?? null,
        date_filed: op.date_filed ?? null,
        date_argued: op.date_argued ?? null,
        opinion_type: op.opinion_type ?? null,
        author_judge: op.author_judge ?? null,
        per_curiam: op.per_curiam ?? false,
        opinion_text: op.opinion_text ?? null,
        opinion_url: op.opinion_url ?? null,
        download_url: op.download_url ?? null,
        source_url: op.source_url ?? null,
        precedential_status: op.precedential_status ?? null,
        jurisdiction: op.jurisdiction ?? null,
        state: op.state ?? null,
        nature_of_suit: op.nature_of_suit ?? null,
        raw_metadata: op.raw_metadata ?? {},
        scrape_session_id: body.session_id,
      }));

      const { data, error } = await supabase
        .from("juriscraper_opinions")
        .upsert(rows, {
          onConflict: "court_id,docket_number,opinion_url",
          ignoreDuplicates: false,
        })
        .select("id");

      if (error) {
        // Fallback: insert individually to capture per-row errors
        for (let j = 0; j < rows.length; j++) {
          const { error: rowErr } = await supabase
            .from("juriscraper_opinions")
            .upsert(rows[j], {
              onConflict: "court_id,docket_number,opinion_url",
              ignoreDuplicates: false,
            });
          if (rowErr) {
            errors.push({
              index: i + j,
              error: rowErr.message,
              case_name: batch[j].case_name,
            });
          } else {
            inserted++;
          }
        }
      } else {
        inserted += data?.length ?? batch.length;
      }
    }

    // Update ingest log
    if (logEntry?.id) {
      await supabase
        .from("juriscraper_ingest_logs")
        .update({
          opinions_inserted: inserted,
          opinions_updated: updated,
          errors: errors.length > 0 ? errors : [],
          status: errors.length > 0 ? "completed_with_errors" : "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", logEntry.id);
    }

    return new Response(
      JSON.stringify({
        session_id: body.session_id,
        received: body.opinions.length,
        inserted,
        errors: errors.length,
        error_details: errors.slice(0, 10),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Ingest error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
