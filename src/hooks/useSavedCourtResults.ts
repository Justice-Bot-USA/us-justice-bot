import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface SavedCourtResult {
  id: string;
  user_id: string;
  case_id: string | null;
  source_id: string | null;
  search_type: string;
  case_name: string;
  court: string | null;
  court_id: string | null;
  date_filed: string | null;
  date_argued: string | null;
  docket_number: string | null;
  suit_nature: string | null;
  citation: string | null;
  snippet: string | null;
  absolute_url: string | null;
  status: string | null;
  author: string | null;
  download_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface CourtResultToSave {
  id: number;
  caseName: string;
  court: string;
  courtId: string;
  dateFiled: string;
  dateArgued: string;
  docketNumber: string;
  suitNature: string;
  citation: string;
  snippet: string;
  absoluteUrl: string;
  status: string;
  author: string;
  downloadUrl: string;
}

export function useSavedCourtResults(caseId?: string) {
  const { user } = useAuth();
  const [savedResults, setSavedResults] = useState<SavedCourtResult[]>([]);
  const [savedSourceIds, setSavedSourceIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('saved_court_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const results = (data || []) as SavedCourtResult[];
      setSavedResults(results);
      setSavedSourceIds(new Set(results.map(r => r.source_id).filter(Boolean) as string[]));
    } catch (err) {
      console.error('Error fetching saved court results:', err);
    } finally {
      setLoading(false);
    }
  }, [user, caseId]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const saveResult = async (result: CourtResultToSave, searchType: string, linkedCaseId?: string) => {
    if (!user) {
      toast.error('Please sign in to save results');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_court_results')
        .insert({
          user_id: user.id,
          case_id: linkedCaseId || null,
          source_id: String(result.id),
          search_type: searchType,
          case_name: result.caseName || 'Untitled',
          court: result.court || null,
          court_id: result.courtId || null,
          date_filed: result.dateFiled || null,
          date_argued: result.dateArgued || null,
          docket_number: result.docketNumber || null,
          suit_nature: result.suitNature || null,
          citation: result.citation || null,
          snippet: result.snippet || null,
          absolute_url: result.absoluteUrl || null,
          status: result.status || null,
          author: result.author || null,
          download_url: result.downloadUrl || null,
        });

      if (error) throw error;

      toast.success('Result saved');
      await fetchSaved();
      return true;
    } catch (err: any) {
      console.error('Error saving court result:', err);
      toast.error('Failed to save result');
      return false;
    }
  };

  const removeResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_court_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Result removed');
      await fetchSaved();
    } catch (err) {
      console.error('Error removing saved result:', err);
      toast.error('Failed to remove result');
    }
  };

  const isResultSaved = (sourceId: number | string) => {
    return savedSourceIds.has(String(sourceId));
  };

  return {
    savedResults,
    loading,
    saveResult,
    removeResult,
    isResultSaved,
    refreshSaved: fetchSaved,
  };
}
