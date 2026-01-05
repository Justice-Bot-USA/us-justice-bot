import { useState } from 'react';
import { Case, CaseStatus, CaseTimelineEvent } from '@/hooks/useCases';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CaseStatusBadge } from './CaseStatusBadge';
import { CaseTimeline } from './CaseTimeline';
import { CaseNotes } from './CaseNotes';
import { RelatedCasesDisplay } from './RelatedCasesDisplay';
import { DocumentExportButton } from '@/components/export/DocumentExportButton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Scale, 
  Archive, 
  RotateCcw,
  ExternalLink,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseCardProps {
  caseData: Case;
  timelineEvents: CaseTimelineEvent[];
  loadingTimeline: boolean;
  onStatusChange: (status: CaseStatus) => Promise<void>;
  onNotesChange: (notes: string) => Promise<void>;
  onArchive: () => Promise<void>;
  onRestore?: () => Promise<void>;
  isArchived?: boolean;
}

const statusOptions: { value: CaseStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'filed', label: 'Filed' },
  { value: 'resolved', label: 'Resolved' },
];

export function CaseCard({
  caseData,
  timelineEvents,
  loadingTimeline,
  onStatusChange,
  onNotesChange,
  onArchive,
  onRestore,
  isArchived
}: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getMeritScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CaseStatusBadge status={caseData.status as CaseStatus} />
                <span className="text-xs text-muted-foreground">
                  {format(new Date(caseData.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold truncate">
                {caseData.case_title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {caseData.state}{caseData.county ? `, ${caseData.county}` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" />
                  {caseData.legal_area}
                </span>
                <span className={`flex items-center gap-1 font-medium ${getMeritScoreColor(caseData.merit_score)}`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  {caseData.merit_score}% Merit
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DocumentExportButton caseData={caseData} size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/case-journey?caseId=${caseData.id}`)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 border-t">
            <div className="grid gap-6 pt-4 lg:grid-cols-2">
              {/* Left Column - Status & Notes */}
              <div className="space-y-4">
                {/* Status Selector */}
                {!isArchived && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Update Status
                    </label>
                    <Select
                      value={caseData.status || 'pending'}
                      onValueChange={(value) => onStatusChange(value as CaseStatus)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Notes */}
                <CaseNotes
                  notes={caseData.notes}
                  onSave={onNotesChange}
                  disabled={isArchived}
                />

                {/* Archive/Restore Button */}
                <div className="pt-2">
                  {isArchived ? (
                    <Button
                      variant="outline"
                      onClick={onRestore}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore Case
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={onArchive}
                      className="w-full text-muted-foreground hover:text-destructive hover:border-destructive"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Case
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column - Timeline */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Case Timeline
                </h4>
                <CaseTimeline events={timelineEvents} loading={loadingTimeline} />
              </div>
            </div>

            {/* Case Description */}
            {caseData.case_description && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {caseData.case_description}
                </p>
              </div>
            )}

            {/* Related Cases */}
            <RelatedCasesDisplay caseId={caseData.id} className="mt-4" />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
