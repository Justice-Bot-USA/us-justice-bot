import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SweepName, SWEEP_ORDER, SWEEP_DISPLAY_NAMES } from '@/lib/sweeps/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface SweepRow {
  id: number;
  case_id: string;
  sweep_name: SweepName;
  status: 'queued' | 'running' | 'done' | 'error';
  progress: number;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  output: Record<string, unknown> | null;
  updated_at: string;
  user_id: string;
}

export interface SweepRealtimeState {
  sweeps: Record<SweepName, SweepRow | null>;
  isLoading: boolean;
  isComplete: boolean;
  hasError: boolean;
  overallProgress: number;
  currentSweep: SweepName | null;
}

/**
 * Hook that subscribes to case_sweeps table for realtime updates
 * As each sweep completes, the UI updates instantly
 */
export function useSweepRealtime(caseId: string | null) {
  const [state, setState] = useState<SweepRealtimeState>({
    sweeps: {} as Record<SweepName, SweepRow | null>,
    isLoading: true,
    isComplete: false,
    hasError: false,
    overallProgress: 0,
    currentSweep: null,
  });

  // Calculate derived state from sweeps
  const calculateDerivedState = useCallback((sweeps: Record<SweepName, SweepRow | null>) => {
    const totalSweeps = SWEEP_ORDER.length;
    let completedCount = 0;
    let hasError = false;
    let currentSweep: SweepName | null = null;

    for (const name of SWEEP_ORDER) {
      const sweep = sweeps[name];
      if (sweep?.status === 'done') {
        completedCount++;
      } else if (sweep?.status === 'error') {
        hasError = true;
      } else if (sweep?.status === 'running' && !currentSweep) {
        currentSweep = name;
      }
    }

    const overallProgress = Math.round((completedCount / totalSweeps) * 100);
    const isComplete = completedCount === totalSweeps;

    return { overallProgress, isComplete, hasError, currentSweep };
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!caseId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchSweeps = async () => {
      const { data, error } = await supabase
        .from('case_sweeps')
        .select('*')
        .eq('case_id', caseId);

      if (error) {
        console.error('Error fetching sweeps:', error);
        setState(prev => ({ ...prev, isLoading: false, hasError: true }));
        return;
      }

      const sweepMap: Record<SweepName, SweepRow | null> = {} as Record<SweepName, SweepRow | null>;
      (data || []).forEach((row) => {
        const sweepName = row.sweep_name as SweepName;
        sweepMap[sweepName] = {
          ...row,
          sweep_name: sweepName,
          completed_at: row.completed_at ?? null,
          started_at: row.started_at ?? null,
          error: row.error ?? null,
          output: row.output as Record<string, unknown> | null,
        };
      });

      const derived = calculateDerivedState(sweepMap);
      setState(prev => ({
        ...prev,
        sweeps: sweepMap,
        isLoading: false,
        ...derived,
      }));
    };

    fetchSweeps();
  }, [caseId, calculateDerivedState]);

  // Realtime subscription
  useEffect(() => {
    if (!caseId) return;

    let channel: RealtimeChannel | null = null;

    const setupSubscription = () => {
      channel = supabase
        .channel(`case_sweeps:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'case_sweeps',
            filter: `case_id=eq.${caseId}`,
          },
          (payload) => {
            const row = (payload.new || payload.old) as SweepRow;
            
            setState(prev => {
              const newSweeps = {
                ...prev.sweeps,
                [row.sweep_name as SweepName]: row,
              };
              const derived = calculateDerivedState(newSweeps);
              
              return {
                ...prev,
                sweeps: newSweeps,
                isLoading: false,
                ...derived,
              };
            });
          }
        )
        .subscribe((status) => {
          console.log(`Realtime subscription status for case ${caseId}:`, status);
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [caseId, calculateDerivedState]);

  // Get sweep output by name
  const getSweepOutput = useCallback(<T = unknown>(sweepName: SweepName): T | null => {
    const sweep = state.sweeps[sweepName];
    return sweep?.output as T | null;
  }, [state.sweeps]);

  // Get sweep status by name
  const getSweepStatus = useCallback((sweepName: SweepName): SweepRow['status'] | 'pending' => {
    const sweep = state.sweeps[sweepName];
    return sweep?.status || 'pending';
  }, [state.sweeps]);

  return {
    ...state,
    getSweepOutput,
    getSweepStatus,
    sweepOrder: SWEEP_ORDER,
    sweepNames: SWEEP_DISPLAY_NAMES,
  };
}

/**
 * Create a new case and seed all sweep rows as 'queued'
 * Returns the case_id for subscription
 */
export async function createCaseWithSweeps(
  userId: string,
  userStory: string,
  state?: string,
  county?: string
): Promise<string> {
  // Create case_merit_scores entry (this is our "cases" table)
  const { data: caseData, error: caseError } = await supabase
    .from('case_merit_scores')
    .insert({
      user_id: userId,
      case_title: 'AI Analysis Case',
      case_description: userStory,
      state: state || 'US',
      legal_area: 'pending', // Will be updated by classification sweep
      merit_score: 0,
      status: 'analyzing',
    })
    .select('id')
    .single();

  if (caseError) {
    throw new Error(`Failed to create case: ${caseError.message}`);
  }

  const caseId = caseData.id;

  // Seed all sweep rows as 'queued'
  const sweepRows = SWEEP_ORDER.map((sweepName) => ({
    case_id: caseId,
    sweep_name: sweepName,
    status: 'queued' as const,
    progress: 0,
    user_id: userId,
  }));

  const { error: sweepError } = await supabase
    .from('case_sweeps')
    .insert(sweepRows);

  if (sweepError) {
    console.error('Failed to seed sweep rows:', sweepError);
    // Don't throw - sweeps can still work without pre-seeded rows
  }

  // Queue a job for the worker to pick up (optional - for background processing)
  await supabase
    .from('jobs')
    .insert({
      type: 'RUN_SWEEPS',
      status: 'queued',
      payload: { case_id: caseId, user_id: userId },
    });

  return caseId;
}
