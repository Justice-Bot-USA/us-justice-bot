import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). Legal sweeps were removed: the function never searched
// anything. It wrote made-up results with random statute citations and filing
// fees. The function stays deployed only to answer old clients with 410 Gone;
// nothing in the app calls it.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "Legal sweeps have been retired. For statutes and court rules, use your state legislature's or court system's official website, or ask a law library.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
