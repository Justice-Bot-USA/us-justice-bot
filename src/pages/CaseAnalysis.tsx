import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SweepAnalyzerRealtime } from '@/components/sweeps/SweepAnalyzerRealtime';
import { SmartTriageWizard } from '@/components/SmartTriageWizard';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CaseAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [completedCaseId, setCompletedCaseId] = useState<string | null>(null);

  const handleAnalysisComplete = (caseId: string) => {
    setCompletedCaseId(caseId);
    setAnalysisComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Case Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered legal triage with real-time sweep updates
          </p>
        </div>

        <Tabs defaultValue="realtime-sweeps" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="realtime-sweeps">Real-Time Analysis</TabsTrigger>
            <TabsTrigger value="quick-triage">Quick Triage</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime-sweeps">
            <SweepAnalyzerRealtime onComplete={handleAnalysisComplete} />
          </TabsContent>

          <TabsContent value="quick-triage">
            <SmartTriageWizard onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaseAnalysis;