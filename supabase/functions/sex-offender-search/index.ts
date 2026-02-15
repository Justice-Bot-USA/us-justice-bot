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
    const { name, state, zipCode } = await req.json();

    if (!state) {
      return new Response(
        JSON.stringify({ success: false, error: "State is required" }),
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

    // Search NSOPW (National Sex Offender Public Website) and state registries
    const namePart = name ? `"${name}" ` : "";
    const zipPart = zipCode ? ` ${zipCode}` : "";
    const query = `${namePart}sex offender registry ${state}${zipPart} site:nsopw.gov OR site:gov`;

    console.log("Sex offender search query:", query);

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
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Firecrawl API error:", data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get official state registry links
    const registryResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${state} official sex offender registry search site:gov`,
        limit: 5,
        country: "us",
        lang: "en",
      }),
    });

    const registryData = await registryResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        results: data.data || [],
        officialRegistries: registryData.data || [],
        nsopwLink: "https://www.nsopw.gov/",
        disclaimer: "This is legal information, not legal advice. Always verify information through the National Sex Offender Public Website (NSOPW.gov) or your state's official registry.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sex offender search error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
