import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Heart, 
  DollarSign, 
  Briefcase, 
  Home, 
  Shield, 
  Baby, 
  Users, 
  HandHeart,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { 
  getFunnelsForState, 
  US_STATE_NAMES, 
  LEGAL_AREA_NAMES, 
  isStateEnabled,
  LegalCategory 
} from '@/lib/funnels';
import { StateComingSoon } from '@/components/funnel/StateComingSoon';
import { stateRouteFor } from '@/lib/stateRouting';

const BASE_URL = 'https://justicebot-usa.com';

const LEGAL_AREA_ICONS: Record<LegalCategory, React.ReactNode> = {
  'family': <Heart className="h-6 w-6" />,
  'small-claims': <DollarSign className="h-6 w-6" />,
  'employment': <Briefcase className="h-6 w-6" />,
  'housing': <Home className="h-6 w-6" />,
  'criminal': <Shield className="h-6 w-6" />,
  'cps': <Baby className="h-6 w-6" />,
  'workers-rights': <Users className="h-6 w-6" />,
  'human-rights': <HandHeart className="h-6 w-6" />,
  'agency-complaints': <ClipboardList className="h-6 w-6" />,
  'personal-injury': <Scale className="h-6 w-6" />,
  'immigration': <MapPin className="h-6 w-6" />,
  'bankruptcy': <DollarSign className="h-6 w-6" />,
  'consumer-protection': <Shield className="h-6 w-6" />,
};

const StateLandingPage: React.FC = () => {
  const { stateCode } = useParams<{ stateCode: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');
  
  const stateUpper = stateCode?.toUpperCase() || '';
  const stateName = US_STATE_NAMES[stateUpper];
  const funnels = getFunnelsForState(stateUpper);

  // Unknown state code: say so plainly.
  if (!stateName) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Page Not Found | Justice Bot USA</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12 text-center">
          <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this page. Justice Bot USA is live in California and New York; other states are coming soon.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild>
              <Link to="/ca/legal-center">California legal center</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/ny/legal-center">New York legal center</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // The 48 states (and DC) that have not launched: coming soon, nothing to sign up for or buy.
  if (!isStateEnabled(stateUpper)) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{`${stateName} Legal Help: Coming Soon | Justice Bot USA`}</title>
          <meta name="description" content={`Justice Bot USA is live in California and New York. ${stateName} is coming soon.`} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12">
          <StateComingSoon stateName={stateName} headingLevel="h1" />
        </main>
        <Footer />
      </div>
    );
  }

  const centerPath = stateRouteFor(stateUpper)?.centerPath;
  const otherLaunched = stateUpper === 'CA' ? 'NY' : 'CA';

  const title = `${stateName} Legal Self-Help | Court Forms & AI Guidance`;
  const description = `Legal information for self-represented people in ${stateName} courts: official court forms with filling instructions, a plain-language summary of your situation, and step-by-step guidance. Not legal advice.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={`${BASE_URL}/states/${stateCode?.toLowerCase()}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header language={language} onLanguageChange={setLanguage} />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {stateName}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {stateName} Legal Self-Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered tools to help you navigate {stateName} courts. Find the official forms, learn your rights,
              and prepare to file on your own. Legal information, not legal advice.
            </p>
            {centerPath && (
              <Button asChild size="lg" className="mt-6">
                <Link to={centerPath}>
                  Open the {stateName} legal center <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>

          {/* What We Offer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { label: 'Plain-Language Summary', icon: <Scale className="h-5 w-5" /> },
              { label: 'Official Court Forms', icon: <ClipboardList className="h-5 w-5" /> },
              { label: 'Filling Instructions', icon: <CheckCircle2 className="h-5 w-5" /> },
              { label: 'You Fill In Official Forms', icon: <Briefcase className="h-5 w-5" /> },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="p-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legal Areas Grid */}
          <h2 className="text-2xl font-semibold text-center mb-6">
            Choose Your Legal Issue
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {funnels.map((funnel) => (
              <Card 
                key={funnel.id}
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(funnel.entryPoint)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {LEGAL_AREA_ICONS[funnel.legalArea]}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3">
                    {LEGAL_AREA_NAMES[funnel.legalArea]}
                  </CardTitle>
                  <CardDescription>
                    {funnel.seo.description.slice(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {funnel.forms.length > 0 ? 'Common official forms' : 'General information'}
                    </span>
                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      Start <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other States CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">Not in {stateName}?</h3>
            <p className="text-muted-foreground mb-6">
              Justice Bot USA is live in California and New York. Other states are coming soon.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate(`/states/${otherLaunched.toLowerCase()}`)}
              >
                {US_STATE_NAMES[otherLaunched]}
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StateLandingPage;
