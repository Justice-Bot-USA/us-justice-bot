// Checks the consent a create_subscription request carries: both checkboxes ticked (strictly true),
// the current disclosure version, and the SHA-256 of the disclosure text the page showed, which must
// equal the hash of the server copy in _shared/billingDisclosure.ts. No remote imports (testable).

import { DISCLOSURE_VERSION, isCurrentDisclosure } from "../_shared/billingDisclosure.ts";

export type ConsentProblem =
  /** A checkbox was not ticked, or the request did not say so. */
  | "consent_missing"
  /** The page showed another version of the terms (for example an old tab). */
  | "disclosure_outdated";

export type ConsentCheck =
  | { ok: true; version: string; sha256: string }
  | { ok: false; problem: ConsentProblem };

export async function checkConsent(body: Record<string, unknown>): Promise<ConsentCheck> {
  if (body.autoRenewConsent !== true || body.tosConsent !== true) return { ok: false, problem: "consent_missing" };
  const sha = typeof body.disclosureSha256 === "string" ? body.disclosureSha256.toLowerCase() : "";
  if (!/^[0-9a-f]{64}$/.test(sha) || !(await isCurrentDisclosure(body.disclosureVersion, sha))) {
    return { ok: false, problem: "disclosure_outdated" };
  }
  return { ok: true, version: DISCLOSURE_VERSION, sha256: sha };
}
