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
        "PayPal payments are no longer accepted. Justice Bot USA's only paid plan is the Toolkit ($25.00 a month), sold through Stripe on the Pricing page when it is available.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
