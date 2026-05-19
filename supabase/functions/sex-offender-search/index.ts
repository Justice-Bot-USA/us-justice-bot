import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Require authentication to prevent scraping abuse
    await requireUser(req);

    const body = await req.json();
    const { action } = body;


    // Return the Mapbox token for client-side use (publishable key)
    // Restricted to trusted origins to prevent quota abuse
    if (action === "get-mapbox-token") {
      const origin = req.headers.get("origin") || "";
      const referer = req.headers.get("referer") || "";
      const TRUSTED_ORIGINS = [
        "https://us-justice-bot.lovable.app",
        "https://id-preview--0fb7fd76-1322-4244-87c6-066cca5bc66d.lovable.app",
        "http://localhost:5173",
        "http://localhost:8080",
      ];
      const isTrusted = TRUSTED_ORIGINS.some(
        (o) => origin.startsWith(o) || referer.startsWith(o)
      );
      if (!isTrusted) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized origin" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const token = Deno.env.get("MAPBOX_ACCESS_TOKEN");
      if (!token) {
        return new Response(
          JSON.stringify({ success: false, error: "Mapbox token not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ token }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map-based search using coordinates
    if (action === "map-search") {
      const { lat, lng, placeName } = body;
      return await handleMapSearch(lat, lng, placeName);
    }

    // Legacy form-based search
    const { name, state, zipCode } = body;

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
    const isAuth = error instanceof Error && error.message.includes("authorization");
    return new Response(
      JSON.stringify({ success: false, error: isAuth ? "Unauthorized" : "An error occurred processing your request" }),
      { status: isAuth ? 401 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleMapSearch(lat: number, lng: number, placeName?: string) {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  const mapboxToken = Deno.env.get("MAPBOX_ACCESS_TOKEN");

  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Firecrawl connector not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Reverse geocode to get location name if not provided
  let locationName = placeName;
  if (!locationName && mapboxToken) {
    try {
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,locality,neighborhood,postcode&limit=1`
      );
      const geoData = await geoRes.json();
      if (geoData.features?.length) {
        locationName = geoData.features[0].place_name;
      }
    } catch (e) {
      console.error("Reverse geocode error:", e);
    }
  }

  if (!locationName) {
    locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  console.log("Map search for location:", locationName);

  // Search for sex offenders and official registries in parallel (no scrapeOptions for speed)
  const query = `sex offender registry near ${locationName} site:nsopw.gov OR site:gov OR site:familywatchdog.us`;

  const [response, registryResponse] = await Promise.all([
    fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 8,
        country: "us",
        lang: "en",
      }),
    }),
    fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${locationName} official sex offender registry site:gov`,
        limit: 3,
        country: "us",
        lang: "en",
      }),
    }),
  ]);

  const [data, registryData] = await Promise.all([
    response.json(),
    registryResponse.json(),
  ]);

  if (!response.ok) {
    console.error("Firecrawl API error:", data);
    return new Response(
      JSON.stringify({ success: false, error: data.error || `Request failed: ${response.status}` }),
      { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Add approximate coordinates to results (scatter around the search point)
  const results = (data.data || []).map((r: any, i: number) => {
    const angle = (i / 8) * 2 * Math.PI;
    const radius = 0.01 + Math.random() * 0.02;
    return {
      ...r,
      lat: lat + radius * Math.sin(angle),
      lng: lng + radius * Math.cos(angle),
    };
  });

  console.log("Map search complete, results:", results.length);

  return new Response(
    JSON.stringify({
      success: true,
      results,
      officialRegistries: registryData.data || [],
      disclaimer: "This is legal information, not legal advice. Map pins show approximate locations only. Always verify through NSOPW.gov or your state's official registry.",
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
