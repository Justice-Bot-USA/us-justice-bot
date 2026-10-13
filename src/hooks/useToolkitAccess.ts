import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchToolkitAccess, toolkitKeys, type ToolkitAccess } from "@/lib/toolkit/access";

export interface UseToolkitAccessResult extends ToolkitAccess {
  /** True once auth has loaded and someone is signed in. */
  signedIn: boolean;
  /** Re-checks the plan (for example after cancelling or subscribing). */
  refresh: () => Promise<void>;
}

/**
 * The signed-in person's Toolkit plan status: 'loading' | 'active' | 'none' | 'lapsed'.
 * Signed-out visitors get 'none'. Use it to decide what to offer; the database enforces the same
 * rule (only new calendar dates and class records need a plan), so a stale answer can never let
 * someone add rows without a plan or stop them changing their own data.
 */
export function useToolkitAccess(): UseToolkitAccessResult {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery({
    queryKey: toolkitKeys.access(userId),
    queryFn: () => fetchToolkitAccess(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["toolkit", "access"] });
  }, [queryClient]);

  if (authLoading) return { status: "loading", signedIn: false, refresh };
  if (!userId) return { status: "none", signedIn: false, refresh };
  if (query.isPending) return { status: "loading", signedIn: true, refresh };
  if (query.error || !query.data) return { status: "none", checkFailed: true, signedIn: true, refresh };
  return { ...query.data, signedIn: true, refresh };
}
