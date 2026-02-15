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
    const { name, state, county } = await req.json();

    if (!name || !state) {
      return new Response(
        JSON.stringify({ success: false, error: "Name and state are required" }),
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

    const countyPart = county ? ` ${county} county` : "";
    const query = `${name} active warrant${countyPart} ${state} site:gov OR site:courts`;

    console.log("Warrant search query:", query);

    const controller1 = new AbortController();
    const timeout1 = setTimeout(() => controller1.abort(), 15000);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 10,
        country: "us",
        lang: "en",
        scrapeOptions: { formats: ["markdown"] },
      }),
      signal: controller1.signal,
    });

    clearTimeout(timeout1);

    const data = await response.json();

    if (!response.ok) {
      console.error("Firecrawl API error:", data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let portalData: any = { data: [] };
    try {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 10000);

      const portalResponse = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${state} outstanding warrant search official court portal site:gov`,
          limit: 5,
          country: "us",
          lang: "en",
        }),
        signal: controller2.signal,
      });

      clearTimeout(timeout2);
      portalData = await portalResponse.json();
    } catch (portalErr) {
      console.warn("Portal search timed out or failed, continuing without portals:", portalErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: data.data || [],
        officialPortals: portalData.data || [],
        disclaimer: "This is legal information, not legal advice. Results are from public records searches. Always verify with official court or law enforcement sources.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Warrant lookup error:", error);
    const isTimeout = error instanceof DOMException && error.name === "AbortError";
    return new Response(
      JSON.stringify({
        success: false,
        error: isTimeout
          ? "Search timed out. The public records service is slow right now — please try again or check your state's official court portal directly."
          : error instanceof Error ? error.message : "Unknown error",
      }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
