import { corsHeaders, handleCors } from "../_shared/auth.ts";

// Retired (Oct 2026). This AI chat function told the model to cite statutes and answer
// individual legal questions; nothing in the app calls it any more. It stays deployed
// only to answer old clients with 410 Gone.
Deno.serve((req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return new Response(
    JSON.stringify({
      error:
        "The legal chat assistant has been retired. Free California and New York court forms and guides are at justicebot-usa.com.",
      code: "GONE",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
