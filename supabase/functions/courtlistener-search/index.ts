import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";

const CL_BASE = "https://www.courtlistener.com/api/rest/v4";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    await requireUser(req);

    const {
      query,
      searchType = "o",      // o=opinions, r=RECAP/dockets, oa=oral arguments, p=people
      court,                   // court id e.g. "scotus", "ca9"
      dateAfter,               // YYYY-MM-DD
      dateBefore,              // YYYY-MM-DD
      jurisdiction,            // e.g. "F" (federal), "S" (state)
      status,                  // e.g. "Published", "Unpublished"
      page = 1,
    } = await req.json();

    if (!query || query.trim().length < 2) {
      return errorResponse("Search query must be at least 2 characters", 400);
    }

    // Build search URL with query params
    const params = new URLSearchParams();
    params.set("q", query.trim());
    params.set("type", searchType);
    params.set("order_by", "score desc");

    if (court) params.set("court", court);
    if (dateAfter) params.set("filed_after", dateAfter);
    if (dateBefore) params.set("filed_before", dateBefore);
    if (status) params.set("stat_", status);

    // Pagination — CL search uses cursor/page
    if (page > 1) params.set("page", String(page));

    const url = `${CL_BASE}/search/?${params.toString()}`;
    console.log("CourtListener search URL:", url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error("CourtListener API error:", response.status, errText);
      return errorResponse(
        `CourtListener returned ${response.status}`,
        response.status >= 500 ? 502 : response.status,
      );
    }

    const data = await response.json();

    // Normalize results based on search type
    const results = (data.results || []).map((r: any) => ({
      id: r.id,
      caseName: r.caseName || r.case_name || r.caseNameFull || "",
      court: r.court || r.court_citation_string || "",
      courtId: r.court_id || "",
      dateFiled: r.dateFiled || r.date_filed || "",
      dateArgued: r.dateArgued || r.date_argued || "",
      docketNumber: r.docketNumber || r.docket_number || "",
      suitNature: r.suitNature || r.nature_of_suit || "",
      citation: r.citation || (r.citations || []).map((c: any) => c.cite || c).join(", "),
      snippet: r.snippet || "",
      absoluteUrl: r.absolute_url || "",
      status: r.status || "",
      author: r.author_str || r.judge || "",
      downloadUrl: r.download_url || "",
    }));

    return successResponse({
      count: data.count || results.length,
      next: data.next || null,
      previous: data.previous || null,
      results,
      page,
      disclaimer:
        "Data sourced from CourtListener (Free Law Project). This is legal information, not legal advice.",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return errorResponse("CourtListener request timed out. Please try again.", 504);
    }
    console.error("CourtListener search error:", error);
    return handleError(error);
  }
});
