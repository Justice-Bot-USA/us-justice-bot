import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Attorney {
  id: string;
  full_name: string;
  firm_name: string | null;
  states_licensed: string[];
  specialties: string[];
  bio: string | null;
  website: string | null;
  verified: boolean;
}

export default function AttorneyDirectory() {
  const { user } = useAuth();
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [stateFilter, setStateFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Attorney | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("attorneys")
        .select("id, full_name, firm_name, states_licensed, specialties, bio, website, verified")
        .eq("is_active", true)
        .eq("accepting_referrals", true)
        .order("verified", { ascending: false });
      if (!error && data) setAttorneys(data as Attorney[]);
      setLoading(false);
    })();
  }, []);

  const filtered = attorneys.filter((a) => {
    const s = stateFilter.trim().toUpperCase();
    const sp = specialtyFilter.trim().toLowerCase();
    if (s && !a.states_licensed.some((x) => x.toUpperCase() === s)) return false;
    if (sp && !a.specialties.some((x) => x.toLowerCase().includes(sp))) return false;
    return true;
  });

  const sendReferral = async () => {
    if (!user) {
      toast.error("Please sign in to request a referral");
      return;
    }
    if (!selected) return;
    const { error } = await supabase.from("attorney_referrals").insert({
      user_id: user.id,
      attorney_id: selected.id,
      message,
      state: stateFilter || null,
      legal_area: specialtyFilter || null,
    });
    if (error) {
      toast.error("Failed to send referral");
    } else {
      toast.success("Referral request sent");
      setSelected(null);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Find an Attorney | A.N.A.L. Legal Directory</title>
        <meta name="description" content="Browse vetted attorneys by state and specialty. Request a referral for your case. Legal information, not legal advice." />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Attorney Directory</h1>
        <p className="text-muted-foreground mb-6">
          A.N.A.L. provides legal information, not legal advice. Use this directory to find an attorney who may take your case.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            placeholder="State (e.g. CA)"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="sm:max-w-[180px]"
          />
          <Input
            placeholder="Specialty (e.g. eviction)"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading attorneys…</p>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            No attorneys match your filters yet. Check back soon.
          </CardContent></Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {a.full_name}
                    {a.verified && <Badge variant="secondary">Verified</Badge>}
                  </CardTitle>
                  {a.firm_name && <CardDescription>{a.firm_name}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {a.states_licensed.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
                  </div>
                  {a.bio && <p className="text-sm text-muted-foreground line-clamp-3">{a.bio}</p>}
                  <Dialog open={selected?.id === a.id} onOpenChange={(o) => !o && setSelected(null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelected(a)}>Request Referral</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request referral from {a.full_name}</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        placeholder="Briefly describe your situation. Do not include sensitive details."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                      />
                      <DialogFooter>
                        <Button onClick={sendReferral}>Send</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}