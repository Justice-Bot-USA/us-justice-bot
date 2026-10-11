import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). The in-app CourtListener search was removed; /courtlistener
// now redirects to /court-records, which links to official court sites. The
// function stays deployed only to answer old clients with 410 Gone; nothing in
// the app calls it.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "CourtListener search has been retired. Search court decisions directly at courtlistener.com, or use your state court's website.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
