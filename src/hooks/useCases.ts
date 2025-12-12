import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type CaseStatus = 'draft' | 'pending' | 'in_progress' | 'filed' | 'resolved' | 'archived';

export interface CaseTimelineEvent {
  id: string;
  case_id: string;
  user_id: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Case {
  id: string;
  user_id: string;
  case_title: string;
  case_description: string | null;
  state: string;
  county: string | null;
  legal_area: string;
  merit_score: number;
  status: CaseStatus;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
  estimated_success_rate: number | null;
  complexity_score: number | null;
  strength_factors: unknown;
  weakness_factors: unknown;
  next_steps: unknown;
}

export function useCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [archivedCases, setArchivedCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    if (!user) {
      setCases([]);
      setArchivedCases([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch active cases
      const { data: activeCases, error: activeError } = await supabase
        .from('case_merit_scores')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      // Fetch archived cases
      const { data: archived, error: archivedError } = await supabase
        .from('case_merit_scores')
        .select('*')
        .eq('user_id', user.id)
        .not('archived_at', 'is', null)
        .order('archived_at', { ascending: false });

      if (archivedError) throw archivedError;

      setCases((activeCases || []) as Case[]);
      setArchivedCases((archived || []) as Case[]);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const updateCaseStatus = async (caseId: string, status: CaseStatus) => {
    try {
      const { error } = await supabase
        .from('case_merit_scores')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      // Add timeline event
      await addTimelineEvent(caseId, 'status_change', `Status changed to ${status}`, `Case status updated to ${status}`);
      
      await fetchCases();
      toast.success('Case status updated');
    } catch (err) {
      console.error('Error updating case status:', err);
      toast.error('Failed to update case status');
    }
  };

  const updateCaseNotes = async (caseId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('case_merit_scores')
        .update({ 
          notes, 
          updated_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;
      
      await fetchCases();
      toast.success('Notes saved');
    } catch (err) {
      console.error('Error updating notes:', err);
      toast.error('Failed to save notes');
    }
  };

  const archiveCase = async (caseId: string) => {
    try {
      const { error } = await supabase
        .from('case_merit_scores')
        .update({ 
          archived_at: new Date().toISOString(),
          status: 'archived' as CaseStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      await addTimelineEvent(caseId, 'archived', 'Case archived', 'Case was archived');
      
      await fetchCases();
      toast.success('Case archived');
    } catch (err) {
      console.error('Error archiving case:', err);
      toast.error('Failed to archive case');
    }
  };

  const restoreCase = async (caseId: string) => {
    try {
      const { error } = await supabase
        .from('case_merit_scores')
        .update({ 
          archived_at: null,
          status: 'pending' as CaseStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      await addTimelineEvent(caseId, 'restored', 'Case restored', 'Case was restored from archive');
      
      await fetchCases();
      toast.success('Case restored');
    } catch (err) {
      console.error('Error restoring case:', err);
      toast.error('Failed to restore case');
    }
  };

  const addTimelineEvent = async (
    caseId: string, 
    eventType: string, 
    title: string, 
    description?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('case_timeline_events')
        .insert({
          case_id: caseId,
          user_id: user.id,
          event_type: eventType,
          title,
          description: description || null
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding timeline event:', err);
    }
  };

  const fetchTimelineEvents = async (caseId: string): Promise<CaseTimelineEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('case_timeline_events')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as CaseTimelineEvent[];
    } catch (err) {
      console.error('Error fetching timeline:', err);
      return [];
    }
  };

  return {
    cases,
    archivedCases,
    loading,
    error,
    refreshCases: fetchCases,
    updateCaseStatus,
    updateCaseNotes,
    archiveCase,
    restoreCase,
    addTimelineEvent,
    fetchTimelineEvents
  };
}
