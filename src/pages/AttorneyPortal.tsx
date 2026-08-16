import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AttorneyProfile {
  id: string;
  full_name: string;
  firm_name: string | null;
  bar_number: string | null;
  states_licensed: string[];
  specialties: string[];
  contact_email: string;
  phone: string | null;
  website: string | null;
  bio: string | null;
  accepting_referrals: boolean;
  verified: boolean;
}

interface Referral {
  id: string;
  user_id: string;
  state: string | null;
  legal_area: string | null;
  message: string | null;
  status: string;
  attorney_response: string | null;
  created_at: string;
}

export default function AttorneyPortal() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AttorneyProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state for new profile / edits
  const [form, setForm] = useState({
    full_name: "",
    firm_name: "",
    bar_number: "",
    states_licensed: "",
    specialties: "",
    contact_email: "",
    phone: "",
    website: "",
    bio: "",
    accepting_referrals: true,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth?redirect=/firm");
      return;
    }
    (async () => {
      const { data: p } = await supabase
        .from("attorneys")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (p) {
        setProfile(p as AttorneyProfile);
        setForm({
          full_name: p.full_name ?? "",
          firm_name: p.firm_name ?? "",
          bar_number: p.bar_number ?? "",
          states_licensed: (p.states_licensed ?? []).join(", "),
          specialties: (p.specialties ?? []).join(", "),
          contact_email: p.contact_email ?? user.email ?? "",
          phone: p.phone ?? "",
          website: p.website ?? "",
          bio: p.bio ?? "",
          accepting_referrals: p.accepting_referrals,
        });

        const { data: refs } = await supabase
          .from("attorney_referrals")
          .select("id, user_id, state, legal_area, message, status, attorney_response, created_at")
          .eq("attorney_id", p.id)
          .order("created_at", { ascending: false });
        if (refs) setReferrals(refs as Referral[]);
      } else {
        setForm((f) => ({ ...f, contact_email: user.email ?? "" }));
      }
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      full_name: form.full_name.trim(),
      firm_name: form.firm_name.trim() || null,
      bar_number: form.bar_number.trim() || null,
      states_licensed: form.states_licensed.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      contact_email: form.contact_email.trim(),
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      bio: form.bio.trim() || null,
      accepting_referrals: form.accepting_referrals,
    };
    const { data, error } = await supabase
      .from("attorneys")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast.error("Could not save profile: " + error.message);
    } else {
      toast.success("Profile saved");
      setProfile(data as AttorneyProfile);
    }
  };

  const updateReferral = async (id: string, status: string) => {
    const { error } = await supabase
      .from("attorney_referrals")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Could not update referral");
    } else {
      setReferrals((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success("Referral updated");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Attorney Portal | Justice Bot USA</title>
        <meta name="description" content="Attorney portal for managing your profile and incoming referrals from Justice Bot USA users." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />
      <main className="container mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Attorney Portal</h1>
          <p className="text-muted-foreground">Manage your directory listing and respond to user referrals.</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Profile
                  {profile?.verified && <Badge variant="secondary">Verified</Badge>}
                </CardTitle>
                <CardDescription>
                  States and specialties are comma-separated. You will only appear in the public directory when "Accepting referrals" is on.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <Label>Firm Name</Label>
                  <Input value={form.firm_name} onChange={(e) => setForm({ ...form, firm_name: e.target.value })} />
                </div>
                <div>
                  <Label>Bar Number</Label>
                  <Input value={form.bar_number} onChange={(e) => setForm({ ...form, bar_number: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div>
                  <Label>States Licensed (e.g. CA, TX, NY)</Label>
                  <Input value={form.states_licensed} onChange={(e) => setForm({ ...form, states_licensed: e.target.value })} />
                </div>
                <div>
                  <Label>Specialties (e.g. eviction, family law)</Label>
                  <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Bio</Label>
                  <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.accepting_referrals} onCheckedChange={(v) => setForm({ ...form, accepting_referrals: v })} />
                  <Label>Accepting new referrals</Label>
                </div>
                <div className="md:col-span-2">
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? "Saving…" : profile ? "Update Profile" : "Create Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Incoming Referrals ({referrals.length})</CardTitle>
                  <CardDescription>Users who have requested a referral to your firm.</CardDescription>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <p className="text-muted-foreground">No referrals yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {referrals.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex gap-2">
                              {r.state && <Badge variant="outline">{r.state}</Badge>}
                              {r.legal_area && <Badge>{r.legal_area}</Badge>}
                              <Badge variant={r.status === "accepted" ? "default" : r.status === "declined" ? "destructive" : "secondary"}>
                                {r.status}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.created_at).toLocaleString()}
                            </span>
                          </div>
                          {r.message && <p className="text-sm">{r.message}</p>}
                          <div className="flex gap-2">
                            <Select value={r.status} onValueChange={(v) => updateReferral(r.id, v)}>
                              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}