import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ListChecks, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stateRouteFor } from '@/lib/stateRouting';

interface Props {
  /** State code or name, as the page has it ("CA", "California", "NY"…). */
  state?: string | null;
  /** Legal area or issue, free-form ("housing", "divorce", "eviction"…). */
  area?: string | null;
  className?: string;
}

/** Sends a user from their story to the matching California or New York legal center and form
 *  filler. Renders nothing for other states. */
export default function StateNextSteps({ state, area, className }: Props) {
  const route = stateRouteFor(state, area);
  if (!route) return null;
  return (
    <Card className={`border-primary/30 bg-primary/5 ${className ?? ''}`} data-testid="state-next-steps">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Your next steps in {route.stateName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          See where to file, the fees and deadlines, and the official {route.stateName} forms for your situation. Then fill
          the forms with your answers and download them.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to={route.centerPath}>
              <ListChecks className="h-4 w-4 mr-2" /> {route.stateName} filing steps <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={route.fillPath}>
              <FileText className="h-4 w-4 mr-2" /> Fill {route.stateName} court forms
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
