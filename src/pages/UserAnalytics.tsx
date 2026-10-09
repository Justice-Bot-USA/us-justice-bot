import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, FileText, Activity, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  totalCases: number;
  activeCases: number;
  totalSweeps: number;
  totalFiles: number;
  byArea: { name: string; count: number }[];
  byState: { name: string; count: number }[];
  byMonth: { month: string; cases: number }[];
  recent: { id: string; title: string; area: string; created: string }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--destructive))"];

const UserAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [cases, sweeps, files] = await Promise.all([
        supabase.from("case_merit_scores").select("id, case_title, legal_area, state, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("case_sweeps").select("id, completed_at").eq("user_id", user.id),
        supabase.from("case_files").select("id").eq("user_id", user.id),
      ]);

      const rows = cases.data ?? [];
      const byAreaMap = new Map<string, number>();
      const byStateMap = new Map<string, number>();
      const byMonthMap = new Map<string, number>();

      rows.forEach((r: any) => {
        if (r.legal_area) byAreaMap.set(r.legal_area, (byAreaMap.get(r.legal_area) ?? 0) + 1);
        if (r.state) byStateMap.set(r.state, (byStateMap.get(r.state) ?? 0) + 1);
        const m = new Date(r.created_at).toISOString().slice(0, 7);
        byMonthMap.set(m, (byMonthMap.get(m) ?? 0) + 1);
      });

      const months = Array.from(byMonthMap.entries()).sort().slice(-6).map(([month, cases]) => ({ month, cases }));

      setStats({
        totalCases: rows.length,
        activeCases: rows.filter((r: any) => r.status !== "archived" && r.status !== "closed").length,
        totalSweeps: (sweeps.data ?? []).length,
        totalFiles: (files.data ?? []).length,
        byArea: Array.from(byAreaMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
        byState: Array.from(byStateMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5),
        byMonth: months,
        recent: rows.slice(0, 5).map((r: any) => ({ id: r.id, title: r.case_title, area: r.legal_area, created: r.created_at })),
      });
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = stats!;
  const empty = s.totalCases === 0;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Analytics — Justice Bot USA</title>
        <meta name="description" content="Track your case activity, documents and journey progress on Justice Bot USA." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/my-cases")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to My Cases
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Analytics</h1>
          <p className="text-muted-foreground">Your case activity and document stats on Justice Bot USA.</p>
        </div>

        {empty ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No case data yet</h2>
              <p className="text-muted-foreground mb-6">Describe your situation to see your activity here.</p>
              <Button asChild><Link to="/case-analysis">Describe your situation</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KPI icon={Briefcase} label="Total Cases" value={s.totalCases} />
              <KPI icon={Activity} label="Active" value={s.activeCases} />
              <KPI icon={Target} label="Sweeps Run" value={s.totalSweeps} />
              <KPI icon={FileText} label="Documents" value={s.totalFiles} />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Month</CardTitle>
                  <CardDescription>Last 6 months of case activity</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="cases" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cases by Legal Area</CardTitle>
                  <CardDescription>Top areas you've worked on</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={s.byArea} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cases by State</CardTitle>
                  <CardDescription>Top jurisdictions</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={s.byState} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {s.byState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>Your 5 most recent cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {s.recent.map((r) => (
                      <li key={r.id} className="py-3">
                        <Link to={`/case/${r.id}`} className="block min-w-0">
                          <p className="font-medium truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.area} · {new Date(r.created).toLocaleDateString()}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Justice Bot USA. Analytics shown above reflect your own case activity only.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const KPI = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default UserAnalytics;