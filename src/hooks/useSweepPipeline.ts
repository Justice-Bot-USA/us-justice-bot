import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CaseProfile, 
  SweepName, 
  SWEEP_ORDER, 
  createEmptyCaseProfile,
  IntakeData,
  EvidenceIndex,
  Classification,
  Venue,
  Timeline,
  AuthoritySweep,
  AnalysisReport
} from '@/lib/sweeps/types';

export interface SweepProgress {
  currentSweep: SweepName | null;
  completedSweeps: SweepName[];
  failedSweeps: SweepName[];
  isRunning: boolean;
  progress: number; // 0-100
}

export function useSweepPipeline() {
  const [caseProfile, setCaseProfile] = useState<CaseProfile | null>(null);
  const [progress, setProgress] = useState<SweepProgress>({
    currentSweep: null,
    completedSweeps: [],
    failedSweeps: [],
    isRunning: false,
    progress: 0
  });
  const [error, setError] = useState<string | null>(null);

  const updateSweepStatus = useCallback((sweep: SweepName, status: 'running' | 'completed' | 'failed') => {
    setProgress(prev => {
      const newProgress = { ...prev };
      
      if (status === 'running') {
        newProgress.currentSweep = sweep;
      } else if (status === 'completed') {
        newProgress.completedSweeps = [...prev.completedSweeps, sweep];
        newProgress.currentSweep = null;
      } else if (status === 'failed') {
        newProgress.failedSweeps = [...prev.failedSweeps, sweep];
        newProgress.currentSweep = null;
      }
      
      // Calculate progress percentage
      const totalSweeps = SWEEP_ORDER.length;
      const completed = newProgress.completedSweeps.length;
      newProgress.progress = Math.round((completed / totalSweeps) * 100);
      
      return newProgress;
    });
  }, []);

  const runSweep = useCallback(async <T>(
    sweepName: SweepName,
    functionName: string,
    payload: Record<string, unknown>
  ): Promise<T | null> => {
    updateSweepStatus(sweepName, 'running');
    
    try {
      console.log(`Running sweep: ${sweepName}`);
      const { data, error: fnError } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.data) {
        updateSweepStatus(sweepName, 'completed');
        return data.data as T;
      }
      
      throw new Error('No data returned from sweep');
    } catch (err) {
      console.error(`Sweep ${sweepName} failed:`, err);
      updateSweepStatus(sweepName, 'failed');
      
      // Record error in case profile
      setCaseProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          errors: [...prev.errors, {
            sweep: sweepName,
            message: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }]
        };
      });
      
      return null;
    }
  }, [updateSweepStatus]);

  const runPipeline = useCallback(async (
    userStory: string,
    fileIds: string[],
    state?: string,
    county?: string,
    userId?: string,
    saveToDb = false
  ): Promise<CaseProfile | null> => {
    setError(null);
    setProgress({
      currentSweep: null,
      completedSweeps: [],
      failedSweeps: [],
      isRunning: true,
      progress: 0
    });

    // Create initial case profile
    const caseId = crypto.randomUUID();
    let profile = createEmptyCaseProfile(caseId, userStory, fileIds, userId);
    setCaseProfile(profile);

    try {
      // Sweep 0: Intake
      const intake = await runSweep<IntakeData>('intake', 'sweep-intake', {
        userStory,
        documentTexts: [] // Will be populated from evidence sweep
      });
      
      if (intake) {
        profile = { ...profile, intake, sweepStatus: { ...profile.sweepStatus, intake: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 1: Evidence Index (can run in parallel with intake normalization)
      const evidenceIndex = await runSweep<EvidenceIndex>('evidenceIndex', 'sweep-evidence', {
        fileIds
      });
      
      if (evidenceIndex) {
        profile = { ...profile, evidenceIndex, sweepStatus: { ...profile.sweepStatus, evidenceIndex: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 2: Classification (depends on intake + evidence)
      const classification = await runSweep<Classification>('classification', 'sweep-classification', {
        intake: profile.intake,
        evidenceIndex: profile.evidenceIndex
      });
      
      if (classification) {
        profile = { ...profile, classification, sweepStatus: { ...profile.sweepStatus, classification: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 3: Venue (depends on intake + classification)
      const resolvedState = state || profile.intake?.locationHints?.state;
      const resolvedCounty = county || profile.intake?.locationHints?.county;
      
      const venue = await runSweep<Venue>('venue', 'sweep-venue', {
        intake: profile.intake,
        classification: profile.classification,
        state: resolvedState,
        county: resolvedCounty
      });
      
      if (venue) {
        profile = { ...profile, venue, sweepStatus: { ...profile.sweepStatus, venue: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 4: Timeline (depends on intake + evidence)
      const timeline = await runSweep<Timeline>('timeline', 'sweep-timeline', {
        intake: profile.intake,
        evidenceIndex: profile.evidenceIndex
      });
      
      if (timeline) {
        profile = { ...profile, timeline, sweepStatus: { ...profile.sweepStatus, timeline: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 5: Authority search (depends on classification + venue + timeline)
      const authority = await runSweep<AuthoritySweep>('authority', 'sweep-authority', {
        classification: profile.classification,
        venue: profile.venue,
        timeline: profile.timeline,
        state: resolvedState
      });
      
      if (authority) {
        profile = { ...profile, authoritySweep: authority, sweepStatus: { ...profile.sweepStatus, authority: 'completed' } };
        setCaseProfile(profile);
      }

      // Sweep 6: Final Analysis (depends on everything)
      const analysisResult = await runSweep<AnalysisReport & { caseId?: string }>('analysis', 'sweep-analysis', {
        caseProfile: profile,
        saveToDb
      });
      
      if (analysisResult) {
        const { caseId: savedCaseId, ...analysisReport } = analysisResult;
        profile = { 
          ...profile, 
          analysisReport, 
          sweepStatus: { ...profile.sweepStatus, analysis: 'completed' },
          status: 'completed'
        };
        if (savedCaseId) {
          profile.caseId = savedCaseId;
        }
        setCaseProfile(profile);
      }

      setProgress(prev => ({ ...prev, isRunning: false, progress: 100 }));
      return profile;

    } catch (err) {
      console.error('Pipeline error:', err);
      setError(err instanceof Error ? err.message : 'Pipeline failed');
      setProgress(prev => ({ ...prev, isRunning: false }));
      profile = { ...profile, status: 'error' };
      setCaseProfile(profile);
      return profile;
    }
  }, [runSweep]);

  const reset = useCallback(() => {
    setCaseProfile(null);
    setProgress({
      currentSweep: null,
      completedSweeps: [],
      failedSweeps: [],
      isRunning: false,
      progress: 0
    });
    setError(null);
  }, []);

  return {
    caseProfile,
    progress,
    error,
    runPipeline,
    reset,
    isRunning: progress.isRunning
  };
}
