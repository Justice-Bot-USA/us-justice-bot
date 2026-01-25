import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface RelatedCaseReference {
  id: string;
  caseId: string;
  courtName: string | null;
  state: string;
  county: string | null;
  docketNumber: string | null;
  caseType: string | null;
  relationshipDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedCaseInput {
  id?: string;
  courtName: string;
  state: string;
  county: string;
  docketNumber: string;
  caseType: string;
  relationshipDescription: string;
}

export function useRelatedCases(caseId?: string) {
  const { user } = useAuth();
  const [relatedCases, setRelatedCases] = useState<RelatedCaseReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch related cases for a specific case
  const fetchRelatedCases = useCallback(async () => {
    if (!caseId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('related_case_references')
        .select('*')
        .eq('case_id', caseId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setRelatedCases(
        (data || []).map((row: any) => ({
          id: row.id,
          caseId: row.case_id,
          courtName: row.court_name,
          state: row.state,
          county: row.county,
          docketNumber: row.docket_number,
          caseType: row.case_type,
          relationshipDescription: row.relationship_description,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
      );
    } catch (err: any) {
      console.error('Error fetching related cases:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [caseId, user]);

  // Save related cases (batch upsert)
  const saveRelatedCases = useCallback(async (
    targetCaseId: string,
    cases: RelatedCaseInput[]
  ) => {
    if (!user) {
      toast.error('You must be logged in to save related cases');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, delete existing related cases for this case
      const { error: deleteError } = await supabase
        .from('related_case_references')
        .delete()
        .eq('case_id', targetCaseId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Then insert the new ones
      if (cases.length > 0) {
        const insertData = cases.map((c) => ({
          case_id: targetCaseId,
          user_id: user.id,
          court_name: c.courtName || null,
          state: c.state,
          county: c.county || null,
          docket_number: c.docketNumber || null,
          case_type: c.caseType || null,
          relationship_description: c.relationshipDescription || null,
        }));

        const { error: insertError } = await supabase
          .from('related_case_references')
          .insert(insertData);

        if (insertError) throw insertError;
      }

      // Refresh the list
      if (caseId === targetCaseId) {
        await fetchRelatedCases();
      }

      return true;
    } catch (err: any) {
      console.error('Error saving related cases:', err);
      setError(err.message);
      toast.error('Failed to save related cases');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, caseId, fetchRelatedCases]);

  // Add a single related case
  const addRelatedCase = useCallback(async (
    targetCaseId: string,
    caseData: RelatedCaseInput
  ) => {
    if (!user) {
      toast.error('You must be logged in');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('related_case_references')
        .insert({
          case_id: targetCaseId,
          user_id: user.id,
          court_name: caseData.courtName || null,
          state: caseData.state,
          county: caseData.county || null,
          docket_number: caseData.docketNumber || null,
          case_type: caseData.caseType || null,
          relationship_description: caseData.relationshipDescription || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (caseId === targetCaseId) {
        await fetchRelatedCases();
      }

      return data;
    } catch (err: any) {
      console.error('Error adding related case:', err);
      toast.error('Failed to add related case');
      return null;
    }
  }, [user, caseId, fetchRelatedCases]);

  // Delete a related case
  const deleteRelatedCase = useCallback(async (relatedCaseId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('related_case_references')
        .delete()
        .eq('id', relatedCaseId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setRelatedCases(prev => prev.filter(c => c.id !== relatedCaseId));
      return true;
    } catch (err: any) {
      console.error('Error deleting related case:', err);
      toast.error('Failed to delete related case');
      return false;
    }
  }, [user]);

  // Load on mount if caseId is provided
  useEffect(() => {
    if (caseId && user) {
      fetchRelatedCases();
    }
  }, [caseId, user, fetchRelatedCases]);

  return {
    relatedCases,
    isLoading,
    error,
    fetchRelatedCases,
    saveRelatedCases,
    addRelatedCase,
    deleteRelatedCase,
  };
}
