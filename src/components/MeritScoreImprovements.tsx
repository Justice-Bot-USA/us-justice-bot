import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Camera, FileText, Users } from 'lucide-react';

interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface MeritScoreImprovementsProps {
  meritScore: number;
  improvementSuggestions?: ImprovementSuggestion[];
  evidenceCount: number;
}

export const MeritScoreImprovements: React.FC<MeritScoreImprovementsProps> = ({
  meritScore,
  improvementSuggestions = [],
  evidenceCount
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === 'high') return 'destructive';
    if (priority === 'medium') return 'default';
    return 'secondary';
  };

  // Show improvement suggestions for scores below 80
  if (meritScore >= 80 && improvementSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-yellow-600" />
          How to Strengthen Your Case
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Merit Score Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">Current Merit Score: </span>
            <span className={`font-bold ${getScoreColor(meritScore)}`}>
              {meritScore.toFixed(0)}/100
            </span>
            {meritScore < 70 && (
              <span className="block mt-1 text-sm">
                Your case could benefit from additional evidence and documentation.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* AI-Generated Improvement Suggestions */}
        {improvementSuggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Recommended Actions:</h4>
            {improvementSuggestions.map((suggestion, idx) => (
              <div key={idx} className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{suggestion.category}</span>
                  <Badge variant={getPriorityVariant(suggestion.priority)}>
                    {suggestion.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
              </div>
            ))}
          </div>
        )}

        {/* Evidence Gathering Quick Tips */}
        <div className="p-4 bg-white rounded-lg border-2 border-primary/20">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Quick Ways to Improve Your Score:
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Camera className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>
                <strong>Photos & Videos:</strong> Document physical evidence, damage, or relevant scenes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>
                <strong>Documents:</strong> Contracts, emails, texts, receipts, medical records
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>
                <strong>Witness Statements:</strong> Written accounts from people who witnessed events
              </span>
            </li>
          </ul>
          {evidenceCount < 3 && (
            <p className="mt-3 text-xs text-muted-foreground">
              You currently have {evidenceCount} evidence file{evidenceCount !== 1 ? 's' : ''} uploaded. 
              Adding more documentation typically increases your merit score by 10-20 points.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
