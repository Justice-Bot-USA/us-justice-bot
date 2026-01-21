import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSweepPipeline } from '@/hooks/useSweepPipeline';
import { SweepProgressDisplay } from './SweepProgressDisplay';
import { CaseProfileDisplay } from './CaseProfileDisplay';
import { EvidenceUploader } from '@/components/EvidenceUploader';
import { useAuth } from '@/hooks/useAuth';
import { Scale, Upload, Zap } from 'lucide-react';
import { US_STATES } from '@/lib/states';

interface SweepAnalyzerProps {
  onComplete?: (caseId: string) => void;
}

export const SweepAnalyzer: React.FC<SweepAnalyzerProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { caseProfile, progress, error, runPipeline, reset, isRunning } = useSweepPipeline();
  
  const [userStory, setUserStory] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  const handleStartAnalysis = async () => {
    if (!userStory.trim()) return;
    
    const result = await runPipeline(
      userStory,
      uploadedFileIds,
      state || undefined,
      county || undefined,
      user?.id,
      !!user // Save to DB if logged in
    );
    
    if (result?.caseId && onComplete) {
      onComplete(result.caseId);
    }
  };

  const handleFilesUploaded = (newFiles: Array<{ id: string }>) => {
    setUploadedFileIds(prev => [...prev, ...newFiles.map(f => f.id)]);
  };

  const handleReset = () => {
    reset();
    setUserStory('');
    setState('');
    setCounty('');
    setUploadedFileIds([]);
    setShowUploader(false);
  };

  // Show results if analysis is complete
  if (caseProfile?.status === 'completed' && caseProfile.analysisReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analysis Complete</h2>
          <Button variant="outline" onClick={handleReset}>
            Start New Analysis
          </Button>
        </div>
        <CaseProfileDisplay profile={caseProfile} />
      </div>
    );
  }

  // Show progress if running
  if (isRunning) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            Analyzing Your Case
          </CardTitle>
          <CardDescription>
            Our AI is running 7 specialized analysis sweeps on your case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SweepProgressDisplay progress={progress} />
          
          {/* Show partial results as they come in */}
          {caseProfile && (
            <div className="mt-6 pt-6 border-t">
              {caseProfile.intake && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✓ Issue Summary</p>
                  <p className="text-sm text-green-700">{caseProfile.intake.issueSummary}</p>
                </div>
              )}
              
              {caseProfile.classification && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✓ Classification</p>
                  <p className="text-sm text-green-700">
                    {caseProfile.classification.primaryCategory} → {caseProfile.classification.forumType}
                  </p>
                </div>
              )}
              
              {caseProfile.venue && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✓ Venue</p>
                  <p className="text-sm text-green-700">{caseProfile.venue.courtName}</p>
                </div>
              )}
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
          Sweep-Based Case Analysis
        </CardTitle>
        <CardDescription>
          Our AI runs 7 specialized analysis sweeps to provide comprehensive, reliable legal insights
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

        {/* Evidence Upload */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUploader(!showUploader)}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadedFileIds.length > 0 
              ? `${uploadedFileIds.length} file(s) uploaded` 
              : 'Upload Supporting Documents'}
          </Button>
          
          {showUploader && (
            <div className="mt-4 p-4 border rounded-lg">
              <EvidenceUploader 
                onFilesUploaded={handleFilesUploaded}
              />
            </div>
          )}
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
          disabled={!userStory.trim() || isRunning}
          className="w-full"
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          Start AI Analysis
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Analysis runs 7 sweeps: Intake → Evidence Index → Classification → Venue → Timeline → Precedents → Final Report
        </p>
      </CardContent>
    </Card>
  );
};
