import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LegalCategory, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { stateRouteFor } from '@/lib/stateRouting';

interface StateComingSoonProps {
  /** Full state name, e.g. "Texas". Omit when the state is unknown. */
  stateName?: string;
  /** Legal area, used to open the California and New York legal centers on the matching tab. */
  legalArea?: LegalCategory;
  /** Heading element: h1 when this is the whole page, h2 inside another page. */
  headingLevel?: 'h1' | 'h2';
}

/**
 * Shown instead of the funnel, the paywall and checkout for every state except California
 * and New York. Nothing is sold here: it only says the state is coming soon and links to the
 * two live legal centers.
 */
export const StateComingSoon: React.FC<StateComingSoonProps> = ({ stateName, legalArea, headingLevel = 'h2' }) => {
  const Heading = headingLevel;
  const where = stateName || 'Your state';
  const areaName = legalArea ? LEGAL_AREA_NAMES[legalArea] : undefined;
  const caPath = stateRouteFor('CA', legalArea)?.centerPath ?? '/ca/legal-center';
  const nyPath = stateRouteFor('NY', legalArea)?.centerPath ?? '/ny/legal-center';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 text-center space-y-4">
        <Badge variant="secondary">Coming soon</Badge>
        <Heading className="text-2xl md:text-3xl font-bold">
          {areaName ? `${areaName} help in ${where} is coming soon` : `${where} is coming soon`}
        </Heading>
        <p className="text-muted-foreground">
          Justice Bot USA is live in California and New York. {stateName ? `${stateName} and the other states are` : 'Other states are'} coming
          soon. Until then we have no forms, filling instructions or paid plan for {stateName || 'other states'}, so
          there is nothing to sign up for or buy here.
        </p>
        <p className="text-muted-foreground">
          If your case is in a California or New York court, start at that state's legal center:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to={caPath}>California legal center</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={nyPath}>New York legal center</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          For a case in {stateName || 'another state'}, the court's self-help center or a local legal aid office can help.
        </p>
        <p className="text-xs text-muted-foreground">
          Justice Bot USA gives legal information, not legal advice.
        </p>
      </CardContent>
    </Card>
  );
};
