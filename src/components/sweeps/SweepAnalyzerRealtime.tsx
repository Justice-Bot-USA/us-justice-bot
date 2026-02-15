import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSweepRealtime, createCaseWithSweeps } from '@/hooks/useSweepRealtime';
import { SweepProgressDisplay } from './SweepProgressDisplay';
import { CaseProfileDisplay } from './CaseProfileDisplay';
import { EvidenceUploaderRealtime } from './EvidenceUploaderRealtime';
import { useAuth } from '@/hooks/useAuth';
import { Scale, Upload, Zap, AlertCircle } from 'lucide-react';
import { US_STATES } from '@/lib/states';
import { supabase } from '@/integrations/supabase/client';
import { CaseProfile, createEmptyCaseProfile } from '@/lib/sweeps/types';
import { toast } from 'sonner';

interface SweepAnalyzerRealtimeProps {
  onComplete?: (caseId: string) => void;
}

export const SweepAnalyzerRealtime: React.FC<SweepAnalyzerRealtimeProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [userStory, setUserStory] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [preUploadFiles, setPreUploadFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to realtime updates for the case
  const {
    sweeps,
    meritScore,
    isLoading,
    isComplete,
    hasError,
    overallProgress,
    currentSweep,
    getSweepOutput,
    sweepOrder,
  } = useSweepRealtime(caseId);

  // Start the analysis pipeline
  const handleStartAnalysis = useCallback(async () => {
    if (!userStory.trim()) {
      toast.error('Please describe your legal issue');
      return;
    }

    if (!user) {
      toast.error('Please sign in to start analysis');
      return;
    }

    setError(null);
    setIsStarting(true);

    try {
      // 1. Create case and seed sweep rows
      const newCaseId = await createCaseWithSweeps(
        user.id,
        userStory,
        state || undefined,
        county || undefined
      );
      
      setCaseId(newCaseId);
      toast.success('Analysis started! Watch the progress below.');

      // 2. Trigger the sweep pipeline via edge functions
      // The sweeps will update the DB, and realtime subscription will update the UI
      await triggerSweepPipeline(newCaseId, user.id, userStory, uploadedFileIds, state, county);

    } catch (err) {
      console.error('Failed to start analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      toast.error('Failed to start analysis');
    } finally {
      setIsStarting(false);
    }
  }, [userStory, user, state, county, uploadedFileIds]);

  // Trigger all sweeps in sequence
  const triggerSweepPipeline = async (
    caseId: string,
    userId: string,
    story: string,
    fileIds: string[],
    stateCode?: string,
    countyName?: string
  ) => {
    // Run sweeps sequentially - each one updates the DB
    try {
      // Sweep 0: Intake
      const intakeResult = await supabase.functions.invoke('sweep-intake', {
        body: { userStory: story, documentTexts: [], caseId, userId }
      });
      
      // Sweep 1: Evidence Index
      await supabase.functions.invoke('sweep-evidence', {
        body: { fileIds, caseId, userId }
      });

      // Sweep 2: Classification
      await supabase.functions.invoke('sweep-classification', {
        body: { 
          intake: intakeResult.data?.data, 
          evidenceIndex: null,
          caseId, 
          userId 
        }
      });

      // Sweep 3: Venue
      await supabase.functions.invoke('sweep-venue', {
        body: { 
          intake: intakeResult.data?.data,
          classification: null,
          state: stateCode,
          county: countyName,
          caseId, 
          userId 
        }
      });

      // Sweep 4: Timeline
      await supabase.functions.invoke('sweep-timeline', {
        body: { 
          intake: intakeResult.data?.data,
          evidenceIndex: null,
          caseId, 
          userId 
        }
      });

      // Sweep 5: Authority
      await supabase.functions.invoke('sweep-authority', {
        body: { 
          classification: null,
          venue: null,
          timeline: null,
          state: stateCode,
          caseId, 
          userId 
        }
      });

      // Sweep 6: Final Analysis
      const analysisResult = await supabase.functions.invoke('sweep-analysis', {
        body: { 
          caseProfile: null, // Will be built from DB
          saveToDb: true,
          caseId, 
          userId 
        }
      });

      if (analysisResult.data?.data?.caseId) {
        onComplete?.(analysisResult.data.data.caseId);
      }
    } catch (err) {
      console.error('Sweep pipeline error:', err);
    }
  };

  const handleFilesUploaded = (newFiles: Array<{ id: string }>) => {
    setUploadedFileIds(prev => [...prev, ...newFiles.map(f => f.id)]);
  };

  const handleReset = () => {
    setCaseId(null);
    setUserStory('');
    setState('');
    setCounty('');
    setUploadedFileIds([]);
    setPreUploadFiles([]);
    setError(null);
  };

  // Build a CaseProfile from the sweep outputs for display
  const buildCaseProfile = (): CaseProfile | null => {
    if (!caseId) return null;

    const profile = createEmptyCaseProfile(caseId, userStory, uploadedFileIds, user?.id);
    
    const intake = getSweepOutput<CaseProfile['intake']>('intake');
    if (intake) profile.intake = intake;

    const evidenceIndex = getSweepOutput<CaseProfile['evidenceIndex']>('evidenceIndex');
    if (evidenceIndex) profile.evidenceIndex = evidenceIndex;

    const classification = getSweepOutput<CaseProfile['classification']>('classification');
    if (classification) profile.classification = classification;

    const venue = getSweepOutput<CaseProfile['venue']>('venue');
    if (venue) profile.venue = venue;

    const timeline = getSweepOutput<CaseProfile['timeline']>('timeline');
    if (timeline) profile.timeline = timeline;

    const authority = getSweepOutput<CaseProfile['authoritySweep']>('authority');
    if (authority) profile.authoritySweep = authority;

    const analysis = getSweepOutput<CaseProfile['analysisReport']>('analysis');
    if (analysis) {
      profile.analysisReport = analysis;
      profile.status = 'completed';
    }

    return profile;
  };

  // Show results if analysis is complete
  if (isComplete && caseId) {
    const profile = buildCaseProfile();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analysis Complete</h2>
          <Button variant="outline" onClick={handleReset}>
            Start New Analysis
          </Button>
        </div>
        {profile && <CaseProfileDisplay profile={profile} />}
      </div>
    );
  }

  // Show progress if case is in progress
  if (caseId && !isComplete) {
    const profile = buildCaseProfile();
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            Analyzing Your Case (Live)
          </CardTitle>
          <CardDescription>
            Watching {sweepOrder.length} analysis sweeps in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Display */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {currentSweep ? `Running: ${currentSweep}` : 'Processing...'}
              </span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Sweep Status Grid */}
          <div className="space-y-2">
            {sweepOrder.map((name) => {
              const sweep = sweeps[name];
              const status = sweep?.status || 'pending';
              
              return (
                <div 
                  key={name}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    status === 'running' ? 'bg-primary/10 border border-primary/20' :
                    status === 'done' ? 'bg-green-500/10' :
                    status === 'error' ? 'bg-destructive/10' :
                    'bg-muted/50'
                  }`}
                >
                  <span className={`font-medium ${
                    status === 'done' ? 'text-green-600' :
                    status === 'running' ? 'text-primary' :
                    status === 'error' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {name}
                  </span>
                  <span className="text-sm">
                    {status === 'done' && '✓'}
                    {status === 'running' && `${sweep?.progress || 0}%`}
                    {status === 'error' && '✗'}
                    {status === 'queued' && '○'}
                    {status === 'pending' && '○'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Merit Score */}
          {meritScore && meritScore.merit_score > 0 && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Case Strength Score</span>
                <span className="text-2xl font-bold text-primary">{meritScore.merit_score}/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${meritScore.merit_score}%` }}
                />
              </div>
              {meritScore.estimated_success_rate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated success rate: {Math.round(meritScore.estimated_success_rate * 100)}%
                </p>
              )}
            </div>
          )}

          {/* Evidence Uploader - Upload during analysis for re-processing */}
          <div className="mt-6 pt-6 border-t">
            <EvidenceUploaderRealtime
              caseId={caseId}
              userId={user?.id || null}
              onFilesChanged={() => {
                // Files uploaded - sweeps will be invalidated automatically
                toast.info('New evidence uploaded - re-analyzing...');
              }}
            />
          </div>

          {/* Partial Results */}
          {profile?.intake && (
            <div className="mt-6 pt-6 border-t">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">✓ Issue Summary</p>
                <p className="text-sm text-green-700 dark:text-green-300">{profile.intake.issueSummary}</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Some sweeps encountered errors. Results may be incomplete.</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show input form
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Real-Time Case Analysis
        </CardTitle>
        <CardDescription>
          Watch as our AI runs 7 specialized sweeps on your case with live updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Story Input */}
        <div className="space-y-2">
          <Label htmlFor="story">Describe Your Legal Issue *</Label>
          <Textarea
            id="story"
            placeholder="Tell us what happened. Include key dates, people involved, and what you're trying to achieve..."
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            The more detail you provide, the better analysis you'll receive
          </p>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="county">County (Optional)</Label>
            <Input
              id="county"
              placeholder="e.g., Los Angeles"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
          </div>
        </div>

        {/* Evidence Upload - available before and during analysis */}
        <div className="space-y-2">
          <Label>Supporting Documents (Optional)</Label>
          <div className="border rounded-lg p-4 bg-muted/20">
            <input
              type="file"
              id="evidence-upload"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.rtf"
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                // For pre-analysis uploads, we store files locally and upload them when analysis starts
                // For now, show selected file names
                const newIds = files.map((f, i) => `pre-${Date.now()}-${i}`);
                setUploadedFileIds(prev => [...prev, ...newIds]);
                setPreUploadFiles(prev => [...prev, ...files]);
                toast.success(`${files.length} file(s) selected for upload`);
                e.target.value = '';
              }}
            />
            <label
              htmlFor="evidence-upload"
              className="flex flex-col items-center cursor-pointer py-4 hover:bg-muted/40 rounded-lg transition-colors"
            >
              <Upload className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm font-medium text-foreground">Click to upload evidence files</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Word, Images, Text files accepted</p>
            </label>
            {preUploadFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                {preUploadFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-background rounded px-3 py-1.5">
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive ml-2 text-xs"
                      onClick={() => {
                        setPreUploadFiles(prev => prev.filter((_, idx) => idx !== i));
                        setUploadedFileIds(prev => prev.filter((_, idx) => idx !== i));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button 
          onClick={handleStartAnalysis}
          disabled={!userStory.trim() || isStarting || !user}
          className="w-full"
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isStarting ? 'Starting Analysis...' : 'Start Real-Time Analysis'}
        </Button>

        {!user && (
          <p className="text-xs text-center text-amber-600">
            Please sign in to start analysis
          </p>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Live updates: Intake → Evidence → Classification → Venue → Timeline → Authority → Report
        </p>
      </CardContent>
    </Card>
  );
};
