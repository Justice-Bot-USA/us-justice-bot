import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Search } from 'lucide-react';

interface LookupActionCTAProps {
  onPrepareClick: () => void;
  state?: string;
}

const LookupActionCTA: React.FC<LookupActionCTAProps> = ({ onPrepareClick, state }) => (
  <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 mt-8">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-1">Ready to take action?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Use your lookup results to prepare the right filing for your situation.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onPrepareClick} className="gap-2">
          <FileText className="h-4 w-4" />
          Prepare an official filing packet ($9.99)
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" asChild>
          <a href="/court-records">
            <Search className="h-4 w-4 mr-2" />
            Find the right court/agency (free)
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Not legal advice. You file it yourself.
      </p>
    </CardContent>
  </Card>
);

export default LookupActionCTA;
