import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, ArrowRight, Activity } from 'lucide-react';
import { US_FUNNELS, ENABLED_STATES } from '@/lib/funnels/us-funnels';
import { FunnelStep } from '@/lib/funnels/types';
import { Json } from '@/integrations/supabase/types';

interface FunnelEvent {
  id: string;
  funnel_id: string;
  session_id: string;
  user_id: string | null;
  step: string;
  action: string;
  metadata: Json;
  created_at: string;
}

interface StepMetrics {
  step: string;
  total: number;
  completed: number;
  dropped: number;
  dropOffRate: number;
}

const STEP_ORDER: FunnelStep[] = ['triage', 'evidence', 'results', 'paywall', 'merit_score', 'form_recommendation', 'payment', 'generate', 'next_steps'];
const STEP_LABELS: Record<FunnelStep, string> = {
  triage: 'Triage',
  evidence: 'Evidence',
  results: 'Results',
  paywall: 'Paywall',
  merit_score: 'Merit Score',
  form_recommendation: 'Forms',
  payment: 'Payment',
  generate: 'Generate',
  next_steps: 'Next Steps',
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const FunnelAnalyticsDashboard = () => {
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedLegalArea, setSelectedLegalArea] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date filter
      const now = new Date();
      let startDate = new Date();
      switch (dateRange) {
        case '24h': startDate.setHours(now.getHours() - 24); break;
        case '7d': startDate.setDate(now.getDate() - 7); break;
        case '30d': startDate.setDate(now.getDate() - 30); break;
        case '90d': startDate.setDate(now.getDate() - 90); break;
        default: startDate.setDate(now.getDate() - 7);
      }

      const { data, error } = await supabase
        .from('funnel_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents((data || []) as FunnelEvent[]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on selected state and legal area
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const funnelConfig = US_FUNNELS.find(f => f.id === event.funnel_id);
      if (!funnelConfig) return true; // Include events without matching funnel config
      
      if (selectedState !== 'all' && funnelConfig.jurisdiction !== selectedState) return false;
      if (selectedLegalArea !== 'all' && funnelConfig.legalArea !== selectedLegalArea) return false;
      
      return true;
    });
  }, [events, selectedState, selectedLegalArea]);

  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    const uniqueSessions = new Set(filteredEvents.map(e => e.session_id)).size;
    const starts = filteredEvents.filter(e => e.action === 'start').length;
    const completions = filteredEvents.filter(e => e.step === 'next_steps' && e.action === 'complete').length;
    const payments = filteredEvents.filter(e => e.step === 'payment' && e.action === 'complete').length;
    
    return {
      totalSessions: uniqueSessions,
      totalStarts: starts,
      totalCompletions: completions,
      totalPayments: payments,
      conversionRate: starts > 0 ? ((completions / starts) * 100).toFixed(1) : '0',
      paymentRate: starts > 0 ? ((payments / starts) * 100).toFixed(1) : '0',
    };
  }, [filteredEvents]);

  // Calculate step-by-step drop-off
  const stepMetrics = useMemo((): StepMetrics[] => {
    const metrics: StepMetrics[] = [];
    
    for (const step of STEP_ORDER) {
      const stepEvents = filteredEvents.filter(e => e.step === step);
      const completed = stepEvents.filter(e => e.action === 'complete').length;
      const dropped = stepEvents.filter(e => e.action === 'drop').length;
      const total = completed + dropped;
      
      metrics.push({
        step: STEP_LABELS[step],
        total,
        completed,
        dropped,
        dropOffRate: total > 0 ? (dropped / total) * 100 : 0,
      });
    }
    
    return metrics;
  }, [filteredEvents]);

  // Calculate funnel visualization data
  const funnelData = useMemo(() => {
    let remaining = overviewMetrics.totalStarts;
    
    return STEP_ORDER.map((step, index) => {
      const stepData = stepMetrics.find(m => m.step === STEP_LABELS[step]);
      const dropped = stepData?.dropped || 0;
      remaining = Math.max(0, remaining - dropped);
      
      return {
        step: STEP_LABELS[step],
        value: remaining,
        fill: COLORS[index % COLORS.length],
      };
    });
  }, [stepMetrics, overviewMetrics.totalStarts]);

  // Legal area distribution
  const legalAreaDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    filteredEvents.filter(e => e.action === 'start').forEach(event => {
      const funnelConfig = US_FUNNELS.find(f => f.id === event.funnel_id);
      if (funnelConfig) {
        distribution[funnelConfig.legalArea] = (distribution[funnelConfig.legalArea] || 0) + 1;
      }
    });
    
    return Object.entries(distribution)
      .map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEvents]);

  // State distribution
  const stateDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    filteredEvents.filter(e => e.action === 'start').forEach(event => {
      const funnelConfig = US_FUNNELS.find(f => f.id === event.funnel_id);
      if (funnelConfig) {
        distribution[funnelConfig.jurisdiction] = (distribution[funnelConfig.jurisdiction] || 0) + 1;
      }
    });
    
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEvents]);

  // Daily trends
  const dailyTrends = useMemo(() => {
    const trends: Record<string, { date: string; starts: number; completions: number }> = {};
    
    filteredEvents.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (!trends[date]) {
        trends[date] = { date, starts: 0, completions: 0 };
      }
      if (event.action === 'start') trends[date].starts++;
      if (event.step === 'next_steps' && event.action === 'complete') trends[date].completions++;
    });
    
    return Object.values(trends).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredEvents]);

  const chartConfig = {
    starts: { label: 'Starts', color: 'hsl(var(--primary))' },
    completions: { label: 'Completions', color: 'hsl(var(--chart-2))' },
    value: { label: 'Sessions', color: 'hsl(var(--primary))' },
    dropped: { label: 'Dropped', color: 'hsl(var(--destructive))' },
    completed: { label: 'Completed', color: 'hsl(var(--chart-2))' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {ENABLED_STATES.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLegalArea} onValueChange={setSelectedLegalArea}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Legal Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Legal Areas</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
            <SelectItem value="consumer-protection">Consumer</SelectItem>
            <SelectItem value="human-rights">Civil Rights</SelectItem>
            <SelectItem value="criminal">Criminal</SelectItem>
            <SelectItem value="immigration">Immigration</SelectItem>
            <SelectItem value="small-claims">Small Claims</SelectItem>
            <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Unique funnel sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funnel Starts</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalStarts}</div>
            <p className="text-xs text-muted-foreground">Users entered funnels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Completed full funnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.paymentRate}%</div>
            <p className="text-xs text-muted-foreground">Made a payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off Points</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Progression</CardTitle>
              <CardDescription>Users remaining at each step</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="step" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropoff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drop-off Analysis</CardTitle>
              <CardDescription>Where users are leaving the funnel</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stepMetrics}>
                    <XAxis dataKey="step" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" stackId="a" fill="hsl(var(--chart-2))" name="Completed" />
                    <Bar dataKey="dropped" stackId="a" fill="hsl(var(--destructive))" name="Dropped" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Drop-off rate badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {stepMetrics.map(metric => (
                  <Badge 
                    key={metric.step} 
                    variant={metric.dropOffRate > 50 ? 'destructive' : metric.dropOffRate > 25 ? 'default' : 'secondary'}
                  >
                    {metric.step}: {metric.dropOffRate.toFixed(1)}% drop
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>By Legal Area</CardTitle>
                <CardDescription>Most popular legal categories</CardDescription>
              </CardHeader>
              <CardContent>
                {legalAreaDistribution.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={legalAreaDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {legalAreaDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By State</CardTitle>
                <CardDescription>Funnel starts by jurisdiction</CardDescription>
              </CardHeader>
              <CardContent>
                {stateDistribution.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stateDistribution}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Trends</CardTitle>
              <CardDescription>Funnel starts and completions over time</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyTrends.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTrends}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="starts" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="completions" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">No trend data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Latest funnel activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Funnel</th>
                  <th className="text-left p-2">Step</th>
                  <th className="text-left p-2">Action</th>
                  <th className="text-left p-2">Session</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.slice(0, 10).map(event => (
                  <tr key={event.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{event.funnel_id.split('-').slice(0, 2).join('-')}</Badge>
                    </td>
                    <td className="p-2">{STEP_LABELS[event.step as FunnelStep] || event.step}</td>
                    <td className="p-2">
                      <Badge 
                        variant={
                          event.action === 'complete' ? 'default' : 
                          event.action === 'drop' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {event.action}
                      </Badge>
                    </td>
                    <td className="p-2 font-mono text-xs text-muted-foreground">
                      {event.session_id.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No funnel events recorded yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelAnalyticsDashboard;
