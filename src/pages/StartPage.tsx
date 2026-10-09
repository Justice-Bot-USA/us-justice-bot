import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Compass, FileSearch, FileText, Building2, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import StatePicker from "@/components/StatePicker";
import EnhancedSEO from "@/components/EnhancedSEO";
import brandLogo from "@/assets/ai-anal-logo.png";
import { useState } from "react";

// GA4 journey_start event
const trackJourneyStart = (journeyType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'journey_start', {
      journey_type: journeyType,
      country: 'US',
    });
    console.log('[GA4] journey_start:', { journeyType });
  }
};

const journeys = [
  {
    icon: Compass,
    emoji: "🧭",
    title: "Understand My Situation",
    description: "For users who are confused, overwhelmed, or unsure where to begin. Get plain-language clarity on your legal or administrative issue.",
    cta: "Get clarity",
    href: "/case-analysis",
    journeyType: "understand",
  },
  {
    icon: FileSearch,
    emoji: "📄",
    title: "Request Official Records",
    description: "You know records exist but don't know how to get them. We'll guide you through the FOIA or public-records request process for your state.",
    cta: "Request records",
    href: "/foia-request-generator",
    journeyType: "records",
  },
  {
    icon: FileText,
    emoji: "✍️",
    title: "Prepare Documents or Letters",
    description: "Need paperwork help? Select your document type, fill in guided inputs, preview, and export — step by step.",
    cta: "Prepare documents",
    href: "/forms-library",
    journeyType: "documents",
  },
  {
    icon: Building2,
    emoji: "🏛",
    title: "Navigate a Court or Agency Process",
    description: "Dealing with courts, hearings, or agencies? Get step-by-step procedural guidance on what happens first, next, and later.",
    cta: "See the process",
    href: "#choose-state",
    journeyType: "process",
  },
  {
    icon: GraduationCap,
    emoji: "📘",
    title: "Learn My Options",
    description: "Not ready to act? Explore educational pathways to understand what you can do — without legal advice or pressure.",
    cta: "Learn my options",
    href: "/ai-tools",
    journeyType: "options",
  },
];

const StartPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const handleCardClick = (journey: typeof journeys[0]) => {
    trackJourneyStart(journey.journeyType);
    if (journey.href.startsWith('#')) {
      document.getElementById(journey.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(journey.href);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Start Your Legal Journey — Justice Bot USA",
    description: "Choose your path: understand your situation, request records, prepare documents, navigate court processes, or learn your options.",
    url: "https://justicebot-usa.com/start",
    isPartOf: {
      "@type": "WebSite",
      name: "Justice Bot USA",
      url: "https://justicebot-usa.com",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Start Your Legal Journey | Justice Bot USA — Powered by Justice Bot USA"
        description="Choose where to start: understand your legal situation, request official records, prepare documents, navigate court processes, or learn your options. Informational guidance only."
        keywords="legal journey, legal guidance, FOIA request, court process, self-represented, legal information, document preparation"
        url="https://justicebot-usa.com/start"
      />
      <EnhancedSEO
        title="Start Your Legal Journey | Justice Bot USA"
        description="Step-by-step legal guidance for self-represented individuals. Choose your path and get started immediately."
        canonicalUrl="https://justicebot-usa.com/start"
        structuredData={structuredData}
      />

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={brandLogo} alt="Justice Bot USA" className="w-16 h-16 mx-auto rounded-full bg-white p-1.5 shadow-lg mb-6" />
        </div>

        {/* H1 */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Start Your Legal Journey — Step by Step
        </h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          You don't need to know the right form or process yet. Justice Bot USA helps you start in the right place and guides you forward — clearly, lawfully, and at your pace.
        </p>

        {/* Primary Question */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          What do you need help with right now?
        </h2>

        {/* Journey Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {journeys.map((journey, i) => (
            <Card
              key={i}
              className="cursor-pointer group hover:shadow-lg hover:border-primary/40 transition-all flex flex-col"
              onClick={() => handleCardClick(journey)}
            >
              <CardHeader className="flex-1">
                <div className="text-3xl mb-2">{journey.emoji}</div>
                <CardTitle className="text-lg">{journey.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  {journey.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(journey);
                  }}
                >
                  {journey.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <StatePicker className="mb-16" />

        {/* Footer Note */}
        <div className="text-center border-t pt-8">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Justice Bot USA provides informational guidance only. We do not provide legal advice, legal representation, or access law-enforcement systems.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StartPage;
