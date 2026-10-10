import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). Justice Bot USA takes payment only through Stripe, for the
// single $25/month plan. PayPal was never offered in the app; the function stays
// deployed only to answer old callers with 410 Gone.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "PayPal payments are no longer accepted. Justice Bot USA has one plan, $25/month, paid through our Stripe checkout on the Pricing page.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
