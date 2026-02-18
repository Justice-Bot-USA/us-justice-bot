import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import StartHero from "@/components/StartHero";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { useState } from "react";

// New homepage sections
import PlatformExplainer from "@/components/homepage/PlatformExplainer";
import GuidancePathways from "@/components/homepage/GuidancePathways";
import JusticeBotExplainer from "@/components/homepage/JusticeBotExplainer";
import BoundariesSection from "@/components/homepage/BoundariesSection";
import AudienceSection from "@/components/homepage/AudienceSection";

// Lazy load secondary sections
const PricingComparison = lazy(() => import("@/components/PricingComparison"));
const ClosingCTA = lazy(() => import("@/components/ClosingCTA"));
const StatsBar = lazy(() => import("@/components/StatsBar"));
const SuccessStories = lazy(() => import("@/components/SuccessStories"));

const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Justice-Bot Technologies",
    url: "https://justicebot-usa.com",
    description: "Veritas Path is an informational civic-guidance platform powered by Justice-Bot™, helping self-represented individuals navigate the U.S. legal system.",
    brand: {
      "@type": "Brand",
      name: "Veritas Path"
    },
    owns: {
      "@type": "SoftwareApplication",
      name: "Justice-Bot™",
      applicationCategory: "Legal",
      operatingSystem: "Web",
      description: "AI-powered informational guidance engine for understanding legal processes, records, and next steps.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free informational guidance with paid document preparation from $9.99"
      }
    }
  };

  const faqData = [
    {
      question: "What is Veritas Path?",
      answer: "Veritas Path is an informational civic-guidance platform that helps self-represented individuals understand U.S. legal and administrative processes. It is not a law firm and does not provide legal advice.",
    },
    {
      question: "What is Justice-Bot™?",
      answer: "Justice-Bot™ is the guidance engine powering Veritas Path. It analyzes user-provided information to offer informational guidance on legal processes, documents, and next steps.",
    },
    {
      question: "Does this platform access government databases?",
      answer: "No. Justice-Bot™ does not connect to, query, or access any government or law-enforcement databases. All analysis is based on information you provide.",
    },
    {
      question: "Is this legal advice?",
      answer: "No. This platform provides legal information and educational guidance only. It does not replace a lawyer or constitute legal advice or representation.",
    },
    {
      question: "What does it cost?",
      answer: "Informational guidance is free. Prepared document packages start at $9.99 one-time. Monthly access for unlimited exports is $19.99/mo.",
    },
    {
      question: "Can I use this for FOIA or public records requests?",
      answer: "Yes. Veritas Path includes a guided FOIA and public-records request generator to help you prepare lawful, user-initiated requests.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Veritas Path — Navigate the U.S. Legal System | Powered by Justice-Bot™"
        description="Veritas Path is an informational civic-guidance platform powered by Justice-Bot™. Understand legal processes, prepare documents, and request public records. For self-represented individuals. Not legal advice."
        keywords="legal guidance platform, public records request, FOIA request generator, informational use only, self-represented individuals, legal information, court filing help, civic guidance"
        url="https://justicebot-usa.com"
      />
      <EnhancedSEO
        title="Veritas Path — Navigate the U.S. Legal System | Justice-Bot Technologies"
        description="Informational civic-guidance platform for self-represented individuals. Understand legal processes, prepare documents, request records. Powered by Justice-Bot™. Not legal advice."
        keywords="legal guidance, FOIA request generator, public records request, self-represented individuals, legal information, court forms, civic guidance, document preparation"
        canonicalUrl="https://justicebot-usa.com/"
        structuredData={structuredData}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="space-y-0">
        {/* 1. Hero — Above the fold */}
        <StartHero language={language} />
        
        {/* 2. Stats Bar — social proof */}
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        
        {/* 3. What Veritas Path Helps You Do */}
        <PlatformExplainer />
        
        {/* 4. Choose Where You'd Like to Start */}
        <div id="guidance-pathways">
          <GuidancePathways />
        </div>
        
        {/* 5. How Justice-Bot™ Works */}
        <JusticeBotExplainer />
        
        {/* 6. Clear Boundaries & Expectations */}
        <div id="boundaries-section">
          <BoundariesSection />
        </div>
        
        {/* 7. Who This Platform Is For */}
        <AudienceSection />
        
        {/* 8. Pricing */}
        <Suspense fallback={<LoadingSection />}>
          <div className="py-8">
            <PricingComparison />
          </div>
        </Suspense>
        
        {/* 9. Success Stories */}
        <Suspense fallback={null}>
          <SuccessStories language={language} />
        </Suspense>
        
        {/* 10. Closing CTA */}
        <Suspense fallback={null}>
          <ClosingCTA />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
