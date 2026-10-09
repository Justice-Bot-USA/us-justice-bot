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
  MapPin,
  Info,
  ExternalLink
} from 'lucide-react';
import { CaseProfile } from '@/lib/sweeps/types';
import { cn } from '@/lib/utils';

interface CaseProfileDisplayProps {
  profile: CaseProfile;
}

export const CaseProfileDisplay: React.FC<CaseProfileDisplayProps> = ({ profile }) => {
  const analysis = profile.analysisReport;
  const summary = analysis?.summary || profile.intake?.issueSummary;
  const state = profile.venue?.jurisdiction?.state || profile.intake?.locationHints?.state;

  return (
    <div className="space-y-6">
      {/* Plain-language summary of what the user told us */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">A summary of your situation</h2>
            <div className="flex flex-wrap gap-2">
              {profile.classification && (
                <Badge variant="outline" className="text-sm">
                  <Scale className="h-3 w-3 mr-1" />
                  {profile.classification.primaryCategory}
                </Badge>
              )}
              {state && (
                <Badge variant="outline" className="text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {state}
                </Badge>
              )}
            </div>
          </div>

          {summary ? (
            <p className="text-sm leading-relaxed">{summary}</p>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{profile.userStory}</p>
          )}

          {analysis?.generalInfo && analysis.generalInfo.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                General information{analysis.legalArea ? ` about ${analysis.legalArea.toLowerCase()} matters` : ''}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {analysis.generalInfo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis?.officialSources && analysis.officialSources.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-medium text-sm mb-2">Official sources</h3>
              <ul className="space-y-1 text-sm">
                {analysis.officialSources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {src.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-4 border-t">
            This is general legal information, not legal advice. It is not a prediction of how your matter will turn out. Talk to a lawyer or a free legal aid organization about your situation.
          </p>
        </CardContent>
      </Card>

      {/* Your own facts and uploads */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evidence">Your Documents</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline of what you told us
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
                Your Documents
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
                        {item.credibility?.isOfficial && (
                          <Badge variant="secondary">Official document</Badge>
                        )}
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};
