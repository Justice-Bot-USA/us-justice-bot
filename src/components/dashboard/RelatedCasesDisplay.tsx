import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, MapPin, Building2 } from 'lucide-react';
import { useRelatedCases, RelatedCaseReference } from '@/hooks/useRelatedCases';
import { US_STATE_NAMES } from '@/lib/funnels/types';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedCasesDisplayProps {
  caseId: string;
  className?: string;
}

const CASE_TYPE_LABELS: Record<string, string> = {
  family: 'Family Court',
  divorce: 'Divorce',
  custody: 'Custody / Visitation',
  'child-support': 'Child Support',
  eviction: 'Eviction / Housing',
  'small-claims': 'Small Claims',
  'protection-order': 'Protection Order',
  cps: 'CPS / Child Welfare',
  criminal: 'Criminal Case',
  civil: 'Civil Case',
  appeal: 'Appeal',
  bankruptcy: 'Bankruptcy',
  other: 'Other',
};

export const RelatedCasesDisplay: React.FC<RelatedCasesDisplayProps> = ({
  caseId,
  className,
}) => {
  const { relatedCases, isLoading } = useRelatedCases(caseId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Related Court Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedCases.length === 0) {
    return null; // Don't show anything if no related cases
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Related Court Cases
          </CardTitle>
          <Badge variant="secondary">{relatedCases.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relatedCases.map((relatedCase) => (
            <div
              key={relatedCase.id}
              className="p-3 bg-muted rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {relatedCase.courtName && (
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{relatedCase.courtName}</span>
                    </div>
                  )}
                  {relatedCase.docketNumber && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="font-mono">{relatedCase.docketNumber}</span>
                    </div>
                  )}
                </div>
                {relatedCase.caseType && (
                  <Badge variant="outline" className="flex-shrink-0">
                    {CASE_TYPE_LABELS[relatedCase.caseType] || relatedCase.caseType}
                  </Badge>
                )}
              </div>
              
              {(relatedCase.state || relatedCase.county) && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span>
                    {relatedCase.county && `${relatedCase.county}, `}
                    {US_STATE_NAMES[relatedCase.state] || relatedCase.state}
                  </span>
                </div>
              )}
              
              {relatedCase.relationshipDescription && (
                <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                  {relatedCase.relationshipDescription}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          These related cases will be referenced in your generated documents where applicable.
        </p>
      </CardContent>
    </Card>
  );
};

export default RelatedCasesDisplay;
