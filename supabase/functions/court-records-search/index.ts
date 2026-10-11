import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). Court records search was removed: it showed general web
// search results labeled as court records. The /court-records page now links
// straight to official California and New York court sites. The function stays
// deployed only to answer old clients with 410 Gone; nothing in the app calls it.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "Court records search has been retired. Search court records on your court's official website. Links for California and New York are at justicebot-usa.com/court-records.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
