import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCaseFiles, toToolkitError, toolkitKeys, updateCaseFile, type ToolkitApiError } from "@/lib/toolkit/api";
import type { CaseFilePatch, CaseFileRow } from "@/lib/toolkit/types";

/** Same order as the database query: sort_order (empty last), then upload time. */
export function compareFiles(a: CaseFileRow, b: CaseFileRow): number {
  const sa = a.sort_order ?? Number.POSITIVE_INFINITY;
  const sb = b.sort_order ?? Number.POSITIVE_INFINITY;
  if (sa !== sb) return sa < sb ? -1 : 1;
  return (a.created_at ?? "").localeCompare(b.created_at ?? "");
}

/** "1.2 MB", "350 KB" */
export function formatBytes(bytes: number | null | undefined): string {
  const n = Number(bytes ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export interface UseBinderFilesResult {
  /** All of the person's files (every case), in their chosen order. */
  files: CaseFileRow[];
  isLoading: boolean;
  error: ToolkitApiError | null;
  refetch: () => void;
  /** Saves organizing changes to one file and updates the list. Throws ToolkitApiError. */
  save: (id: string, patch: CaseFilePatch) => Promise<CaseFileRow>;
  /** Moves a file up or down within `list` (one case's files) and saves the new order. Throws ToolkitApiError. */
  move: (list: CaseFileRow[], index: number, direction: -1 | 1) => Promise<void>;
  /** Drops rows from the cached list after they were deleted. */
  forget: (ids: string[]) => void;
  /** Re-reads the list and the Toolkit counts. */
  invalidate: () => Promise<void>;
}

/** The signed-in person's binder files. Organizing is free for everyone. */
export function useBinderFiles(userId: string | null): UseBinderFilesResult {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: toolkitKeys.files(userId),
    queryFn: () => listCaseFiles(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

  const setRows = useCallback(
    (fn: (rows: CaseFileRow[]) => CaseFileRow[]) => {
      queryClient.setQueryData<CaseFileRow[]>(toolkitKeys.files(userId), (rows) => fn(rows ?? []).sort(compareFiles));
    },
    [queryClient, userId],
  );

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: toolkitKeys.files(userId) }),
      queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) }),
    ]);
  }, [queryClient, userId]);

  const save = useCallback(
    async (id: string, patch: CaseFilePatch) => {
      const row = await updateCaseFile(id, patch);
      setRows((rows) => rows.map((r) => (r.id === id ? row : r)));
      return row;
    },
    [setRows],
  );

  const move = useCallback(
    async (list: CaseFileRow[], index: number, direction: -1 | 1) => {
      const target = index + direction;
      if (target < 0 || target >= list.length) return;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      // Number the whole list once, then only rows whose position changed are saved.
      const changes = next
        .map((row, i) => ({ row, order: i }))
        .filter(({ row, order }) => row.sort_order !== order);
      const orders = new Map(changes.map(({ row, order }) => [row.id, order]));
      setRows((rows) => rows.map((r) => (orders.has(r.id) ? { ...r, sort_order: orders.get(r.id) ?? null } : r)));
      try {
        for (const { row, order } of changes) await updateCaseFile(row.id, { sort_order: order });
      } catch (err) {
        await invalidate();
        throw toToolkitError(err);
      }
    },
    [setRows, invalidate],
  );

  const forget = useCallback(
    (ids: string[]) => {
      const gone = new Set(ids);
      setRows((rows) => rows.filter((r) => !gone.has(r.id)));
      void queryClient.invalidateQueries({ queryKey: toolkitKeys.counts(userId) });
    },
    [setRows, queryClient, userId],
  );

  return {
    files: query.data ?? [],
    isLoading: Boolean(userId) && query.isPending,
    error: query.error ? toToolkitError(query.error) : null,
    refetch: () => {
      void query.refetch();
    },
    save,
    move,
    forget,
    invalidate,
  };
}
