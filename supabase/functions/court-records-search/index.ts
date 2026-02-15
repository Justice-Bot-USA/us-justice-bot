const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { docketNumber, state, partyName, caseType } = await req.json();

    if (!docketNumber && !partyName) {
      return new Response(
        JSON.stringify({ success: false, error: "Docket number or party name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl connector not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build search query
    const parts: string[] = [];
    if (docketNumber) parts.push(`"${docketNumber}"`);
    if (partyName) parts.push(partyName);
    if (caseType) parts.push(caseType);
    if (state) parts.push(state);
    parts.push("court case docket filing site:gov OR site:courts OR site:judiciary");

    const query = parts.join(" ");
    console.log("Court records search query:", query);

    // Search for court records
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
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Firecrawl API error:", data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also search CourtListener for federal cases
    let courtListenerResults: any[] = [];
    if (docketNumber) {
      try {
        const clResponse = await fetch(
          `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(docketNumber)}&type=r`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (clResponse.ok) {
          const clData = await clResponse.json();
          courtListenerResults = (clData.results || []).slice(0, 5).map((r: any) => ({
            title: r.caseName || r.case_name || "Court Record",
            url: `https://www.courtlistener.com${r.absolute_url || ""}`,
            docketNumber: r.docketNumber || r.docket_number || docketNumber,
            court: r.court || r.court_citation_string || "",
            dateFiled: r.dateFiled || r.date_filed || "",
            description: r.snippet || "",
          }));
        }
      } catch (e) {
        console.error("CourtListener search error:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: data.data || [],
        federalResults: courtListenerResults,
        disclaimer: "This is legal information, not legal advice. Court records shown are from public sources. Some records may be sealed, restricted, or not publicly available online. Always verify with the official court clerk.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Court records search error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
