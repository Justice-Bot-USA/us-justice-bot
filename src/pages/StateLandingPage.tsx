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

  if (!stateName || !isStateEnabled(stateUpper)) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12 text-center">
          <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">
            We're expanding to all 50 states. Check back soon for {stateCode?.toUpperCase()} legal help.
          </p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `${stateName} Legal Self-Help | Free Court Forms & AI Guidance`;
  const description = `Navigate ${stateName} courts without an attorney. Get free legal forms, AI-powered case analysis, and step-by-step guidance for family law, small claims, housing, employment, and more.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={`https://usjusticebot.com/states/${stateCode?.toLowerCase()}`} />
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
              Free AI-powered tools to help you navigate {stateName} courts. 
              Get the right forms, understand your rights, and file with confidence.
            </p>
          </div>

          {/* What We Offer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { label: 'AI Case Analysis', icon: <Scale className="h-5 w-5" /> },
              { label: 'Court Forms', icon: <ClipboardList className="h-5 w-5" /> },
              { label: 'Step-by-Step Guides', icon: <CheckCircle2 className="h-5 w-5" /> },
              { label: 'Document Generation', icon: <Briefcase className="h-5 w-5" /> },
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
                    <Badge variant="secondary">Free</Badge>
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
                      {funnel.forms.length} forms available
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
              California and New York have full legal centers with fillable court forms. Other states have general information pages for now.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['CA', 'TX', 'NY', 'FL'].filter(s => s !== stateUpper).map((state) => (
                <Button 
                  key={state}
                  variant="outline"
                  onClick={() => navigate(`/states/${state.toLowerCase()}`)}
                >
                  {US_STATE_NAMES[state]}
                </Button>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StateLandingPage;
