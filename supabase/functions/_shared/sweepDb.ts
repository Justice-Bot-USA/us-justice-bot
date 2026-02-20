import { createClient } from "npm:@supabase/supabase-js@2.49.4";

// Get Supabase client with service role for writing sweep progress
export function getServiceClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
}

export type SweepStatus = 'queued' | 'running' | 'done' | 'error';

export interface SweepUpdate {
  status?: SweepStatus;
  progress?: number;
  started_at?: string;
  completed_at?: string;
  error?: string | null;
  output?: Record<string, unknown> | null;
}

/**
 * Update a sweep row in the database
 * Uses upsert with composite unique (case_id, sweep_name)
 */
export async function updateSweep(
  caseId: string,
  sweepName: string,
  userId: string,
  update: SweepUpdate
): Promise<void> {
  const client = getServiceClient();
  
  const { error } = await client
    .from('case_sweeps')
    .upsert(
      {
        case_id: caseId,
        sweep_name: sweepName,
        user_id: userId,
        ...update,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'case_id,sweep_name' }
    );
  
  if (error) {
    console.error(`Failed to update sweep ${sweepName}:`, error);
    throw error;
  }
}

/**
 * Mark a sweep as running with initial progress
 */
export async function startSweep(
  caseId: string,
  sweepName: string,
  userId: string
): Promise<void> {
  await updateSweep(caseId, sweepName, userId, {
    status: 'running',
    progress: 5,
    started_at: new Date().toISOString(),
    error: null,
  });
}

/**
 * Update sweep progress (0-100)
 */
export async function updateSweepProgress(
  caseId: string,
  sweepName: string,
  userId: string,
  progress: number
): Promise<void> {
  await updateSweep(caseId, sweepName, userId, {
    progress: Math.min(100, Math.max(0, progress)),
  });
}

/**
 * Mark a sweep as completed with output
 */
export async function completeSweep(
  caseId: string,
  sweepName: string,
  userId: string,
  output: Record<string, unknown>
): Promise<void> {
  await updateSweep(caseId, sweepName, userId, {
    status: 'done',
    progress: 100,
    completed_at: new Date().toISOString(),
    output,
    error: null,
  });
}

/**
 * Mark a sweep as failed with error message
 */
export async function failSweep(
  caseId: string,
  sweepName: string,
  userId: string,
  errorMessage: string
): Promise<void> {
  await updateSweep(caseId, sweepName, userId, {
    status: 'error',
    progress: 100,
    completed_at: new Date().toISOString(),
    error: errorMessage,
  });
}
