// Toolkit plan status for the signed-in person, and the react-query keys the Toolkit uses.
//
// "active" comes from rpc('my_toolkit_access'), the same function the database's row-level
// security uses, so the screen and the database always agree. The person's own subscriptions row
// only adds dates. A lapsed or never-subscribed person can always open, change, download and
// delete their own data; only adding new calendar dates or class records and making a binder PDF
// need an active plan.
//
// This file stays small (no Toolkit lists, no pdf-lib) because the site Header imports it.

import { supabase } from "@/integrations/supabase/client";

export type ToolkitAccessStatus = "loading" | "active" | "none" | "lapsed";

export interface ToolkitAccess {
  status: ToolkitAccessStatus;
  /** ISO timestamp: end of the active plan's current period (subscriptions.end_date), when known. */
  activeUntil?: string;
  /** ISO timestamp: when a lapsed plan ended. Only set when that moment is in the past. */
  endedOn?: string;
  /** The person cancelled; the plan stays active until activeUntil. */
  cancelAtPeriodEnd?: boolean;
  /** The person has at least one subscriptions row (any status). */
  hasSubscriptionRow?: boolean;
  /** The check failed; status is a best guess from the subscriptions row. The database still enforces access. */
  checkFailed?: boolean;
}

/** React-query keys for everything the Toolkit caches. Invalidate ['toolkit'] to refresh it all. */
export const toolkitKeys = {
  all: ["toolkit"] as const,
  access: (userId: string | null | undefined) => ["toolkit", "access", userId ?? "signed-out"] as const,
  cases: (userId: string | null | undefined) => ["toolkit", "cases", userId ?? "signed-out"] as const,
  files: (userId: string | null | undefined) => ["toolkit", "files", userId ?? "signed-out"] as const,
  calendar: (userId: string | null | undefined) => ["toolkit", "calendar", userId ?? "signed-out"] as const,
  trackers: (userId: string | null | undefined) => ["toolkit", "trackers", userId ?? "signed-out"] as const,
  sessions: (userId: string | null | undefined, trackerId?: string) =>
    trackerId
      ? (["toolkit", "sessions", userId ?? "signed-out", trackerId] as const)
      : (["toolkit", "sessions", userId ?? "signed-out"] as const),
  counts: (userId: string | null | undefined) => ["toolkit", "counts", userId ?? "signed-out"] as const,
  /** Header: does the person have any subscriptions row? */
  subscriptionRow: (userId: string | null | undefined) => ["toolkit", "subscription-row", userId ?? "signed-out"] as const,
  /** Header: check-subscription result (subscribed or cancellable). */
  checkSubscription: (userId: string | null | undefined) =>
    ["toolkit", "check-subscription", userId ?? "signed-out"] as const,
};

/** Same grace period as public.my_toolkit_access(): two days after end_date for a late renewal webhook. */
const GRACE_MS = 2 * 24 * 60 * 60 * 1000;

interface SubscriptionDates {
  status: string;
  end_date: string;
  cancel_at_period_end: boolean | null;
}

/** Works out the signed-in person's Toolkit status. Never throws. */
export async function fetchToolkitAccess(userId: string): Promise<ToolkitAccess> {
  const [rpcRes, subsRes] = await Promise.all([
    supabase.rpc("my_toolkit_access"),
    supabase
      .from("subscriptions")
      .select("status,end_date,cancel_at_period_end")
      .eq("user_id", userId)
      .order("end_date", { ascending: false })
      .limit(10),
  ]);

  const rows: SubscriptionDates[] = subsRes.error ? [] : ((subsRes.data ?? []) as SubscriptionDates[]);
  const latestActive = rows.find((r) => r.status === "active");
  const latest = rows[0];
  const now = Date.now();

  let active: boolean;
  let checkFailed = Boolean(subsRes.error);
  if (rpcRes.error) {
    checkFailed = true;
    active = Boolean(latestActive && Date.parse(latestActive.end_date) > now - GRACE_MS);
  } else {
    active = rpcRes.data === true;
  }

  if (active) {
    return {
      status: "active",
      activeUntil: latestActive?.end_date,
      cancelAtPeriodEnd: Boolean(latestActive?.cancel_at_period_end),
      hasSubscriptionRow: rows.length > 0,
      ...(checkFailed ? { checkFailed } : {}),
    };
  }

  if (latest) {
    const ended = Date.parse(latest.end_date);
    return {
      status: "lapsed",
      ...(Number.isFinite(ended) && ended <= now ? { endedOn: latest.end_date } : {}),
      hasSubscriptionRow: true,
      ...(checkFailed ? { checkFailed } : {}),
    };
  }

  return { status: "none", hasSubscriptionRow: false, ...(checkFailed ? { checkFailed } : {}) };
}

/** True when the person may add new calendar dates or class records, or make a binder PDF. */
export function canCreate(access: Pick<ToolkitAccess, "status">): boolean {
  return access.status === "active";
}

const LONG_DATE = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

/**
 * "October 15, 2026" for a plan date (an ISO timestamp from subscriptions.end_date), in the
 * viewer's own time zone. A bare 'yyyy-MM-dd' string is shown as that calendar date. Returns ""
 * for a missing or unreadable value.
 */
export function formatPlanDate(value: string | null | undefined): string {
  if (!value) return "";
  const bare = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (bare) {
    // Built from the numbers so the day never shifts.
    return LONG_DATE.format(new Date(Number(bare[1]), Number(bare[2]) - 1, Number(bare[3])));
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? LONG_DATE.format(new Date(ms)) : "";
}
