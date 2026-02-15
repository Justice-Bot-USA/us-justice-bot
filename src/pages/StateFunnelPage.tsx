import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFunnelByRoute, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { FunnelEngine } from '@/components/funnel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { parseStateToolSlug } from '@/lib/stateToolSeo';
import StateToolLandingPage from '@/pages/StateToolLandingPage';

const StateFunnelPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');
  
  // Check for state-tool landing pages (e.g. ohio-warrant-lookup, california-court-forms)
  const stateToolMatch = slug ? parseStateToolSlug(slug) : null;

  // Get funnel config from route
  const route = `/${slug}`;
  const funnelConfig = getFunnelByRoute(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Render state-tool landing page if matched
  if (stateToolMatch) {
    return <StateToolLandingPage />;
  }

  // Handle funnel completion
  const handleComplete = (data: any) => {
    console.log('Funnel completed:', data);
    navigate('/my-cases');
  };

  // Handle funnel exit
  const handleExit = () => {
    navigate('/');
  };

  // Funnel not found
  if (!funnelConfig) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-muted-foreground mb-6">
                This legal help page isn't available yet. We're expanding to all 50 states soon.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => navigate('/')}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { seo } = funnelConfig;
  const stateName = US_STATE_NAMES[funnelConfig.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[funnelConfig.legalArea];

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />

        {/* Canonical */}
        <link rel="canonical" href={`https://justicebot-usa.com${route}`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": `US Justice Bot - ${stateName} ${legalAreaName}`,
            "description": seo.description,
            "areaServed": {
              "@type": "State",
              "name": stateName,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              }
            },
            "serviceType": legalAreaName,
            "provider": {
              "@type": "Organization",
              "name": "US Justice Bot",
              "url": "https://usjusticebot.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header language={language} onLanguageChange={setLanguage} />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* SEO Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{seo.h1}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free self-help tools for {legalAreaName.toLowerCase()} in {stateName}. 
              Get the right forms, understand your rights, and navigate the legal process.
            </p>
          </div>

          {/* Funnel Engine */}
          <FunnelEngine 
            config={funnelConfig}
            onComplete={handleComplete}
            onExit={handleExit}
          />

          {/* Additional SEO Content */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              About {legalAreaName} in {stateName}
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                {stateName} has specific laws and procedures for {legalAreaName.toLowerCase()} matters. 
                Our AI-powered platform helps you understand your rights, find the correct court forms, 
                and navigate the legal process step by step.
              </p>
              <h3>What You'll Get</h3>
              <ul>
                <li>AI-powered case analysis specific to {stateName} law</li>
                <li>Recommended court forms for your situation</li>
                <li>Step-by-step guidance through the filing process</li>
                <li>Document generation with your case details pre-filled</li>
                <li>Next steps and court filing instructions</li>
              </ul>
              <h3>Disclaimer</h3>
              <p>
                US Justice Bot provides self-help legal information and tools. 
                We are not a law firm and do not provide legal advice. 
                For complex matters, consider consulting with a licensed {stateName} attorney.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StateFunnelPage;
