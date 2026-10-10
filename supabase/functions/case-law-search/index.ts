import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). Case law search was removed: it asked an AI model for case
// citations, which can be invented, plus case strategy. The function stays
// deployed only to answer old clients with 410 Gone; nothing in the app calls it.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "Case law search has been retired. For real court decisions, use CourtListener (courtlistener.com) or your state court's website, or ask a law library.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
