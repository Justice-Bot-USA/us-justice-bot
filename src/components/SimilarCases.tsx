import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Scale, TrendingUp, Users } from 'lucide-react';

interface SimilarCasesProps {
  state: string;
  legalArea: string;
  currentCaseId?: string;
}

interface SimilarCase {
  id: string;
  case_title: string;
  legal_area: string;
  state: string;
  county: string | null;
  merit_score: number;
  status: string | null;
  created_at: string;
}

export const SimilarCases: React.FC<SimilarCasesProps> = ({ 
  state, 
  legalArea, 
  currentCaseId 
}) => {
  const { data: similarCases, isLoading } = useQuery({
    queryKey: ['similar-cases', state, legalArea, currentCaseId],
    queryFn: async () => {
      // Get cases in the same state with similar legal areas
      const { data, error } = await supabase
        .from('case_merit_scores')
        .select('id, case_title, legal_area, state, county, merit_score, status, created_at')
        .eq('state', state)
        .neq('id', currentCaseId || '')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Filter and score by similarity to the legal area
      const scored = (data || []).map((c: SimilarCase) => {
        let similarity = 0;
        // Exact match on legal area
        if (c.legal_area?.toLowerCase().includes(legalArea.toLowerCase())) {
          similarity = 100;
        } else if (legalArea.toLowerCase().includes(c.legal_area?.toLowerCase() || '')) {
          similarity = 80;
        } else {
          // Check for related areas
          const relatedAreas: Record<string, string[]> = {
            'family': ['divorce', 'custody', 'child support', 'family law'],
            'employment': ['wrongful termination', 'wage theft', 'discrimination', 'workplace'],
            'housing': ['tenant', 'landlord', 'eviction', 'rental'],
            'criminal': ['defense', 'dui', 'assault', 'theft', 'drug'],
            'small-claims': ['money', 'contract', 'dispute', 'debt'],
          };
          
          for (const [key, related] of Object.entries(relatedAreas)) {
            if (legalArea.toLowerCase().includes(key) || related.some(r => legalArea.toLowerCase().includes(r))) {
              if (c.legal_area?.toLowerCase().includes(key) || related.some(r => c.legal_area?.toLowerCase().includes(r))) {
                similarity = 60;
                break;
              }
            }
          }
        }
        return { ...c, similarity };
      });
      
      // Sort by similarity and return top 5
      return scored
        .filter(c => c.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    },
    enabled: !!state && !!legalArea
  });

  const getMeritColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Similar Cases in Your Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!similarCases || similarCases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Similar Cases in Your Region
          </CardTitle>
          <CardDescription>
            Cases with similar legal issues in {state}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No similar cases found in your region yet. Your case analysis will help others in the future!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Similar Cases in Your Region
        </CardTitle>
        <CardDescription>
          {similarCases.length} similar {legalArea} case{similarCases.length !== 1 ? 's' : ''} analyzed in {state}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {similarCases.map((c) => (
          <div 
            key={c.id} 
            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{c.case_title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{c.county ? `${c.county}, ` : ''}{c.state}</span>
                  <span>•</span>
                  <Scale className="h-3 w-3" />
                  <span>{c.legal_area}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getMeritColor(c.merit_score)}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {c.merit_score}%
                </Badge>
              </div>
            </div>
            {c.similarity && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {c.similarity}% similar
                </Badge>
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Average merit score: {Math.round(similarCases.reduce((sum, c) => sum + c.merit_score, 0) / similarCases.length)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
