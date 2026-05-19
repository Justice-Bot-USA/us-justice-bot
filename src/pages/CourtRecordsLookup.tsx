import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Search, ExternalLink, MapPin, FileText, Loader2,
  Scale, AlertTriangle, Building2, Globe, Gavel, BookOpen, Mic, FolderOpen
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { US_STATES } from "@/lib/states";
import { trackUSLookupStarted, trackUSLookupCompleted } from "@/hooks/useAnalytics";
import LookupActionCTA from "@/components/LookupActionCTA";
import PrepareFilingModal from "@/components/PrepareFilingModal";
import DOMPurify from "dompurify";

// State court portal directory - official public record websites
const STATE_COURT_PORTALS: Record<string, { name: string; url: string; hasPublicSearch: boolean; notes: string }> = {
  AL: { name: "Alacourt.com", url: "https://v2.alacourt.com/", hasPublicSearch: true, notes: "Requires registration for full access" },
  AK: { name: "CourtView", url: "https://records.courts.alaska.gov/eaccess/", hasPublicSearch: true, notes: "Free public access" },
  AZ: { name: "AZ Court Case Search", url: "https://www.azcourts.gov/records/", hasPublicSearch: true, notes: "Varies by county" },
  AR: { name: "CourtConnect", url: "https://caseinfo.arcourts.gov/cconnect/", hasPublicSearch: true, notes: "Free public access" },
  CA: { name: "CA Courts Case Search", url: "https://www.courts.ca.gov/find-my-court.htm", hasPublicSearch: true, notes: "Search by county — most use Odyssey or CMS" },
  CO: { name: "Colorado Judicial Branch", url: "https://www.courts.state.co.us/dockets/", hasPublicSearch: true, notes: "Free docket search" },
  CT: { name: "CT Judicial Branch", url: "https://www.jud.ct.gov/jud2.htm", hasPublicSearch: true, notes: "Civil/family case look-up available" },
  DE: { name: "Delaware Courts", url: "https://courts.delaware.gov/", hasPublicSearch: false, notes: "Contact court clerk for records" },
  DC: { name: "DC Courts", url: "https://www.dccourts.gov/superior-court/cases-online", hasPublicSearch: true, notes: "CaseFileXpress for online access" },
  FL: { name: "FL Clerk of Courts", url: "https://www.myflcourtaccess.com/", hasPublicSearch: true, notes: "Comprehensive public access — search by county" },
  GA: { name: "GA Courts Case Search", url: "https://www.georgiacourts.gov/", hasPublicSearch: true, notes: "Varies by county — check Superior Court websites" },
  HI: { name: "Hawaii eCourt Kokua", url: "https://www.courts.state.hi.us/legal_references/records/jims", hasPublicSearch: true, notes: "Free public case search" },
  ID: { name: "iCourt", url: "https://www.idcourts.us/repository/start.do", hasPublicSearch: true, notes: "Free case repository" },
  IL: { name: "IL Circuit Court", url: "https://www.illinoiscourts.gov/", hasPublicSearch: true, notes: "Check county clerk websites — Cook County has online portal" },
  IN: { name: "MyCase / Odyssey", url: "https://public.courts.in.gov/mycase/", hasPublicSearch: true, notes: "Free statewide case search" },
  IA: { name: "Iowa Courts Online", url: "https://www.iowacourts.gov/for-the-public/court-case-online/", hasPublicSearch: true, notes: "Free case search" },
  KS: { name: "Kansas Courts", url: "https://www.kscourts.org/", hasPublicSearch: true, notes: "District court records available by county" },
  KY: { name: "KY CourtNet 2.0", url: "https://kcoj.kycourts.net/", hasPublicSearch: true, notes: "Requires registration" },
  LA: { name: "Louisiana Courts", url: "https://www.lasc.org/", hasPublicSearch: false, notes: "Check parish clerk of court websites" },
  ME: { name: "Maine Courts", url: "https://www.courts.maine.gov/", hasPublicSearch: false, notes: "Contact court clerk for records" },
  MD: { name: "MD Case Search", url: "https://casesearch.courts.state.md.us/casesearch/", hasPublicSearch: true, notes: "Free comprehensive case search" },
  MA: { name: "MA Trial Court", url: "https://www.mass.gov/orgs/trial-court", hasPublicSearch: true, notes: "MassCourts portal for online access" },
  MI: { name: "MI Courts Case Search", url: "https://micourt.courts.michigan.gov/case-search/", hasPublicSearch: true, notes: "Free statewide case search" },
  MN: { name: "MN Court Records Online", url: "https://www.mncourts.gov/Access-Case-Records.aspx", hasPublicSearch: true, notes: "Free public access" },
  MS: { name: "Mississippi Courts", url: "https://courts.ms.gov/", hasPublicSearch: false, notes: "Check county circuit clerk" },
  MO: { name: "Case.net", url: "https://www.courts.mo.gov/cnet/", hasPublicSearch: true, notes: "Free statewide case search" },
  MT: { name: "Montana Courts", url: "https://courts.mt.gov/", hasPublicSearch: true, notes: "Full Court Press for online records" },
  NE: { name: "JUSTICE (Nebraska)", url: "https://www.nebraska.gov/justice/case.cgi", hasPublicSearch: true, notes: "Free case search" },
  NV: { name: "Nevada Courts", url: "https://nvcourts.gov/", hasPublicSearch: true, notes: "Varies by county — Clark County has Odyssey" },
  NH: { name: "NH Court System", url: "https://www.courts.nh.gov/", hasPublicSearch: false, notes: "Contact court clerk" },
  NJ: { name: "NJ Courts Online", url: "https://www.njcourts.gov/", hasPublicSearch: true, notes: "eCourts for case information" },
  NM: { name: "NM Courts Case Lookup", url: "https://caselookup.nmcourts.gov/caselookup/", hasPublicSearch: true, notes: "Free statewide search" },
  NY: { name: "WebCivil Supreme / eCourts", url: "https://iapps.courts.state.ny.us/webcivil/FCASMain", hasPublicSearch: true, notes: "WebCivil for civil, WebCrims for criminal" },
  NC: { name: "NC Courts", url: "https://www.nccourts.gov/court-dates", hasPublicSearch: true, notes: "eCourts portal" },
  ND: { name: "ND Court Records", url: "https://www.ndcourts.gov/", hasPublicSearch: true, notes: "Odyssey Portal" },
  OH: { name: "Ohio Courts", url: "https://www.supremecourt.ohio.gov/", hasPublicSearch: true, notes: "Check county court websites" },
  OK: { name: "OSCN / ODCR", url: "https://www.oscn.net/dockets/", hasPublicSearch: true, notes: "Free comprehensive docket search" },
  OR: { name: "Oregon eCourt", url: "https://www.courts.oregon.gov/services/online/Pages/ojcin.aspx", hasPublicSearch: true, notes: "Oregon Judicial Case Information Network" },
  PA: { name: "PA UJS Portal", url: "https://ujsportal.pacourts.us/", hasPublicSearch: true, notes: "Free statewide case search — Common Pleas, MDJ, Appellate" },
  RI: { name: "RI Courts", url: "https://www.courts.ri.gov/", hasPublicSearch: false, notes: "Contact court clerk" },
  SC: { name: "SC Courts", url: "https://www.sccourts.org/caseSearch/", hasPublicSearch: true, notes: "Public index search" },
  SD: { name: "SD UJS", url: "https://ujs.sd.gov/", hasPublicSearch: true, notes: "Odyssey Portal" },
  TN: { name: "Tennessee Courts", url: "https://www.tncourts.gov/", hasPublicSearch: true, notes: "Check county clerk websites" },
  TX: { name: "re:SearchTX", url: "https://research.txcourts.gov/CourtRecordsSearch/", hasPublicSearch: true, notes: "Free statewide case search" },
  UT: { name: "Utah Courts Xchange", url: "https://www.utcourts.gov/xchange/", hasPublicSearch: true, notes: "Free case search" },
  VT: { name: "Vermont Judiciary", url: "https://www.vermontjudiciary.org/", hasPublicSearch: false, notes: "Contact court clerk" },
  VA: { name: "VA Courts Case Info", url: "https://www.vacourts.gov/caseinfo/home.html", hasPublicSearch: true, notes: "Free case information system" },
  WA: { name: "WA Courts Case Search", url: "https://dw.courts.wa.gov/", hasPublicSearch: true, notes: "Free statewide case search" },
  WV: { name: "WV Judiciary", url: "https://www.courtswv.gov/", hasPublicSearch: true, notes: "Magistrate Court Case Search" },
  WI: { name: "WCCA", url: "https://wcca.wicourts.gov/", hasPublicSearch: true, notes: "Wisconsin Circuit Court Access — free and comprehensive" },
  WY: { name: "Wyoming Courts", url: "https://www.courts.state.wy.us/", hasPublicSearch: false, notes: "Contact court clerk" },
};

// Federal court portals
const FEDERAL_PORTALS = [
  { name: "PACER", url: "https://pacer.uscourts.gov/", description: "Federal court filings — bankruptcy, civil, criminal, appellate. $0.10/page." },
  { name: "CourtListener (Free)", url: "https://www.courtlistener.com/", description: "Free federal court opinions, oral arguments, and RECAP archive of PACER documents." },
  { name: "RECAP Archive", url: "https://www.courtlistener.com/recap/", description: "Free mirror of millions of PACER documents uploaded by the public." },
  { name: "Supreme Court", url: "https://www.supremecourt.gov/docket/docket.aspx", description: "US Supreme Court docket search." },
];

interface SearchResult {
  title: string;
  url: string;
  description?: string;
  markdown?: string;
}

interface CLResult {
  type: string;
  title: string;
  url: string;
  docketNumber: string;
  court: string;
  dateFiled?: string;
  dateArgued?: string;
  citation?: string;
  status?: string;
  author?: string;
  snippet?: string;
  downloadUrl?: string;
  suitNature?: string;
  assignedTo?: string;
  duration?: number;
}

export default function CourtRecordsLookup() {
  const [searchState, setSearchState] = useState("");
  const [docketNumber, setDocketNumber] = useState("");
  const [partyName, setPartyName] = useState("");
  const [caseType, setCaseType] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [opinions, setOpinions] = useState<CLResult[]>([]);
  const [dockets, setDockets] = useState<CLResult[]>([]);
  const [oralArguments, setOralArguments] = useState<CLResult[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [portalFilter, setPortalFilter] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSearch = async () => {
    if (!docketNumber && !partyName) {
      toast({ title: "Enter a docket number or party name", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    trackUSLookupStarted('court_records', searchState);

    try {
      const { data, error } = await supabase.functions.invoke("court-records-search", {
        body: {
          docketNumber: docketNumber.trim(),
          state: searchState || undefined,
          partyName: partyName.trim() || undefined,
          caseType: caseType || undefined,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setResults(data.results || []);
        setOpinions(data.opinions || []);
        setDockets(data.dockets || []);
        setOralArguments(data.oralArguments || []);
        setDisclaimer(data.disclaimer || "");
        const totalCount = (data.results || []).length + (data.opinions || []).length + (data.dockets || []).length + (data.oralArguments || []).length;
        trackUSLookupCompleted('court_records', searchState, totalCount);
      } else {
        toast({ title: "Search failed", description: data?.error || "Unknown error", variant: "destructive" });
      }
    } catch (err) {
      console.error("Court records search error:", err);
      toast({ title: "Search error", description: String(err), variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const filteredPortals = portalFilter
    ? Object.entries(STATE_COURT_PORTALS).filter(([code]) => code === portalFilter)
    : Object.entries(STATE_COURT_PORTALS);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Court Records Lookup - Find Case Filings & Dockets | A.I. ANAL"
        description="Search court records, dockets, and case filings across all 50 states and federal courts. Free access to public court record portals."
        keywords="court records, docket search, case filings, court hearings, PACER, state court records"
        url="https://us-justice-bot.lovable.app/court-records"
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Gavel className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Court Records Lookup</h1>
              <p className="text-primary-foreground/80">
                Search dockets, filings &amp; hearings across state &amp; federal courts
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Important Notice */}
        <Card className="mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-destructive mb-1">Important: Court Record Availability</p>
                <p className="text-muted-foreground">
                  Many court records — especially <strong>family court, CPS, juvenile, and sealed cases</strong> — are 
                  <strong> not publicly available online</strong>. If you're a party to a case, contact the court clerk 
                  directly with your case/docket number. Our search covers publicly accessible records only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Docket Search
            </TabsTrigger>
            <TabsTrigger value="state-portals">
              <MapPin className="h-4 w-4 mr-2" />
              State Court Portals
            </TabsTrigger>
            <TabsTrigger value="federal">
              <Building2 className="h-4 w-4 mr-2" />
              Federal Courts
            </TabsTrigger>
          </TabsList>

          {/* DOCKET SEARCH TAB */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Court Records
                </CardTitle>
                <CardDescription>
                  Search public court records by docket number or party name. Uses AI-powered search of official court websites.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Docket / Case Number</label>
                    <Input
                      placeholder="e.g., 2024-CV-12345"
                      value={docketNumber}
                      onChange={(e) => setDocketNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Party Name (optional)</label>
                    <Input
                      placeholder="e.g., Smith v. Jones"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">State (optional)</label>
                    <Select value={searchState} onValueChange={setSearchState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="any">Any State</SelectItem>
                        <SelectItem value="federal">Federal</SelectItem>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Case Type (optional)</label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                        <SelectItem value="small claims">Small Claims</SelectItem>
                        <SelectItem value="probate">Probate</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSearch} disabled={isSearching} className="w-full md:w-auto">
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching public records...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Court Records
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Court Opinions from CourtListener */}
            {opinions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Court Opinions
                    <Badge variant="secondary">{opinions.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {opinions.map((r, i) => (
                      <div key={i} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                              {r.title}
                            </a>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {r.docketNumber && <Badge variant="outline" className="text-xs">#{r.docketNumber}</Badge>}
                              {r.court && <Badge variant="secondary" className="text-xs">{r.court}</Badge>}
                              {r.status && <Badge variant="outline" className="text-xs">{r.status}</Badge>}
                              {r.dateFiled && <span className="text-xs text-muted-foreground">Filed: {r.dateFiled}</span>}
                            </div>
                            {r.citation && <p className="text-xs text-muted-foreground mt-1">{r.citation}</p>}
                            {r.snippet && <p className="text-sm text-muted-foreground mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.snippet, { ALLOWED_TAGS: ["mark","em","strong","b","i"], ALLOWED_ATTR: [] }) }} />}
                            {r.author && <p className="text-xs text-muted-foreground mt-1">Author: {r.author}</p>}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dockets from CourtListener */}
            {dockets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    Dockets & Filings
                    <Badge variant="secondary">{dockets.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dockets.map((r, i) => (
                      <div key={i} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                              {r.title}
                            </a>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {r.docketNumber && <Badge variant="outline" className="text-xs">#{r.docketNumber}</Badge>}
                              {r.court && <Badge variant="secondary" className="text-xs">{r.court}</Badge>}
                              {r.suitNature && <Badge variant="outline" className="text-xs">{r.suitNature}</Badge>}
                              {r.dateFiled && <span className="text-xs text-muted-foreground">Filed: {r.dateFiled}</span>}
                            </div>
                            {r.assignedTo && <p className="text-xs text-muted-foreground mt-1">Assigned to: {r.assignedTo}</p>}
                            {r.snippet && <p className="text-sm text-muted-foreground mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.snippet, { ALLOWED_TAGS: ["mark","em","strong","b","i"], ALLOWED_ATTR: [] }) }} />}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Oral Arguments from CourtListener */}
            {oralArguments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary" />
                    Oral Arguments
                    <Badge variant="secondary">{oralArguments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {oralArguments.map((r, i) => (
                      <div key={i} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                              {r.title}
                            </a>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {r.docketNumber && <Badge variant="outline" className="text-xs">#{r.docketNumber}</Badge>}
                              {r.court && <Badge variant="secondary" className="text-xs">{r.court}</Badge>}
                              {r.dateArgued && <span className="text-xs text-muted-foreground">Argued: {r.dateArgued}</span>}
                            </div>
                            {r.snippet && <p className="text-sm text-muted-foreground mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.snippet, { ALLOWED_TAGS: ["mark","em","strong","b","i"], ALLOWED_ATTR: [] }) }} />}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Web Search Results */}
            {hasSearched && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    State Portal Search Results
                    {results.length > 0 && <Badge variant="secondary">{results.length} found</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {results.length > 0 ? (
                    <div className="space-y-3">
                      {results.map((r, i) => (
                        <div key={i} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">{r.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">{r.url}</p>
                              {r.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={r.url} target="_blank" rel="noopener noreferrer">
                                Open <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isSearching && opinions.length === 0 && dockets.length === 0 && oralArguments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">
                      No public records found. Try searching directly on your state's court portal below, or contact the court clerk.
                    </p>
                  ) : null}

                  {disclaimer && (
                    <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">{disclaimer}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* STATE COURT PORTALS TAB */}
          <TabsContent value="state-portals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  State Court Record Portals
                </CardTitle>
                <CardDescription>
                  Official court record lookup websites for each state. Click to go directly to your state's court records system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={portalFilter} onValueChange={setPortalFilter}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Filter by state..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All States</SelectItem>
                      {US_STATES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPortals.map(([code, portal]) => (
                    <Card key={code} className="hover:border-primary/50 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">{code}</Badge>
                              <h4 className="font-semibold text-sm">{portal.name}</h4>
                            </div>
                          </div>
                          {portal.hasPublicSearch ? (
                            <Badge variant="default" className="text-xs shrink-0">Online Search</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs shrink-0">Clerk Only</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{portal.notes}</p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={portal.url} target="_blank" rel="noopener noreferrer">
                            Visit Portal <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEDERAL COURTS TAB */}
          <TabsContent value="federal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Federal Court Record Systems
                </CardTitle>
                <CardDescription>
                  Federal courts use PACER for case filings. CourtListener provides free access to many federal opinions and RECAP documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FEDERAL_PORTALS.map((portal) => (
                    <Card key={portal.name} className="hover:border-primary/50 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold mb-1">{portal.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{portal.description}</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={portal.url} target="_blank" rel="noopener noreferrer">
                            Visit <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">What's on PACER vs. What's Not</p>
                    <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                      <li><strong>On PACER:</strong> Federal bankruptcy, civil, criminal, and appellate cases</li>
                      <li><strong>NOT on PACER:</strong> State courts, family courts, CPS, juvenile cases, traffic tickets</li>
                      <li><strong>Sealed cases:</strong> Not publicly accessible regardless of system</li>
                      <li><strong>Cost:</strong> PACER charges $0.10/page (capped at $3/document). CourtListener's RECAP archive is free.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Links */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/warrant-lookup">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Warrant Lookup</span>
                  <span className="text-xs text-muted-foreground">Check for active warrants</span>
                </Button>
              </Link>
              <Link to="/usa-forms">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Scale className="h-6 w-6" />
                  <span className="font-medium">Court Forms</span>
                  <span className="text-xs text-muted-foreground">Download official forms</span>
                </Button>
              </Link>
              <Link to="/case-analysis">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Gavel className="h-6 w-6" />
                  <span className="font-medium">Case Analysis</span>
                  <span className="text-xs text-muted-foreground">AI-powered case review</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Action CTA after search */}
        {hasSearched && !isSearching && (
          <LookupActionCTA
            onPrepareClick={() => setShowPaywall(true)}
            state={searchState}
          />
        )}

        <PrepareFilingModal
          open={showPaywall}
          onOpenChange={setShowPaywall}
          defaultState={searchState}
          source="court_records_lookup"
        />
      </main>
    </div>
  );
}
