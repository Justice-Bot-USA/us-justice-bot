import { useState, useEffect } from 'react';
import { useCases, Case, CaseTimelineEvent } from '@/hooks/useCases';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { CaseCard } from '@/components/dashboard/CaseCard';
import { ExportAllCasesButton } from '@/components/export/ExportAllCasesButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Briefcase, 
  Archive, 
  Search, 
  Plus,
  Filter,
  Loader2,
  FileX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CaseDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { 
    cases, 
    archivedCases, 
    loading, 
    updateCaseStatus, 
    updateCaseNotes, 
    archiveCase, 
    restoreCase,
    fetchTimelineEvents 
  } = useCases();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timelineCache, setTimelineCache] = useState<Record<string, CaseTimelineEvent[]>>({});
  const [loadingTimelines, setLoadingTimelines] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadTimeline = async (caseId: string) => {
    if (timelineCache[caseId]) return;
    
    setLoadingTimelines(prev => ({ ...prev, [caseId]: true }));
    const events = await fetchTimelineEvents(caseId);
    setTimelineCache(prev => ({ ...prev, [caseId]: events }));
    setLoadingTimelines(prev => ({ ...prev, [caseId]: false }));
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.legal_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredArchivedCases = archivedCases.filter(c => 
    c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.legal_area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Cases</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your legal cases in one place
            </p>
          </div>
          <div className="flex gap-2">
            <ExportAllCasesButton cases={cases} />
            <Button onClick={() => navigate('/case-analysis')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Case Analysis
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="filed">Filed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Active Cases ({filteredCases.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive className="h-4 w-4" />
              Archived ({archivedCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileX className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {cases.length === 0 ? 'No cases yet' : 'No matching cases'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {cases.length === 0 
                    ? 'Start by creating a new case analysis to get legal guidance tailored to your situation.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                {cases.length === 0 && (
                  <Button onClick={() => navigate('/case-analysis')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Case
                  </Button>
                )}
              </div>
            ) : (
              filteredCases.map((caseData) => (
                <CaseCard
                  key={caseData.id}
                  caseData={caseData}
                  timelineEvents={timelineCache[caseData.id] || []}
                  loadingTimeline={loadingTimelines[caseData.id] || false}
                  onStatusChange={async (status) => {
                    await updateCaseStatus(caseData.id, status);
                    // Refresh timeline after status change
                    const events = await fetchTimelineEvents(caseData.id);
                    setTimelineCache(prev => ({ ...prev, [caseData.id]: events }));
                  }}
                  onNotesChange={(notes) => updateCaseNotes(caseData.id, notes)}
                  onArchive={() => archiveCase(caseData.id)}
                  isArchived={false}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {filteredArchivedCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Archive className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No archived cases
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Cases you archive will appear here. You can restore them anytime.
                </p>
              </div>
            ) : (
              filteredArchivedCases.map((caseData) => (
                <CaseCard
                  key={caseData.id}
                  caseData={caseData}
                  timelineEvents={timelineCache[caseData.id] || []}
                  loadingTimeline={loadingTimelines[caseData.id] || false}
                  onStatusChange={async () => {}}
                  onNotesChange={() => Promise.resolve()}
                  onArchive={() => Promise.resolve()}
                  onRestore={() => restoreCase(caseData.id)}
                  isArchived={true}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
