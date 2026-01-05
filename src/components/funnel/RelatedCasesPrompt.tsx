import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Scale, Info, FileText } from 'lucide-react';
import { US_STATE_NAMES } from '@/lib/funnels/types';
import { motion, AnimatePresence } from 'framer-motion';

export interface RelatedCase {
  id: string;
  courtName: string;
  state: string;
  county: string;
  docketNumber: string;
  caseType: string;
  relationshipDescription: string;
}

interface RelatedCasesPromptProps {
  relatedCases: RelatedCase[];
  onChange: (cases: RelatedCase[]) => void;
  currentState?: string;
}

const CASE_TYPE_OPTIONS = [
  { value: 'family', label: 'Family Court' },
  { value: 'divorce', label: 'Divorce' },
  { value: 'custody', label: 'Custody / Visitation' },
  { value: 'child-support', label: 'Child Support' },
  { value: 'eviction', label: 'Eviction / Housing' },
  { value: 'small-claims', label: 'Small Claims' },
  { value: 'protection-order', label: 'Protection / Restraining Order' },
  { value: 'cps', label: 'CPS / Child Welfare' },
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'civil', label: 'Civil Case' },
  { value: 'appeal', label: 'Appeal' },
  { value: 'bankruptcy', label: 'Bankruptcy' },
  { value: 'other', label: 'Other' },
];

const createEmptyCase = (): RelatedCase => ({
  id: crypto.randomUUID(),
  courtName: '',
  state: '',
  county: '',
  docketNumber: '',
  caseType: '',
  relationshipDescription: '',
});

export const RelatedCasesPrompt: React.FC<RelatedCasesPromptProps> = ({
  relatedCases,
  onChange,
  currentState,
}) => {
  const addCase = () => {
    const newCase = createEmptyCase();
    if (currentState) {
      newCase.state = currentState;
    }
    onChange([...relatedCases, newCase]);
  };

  const removeCase = (id: string) => {
    onChange(relatedCases.filter(c => c.id !== id));
  };

  const updateCase = (id: string, updates: Partial<RelatedCase>) => {
    onChange(relatedCases.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Why add related court cases?
              </p>
              <p className="text-sm text-muted-foreground">
                Courts often expect filings to reference related cases involving the same parties.
                Adding this information helps ensure your documents are consistent and complete,
                and prevents contradictions or gaps in your filings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Cases List */}
      <AnimatePresence>
        {relatedCases.map((relatedCase, index) => (
          <motion.div
            key={relatedCase.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Related Case #{index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCase(relatedCase.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Court Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`court-${relatedCase.id}`}>Court Name</Label>
                    <Input
                      id={`court-${relatedCase.id}`}
                      placeholder="e.g., Los Angeles Superior Court"
                      value={relatedCase.courtName}
                      onChange={(e) => updateCase(relatedCase.id, { courtName: e.target.value })}
                    />
                  </div>

                  {/* Case Type */}
                  <div className="space-y-2">
                    <Label htmlFor={`type-${relatedCase.id}`}>Case Type</Label>
                    <Select
                      value={relatedCase.caseType}
                      onValueChange={(value) => updateCase(relatedCase.id, { caseType: value })}
                    >
                      <SelectTrigger id={`type-${relatedCase.id}`}>
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CASE_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor={`state-${relatedCase.id}`}>State</Label>
                    <Select
                      value={relatedCase.state}
                      onValueChange={(value) => updateCase(relatedCase.id, { state: value })}
                    >
                      <SelectTrigger id={`state-${relatedCase.id}`}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* County */}
                  <div className="space-y-2">
                    <Label htmlFor={`county-${relatedCase.id}`}>County</Label>
                    <Input
                      id={`county-${relatedCase.id}`}
                      placeholder="e.g., Los Angeles"
                      value={relatedCase.county}
                      onChange={(e) => updateCase(relatedCase.id, { county: e.target.value })}
                    />
                  </div>

                  {/* Docket Number */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`docket-${relatedCase.id}`} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Docket / Case Number
                    </Label>
                    <Input
                      id={`docket-${relatedCase.id}`}
                      placeholder="e.g., 24STFL12345"
                      value={relatedCase.docketNumber}
                      onChange={(e) => updateCase(relatedCase.id, { docketNumber: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      This number appears on court documents and notices
                    </p>
                  </div>
                </div>

                {/* Relationship Description */}
                <div className="space-y-2">
                  <Label htmlFor={`desc-${relatedCase.id}`}>
                    How is this case related? (Optional)
                  </Label>
                  <Textarea
                    id={`desc-${relatedCase.id}`}
                    placeholder="e.g., Prior custody case with same ex-spouse, or related eviction proceeding"
                    value={relatedCase.relationshipDescription}
                    onChange={(e) => updateCase(relatedCase.id, { relationshipDescription: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Case Button */}
      <Button
        variant="outline"
        onClick={addCase}
        className="w-full border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {relatedCases.length === 0 ? 'a' : 'Another'} Related Case
      </Button>

      {/* Summary */}
      {relatedCases.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{relatedCases.length}</Badge>
          <span>related case{relatedCases.length !== 1 ? 's' : ''} will be linked to your primary case</span>
        </div>
      )}
    </div>
  );
};

export default RelatedCasesPrompt;
