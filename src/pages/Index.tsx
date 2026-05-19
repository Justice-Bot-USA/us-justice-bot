import { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Home,
  Users,
  ShieldAlert,
  Scale,
  Briefcase,
  Gavel,
  Globe,
  ClipboardList,
  Search,
  CheckCircle,
  MapPin,
  Shield,
  Handshake,
} from "lucide-react";
import StartHero from "@/components/StartHero";
import { SEOHead } from "@/components/SEOHead";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { Button } from "@/components/ui/button";

// Lazy load everything below the fold
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const PricingComparison = lazy(() => import("@/components/PricingComparison"));
const StatsBar = lazy(() => import("@/components/StatsBar"));
const SuccessStories = lazy(() => import("@/components/SuccessStories"));
const ClosingCTA = lazy(() => import("@/components/ClosingCTA"));

const justiceSystems = [
  { icon: Home, title: "Eviction & Housing", desc: "Tenant defenses, eviction responses, repair complaints — state-specific procedures", href: "/legal-help/eviction" },
  { icon: Users, title: "Family Court", desc: "Divorce, custody, child support, protective orders across all 50 states", href: "/legal-help/child-custody" },
  { icon: ShieldAlert, title: "Civil Rights & Discrimination", desc: "EEOC complaints, housing discrimination, workplace civil rights filings", href: "/legal-help/discrimination-law" },
  { icon: Scale, title: "Small Claims Court", desc: "File or defend small-dollar claims — state limits, forms, evidence prep", href: "/legal-help/small-claims-court" },
  { icon: Gavel, title: "Criminal Court Process", desc: "Understand arraignment, plea, trial, sentencing — procedural information only", href: "/legal-help/criminal-court-process" },
  { icon: Globe, title: "Immigration", desc: "DACA, ICE encounters, family safety planning, removal defense information", href: "/legal-help/immigration" },
  { icon: Briefcase, title: "Workers' Comp & Workplace Injury", desc: "Workers' comp claims, denied benefits, workplace injury procedures", href: "/legal-help/workers-compensation" },
];

const howItWorksSteps = [
  { icon: ClipboardList, title: "Guided Triage", desc: "Structured questions to understand your situation and map it to the correct venue." },
  { icon: Search, title: "Official Form Identification", desc: "Direct links to current federal and state court forms for all 50 states." },
  { icon: CheckCircle, title: "Filing Readiness Checks", desc: "Identify required documents and common filing errors before you submit." },
  { icon: MapPin, title: "Procedural Walkthrough", desc: "Understand next steps before attending court or filing with an agency." },
];

const safeguards = [
  "Uses official federal and state court forms only",
  "Incorporates current state filing rules and deadlines",
  "Flags missing required documents",
  "Distinguishes legal information from legal advice",
  "Encourages consultation with licensed attorneys where appropriate",
];

const audienceGroups = [
  {
    icon: Users,
    title: "Individuals & Families",
    items: [
      "Understand your legal options in plain language",
      "Organize evidence and build your case",
      "Prepare documents and follow procedural steps",
      "Track deadlines and filing requirements",
    ],
  },
  {
    icon: Handshake,
    title: "Legal Aid & Advocacy Organizations",
    items: [
      "Help clients arrive prepared and organized",
      "Review structured evidence packages",
      "Track case progress across programs",
      "Generate reports and structured summaries",
    ],
  },
  {
    icon: Scale,
    title: "Attorneys & Law Firms",
    items: [
      "Receive structured, organized case summaries",
      "Access evidence packages prepared by clients",
      "Reference procedural guidance and official forms",
      "Reduce intake time with pre-organized files",
    ],
  },
  {
    icon: Shield,
    title: "Community Support Workers",
    items: [
      "Guide clients through legal preparation workflows",
      "Help with housing, family, and civil rights issues",
      "Use structured triage to identify next steps",
      "Connect clients to the right courts and agencies",
    ],
  },
];

const BRAND = "A.N.A.L.";

const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "A.I. ANAL",
    alternateName: "Am Not A Lawyer",
    url: "https://justicebot-usa.com",
    description: "A.I. ANAL (Am Not A Lawyer) is an AI-powered civic-guidance platform helping self-represented individuals navigate the U.S. legal system.",
    brand: {
      "@type": "Brand",
      name: "A.I. ANAL"
    },
    owns: {
      "@type": "SoftwareApplication",
      name: "A.I. ANAL",
      applicationCategory: "Legal",
      operatingSystem: "Web",
      description: "AI-powered informational guidance engine for understanding legal processes, records, and next steps. Am Not A Lawyer.",
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
      question: "What is A.I. ANAL?",
      answer: "A.I. ANAL (Am Not A Lawyer) is an AI-powered civic-guidance platform that helps self-represented individuals understand U.S. legal and administrative processes. It is not a law firm and does not provide legal advice.",
    },
    {
      question: "What does A.I. ANAL stand for?",
      answer: "Am Not A Lawyer. The name makes the disclaimer the brand: we provide legal information, not legal advice or representation.",
    },
    {
      question: "Does this platform access government databases?",
      answer: "No. A.I. ANAL does not connect to, query, or access any government or law-enforcement databases. All analysis is based on information you provide.",
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
      answer: "Yes. A.I. ANAL includes a guided FOIA and public-records request generator to help you prepare lawful, user-initiated requests.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="A.I. ANAL — Am Not A Lawyer | Navigate the U.S. Legal System"
        description="A.I. ANAL (Am Not A Lawyer) is an AI-powered civic-guidance platform. Understand legal processes, prepare documents, request public records. For self-represented individuals. Not legal advice."
        keywords="A.I. ANAL, Am Not A Lawyer, legal guidance, public records request, FOIA generator, self-represented individuals, legal information, court filing help, civic guidance"
        url="https://justicebot-usa.com"
      />
      <EnhancedSEO
        title="A.I. ANAL — Am Not A Lawyer | AI legal guidance for all 50 states"
        description="Am Not A Lawyer. Informational civic-guidance platform for self-represented individuals. Understand legal processes, prepare documents, request records. Not legal advice."
        keywords="A.I. ANAL, Am Not A Lawyer, legal guidance, FOIA request generator, public records request, legal information, court forms, civic guidance, document preparation"
        canonicalUrl="https://justicebot-usa.com/"
        structuredData={structuredData}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      
      <Suspense fallback={null}>
        <Header language={language} onLanguageChange={setLanguage} />
      </Suspense>
      
      <main id="main-content" className="space-y-0">
        {/* 1. Hero */}
        <StartHero language={language} />

        {/* 2. Stats Bar */}
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>

        {/* 3. Justice Systems We Support */}
        <section className="py-14 sm:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              Justice Systems We Support
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {justiceSystems.map(({ icon: Icon, title, desc, href }) => (
                <button
                  key={title}
                  onClick={() => navigate(href)}
                  className="flex flex-col items-start text-left gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  <span className="text-xs text-primary font-medium mt-auto">Explore this path →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="py-14 sm:py-20 bg-muted/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              A Structured Approach to Court Navigation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {howItWorksSteps.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Designed with Safeguards */}
        <section className="py-14 sm:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Shield className="w-7 h-7 text-primary" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Designed with Safeguards</h2>
            </div>
            <ul className="space-y-3 max-w-xl mx-auto">
              {safeguards.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Who This Is For */}
        <section className="py-14 sm:py-20 bg-muted/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-3">
              Who {BRAND} Supports
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Built for everyone navigating the U.S. justice system — from individuals to institutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {audienceGroups.map(({ icon: Icon, title, items }) => (
                <div key={title} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3">{title}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why We Built This */}
        <section className="py-14 sm:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Why We Built {BRAND}
            </h2>
            <div className="prose prose-sm sm:prose-base text-muted-foreground max-w-none leading-relaxed space-y-5">
              <p>{BRAND} was not built in a boardroom.</p>
              <p>
                It began in lived experience — in the quiet spaces where everyday people struggle to navigate systems
                that feel complex, expensive, and out of reach.
              </p>
              <p>
                Across the United States, renters, parents, workers, newcomers, and low-income families face court and
                agency processes without clear guidance. The rules are public. The forms are public. But understanding
                how to move through the system is not.
              </p>
              <p>{BRAND} was created to close that gap.</p>
              <p>
                This platform provides structured legal information, official court form identification, and procedural
                clarity — so individuals can better understand their rights and responsibilities within the justice
                system.
              </p>
              <div className="not-prose space-y-2 py-4 border-l-4 border-primary pl-5">
                <p className="text-foreground font-semibold text-sm">We are not a law firm.</p>
                <p className="text-foreground font-semibold text-sm">We do not provide legal advice.</p>
                <p className="text-foreground font-semibold text-sm">We do not replace lawyers.</p>
              </div>
              <p>We exist to make legal processes more understandable and less intimidating.</p>
              <p className="text-foreground font-medium italic">
                Access to justice should not depend on wealth or insider knowledge. It should begin with clarity.
              </p>
            </div>
          </div>
        </section>

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

        {/* 10. Partner With Us */}
        <section className="py-14 sm:py-20 bg-muted/40">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <Handshake className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Partner With Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {BRAND} works alongside legal aid clinics, law schools, access-to-justice initiatives, and community
              justice programs to extend procedural clarity to those who need it most.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Interested in institutional collaboration or pilot partnerships? Contact us to learn more.
            </p>
            <Button variant="outline" size="lg" className="px-8" onClick={() => navigate("/support")}>
              Contact Us About Partnerships
            </Button>
          </div>
        </section>

        {/* 11. Trust Strip */}
        <section className="py-8 bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Not a law firm · Not legal advice · Legal information only ·{" "}
              <span className="font-medium">Built for real people, not lawyers</span>
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Trust & compliance links">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "FAQ", href: "/faq" },
                { label: "Support", href: "/support" },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* 12. SEO Content Block */}
        <section className="py-14 sm:py-20 bg-muted/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              U.S. Legal Navigation — Without the Guesswork
            </h2>
            <div className="prose prose-sm sm:prose-base text-muted-foreground max-w-none leading-relaxed space-y-4">
              <p>
                Whether you're responding to an eviction notice, preparing a small claims complaint, filing for custody,
                or submitting an EEOC discrimination charge, understanding the correct procedures can be the difference
                between a successful filing and a dismissed case.
              </p>
              <p>
                For family matters, navigating divorce petitions, custody affidavits, and financial disclosures requires
                careful attention to your state's Family Court rules. Motions to modify existing orders and preparing
                for hearings demand precise documentation and procedural awareness.
              </p>
              <p>
                {BRAND} organizes these processes into clear, step-by-step pathways — connecting self-represented
                individuals with the correct federal and state forms, filing requirements, and procedural timelines for
                courts and agencies across all 50 states.
              </p>
            </div>

            <nav aria-label="Popular U.S. legal guides" className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { label: "How to fight an eviction notice", href: "/legal-help/how-to-fight-an-eviction" },
                { label: "How to file in small claims court", href: "/legal-help/how-to-file-small-claims" },
                { label: "File a civil rights complaint", href: "/legal-help/how-to-file-civil-rights-complaint" },
                { label: "Court Records & Public Records (FOIA)", href: "/foia-request-generator" },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 ml-2" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* 13. Closing CTA */}
        <Suspense fallback={null}>
          <ClosingCTA />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
