import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LIVE_STATES = [
  { name: 'California', path: '/ca/legal-center', blurb: 'Eviction, small claims, divorce, family, record clearing, workplace, civil rights.' },
  { name: 'New York', path: '/ny/legal-center', blurb: 'Housing court, small claims, divorce, family, CPS, immigration, workplace, human rights.' },
];

/** Entry point into the state legal centers: filing steps, official forms and form filling. */
export default function StatePicker({ className }: { className?: string }) {
  return (
    <section id="choose-state" className={className}>
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">Pick your state</h2>
      <p className="text-center text-muted-foreground mb-6">
        Filing steps, deadlines, official court forms and form filling. Live in California and New York; the other
        48 states are coming soon.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {LIVE_STATES.map((s) => (
          <Link key={s.path} to={s.path} className="group">
            <Card className="h-full hover:shadow-lg hover:border-primary/40 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> {s.name}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{s.blurb}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
