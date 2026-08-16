import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, FileText, Activity, TrendingUp, DollarSign, Briefcase, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

interface AdminStats {
  totalUsers: number;
  totalCases: number;
  totalSweeps: number;
  totalFiles: number;
  totalPayments: number;
  totalRevenue: number;
  avgMerit: number;
  funnel: { step: string; count: number }[];
  casesByMonth: { month: string; cases: number }[];
  usersByMonth: { month: string; users: number }[];
  byArea: { name: string; count: number }[];
  byState: { name: string; count: number }[];
  topFunnelEvents: { name: string; count: number }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--destructive))"];

const AdminAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!user || isAdmin !== true) return;
    const load = async () => {
      setLoading(true);
      try {
        const [profilesRes, casesRes, sweepsRes, filesRes, paymentsRes, funnelRes] = await Promise.all([
          supabase.from("profiles").select("created_at", { count: "exact" }),
          supabase.from("case_merit_scores").select("id,user_id,legal_area,state,merit_score,created_at,status"),
          supabase.from("case_sweeps").select("id", { count: "exact", head: true }),
          supabase.from("case_files").select("id", { count: "exact", head: true }),
          supabase.from("payments").select("id,status,created_at"),
          supabase.from("funnel_analytics").select("step,action,created_at"),
        ]);

        const cases = casesRes.data ?? [];
        const profiles = profilesRes.data ?? [];
        const payments = paymentsRes.data ?? [];
        const funnelRows = funnelRes.data ?? [];

        const monthKey = (d: string) => {
          const dt = new Date(d);
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
        };

        const casesByMonthMap: Record<string, number> = {};
        cases.forEach((c: any) => { const k = monthKey(c.created_at); casesByMonthMap[k] = (casesByMonthMap[k] || 0) + 1; });
        const usersByMonthMap: Record<string, number> = {};
        profiles.forEach((p: any) => { const k = monthKey(p.created_at); usersByMonthMap[k] = (usersByMonthMap[k] || 0) + 1; });

        const areaMap: Record<string, number> = {};
        cases.forEach((c: any) => { areaMap[c.legal_area || "Unknown"] = (areaMap[c.legal_area || "Unknown"] || 0) + 1; });
        const stateMap: Record<string, number> = {};
        cases.forEach((c: any) => { stateMap[c.state || "Unknown"] = (stateMap[c.state || "Unknown"] || 0) + 1; });

        const funnelStepMap: Record<string, number> = {};
        funnelRows.forEach((f: any) => { const k = `${f.step}:${f.action}`; funnelStepMap[k] = (funnelStepMap[k] || 0) + 1; });

        const completedPayments = payments.filter((p: any) => p.status === "completed" || p.status === "succeeded" || p.status === "paid");

        const avgMerit = cases.length > 0
          ? cases.reduce((s: number, c: any) => s + Number(c.merit_score || 0), 0) / cases.length
          : 0;

        setStats({
          totalUsers: profilesRes.count ?? profiles.length,
          totalCases: cases.length,
          totalSweeps: sweepsRes.count ?? 0,
          totalFiles: filesRes.count ?? 0,
          totalPayments: completedPayments.length,
          totalRevenue: 0, // Stripe amounts not stored on payments table; tracked in Stripe metadata
          avgMerit,
          funnel: [
            { step: "Visitors (funnel events)", count: funnelRows.length },
            { step: "Signups", count: profiles.length },
            { step: "Cases started", count: cases.length },
            { step: "Sweeps run", count: sweepsRes.count ?? 0 },
            { step: "Payments", count: completedPayments.length },
          ],
          casesByMonth: Object.entries(casesByMonthMap).sort().map(([month, cases]) => ({ month, cases })),
          usersByMonth: Object.entries(usersByMonthMap).sort().map(([month, users]) => ({ month, users })),
          byArea: Object.entries(areaMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
          byState: Object.entries(stateMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
          topFunnelEvents: Object.entries(funnelStepMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, isAdmin]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Admin access required</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><Link to="/">Back to home</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Analytics | Justice Bot USA</title>
        <meta name="description" content="Platform-wide analytics: users, cases, funnel, revenue." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to admin
            </Link>
            <h1 className="text-3xl font-bold">Admin Analytics</h1>
            <p className="text-muted-foreground">Platform-wide metrics, funnel, and engagement.</p>
          </div>
          <Badge variant="secondary">Admin only</Badge>
        </div>

        {loading || !stats ? (
          <div className="py-20 text-center text-muted-foreground">Loading analytics…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <KPI icon={<Users className="w-4 h-4" />} label="Users" value={stats.totalUsers} />
              <KPI icon={<Briefcase className="w-4 h-4" />} label="Cases" value={stats.totalCases} />
              <KPI icon={<Activity className="w-4 h-4" />} label="Sweeps" value={stats.totalSweeps} />
              <KPI icon={<FileText className="w-4 h-4" />} label="Files" value={stats.totalFiles} />
              <KPI icon={<DollarSign className="w-4 h-4" />} label="Payments" value={stats.totalPayments} />
              <KPI icon={<TrendingUp className="w-4 h-4" />} label="Avg merit" value={`${stats.avgMerit.toFixed(1)}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion funnel</CardTitle>
                  <CardDescription>Visitors → signups → cases → sweeps → payments</CardDescription>
                </CardHeader>
                <CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.funnel} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="step" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Signups by month</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.usersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cases by month</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.casesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="cases" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top legal areas</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byArea} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="count" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top states</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.byState} dataKey="count" nameKey="name" outerRadius={90} label>
                        {stats.byState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top funnel events</CardTitle>
                  <CardDescription>step:action</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.topFunnelEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No funnel events tracked yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {stats.topFunnelEvents.map((e) => (
                        <li key={e.name} className="flex justify-between text-sm border-b pb-2">
                          <span className="font-mono truncate mr-2">{e.name}</span>
                          <Badge variant="secondary">{e.count}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground">
              Revenue totals require Stripe API enrichment (amounts not stored locally). All other metrics computed from Supabase tables in real time.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const KPI = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default AdminAnalytics;