import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). Settlement estimates were removed by founder decision:
// we do not estimate what a claim is worth, predict outcomes or give
// negotiation strategy. The function stays deployed only to answer old clients
// with 410 Gone; nothing in the app calls it any more.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "The settlement calculator has been retired. Justice Bot does not estimate what a claim is worth. For help with your situation, talk to a lawyer or a free legal aid organization in your state.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
