import React, { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { Search, CalendarIcon, ExternalLink, Scale, Loader2, ChevronLeft, ChevronRight, AlertTriangle, Bookmark, BookmarkCheck, FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSavedCourtResults } from "@/hooks/useSavedCourtResults";
import { useCases } from "@/hooks/useCases";

interface CourtResult {
  id: number;
  caseName: string;
  court: string;
  courtId: string;
  dateFiled: string;
  dateArgued: string;
  docketNumber: string;
  suitNature: string;
  citation: string;
  snippet: string;
  absoluteUrl: string;
  status: string;
  author: string;
  downloadUrl: string;
}

const SEARCH_TYPES = [
  { value: "o", label: "Opinions" },
  { value: "r", label: "RECAP / Dockets" },
  { value: "oa", label: "Oral Arguments" },
  { value: "p", label: "Judges" },
];

const POPULAR_COURTS = [
  { value: "", label: "All Courts" },
  { value: "scotus", label: "U.S. Supreme Court" },
  { value: "ca1", label: "1st Circuit" },
  { value: "ca2", label: "2nd Circuit" },
  { value: "ca3", label: "3rd Circuit" },
  { value: "ca4", label: "4th Circuit" },
  { value: "ca5", label: "5th Circuit" },
  { value: "ca6", label: "6th Circuit" },
  { value: "ca7", label: "7th Circuit" },
  { value: "ca8", label: "8th Circuit" },
  { value: "ca9", label: "9th Circuit" },
  { value: "ca10", label: "10th Circuit" },
  { value: "ca11", label: "11th Circuit" },
  { value: "cadc", label: "D.C. Circuit" },
  { value: "cafc", label: "Federal Circuit" },
];

export default function CourtListenerSearch() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("o");
  const [court, setCourt] = useState("");
  const [dateAfter, setDateAfter] = useState<Date | undefined>();
  const [dateBefore, setDateBefore] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CourtResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [disclaimer, setDisclaimer] = useState("");
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [linkedCaseId, setLinkedCaseId] = useState<string>("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const { user } = useAuth();
  const { cases } = useCases();
  const { saveResult, isResultSaved, refreshSaved } = useSavedCourtResults();

  const handleSearch = useCallback(async (pageNum = 1) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke("courtlistener-search", {
        body: {
          query: query.trim(),
          searchType,
          court: court || undefined,
          dateAfter: dateAfter ? format(dateAfter, "yyyy-MM-dd") : undefined,
          dateBefore: dateBefore ? format(dateBefore, "yyyy-MM-dd") : undefined,
          page: pageNum,
        },
      });

      if (error) throw error;

      setResults(data.results || []);
      setTotalCount(data.count || 0);
      setPage(pageNum);
      setDisclaimer(data.disclaimer || "");
    } catch (err: any) {
      console.error("Search error:", err);
      toast.error(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, searchType, court, dateAfter, dateBefore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handleSave = async (result: CourtResult) => {
    setSavingId(result.id);
    await saveResult(result, searchType, linkedCaseId || undefined);
    setSavingId(null);
  };

  return (
    <>
      <Helmet>
        <title>Court Opinion & Docket Search | CourtListener | Justice Bot USA</title>
        <meta name="description" content="Search U.S. federal and state court opinions, dockets, and oral arguments. Filter by court, date range, and case type using CourtListener data." />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search Form */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Scale className="h-6 w-6 text-primary" />
                CourtListener Search
              </CardTitle>
              <CardDescription>
                Search millions of U.S. court opinions, dockets, and oral arguments from the Free Law Project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Query + Search Type */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder='Search cases, e.g. "Miranda v. Arizona" or "due process"'
                      className="h-11"
                    />
                  </div>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEARCH_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select value={court || "__all__"} onValueChange={(v) => setCourt(v === "__all__" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courts" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_COURTS.map((c) => (
                        <SelectItem key={c.value} value={c.value || "__all__"}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !dateAfter && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateAfter ? format(dateAfter, "MMM d, yyyy") : "Filed after..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateAfter} onSelect={setDateAfter} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !dateBefore && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateBefore ? format(dateBefore, "MMM d, yyyy") : "Filed before..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateBefore} onSelect={setDateBefore} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Link to case + Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={loading} className="sm:flex-none">
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                  </Button>

                  {user && cases.length > 0 && (
                    <Select value={linkedCaseId || "__none__"} onValueChange={(v) => setLinkedCaseId(v === "__none__" ? "" : v)}>
                      <SelectTrigger className="w-full sm:w-[260px]">
                        <FolderOpen className="h-4 w-4 mr-2 shrink-0" />
                        <SelectValue placeholder="Link saves to a case..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">No case linked</SelectItem>
                        {cases.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.case_title.length > 35 ? c.case_title.slice(0, 35) + "…" : c.case_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {(dateAfter || dateBefore || court) && (
                    <Button type="button" variant="ghost" onClick={() => { setDateAfter(undefined); setDateBefore(undefined); setCourt(""); }}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Searching..." : `${totalCount.toLocaleString()} result${totalCount !== 1 ? "s" : ""} found`}
                </p>
                {totalCount > 20 && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => handleSearch(page - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page}</span>
                    <Button size="sm" variant="outline" disabled={results.length < 20 || loading} onClick={() => handleSearch(page + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {results.length === 0 && !loading && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm mt-1">Try broadening your search or adjusting filters</p>
                  </CardContent>
                </Card>
              )}

              {results.map((r) => {
                const saved = isResultSaved(r.id);
                return (
                  <Card key={r.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <a
                            href={r.absoluteUrl ? `https://www.courtlistener.com${r.absoluteUrl}` : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-semibold text-lg leading-tight"
                          >
                            {r.caseName || "Untitled Case"}
                          </a>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {r.court && <Badge variant="secondary">{r.court}</Badge>}
                            {r.dateFiled && <Badge variant="outline">{r.dateFiled}</Badge>}
                            {r.status && <Badge variant="outline">{r.status}</Badge>}
                            {r.docketNumber && <Badge variant="outline">#{r.docketNumber}</Badge>}
                          </div>

                          {r.citation && (
                            <p className="text-sm text-muted-foreground mt-2">{r.citation}</p>
                          )}

                          {r.snippet && (
                            <p
                              className="text-sm text-muted-foreground mt-2 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.snippet, { ALLOWED_TAGS: ['mark', 'em', 'strong', 'b', 'i'], ALLOWED_ATTR: [] }) }}
                            />
                          )}

                          {r.author && (
                            <p className="text-xs text-muted-foreground mt-2">Author: {r.author}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          {user && (
                            <Button
                              size="sm"
                              variant={saved ? "default" : "outline"}
                              onClick={() => handleSave(r)}
                              disabled={saved || savingId === r.id}
                              title={saved ? "Already saved" : "Save to your cases"}
                            >
                              {savingId === r.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : saved ? (
                                <BookmarkCheck className="h-4 w-4" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <a
                            href={r.absoluteUrl ? `https://www.courtlistener.com${r.absoluteUrl}` : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{disclaimer}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
