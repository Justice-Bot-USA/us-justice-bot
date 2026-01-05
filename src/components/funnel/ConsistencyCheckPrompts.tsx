import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { ConsistencyCheck } from '@/lib/relatedCaseSuggestions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ConsistencyCheckAnswer {
  checkId: string;
  answer: 'yes' | 'no' | 'unsure';
}

interface ConsistencyCheckPromptsProps {
  checks: ConsistencyCheck[];
  answers: ConsistencyCheckAnswer[];
  onAnswerChange: (checkId: string, answer: 'yes' | 'no' | 'unsure') => void;
}

export const ConsistencyCheckPrompts: React.FC<ConsistencyCheckPromptsProps> = ({
  checks,
  answers,
  onAnswerChange,
}) => {
  if (checks.length === 0) return null;

  const getAnswer = (checkId: string): string | undefined => {
    return answers.find(a => a.checkId === checkId)?.answer;
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-foreground">
            To keep your filing accurate, please confirm:
          </span>
        </div>

        <AnimatePresence>
          {checks.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="space-y-2 p-3 bg-background rounded-lg border"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium flex-1">{check.question}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-[250px]">
                      <p className="text-sm">{check.helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <RadioGroup
                value={getAnswer(check.id)}
                onValueChange={(value) => onAnswerChange(check.id, value as 'yes' | 'no' | 'unsure')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${check.id}-yes`} />
                  <Label htmlFor={`${check.id}-yes`} className="cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${check.id}-no`} />
                  <Label htmlFor={`${check.id}-no`} className="cursor-pointer text-sm">
                    No
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id={`${check.id}-unsure`} />
                  <Label htmlFor={`${check.id}-unsure`} className="cursor-pointer text-sm">
                    Not sure
                  </Label>
                </div>
              </RadioGroup>

              {getAnswer(check.id) === 'yes' && check.suggestedCaseTypes.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <span>Consider adding:</span>
                  {check.suggestedCaseTypes.slice(0, 2).map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ConsistencyCheckPrompts;
