import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Nothing is sold any more: every court form, form guide and the public records letter PDF is free, and
// the monthly plan is paused. This page only catches old checkout redirects (/payment-success?session_id=...).
const PaymentSuccess: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Thank You | Justice Bot USA</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
            <h1 className="text-2xl md:text-3xl font-bold">Thanks, there's nothing else to do</h1>
            <p className="text-muted-foreground">
              Every form and form guide on Justice Bot USA is free, so you don't need a plan. The California and New
              York forms we support can be filled in online and downloaded.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/fill/ca">California forms</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/fill/ny">New York forms</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/my-cases">My Cases</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Questions about a charge? <Link to="/support" className="text-primary underline">Contact support</Link>.
            </p>
            <p className="text-xs text-muted-foreground">
              Legal information, not legal advice. Our content has not yet been reviewed by a licensed attorney.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
