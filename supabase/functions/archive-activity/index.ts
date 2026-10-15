// Retired (Oct 2026). This function logged page visits into user_activity_logs_archive, but its
// insert named a `route` column that table doesn't have and never set the required `action`, so
// every call failed. Nothing in the app calls it. It stays deployed only to answer old callers with
// 410 Gone; its source was never in this repo before.
Deno.serve(() =>
  new Response(JSON.stringify({ error: "This endpoint has been retired.", code: "GONE" }), {
    status: 410,
    headers: { "Content-Type": "application/json" },
  })
);
