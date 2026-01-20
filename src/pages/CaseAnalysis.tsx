import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CaseMeritAnalyzer } from '@/components/CaseMeritAnalyzer';
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

  // Allow guest access for free analysis - per brief, free portion includes:
  // Upload document, receive explanation, identify correct court, preview forms
  // Sign-in only required for $4.99 form generation

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
            AI-powered legal triage with jurisdiction-specific channel recommendations
          </p>
        </div>

        <Tabs defaultValue="smart-triage" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="smart-triage">Smart Triage</TabsTrigger>
            <TabsTrigger value="detailed-analysis">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="smart-triage">
            <SmartTriageWizard onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>

          <TabsContent value="detailed-analysis">
            <CaseMeritAnalyzer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaseAnalysis;