// Billing disclosure checks (engineering review important #11, item 6; legal review important #6).
//
// The Pricing page shows src/lib/billingDisclosure.ts, and stripe-checkout refuses a purchase
// unless the SHA-256 of that text matches its own copy in supabase/functions/_shared/
// billingDisclosure.ts. This check makes sure:
// - the two copies are identical, value for value and byte for byte;
// - the browser, the server and node:crypto all compute the same hash, and the server accepts
//   only the current version and hash;
// - the price is the same everywhere, and the plan's feature lines match what the code does;
// - the cancel path the disclosure describes exists (account menu item and /account/billing);
// - the cancellation email sent when delete-my-data cancels a plan never says the person's files
//   are kept, and delete-my-data deletes every user-keyed table except the billing records it keeps;
// - no price call to action ("Get the Toolkit — $25.00 a month") shows unless checkout is open;
// - sales stay closed unless TOOLKIT_SALES_ENABLED is exactly "true" and every other check passes,
//   and consent needs both boxes ticked;
// - no "Veritas", "free forever", promo codes or old pause flag anywhere, and the company names
//   are spelled the one way.
//
// Run with `npm run check:toolkit` (or `node scripts/toolkit/run-checks.mjs disclosure`).

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import * as client from "@/lib/billingDisclosure";
import { PLAN, disclosureSha256 as browserSha256 } from "@/lib/pricing";
import { BINDER_FILE_ACCEPT, BINDER_FILE_RULES, KIND_MIME, detectFileKind } from "@/lib/binder/prepareFiles";
import { ALERTS_QUALIFIER } from "@/components/toolkit/calendar/copy";
import * as server from "../../supabase/functions/_shared/billingDisclosure.ts";
import { checkConsent } from "../../supabase/functions/stripe-checkout/consent.ts";
import { createSalesGate, type PriceLike } from "../../supabase/functions/stripe-checkout/sales.ts";
import { createHarness, repoRoot, run } from "./harness";

const t = createHarness("check-disclosure");
const read = (rel: string) => readFileSync(path.join(repoRoot(), rel), "utf8");

function listFiles(rel: string, exts: RegExp): string[] {
  const abs = path.join(repoRoot(), rel);
  const st = statSync(abs, { throwIfNoEntry: false });
  if (!st) return [];
  if (st.isFile()) return exts.test(rel) ? [rel] : [];
  return readdirSync(abs).flatMap((name) => (name === "node_modules" ? [] : listFiles(path.join(rel, name), exts)));
}

async function main() {
  // ---------------------------------------------------------------- 1. identical copies
  const clientNames = Object.keys(client).sort();
  const serverSrc = read("supabase/functions/_shared/billingDisclosure.ts");
  const begin = serverSrc.indexOf("// ---- BEGIN SHARED BILLING TEXT");
  const end = serverSrc.indexOf("// ---- END SHARED BILLING TEXT ----");
  t.ok(begin > 0 && end > begin, "server copy has the BEGIN/END SHARED BILLING TEXT markers");
  const serverBlock = serverSrc.slice(serverSrc.indexOf("\n", begin) + 1, end);
  const serverBlockNames = [...serverBlock.matchAll(/^export (?:const|function|async function) (\w+)/gm)].map((m) => m[1]).sort();
  t.eq(serverBlockNames, clientNames, "the shared block exports exactly the client file's names");

  for (const name of clientNames) {
    const c = (client as Record<string, unknown>)[name];
    const s = (server as Record<string, unknown>)[name];
    if (typeof c === "function") {
      t.eq(typeof s === "function" ? (s as () => unknown)() : s, (c as () => unknown)(), `${name}() is the same on both sides`);
    } else if (name === "CANCEL_DIALOG") {
      const cd = c as typeof client.CANCEL_DIALOG;
      const sd = s as typeof client.CANCEL_DIALOG;
      t.eq([sd.title, sd.confirm, sd.keep], [cd.title, cd.confirm, cd.keep], "CANCEL_DIALOG labels are the same");
      for (const date of ["November 13, 2026", "February 28, 2027"]) t.eq(sd.body(date), cd.body(date), `CANCEL_DIALOG.body("${date}") is the same`);
    } else {
      t.eq(s, c, `${name} is the same on both sides`);
    }
  }
  const clientSrc = read("src/lib/billingDisclosure.ts");
  const clientBlock = clientSrc.slice(clientSrc.indexOf("export const DISCLOSURE_VERSION"));
  t.ok(clientBlock.length > 1000 && serverBlock === clientBlock, "the shared block's source is byte-identical in both files");
  t.ok(!/\bDeno\./.test(serverSrc) && !/from\s+["'](https?:|npm:|jsr:)/.test(serverSrc), "the server copy uses no Deno APIs or remote imports (node can read it)");

  // ---------------------------------------------------------------- 2. hashes
  const text = client.disclosureText();
  const nodeHash = createHash("sha256").update(text, "utf8").digest("hex");
  t.ok(/^[0-9a-f]{64}$/.test(nodeHash), "the hash is 64 lowercase hex characters (the billing_consents CHECK)");
  t.eq(await server.disclosureSha256(), nodeHash, "server disclosureSha256() equals node:crypto");
  t.eq(await browserSha256(), nodeHash, "browser disclosureSha256() (src/lib/pricing.ts) equals node:crypto");
  t.ok(await server.isCurrentDisclosure(client.DISCLOSURE_VERSION, nodeHash), "the server accepts the current version and hash");
  t.ok(!(await server.isCurrentDisclosure("toolkit-2025-01-v0", nodeHash)), "the server refuses another version");
  t.ok(!(await server.isCurrentDisclosure(client.DISCLOSURE_VERSION, "0".repeat(64))), "the server refuses another hash");
  t.ok(!(await server.isCurrentDisclosure(client.DISCLOSURE_VERSION, null)), "the server refuses a missing hash");
  const oneCharOff = createHash("sha256").update(text.replace("$25.00 today", "$25 today"), "utf8").digest("hex");
  t.ok(!(await server.isCurrentDisclosure(client.DISCLOSURE_VERSION, oneCharOff)), "a small change to the shown text is refused");
  t.ok(text.startsWith(client.DISCLOSURE_HEADING) && text.endsWith(client.CONSENT_TERMS) && client.DISCLOSURE_BULLETS.every((b) => text.includes(b)), "the hashed text holds the heading, every bullet and both checkboxes");

  // ---------------------------------------------------------------- 3. consent
  const good = { autoRenewConsent: true, tosConsent: true, disclosureVersion: client.DISCLOSURE_VERSION, disclosureSha256: nodeHash };
  t.ok((await checkConsent(good)).ok, "consent: both boxes ticked and the current text");
  for (const [label, body] of [
    ["auto-renew box unticked", { ...good, autoRenewConsent: false }],
    ["terms box missing", { ...good, tosConsent: undefined }],
    ['the string "true" is not consent', { ...good, autoRenewConsent: "true" }],
    ["old text", { ...good, disclosureSha256: oneCharOff }],
    ["unknown version", { ...good, disclosureVersion: "x" }],
  ] as const) {
    t.ok(!(await checkConsent(body as Record<string, unknown>)).ok, `consent refused: ${label}`);
  }

  // ---------------------------------------------------------------- 4. sales stay closed by default
  const goodPrice: PriceLike = {
    active: true,
    currency: server.TOOLKIT_CURRENCY,
    unit_amount: server.TOOLKIT_PRICE_CENTS,
    recurring: { interval: server.TOOLKIT_INTERVAL, interval_count: 1 },
    product: { active: true, name: server.TOOLKIT_PRODUCT_NAME, description: server.TOOLKIT_PRODUCT_DESCRIPTION },
  };
  let stripeCalls = 0;
  const gate = (flag: string | undefined, opts: { email?: boolean; price?: PriceLike; business?: string } = {}) =>
    createSalesGate({
      env: (name) => (name === "TOOLKIT_SALES_ENABLED" ? flag : undefined),
      emailConfigured: () => opts.email ?? true,
      retrievePrice: async () => {
        stripeCalls++;
        return opts.price ?? goodPrice;
      },
      retrieveAccount: async () => ({ business_profile: { name: opts.business ?? server.STRIPE_BUSINESS_NAME } }),
    }).status();
  for (const flag of [undefined, "", "false", "TRUE", "1", "yes", " true"]) {
    t.eq(await gate(flag), { open: false, reason: "flag_off" }, `sales closed when TOOLKIT_SALES_ENABLED is ${JSON.stringify(flag)}`);
  }
  t.eq(stripeCalls, 0, "a closed flag never calls Stripe");
  t.eq((await gate("true", { email: false })).reason, "email_not_configured", "sales closed until billing email is set up");
  t.eq((await gate("true", { business: "Quorex" })).reason, "business_name", 'sales closed unless the Stripe business name is "Justice Bot USA"');
  t.eq((await gate("true", { price: { ...goodPrice, unit_amount: 2000 } })).reason, "price_mismatch", "sales closed unless the price is $25.00 a month");
  const oldProduct = { ...goodPrice, product: { active: true, name: server.TOOLKIT_PRODUCT_NAME, description: "Old text" } };
  t.eq((await gate("true", { price: oldProduct })).reason, "product_description", "sales closed unless the product description is the approved text");
  t.eq(await gate("true"), { open: true, reason: "open" }, 'sales open only when the flag is exactly "true" and every check passes');

  // ---------------------------------------------------------------- 5. one price everywhere
  t.eq(client.TOOLKIT_PRICE_LABEL, `$${(server.TOOLKIT_PRICE_CENTS / 100).toFixed(2)}`, "price label equals the server's price in cents");
  t.eq(PLAN.price, server.TOOLKIT_PRICE_CENTS / 100, "PLAN.price equals the server's price");
  t.ok(PLAN.priceLabel.startsWith(client.TOOLKIT_PRICE_LABEL) && /a month/.test(PLAN.priceLabel), "PLAN.priceLabel says $25.00 a month");
  const pricedTexts = [client.DISCLOSURE_HEADING, client.DISCLOSURE_BULLETS[0], client.CONSENT_AUTO_RENEW];
  const prices = [...text.matchAll(/\$[\d.,]*\d/g)].map((m) => m[0]);
  t.ok(pricedTexts.every((s) => s.includes(client.TOOLKIT_PRICE_LABEL)) && prices.length >= 3 && prices.every((p) => p === client.TOOLKIT_PRICE_LABEL), "every price in the disclosure is written $25.00", prices);
  t.eq(server.TOOLKIT_PRODUCT_NAME, "Justice Bot USA Toolkit", "Stripe product name");
  t.ok(server.CHECKOUT_SUBMIT_MESSAGE.length <= 1200, "Checkout submit message fits Stripe's 1200-character limit");

  // ---------------------------------------------------------------- 6. claims match the code
  const [binderLine, calendarLine, classesLine] = client.TOOLKIT_FEATURES;
  t.ok(client.TOOLKIT_FEATURES.length === 3 && binderLine.startsWith("Case binder:") && calendarLine.startsWith("Hearing calendar:") && classesLine.startsWith("Class tracker:"),
    "the three feature lines are the binder, calendar and class tracker the disclosure lists");
  t.ok(/PDF, JPG and PNG/.test(binderLine) && /PDF, JPG or PNG/.test(BINDER_FILE_RULES), "binder copy says PDF, JPG and PNG");
  t.eq(Object.keys(KIND_MIME).sort(), ["jpeg", "pdf", "png"], "the binder reads exactly PDF, JPEG and PNG");
  t.eq(BINDER_FILE_ACCEPT.split(",").filter((s) => s.includes("/")).sort(), ["application/pdf", "image/jpeg", "image/png"], "the binder uploader accepts exactly those types");
  const bytes = (s: string) => new TextEncoder().encode(s);
  t.ok(detectFileKind(bytes("%PDF-1.7")) === "pdf" && detectFileKind(bytes("PK\u0003\u0004")) === null && detectFileKind(bytes("GIF89a")) === null, "Word (zip) and GIF files are not read as binder files");
  t.ok(calendarLine.includes(ALERTS_QUALIFIER), "the calendar line carries the same alerts qualifier as the calendar page");
  const ack = server.acknowledgmentEmail({ startDate: "October 13, 2026", nextChargeDate: "November 13, 2026" });
  const emails = [
    ack,
    server.annualReminderEmail(),
    server.cancellationEmail({ kind: "period_end", activeUntil: "November 13, 2026" }),
    server.cancellationEmail({ kind: "ended" }),
    server.cancellationEmail({ kind: "refunded" }),
    server.cancellationEmail({ kind: "account_deleted" }),
  ];
  for (const email of emails) {
    const all = `${email.subject}\n${email.text}`;
    t.ok(/Justice Bot USA/.test(all) && all.includes("Quorex Solutions") && all.includes("Justice Bot Technologies Inc.") && all.includes(server.BILLING_EMAIL),
      `email "${email.subject}" names the company and the billing address`);
    t.ok(!/\[|\]|undefined|NaN/.test(all), `email "${email.subject}" has no unfilled placeholders`);
  }
  t.ok(ack.text.includes("November 13, 2026") && ack.text.includes("Cancel subscription") && ack.text.includes("30 days"), "the acknowledgment gives the next charge date, how to cancel and the refund window");

  // Cancellation emails: the plan-ended ones say nothing is deleted; the one delete-my-data sends
  // (account_deleted) must not, because the account and files are deleted right after.
  for (const variant of [{ kind: "period_end", activeUntil: "November 13, 2026" }, { kind: "ended" }, { kind: "refunded" }] as const) {
    t.ok(server.cancellationEmail(variant).text.includes("not deleted"), `the ${variant.kind} cancellation email says files are not deleted`);
  }
  const deletedEmail = server.cancellationEmail({ kind: "account_deleted" });
  t.ok(!deletedEmail.text.includes(server.AFTER_PLAN_ENDS) && !/not deleted|still open|download/i.test(deletedEmail.text),
    "the account-deletion cancellation email never says files are kept or can still be opened");
  t.ok(/because you asked us to delete your account/.test(deletedEmail.text) && /won't be charged again/.test(deletedEmail.text) && /We are deleting your account, your files/.test(deletedEmail.text),
    "the account-deletion cancellation email says why, that there are no more charges, and that the data is being deleted");
  t.eq(server.endedCancellationVariant(server.CANCEL_COMMENT_ACCOUNT_DELETED), { kind: "account_deleted" }, "an account_deleted cancel picks the account_deleted email");
  t.eq(server.endedCancellationVariant(server.CANCEL_COMMENT_REFUNDED), { kind: "refunded" }, "a refunded cancel picks the refunded email");
  t.eq([server.endedCancellationVariant(null), server.endedCancellationVariant(server.CANCEL_COMMENT_DUPLICATE)], [{ kind: "ended" }, { kind: "ended" }], "any other ended plan picks the ended email");
  const deleteSrc = read("supabase/functions/delete-my-data/index.ts");
  t.ok(/comment: CANCEL_COMMENT_ACCOUNT_DELETED/.test(deleteSrc) && !/comment: "account_deleted"/.test(deleteSrc), "delete-my-data cancels with CANCEL_COMMENT_ACCOUNT_DELETED");
  t.ok(/return endedCancellationVariant\(subscription\.cancellation_details\?\.comment\)/.test(read("supabase/functions/stripe-webhook/toolkitSubscriptions.ts")),
    "cancellationVariantFor picks the email for an ended plan with endedCancellationVariant");

  // Account deletion: every table with a user_id column (src/integrations/supabase/types.ts) is
  // deleted by delete-my-data, or kept on purpose as a financial or legal record, or is an
  // attorney's own directory listing. A new user-keyed table fails this until it is placed.
  const tableList = (name: string) => {
    const m = deleteSrc.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`));
    return m ? [...m[1].matchAll(/"(\w+)"|\bCHAT_MESSAGES\b/g)].map((x) => x[1] ?? "chat_messages") : [];
  };
  const deleted = tableList("ROW_TABLES");
  const kept = tableList("KEPT_TABLES");
  t.eq(kept.sort(), ["billing_consents", "billing_notices", "form_payments", "payments", "subscriptions"], "delete-my-data keeps exactly the billing and payment records");
  const typesSrc = read("src/integrations/supabase/types.ts");
  const tablesBlock = typesSrc.slice(typesSrc.indexOf("    Tables: {"), typesSrc.indexOf("    Views: {"));
  const userKeyed = [...tablesBlock.matchAll(/\n {6}(\w+): \{\n {8}Row: \{([\s\S]*?)\n {8}\}/g)]
    .filter((m) => /^\s*user_id\??:/m.test(m[2]))
    .map((m) => m[1]);
  const notPlaced = userKeyed.filter((name) => !deleted.includes(name) && !kept.includes(name) && name !== "attorneys");
  t.ok(userKeyed.length >= 25 && notPlaced.length === 0, `delete-my-data deletes or deliberately keeps all ${userKeyed.length} user-keyed tables`, notPlaced.join(", "));
  t.ok(deleted.includes("chat_messages") && deleted.indexOf("chat_messages") < deleted.indexOf("chat_sessions"), "chat messages are deleted (through chat_sessions) before their sessions");
  for (const [child, parent] of [["class_trackers", "case_files"], ["course_certificates", "course_enrollments"], ["journey_tasks", "legal_journeys"], ["case_files", "case_merit_scores"], ["case_merit_scores", "chat_sessions"], ["support_messages", "support_tickets"]]) {
    t.ok(deleted.indexOf(child) >= 0 && deleted.indexOf(child) < deleted.indexOf(parent), `delete-my-data deletes ${child} before ${parent}`);
  }
  t.ok(/report\.rows = await countByUser\(admin, ROW_TABLES, userId\)/.test(deleteSrc) && /report\.keptRows = await countByUser\(admin, KEPT_TABLES, userId\)/.test(deleteSrc),
    "the dry run counts every table it deletes from and every table it keeps");

  // No price call to action while checkout is closed: every "Get the Toolkit" link checks the
  // checkout-status query first.
  const ctaFiles = listFiles("src", /\.tsx$/).filter((rel) => /Get the Toolkit/.test(read(rel)));
  t.ok(ctaFiles.length >= 2 && ctaFiles.every((rel) => /useCheckoutStatus\(\)/.test(read(rel)) && /checkout\.data === true \?/.test(read(rel))),
    "every \"Get the Toolkit\" link is shown only when checkout is available", ctaFiles.join(", "));

  // The cancel path in the disclosure: account menu > Cancel subscription, or the Pricing page.
  t.ok(/sign in, open your account menu and choose Cancel subscription/.test(client.DISCLOSURE_BULLETS[2]), "the disclosure describes the account-menu cancel path");
  const header = read("src/components/Header.tsx");
  const app = read("src/App.tsx");
  const pricing = read("src/pages/Pricing.tsx");
  t.ok(/Cancel subscription/.test(header) && /["']\/account\/billing["']/.test(header), "the account menu has Cancel subscription linking to /account/billing");
  t.ok(/path=["']\/account\/billing["']/.test(app), "the /account/billing route exists");
  t.ok(/\/account\/billing/.test(pricing) && /Cancel subscription/.test(pricing), "the Pricing page links to cancelling");

  // ---------------------------------------------------------------- 7. wording gate
  const scanned = [
    ...listFiles("src", /\.(ts|tsx)$/),
    ...listFiles("supabase/functions", /\.ts$/),
    "index.html",
    "README.md",
    "FEATURES.md",
  ];
  const banned: [RegExp, string][] = [
    [/veritas/i, 'the old name "Veritas"'],
    [/free forever/i, '"free forever"'],
    [/NEW_SUBSCRIPTIONS_PAUSED/, "the removed NEW_SUBSCRIPTIONS_PAUSED flag"],
    [/\bUS Justice Bot\b|usjusticebot|JusticeBot USA|Justice-Bot USA/, 'a wrong spelling of "Justice Bot USA"'],
    [/Justice Bot Technologies(?! Inc\.)/, 'a wrong spelling of "Justice Bot Technologies Inc."'],
    [/Quorex Solution(?!s)/, 'a wrong spelling of "Quorex Solutions"'],
  ];
  const hits: string[] = [];
  for (const rel of scanned) {
    const lines = read(rel).split("\n");
    lines.forEach((line, i) => {
      for (const [re, what] of banned) if (re.test(line)) hits.push(`${rel}:${i + 1} ${what}`);
      if (/allow_promotion_codes/.test(line) && !/^\s*(\/\/|\*)/.test(line)) hits.push(`${rel}:${i + 1} promo codes (allow_promotion_codes)`);
    });
  }
  t.ok(scanned.length > 100 && hits.length === 0, `wording gate over ${scanned.length} files: names spelled one way, no Veritas, "free forever", promo codes or old pause flag`, hits.slice(0, 10).join("\n       "));

  t.finish();
}

run("check-disclosure", main);
