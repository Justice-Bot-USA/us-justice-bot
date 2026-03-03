import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useIssueHub(slug: string) {
  const hubQuery = useQuery({
    queryKey: ['issue-hub', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issue_hubs')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const sectionsQuery = useQuery({
    queryKey: ['issue-sections', hubQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issue_sections')
        .select('*')
        .eq('hub_id', hubQuery.data!.id)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!hubQuery.data?.id,
  });

  const resourcesQuery = useQuery({
    queryKey: ['resource-links', hubQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_links')
        .select('*')
        .eq('hub_id', hubQuery.data!.id)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!hubQuery.data?.id,
  });

  const triageQuery = useQuery({
    queryKey: ['triage-flows', hubQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('triage_flows')
        .select('*')
        .eq('hub_id', hubQuery.data!.id)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!hubQuery.data?.id,
  });

  const formPackagesQuery = useQuery({
    queryKey: ['form-packages', hubQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_packages')
        .select('*')
        .eq('hub_id', hubQuery.data!.id)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!hubQuery.data?.id,
  });

  return {
    hub: hubQuery.data,
    sections: sectionsQuery.data || [],
    resources: resourcesQuery.data || [],
    triageFlow: triageQuery.data,
    formPackages: formPackagesQuery.data || [],
    isLoading: hubQuery.isLoading,
    error: hubQuery.error,
  };
}

export function useIssueHubsList(category?: string) {
  return useQuery({
    queryKey: ['issue-hubs-list', category],
    queryFn: async () => {
      let query = supabase
        .from('issue_hubs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
