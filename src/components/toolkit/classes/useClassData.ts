import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listClassSessions, listClassTrackers, toToolkitError, toolkitKeys, type ToolkitApiError } from "@/lib/toolkit/api";
import type { ClassSessionRow, ClassTrackerRow } from "@/lib/toolkit/types";
import { sessionsByTracker } from "./classModel";

export interface UseClassDataResult {
  /** The person's class records, oldest first. */
  trackers: ClassTrackerRow[];
  /** Sessions grouped by class id, each list oldest first. */
  sessionsFor: (trackerId: string) => ClassSessionRow[];
  /** Every session (for the records PDF). */
  sessions: ClassSessionRow[];
  isLoading: boolean;
  error: ToolkitApiError | null;
  refetch: () => void;
  putTracker: (row: ClassTrackerRow) => void;
  /** Drops a class and its sessions from the cached lists. */
  removeTracker: (id: string) => void;
  putSession: (row: ClassSessionRow) => void;
  removeSession: (id: string) => void;
}

/**
 * The signed-in person's class records and logged sessions. Reading, changing and deleting are
 * free; only new records and new sessions need the plan (the database decides).
 */
export function useClassData(userId: string | null | undefined): UseClassDataResult {
  const queryClient = useQueryClient();
  const trackersKey = toolkitKeys.trackers(userId);
  const sessionsKey = toolkitKeys.sessions(userId);

  const trackersQuery = useQuery({
    queryKey: trackersKey,
    queryFn: () => listClassTrackers(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
  const sessionsQuery = useQuery({
    queryKey: sessionsKey,
    queryFn: () => listClassSessions(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

  const trackers = useMemo(() => trackersQuery.data ?? [], [trackersQuery.data]);
  const sessions = useMemo(() => sessionsQuery.data ?? [], [sessionsQuery.data]);
  const grouped = useMemo(() => sessionsByTracker(sessions), [sessions]);

  const refreshCounts = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) });
  }, [queryClient, userId]);

  const putTracker = useCallback(
    (row: ClassTrackerRow) => {
      queryClient.setQueryData<ClassTrackerRow[]>(toolkitKeys.trackers(userId), (old) => {
        const list = old ?? [];
        return list.some((r) => r.id === row.id) ? list.map((r) => (r.id === row.id ? row : r)) : [...list, row];
      });
      refreshCounts();
    },
    [queryClient, userId, refreshCounts],
  );

  const removeTracker = useCallback(
    (id: string) => {
      queryClient.setQueryData<ClassTrackerRow[]>(toolkitKeys.trackers(userId), (old) => (old ?? []).filter((r) => r.id !== id));
      queryClient.setQueryData<ClassSessionRow[]>(toolkitKeys.sessions(userId), (old) =>
        (old ?? []).filter((s) => s.tracker_id !== id),
      );
      refreshCounts();
    },
    [queryClient, userId, refreshCounts],
  );

  const putSession = useCallback(
    (row: ClassSessionRow) => {
      queryClient.setQueryData<ClassSessionRow[]>(toolkitKeys.sessions(userId), (old) => {
        const list = old ?? [];
        return list.some((s) => s.id === row.id) ? list.map((s) => (s.id === row.id ? row : s)) : [...list, row];
      });
    },
    [queryClient, userId],
  );

  const removeSession = useCallback(
    (id: string) => {
      queryClient.setQueryData<ClassSessionRow[]>(toolkitKeys.sessions(userId), (old) => (old ?? []).filter((s) => s.id !== id));
    },
    [queryClient, userId],
  );

  const firstError = trackersQuery.error ?? sessionsQuery.error;

  return {
    trackers,
    sessions,
    sessionsFor: (trackerId) => grouped.get(trackerId) ?? [],
    isLoading: Boolean(userId) && (trackersQuery.isPending || sessionsQuery.isPending),
    error: firstError ? toToolkitError(firstError) : null,
    refetch: () => {
      void trackersQuery.refetch();
      void sessionsQuery.refetch();
    },
    putTracker,
    removeTracker,
    putSession,
    removeSession,
  };
}
