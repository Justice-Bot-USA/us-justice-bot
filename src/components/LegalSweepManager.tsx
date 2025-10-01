import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { toast } from 'sonner';
import { Search, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface LegalSweep {
  id: string;
  sweep_name: string;
  target_domains: any;
  search_terms: any;
  state_filter: string;
  legal_area_filter: string;
  status: string;
  results_count: number;
  last_run: string;
  created_at: string;
}

export const LegalSweepManager: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminAccess();
  const [sweeps, setSweeps] = useState<LegalSweep[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New sweep form
  const [showNewSweep, setShowNewSweep] = useState(false);
  const [sweepName, setSweepName] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [legalAreaFilter, setLegalAreaFilter] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchSweeps();
    }
  }, [isAdmin]);

  const fetchSweeps = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_sweeps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSweeps(data || []);
    } catch (error) {
      console.error('Error fetching sweeps:', error);
      toast.error('Failed to load legal sweeps');
    }
  };

  const createSweep = async () => {
    if (!sweepName.trim() || !searchTerms.trim()) {
      toast.error('Please fill in sweep name and search terms');
      return;
    }

    try {
      setLoading(true);
      
      const terms = searchTerms.split(',').map(t => t.trim());
      
      const { data, error } = await supabase
        .from('legal_sweeps')
        .insert({
          sweep_name: sweepName,
          target_domains: [
            'law.cornell.edu',
            'justia.com',
            'findlaw.com'
          ],
          search_terms: terms,
          state_filter: stateFilter || null,
          legal_area_filter: legalAreaFilter || null,
          created_by: user?.id,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Legal sweep created successfully');
      await fetchSweeps();
      
      // Reset form
      setShowNewSweep(false);
      setSweepName('');
      setSearchTerms('');
      setStateFilter('');
      setLegalAreaFilter('');
    } catch (error) {
      console.error('Error creating sweep:', error);
      toast.error('Failed to create legal sweep');
    } finally {
      setLoading(false);
    }
  };

  const runSweep = async (sweepId: string) => {
    try {
      setLoading(true);
      toast.info('Starting legal sweep...');

      const sweep = sweeps.find(s => s.id === sweepId);
      if (!sweep) return;

      const { data, error } = await supabase.functions.invoke('legal-sweep', {
        body: {
          sweepId,
          searchTerms: sweep.search_terms,
          state: sweep.state_filter,
          legalArea: sweep.legal_area_filter
        }
      });

      if (error) throw error;

      toast.success(`Sweep completed! Found ${data.resultsCount} results`);
      await fetchSweeps();
    } catch (error) {
      console.error('Error running sweep:', error);
      toast.error('Failed to run legal sweep');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: 'outline',
      running: 'secondary',
      completed: 'default',
      failed: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Legal Sweep Manager
            </span>
            <Button size="sm" onClick={() => setShowNewSweep(!showNewSweep)}>
              New Sweep
            </Button>
          </CardTitle>
          <CardDescription>
            Automatically sweep reputable legal sites for laws, regulations, and forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showNewSweep && (
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <Input
                placeholder="Sweep Name (e.g., California Contract Laws)"
                value={sweepName}
                onChange={(e) => setSweepName(e.target.value)}
              />
              <Input
                placeholder="Search Terms (comma separated, e.g., statute, regulation, form)"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="State Filter (Optional)"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                />
                <Input
                  placeholder="Legal Area (Optional)"
                  value={legalAreaFilter}
                  onChange={(e) => setLegalAreaFilter(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createSweep} disabled={loading} className="flex-1">
                  Create Sweep
                </Button>
                <Button variant="outline" onClick={() => setShowNewSweep(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {sweeps.map((sweep) => (
              <div
                key={sweep.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(sweep.status)}
                      <h3 className="font-semibold">{sweep.sweep_name}</h3>
                      {getStatusBadge(sweep.status)}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {sweep.state_filter && (
                        <Badge variant="outline">State: {sweep.state_filter}</Badge>
                      )}
                      {sweep.legal_area_filter && (
                        <Badge variant="outline">Area: {sweep.legal_area_filter}</Badge>
                      )}
                      <Badge variant="outline">
                        {sweep.search_terms.length} search terms
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => runSweep(sweep.id)}
                    disabled={loading || sweep.status === 'running'}
                    className="ml-4"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Sweep
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Results Found</p>
                    <p className="text-lg font-semibold">{sweep.results_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Run</p>
                    <p className="text-sm">
                      {sweep.last_run
                        ? new Date(sweep.last_run).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {new Date(sweep.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {sweep.search_terms.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Search Terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {sweep.search_terms.map((term, idx) => (
                        <Badge key={idx} variant="secondary">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {sweeps.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No legal sweeps configured yet</p>
                <p className="text-sm mt-2">Create a sweep to start gathering legal information</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};