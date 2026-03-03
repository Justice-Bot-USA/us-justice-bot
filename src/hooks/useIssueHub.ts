import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useIssueHub(hubKey: string) {
  const hubQuery = useQuery({
    queryKey: ['issue-hub', hubKey],
    queryFn: async () => {
      // Try hub_key first, fall back to slug for backwards compatibility
      const { data: byKey, error: keyErr } = await supabase
        .from('issue_hubs')
        .select('*')
        .eq('hub_key', hubKey)
        .eq('is_active', true)
        .maybeSingle();

      if (byKey) return byKey;

      // Fallback: treat hubKey as slug (legacy routes like /issues/:category/:issue)
      const slug = hubKey.split('/').pop() || hubKey;
      const { data, error } = await supabase
        .from('issue_hubs')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!hubKey,
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

  const tracksQuery = useQuery({
    queryKey: ['tracks', hubQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
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
    tracks: tracksQuery.data || [],
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

export function useTrack(trackId: string) {
  const trackQuery = useQuery({
    queryKey: ['track', trackId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!trackId,
  });

  const trackFormsQuery = useQuery({
    queryKey: ['track-forms', trackId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('track_forms')
        .select('*, form_packages(*)')
        .eq('track_id', trackId)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: !!trackId,
  });

  return {
    track: trackQuery.data,
    trackForms: trackFormsQuery.data || [],
    isLoading: trackQuery.isLoading,
    error: trackQuery.error,
  };
}

export function useTrackByKey(hubId: string | undefined, trackKey: string) {
  const trackQuery = useQuery({
    queryKey: ['track-by-key', hubId, trackKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('hub_id', hubId!)
        .eq('track_key', trackKey)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!hubId && !!trackKey,
  });

  const trackFormsQuery = useQuery({
    queryKey: ['track-forms-by-key', trackQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('track_forms')
        .select('*, form_packages(*)')
        .eq('track_id', trackQuery.data!.id)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: !!trackQuery.data?.id,
  });

  return {
    track: trackQuery.data,
    trackForms: trackFormsQuery.data || [],
    isLoading: trackQuery.isLoading,
    error: trackQuery.error,
  };
}
