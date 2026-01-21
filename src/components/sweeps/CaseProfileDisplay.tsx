import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Scale, 
  FileText, 
  Clock, 
  Gavel, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react';
import { CaseProfile } from '@/lib/sweeps/types';
import { cn } from '@/lib/utils';

interface CaseProfileDisplayProps {
  profile: CaseProfile;
}

export const CaseProfileDisplay: React.FC<CaseProfileDisplayProps> = ({ profile }) => {
  const getMeritScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const analysis = profile.analysisReport;

  return (
    <div className="space-y-6">
      {/* Header with Merit Score */}
      {analysis && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold",
                  getMeritScoreColor(analysis.meritScore)
                )}>
                  {analysis.meritScore}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Case Merit Score</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {analysis.meritScoreJustification?.slice(0, 150)}...
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.classification && (
                  <Badge variant="outline" className="text-sm">
                    <Scale className="h-3 w-3 mr-1" />
                    {profile.classification.primaryCategory}
                  </Badge>
                )}
                {profile.venue && (
                  <Badge variant="outline" className="text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.venue.jurisdiction?.state}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {analysis.estimatedSuccessRate}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              {analysis.settlementRange && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${(analysis.settlementRange.likely / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-muted-foreground">Est. Settlement</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {analysis.timeToResolution?.maxMonths || '?'}
                </p>
                <p className="text-xs text-muted-foreground">Months to Resolve</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {analysis.requiredForms?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Forms Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="precedents">Precedents</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        {/* Claims Tab */}
        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Strongest Claims & Weakest Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Strongest Claims
                  </h4>
                  {analysis?.strongestClaims?.map((claim, i) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-medium text-sm">{claim.claim}</p>
                      <p className="text-xs text-muted-foreground mt-1">{claim.legalBasis}</p>
                      {claim.evidenceReferences?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {claim.evidenceReferences.map((ref, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              Doc {j + 1}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <h4 className="font-medium text-red-700 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Weakest Points
                  </h4>
                  {analysis?.weakestPoints?.map((point, i) => (
                    <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="font-medium text-sm">{point.issue}</p>
                      <p className="text-xs text-muted-foreground mt-1">{point.impact}</p>
                      {point.mitigation && (
                        <p className="text-xs text-green-700 mt-2">
                          💡 {point.mitigation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Case Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  {profile.timeline?.events?.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative pl-10 pb-6"
                    >
                      <div className={cn(
                        "absolute left-2 w-5 h-5 rounded-full border-2 border-background",
                        event.importance === 'critical' && "bg-red-500",
                        event.importance === 'high' && "bg-orange-500",
                        event.importance === 'medium' && "bg-yellow-500",
                        event.importance === 'low' && "bg-green-500"
                      )} />
                      <div className="bg-card p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {event.date}
                          </Badge>
                          <Badge 
                            variant={event.importance === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {event.importance}
                          </Badge>
                        </div>
                        <p className="font-medium mt-2">{event.description}</p>
                        {event.legalSignificance && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ⚖️ {event.legalSignificance}
                          </p>
                        )}
                        {event.source?.quote && (
                          <p className="text-xs italic text-muted-foreground mt-1 border-l-2 pl-2">
                            "{event.source.quote}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Evidence Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.evidenceIndex?.items?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No documents uploaded yet
                </p>
              ) : (
                <div className="space-y-4">
                  {profile.evidenceIndex?.items?.map((item, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.filename}</p>
                          <Badge variant="outline" className="mt-1">
                            {item.docType}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            Relevance: {Math.round(item.relevanceScore * 100)}%
                          </p>
                          {item.credibility?.isOfficial && (
                            <Badge className="mt-1 bg-green-500">Official</Badge>
                          )}
                        </div>
                      </div>
                      {item.entities?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.entities.map((entity, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {entity.type}: {entity.value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Evidence Gaps */}
                  {profile.evidenceIndex?.gapsIdentified?.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        Missing Evidence
                      </h4>
                      <ul className="list-disc list-inside mt-2 text-sm text-yellow-700">
                        {profile.evidenceIndex.gapsIdentified.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Precedents Tab */}
        <TabsContent value="precedents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Legal Precedents & Authorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Case Law */}
                {profile.authoritySweep?.results?.map((result, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-lg border",
                    result.outcome === 'favorable' && "bg-green-50 border-green-200",
                    result.outcome === 'unfavorable' && "bg-red-50 border-red-200",
                    result.outcome === 'mixed' && "bg-yellow-50 border-yellow-200"
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{result.caseName}</p>
                        <p className="text-xs text-muted-foreground">{result.citation}</p>
                      </div>
                      <Badge variant={
                        result.outcome === 'favorable' ? 'default' : 
                        result.outcome === 'unfavorable' ? 'destructive' : 'secondary'
                      }>
                        {result.outcome}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">{result.howItApplies}</p>
                    {result.holdings?.length > 0 && (
                      <ul className="list-disc list-inside mt-2 text-xs text-muted-foreground">
                        {result.holdings.slice(0, 2).map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Statutes */}
                {profile.authoritySweep?.statutes?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Applicable Statutes</h4>
                    {profile.authoritySweep.statutes.map((statute, i) => (
                      <div key={i} className="p-3 bg-muted rounded-lg mb-2">
                        <p className="font-medium text-sm">{statute.title}</p>
                        <p className="text-xs text-muted-foreground">{statute.citation}</p>
                        <p className="text-sm mt-1">{statute.relevance}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="next-steps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Steps & Required Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Immediate Actions */}
                <div>
                  <h4 className="font-medium mb-3">Immediate Actions</h4>
                  <div className="space-y-2">
                    {analysis?.nextSteps?.filter(s => s.priority === 'immediate').map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {step.step}
                        </div>
                        <div>
                          <p className="font-medium">{step.action}</p>
                          {step.deadline && (
                            <p className="text-xs text-destructive mt-1">⏰ Deadline: {step.deadline}</p>
                          )}
                          {step.details && (
                            <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Forms */}
                <div>
                  <h4 className="font-medium mb-3">Required Court Forms</h4>
                  <div className="grid gap-3">
                    {analysis?.requiredForms?.map((form, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{form.formName}</p>
                            <p className="text-xs text-muted-foreground">{form.formNumber}</p>
                          </div>
                          <div className="text-right">
                            {form.fee && (
                              <Badge variant="outline">
                                <DollarSign className="h-3 w-3" />
                                {form.fee}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{form.purpose}</p>
                        {form.url && (
                          <a 
                            href={form.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-2 inline-block"
                          >
                            Download Form →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Warnings */}
                {analysis?.riskWarnings?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Warnings
                    </h4>
                    <div className="space-y-2">
                      {analysis.riskWarnings.map((risk, i) => (
                        <div key={i} className={cn(
                          "p-3 rounded-lg border",
                          risk.severity === 'critical' && "bg-red-100 border-red-300",
                          risk.severity === 'high' && "bg-orange-100 border-orange-300",
                          risk.severity === 'medium' && "bg-yellow-100 border-yellow-300"
                        )}>
                          <p className="font-medium text-sm">{risk.risk}</p>
                          {risk.mitigation && (
                            <p className="text-xs mt-1">💡 {risk.mitigation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
