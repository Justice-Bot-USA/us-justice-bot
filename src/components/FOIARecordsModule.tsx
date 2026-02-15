import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  ArrowRight,
  ShieldAlert,
  Info,
  Lock,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

const REQUESTABLE_RECORDS = [
  'Arrest reports',
  'Warrant returns (after execution)',
  'Probable cause affidavits (if unsealed)',
  'Incident reports',
  'Booking / jail intake records',
  'Court administrative records',
];

interface FOIARecordsModuleProps {
  onGenerateClick: () => void;
  onBundleClick?: () => void;
  state?: string;
}

const FOIARecordsModule: React.FC<FOIARecordsModuleProps> = ({
  onGenerateClick,
  onBundleClick,
  state,
}) => (
  <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 mt-8">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">Request Official Records</CardTitle>
        <Badge variant="secondary" className="text-[10px]">
          FOIA / Public Records
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      {/* Conversion copy — use exactly as specified */}
      <div className="bg-background/60 rounded-lg p-4 border border-primary/20">
        <h3 className="text-base font-semibold mb-1">Want the official paperwork?</h3>
        <p className="text-sm text-muted-foreground">
          You may be able to request the arrest report or court records related
          to this warrant.
        </p>
      </div>

      {/* Plain-language explanation of what records may exist */}
      <div>
        <h4 className="text-sm font-medium mb-2">
          Records you may be able to request:
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {REQUESTABLE_RECORDS.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Warning: some records may be sealed or unavailable */}
      <Alert className="border-destructive/40 bg-destructive/5">
        <ShieldAlert className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-xs">
          <strong>Some records may be sealed or unavailable.</strong> Active warrant
          details, juvenile records, and certain investigative files are
          typically not available through public records requests.
        </AlertDescription>
      </Alert>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onGenerateClick} size="lg" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Public Records Request — $9.99
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Pricing tiers */}
      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <Lock className="h-3 w-3" />
            Single request (PDF export) — $9.99
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <Lock className="h-3 w-3" />
            Bundle (request + follow-up + appeal template) — $29.99
          </span>
        </div>
      </div>

      {/* Free features */}
      <div className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Free:</span>{' '}
        Warrant lookup • Educational explanations • Agency discovery
      </div>

      {/* Required disclaimers — must be visible */}
      <div className="border-t pt-3 space-y-1">
        <p className="text-[11px] text-muted-foreground flex items-start gap-1 font-medium">
          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-destructive" />
          This does not check for active warrants. It helps you request public
          records.
        </p>
        <p className="text-[11px] text-muted-foreground">
          • This tool does not provide legal advice.
        </p>
        <p className="text-[11px] text-muted-foreground">
          • We do not access law enforcement databases.
        </p>
        <p className="text-[11px] text-muted-foreground">
          • We do not determine whether an active warrant exists.
        </p>
        <p className="text-[11px] text-muted-foreground">
          • Users submit requests themselves.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default FOIARecordsModule;
