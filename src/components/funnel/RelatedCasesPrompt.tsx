import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Scale, Info, FileText, Upload, CheckCircle2, Lightbulb } from 'lucide-react';
import { US_STATE_NAMES, LegalCategory } from '@/lib/funnels/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getSuggestedRelatedCases, 
  RelatedCaseSuggestion,
  ALL_RELATED_CASE_TYPES 
} from '@/lib/relatedCaseSuggestions';

export interface RelatedCase {
  id: string;
  courtName: string;
  state: string;
  county: string;
  docketNumber: string;
  caseType: string;
  relationshipDescription: string;
  /** IDs of uploaded supporting documents */
  supportingUploadIds?: string[];
  /** Whether this was auto-suggested */
  wasSuggested?: boolean;
}

interface RelatedCasesPromptProps {
  relatedCases: RelatedCase[];
  onChange: (cases: RelatedCase[]) => void;
  currentState?: string;
  /** The primary legal area to show relevant suggestions */
  legalArea?: LegalCategory;
  /** Case description for keyword matching */
  caseDescription?: string;
}

const createEmptyCase = (caseType?: string, wasSuggested?: boolean): RelatedCase => ({
  id: crypto.randomUUID(),
  courtName: '',
  state: '',
  county: '',
  docketNumber: '',
  caseType: caseType || '',
  relationshipDescription: '',
  supportingUploadIds: [],
  wasSuggested: wasSuggested || false,
});

export const RelatedCasesPrompt: React.FC<RelatedCasesPromptProps> = ({
  relatedCases,
  onChange,
  currentState,
  legalArea,
  caseDescription,
}) => {
  const [suggestions, setSuggestions] = useState<RelatedCaseSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  // Get suggestions based on legal area and description
  useEffect(() => {
    if (legalArea) {
      const suggested = getSuggestedRelatedCases(legalArea, caseDescription);
      setSuggestions(suggested);
      
      // Mark already-added cases as selected
      const existing = new Set<string>();
      relatedCases.forEach(rc => {
        if (rc.caseType) existing.add(rc.caseType);
      });
      setSelectedSuggestions(existing);
    }
  }, [legalArea, caseDescription, relatedCases]);

  const handleSuggestionToggle = (suggestion: RelatedCaseSuggestion, checked: boolean) => {
    const newSelected = new Set(selectedSuggestions);
    
    if (checked) {
      newSelected.add(suggestion.caseType);
      // Add a new related case entry with this type
      const existingWithType = relatedCases.find(rc => rc.caseType === suggestion.caseType);
      if (!existingWithType) {
        const newCase = createEmptyCase(suggestion.caseType, true);
        if (currentState) newCase.state = currentState;
        onChange([...relatedCases, newCase]);
      }
    } else {
      newSelected.delete(suggestion.caseType);
      // Remove the related case with this type
      onChange(relatedCases.filter(rc => rc.caseType !== suggestion.caseType));
    }
    
    setSelectedSuggestions(newSelected);
  };

  const addCase = () => {
    const newCase = createEmptyCase();
    if (currentState) {
      newCase.state = currentState;
    }
    onChange([...relatedCases, newCase]);
  };

  const removeCase = (id: string) => {
    const caseToRemove = relatedCases.find(c => c.id === id);
    if (caseToRemove?.caseType) {
      // Also uncheck from suggestions
      const newSelected = new Set(selectedSuggestions);
      newSelected.delete(caseToRemove.caseType);
      setSelectedSuggestions(newSelected);
    }
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

      {/* Auto-Suggested Related Cases */}
      {suggestions.length > 0 && (
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Common Related Cases for Your Situation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Many people in your situation also have related cases. Do any of these apply?
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.caseType} 
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
                >
                  <Checkbox
                    id={`suggestion-${suggestion.caseType}`}
                    checked={selectedSuggestions.has(suggestion.caseType)}
                    onCheckedChange={(checked) => handleSuggestionToggle(suggestion, checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`suggestion-${suggestion.caseType}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {suggestion.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                  {selectedSuggestions.has(suggestion.caseType) && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                    {relatedCase.wasSuggested && (
                      <Badge variant="secondary" className="text-xs">Suggested</Badge>
                    )}
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
                        {ALL_RELATED_CASE_TYPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Court Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`court-${relatedCase.id}`}>Court Name (Optional)</Label>
                    <Input
                      id={`court-${relatedCase.id}`}
                      placeholder="e.g., Los Angeles Superior Court"
                      value={relatedCase.courtName}
                      onChange={(e) => updateCase(relatedCase.id, { courtName: e.target.value })}
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor={`state-${relatedCase.id}`}>State (Optional)</Label>
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
                    <Label htmlFor={`county-${relatedCase.id}`}>County (Optional)</Label>
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
                      Docket / Case Number (Optional)
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

                {/* Document Upload Hint */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded-lg">
                  <Upload className="h-4 w-4" />
                  <span>You can upload related court documents in the Evidence step</span>
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
