import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TriageQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    next?: string; // next question id or 'result'
    result_key?: string; // which result track to show
  }[];
}

interface TriageResult {
  key: string;
  title: string;
  description: string;
  track: string;
  recommended_forms: string[];
  checklist: string[];
  is_emergency?: boolean;
}

interface TriageWizardProps {
  flowSchema: {
    questions: TriageQuestion[];
    results: TriageResult[];
  };
  onComplete?: (result: TriageResult) => void;
}

export function TriageWizard({ flowSchema, onComplete }: TriageWizardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionId, setCurrentQuestionId] = useState(flowSchema.questions[0]?.id || '');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const currentQuestion = flowSchema.questions.find(q => q.id === currentQuestionId);

  const handleAnswer = (option: TriageQuestion['options'][0]) => {
    setAnswers(prev => ({ ...prev, [currentQuestionId]: option.value }));
    setHistory(prev => [...prev, currentQuestionId]);

    if (option.result_key) {
      const res = flowSchema.results.find(r => r.key === option.result_key);
      if (res) {
        setResult(res);
        onComplete?.(res);
      }
    } else if (option.next) {
      setCurrentQuestionId(option.next);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    const prev = history[history.length - 1];
    if (prev) {
      setHistory(h => h.slice(0, -1));
      setCurrentQuestionId(prev);
    }
  };

  if (result) {
    return (
      <Card className={result.is_emergency ? 'border-destructive' : 'border-primary/30'}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {result.is_emergency ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
            <CardTitle className="text-lg">{result.title}</CardTitle>
          </div>
          <Badge variant={result.is_emergency ? 'destructive' : 'secondary'}>{result.track}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{result.description}</p>

          {result.recommended_forms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Forms commonly used for this kind of matter</h4>
              <p className="text-xs text-muted-foreground mb-2">
                General information, not a choice of forms for you. Check with the court self-help center which apply to you.
              </p>
              <ul className="space-y-1">
                {result.recommended_forms.map(f => (
                  <li key={f} className="text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.checklist.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Next Steps Checklist</h4>
              <ul className="space-y-1">
                {result.checklist.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleBack} className="gap-1">
            <ArrowLeft className="h-3 w-3" /> Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  const stepIndex = history.length;
  const totalSteps = flowSchema.questions.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Find Your Path</CardTitle>
          <span className="text-xs text-muted-foreground">
            Question {stepIndex + 1}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-foreground">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.options.map(opt => (
            <Button
              key={opt.value}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleAnswer(opt)}
            >
              <ArrowRight className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
              {opt.label}
            </Button>
          ))}
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
            <ArrowLeft className="h-3 w-3" /> Back
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
