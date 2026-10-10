import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). The sex offender lookup was removed: Justice Bot does not
// search law-enforcement or registry databases. The function stays deployed only
// to answer old clients with 410 Gone; nothing in the app calls it.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "This lookup has been retired. Justice Bot does not search registry or law-enforcement databases. Use the official National Sex Offender Public Website (nsopw.gov) or your state's registry.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
