import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";

const CL_BASE = "https://www.courtlistener.com/api/rest/v4";

// Helper to fetch with timeout
async function clFetch(url: string, timeoutMs = 10000): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    await requireUser(req);

    const { docketNumber, state, partyName, caseType } = await req.json();

    if (!docketNumber && !partyName) {
      return new Response(
        JSON.stringify({ success: false, error: "Docket number or party name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");

    // Build Firecrawl search query for state court portals
    const parts: string[] = [];
    if (docketNumber) parts.push(`"${docketNumber}"`);
    if (partyName) parts.push(partyName);
    if (caseType) parts.push(caseType);
    if (state) parts.push(state);
    parts.push("court case docket filing site:gov OR site:courts OR site:judiciary");
    const query = parts.join(" ");
    console.log("Court records search query:", query);

    // Build CourtListener search term
    const clQuery = docketNumber || partyName || "";

    // Run all searches in parallel: Firecrawl + 3 CourtListener endpoints
    const [firecrawlResult, clOpinions, clDockets, clOralArgs] = await Promise.all([
      // Firecrawl for state court portals
      apiKey
        ? (async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
              const response = await fetch("https://api.firecrawl.dev/v1/search", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query,
                  limit: 15,
                  country: "us",
                  lang: "en",
                  scrapeOptions: { formats: ["markdown"] },
                }),
                signal: controller.signal,
              });
              clearTimeout(timeout);
              if (!response.ok) return null;
              return await response.json();
            } catch {
              clearTimeout(timeout);
              return null;
            }
          })()
        : Promise.resolve(null),

      // CourtListener: Opinions search
      clFetch(
        `${CL_BASE}/search/?q=${encodeURIComponent(clQuery)}&type=o&order_by=score+desc`
      ),

      // CourtListener: Dockets / RECAP search
      clFetch(
        `${CL_BASE}/search/?q=${encodeURIComponent(clQuery)}&type=r&order_by=score+desc`
      ),

      // CourtListener: Oral Arguments search
      clFetch(
        `${CL_BASE}/search/?q=${encodeURIComponent(clQuery)}&type=oa&order_by=score+desc`
      ),
    ]);

    // Normalize CourtListener opinions
    const opinions = ((clOpinions?.results) || []).slice(0, 10).map((r: any) => ({
      type: "opinion",
      title: r.caseName || r.case_name || "Court Opinion",
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : "",
      docketNumber: r.docketNumber || r.docket_number || "",
      court: r.court || r.court_citation_string || "",
      dateFiled: r.dateFiled || r.date_filed || "",
      citation: r.citation || ((r.citations || []).map((c: any) => c.cite || c).join(", ")),
      status: r.status || "",
      author: r.author_str || "",
      snippet: r.snippet || "",
      downloadUrl: r.download_url || "",
    }));

    // Normalize CourtListener dockets
    const dockets = ((clDockets?.results) || []).slice(0, 10).map((r: any) => ({
      type: "docket",
      title: r.caseName || r.case_name || "Court Docket",
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : "",
      docketNumber: r.docketNumber || r.docket_number || docketNumber || "",
      court: r.court || r.court_citation_string || "",
      dateFiled: r.dateFiled || r.date_filed || "",
      dateArgued: r.dateArgued || r.date_argued || "",
      suitNature: r.suitNature || r.nature_of_suit || "",
      assignedTo: r.assignedTo || r.assigned_to_str || "",
      snippet: r.snippet || "",
    }));

    // Normalize CourtListener oral arguments
    const oralArguments = ((clOralArgs?.results) || []).slice(0, 5).map((r: any) => ({
      type: "oral_argument",
      title: r.caseName || r.case_name || "Oral Argument",
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : "",
      docketNumber: r.docketNumber || r.docket_number || "",
      court: r.court || r.court_citation_string || "",
      dateArgued: r.dateArgued || r.date_argued || "",
      duration: r.duration || null,
      downloadUrl: r.download_url || "",
      snippet: r.snippet || "",
    }));

    console.log(
      `Results: ${opinions.length} opinions, ${dockets.length} dockets, ${oralArguments.length} oral args, firecrawl=${firecrawlResult ? "ok" : "skipped"}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        results: firecrawlResult?.data || [],
        opinions,
        dockets,
        oralArguments,
        disclaimer:
          "This is legal information, not legal advice. Court records are from public sources (CourtListener / Free Law Project and state portals). Some records may be sealed or restricted. Always verify with the official court clerk.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Court records search error:", error);
    const isAuth = error instanceof Error && error.message.includes("authorization");
    return new Response(
      JSON.stringify({
        success: false,
        error: isAuth ? "Unauthorized" : (error instanceof Error ? error.message : "Unknown error"),
      }),
      { status: isAuth ? 401 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
