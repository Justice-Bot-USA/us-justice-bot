import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get active US form sources
    const { data: sources, error: srcErr } = await supabase
      .from("form_sources")
      .select("*")
      .eq("country", "US")
      .eq("is_active", true);

    if (srcErr) throw srcErr;
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active US form sources found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{
      source_id: string;
      jurisdiction: string;
      status: string;
      forms_found: number;
      error?: string;
    }> = [];

    for (const source of sources) {
      try {
        // Update source status to syncing
        await supabase
          .from("form_sources")
          .update({ sync_status: "syncing" })
          .eq("id", source.id);

        // Fetch the source URL with timeout and redirect following
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let response: Response;
        try {
          response = await fetch(source.source_url, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (compatible; USJusticeBot/1.0; +https://justicebot-usa.com)",
            },
          });
        } finally {
          clearTimeout(timeout);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${source.source_url}`);
        }

        const html = await response.text();

        // Parse links to forms (.pdf, .doc, .docx)
        const formLinks = extractFormLinks(html, source.source_url);

        let upsertCount = 0;
        for (const link of formLinks) {
          const { error: upsertErr } = await supabase.from("forms").upsert(
            {
              country: "US",
              jurisdiction_code: source.jurisdiction_code,
              source_id: source.id,
              form_number: link.formNumber || `${source.jurisdiction_code}-${upsertCount + 1}`,
              title: link.title,
              description: link.description || `Form from ${source.source_name}`,
              category: source.category || "general",
              url: link.url,
              file_type: link.fileType,
              is_active: true,
              last_verified_at: new Date().toISOString(),
            },
            { onConflict: "jurisdiction_code,form_number" }
          );

          if (!upsertErr) upsertCount++;
        }

        // Update source status
        await supabase
          .from("form_sources")
          .update({
            sync_status: "synced",
            last_synced_at: new Date().toISOString(),
            sync_error: null,
          })
          .eq("id", source.id);

        results.push({
          source_id: source.id,
          jurisdiction: source.jurisdiction_code,
          status: "synced",
          forms_found: upsertCount,
        });

        // Rate limit: 500ms between sources
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);

        await supabase
          .from("form_sources")
          .update({
            sync_status: "error",
            sync_error: errorMsg,
          })
          .eq("id", source.id);

        results.push({
          source_id: source.id,
          jurisdiction: source.jurisdiction_code,
          status: "error",
          forms_found: 0,
          error: errorMsg,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Synced ${results.filter((r) => r.status === "synced").length}/${results.length} sources`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

interface FormLink {
  url: string;
  title: string;
  description?: string;
  formNumber?: string;
  fileType: string;
}

function extractFormLinks(html: string, baseUrl: string): FormLink[] {
  const links: FormLink[] = [];
  const seen = new Set<string>();

  // Match <a> tags with href pointing to form files
  const linkRegex =
    /<a\s[^>]*href=["']([^"']*\.(?:pdf|doc|docx))[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let url = match[1];
    const rawText = match[2].replace(/<[^>]+>/g, "").trim();

    // Resolve relative URLs
    if (url.startsWith("/")) {
      const base = new URL(baseUrl);
      url = `${base.origin}${url}`;
    } else if (!url.startsWith("http")) {
      const base = new URL(baseUrl);
      url = `${base.origin}/${url}`;
    }

    if (seen.has(url) || !rawText) continue;
    seen.add(url);

    // Try to extract form number from text
    const formNumMatch = rawText.match(
      /([A-Z]{1,5}[-\s]?\d{1,5}[A-Za-z]?)/
    );

    const ext = url.split(".").pop()?.toLowerCase() || "pdf";

    links.push({
      url,
      title: rawText.substring(0, 200),
      formNumber: formNumMatch ? formNumMatch[1].replace(/\s/g, "-") : undefined,
      fileType: ext,
    });
  }

  return links.slice(0, 100); // Cap at 100 forms per source
}
