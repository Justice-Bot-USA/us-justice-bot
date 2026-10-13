// The person's cases, for linking files, calendar dates and classes to a case.
//
// Reads only id, case_title, state and archived_at from case_merit_scores. The legacy AI columns
// on that table (legal_pathway, required_forms, next_steps and the like) hold machine-generated
// deadlines and must never be read by the Toolkit.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toolkitKeys } from "./access";
import { toToolkitError, type ToolkitApiError } from "./api";
import type { TimeZone, ToolkitCase } from "./types";

/**
 * The calendar's starting time zone for a case: Pacific for California, Eastern for New York.
 * Anything else returns null, and the person picks the zone themselves.
 */
export function defaultTimeZoneForState(state: string | null | undefined): TimeZone | null {
  const s = (state ?? "").trim().toLowerCase().replace(/\./g, "");
  if (s === "ca" || s === "california" || s === "calif") return "America/Los_Angeles";
  if (s === "ny" || s === "new york") return "America/New_York";
  return null;
}

interface CaseColumns {
  id: string;
  case_title: string;
  state: string;
  archived_at: string | null;
}

/** Open cases first (newest first), then archived ones. */
export async function listToolkitCases(userId: string): Promise<ToolkitCase[]> {
  const { data, error } = await supabase
    .from("case_merit_scores")
    .select("id, case_title, state, archived_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw toToolkitError(error);
  const rows = (data ?? []) as CaseColumns[];
  const open = rows.filter((r) => !r.archived_at);
  const archived = rows.filter((r) => r.archived_at);
  return [...open, ...archived].map((r) => ({
    id: r.id,
    case_title: r.case_title,
    state: r.state,
    archived_at: r.archived_at,
    defaultTimeZone: defaultTimeZoneForState(r.state),
  }));
}

export interface UseToolkitCasesResult {
  cases: ToolkitCase[];
  isLoading: boolean;
  error: ToolkitApiError | null;
  refetch: () => void;
  /** Looks a case up by id (null for "Not linked to a case" or an unknown id). */
  byId: (id: string | null | undefined) => ToolkitCase | null;
}

/** The signed-in person's cases. Empty while signed out. */
export function useToolkitCases(): UseToolkitCasesResult {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;
  const query = useQuery({
    queryKey: toolkitKeys.cases(userId),
    queryFn: () => listToolkitCases(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
  const cases = query.data ?? [];
  return {
    cases,
    isLoading: authLoading || (Boolean(userId) && query.isPending),
    error: query.error ? toToolkitError(query.error) : null,
    refetch: () => {
      void query.refetch();
    },
    byId: (id) => (id ? (cases.find((c) => c.id === id) ?? null) : null),
  };
}
