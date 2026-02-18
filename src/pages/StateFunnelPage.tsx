import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFunnelByRoute, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { LegalCategory } from '@/lib/funnels/types';
import { FunnelEngine } from '@/components/funnel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { parseStateToolSlug } from '@/lib/stateToolSeo';
import StateToolLandingPage from '@/pages/StateToolLandingPage';

// ---------------------------------------------------------------------------
// Helpers: generate unique structured data per state × legal-area combination
// ---------------------------------------------------------------------------

const BASE_URL = 'https://justicebot-usa.com';

/** State-specific FAQ items that Google can surface as rich results */
const buildFAQSchema = (stateName: string, legalArea: LegalCategory, areaName: string, forms: string[]) => {
  const formList = forms.length > 0 ? forms.slice(0, 3).join(', ') : 'the required court forms';

  const questions: Record<LegalCategory, Array<{ q: string; a: string }>> = {
    'family': [
      { q: `How do I file for divorce in ${stateName}?`, a: `In ${stateName} you file a Petition for Dissolution of Marriage in the Superior/Family Court of your county. Key forms include ${formList}. You must meet residency requirements (usually 6 months) before filing.` },
      { q: `Do I need a lawyer for a divorce in ${stateName}?`, a: `No. ${stateName} allows self-represented (pro se) litigants in family court. Our AI tools walk you through every form and step at no charge.` },
      { q: `How long does divorce take in ${stateName}?`, a: `Uncontested divorces in ${stateName} typically take 60–180 days after filing, depending on the county's docket and whether children are involved.` },
    ],
    'small-claims': [
      { q: `What is the small-claims limit in ${stateName}?`, a: `${stateName}'s small-claims court handles disputes up to the statutory monetary limit. No lawyer is required. Common forms include ${formList}.` },
      { q: `How do I file a small-claims case in ${stateName}?`, a: `Complete and file ${formList} at your local ${stateName} court, pay the filing fee, and serve the defendant with a copy. The court will schedule a hearing date.` },
      { q: `Can I appeal a small-claims judgment in ${stateName}?`, a: `Yes. ${stateName} allows appeals to a higher court within a set number of days (usually 30). Our platform provides the appeal forms and instructions.` },
    ],
    'employment': [
      { q: `How do I file a wrongful termination claim in ${stateName}?`, a: `File a charge with the EEOC or ${stateName}'s state labor agency. Key forms include ${formList}. There are strict deadlines—often 180 or 300 days from the adverse action.` },
      { q: `What is the minimum wage in ${stateName}?`, a: `${stateName} has its own minimum-wage laws that may exceed the federal floor. Check our ${stateName} employment guide for the current rate and overtime rules.` },
      { q: `How long do I have to file a wage theft complaint in ${stateName}?`, a: `${stateName} generally allows 2–3 years for wage claims. Use ${formList} to start your complaint with the state Labor Department.` },
    ],
    'housing': [
      { q: `How do I fight an eviction in ${stateName}?`, a: `You have the right to answer the eviction complaint. File ${formList} in ${stateName} court within the notice period (usually 5–10 days). Our platform generates your Answer automatically.` },
      { q: `What notice must a landlord give before evicting a tenant in ${stateName}?`, a: `${stateName} law requires written notice—typically 3, 5, or 30 days depending on the reason. An illegal eviction can be challenged using ${formList}.` },
      { q: `Can I withhold rent for repairs in ${stateName}?`, a: `${stateName} has repair-and-deduct or rent-withholding remedies for habitability violations. Our guides explain the exact steps and required notices.` },
    ],
    'criminal': [
      { q: `How do I get my record expunged in ${stateName}?`, a: `File ${formList} in the court where you were convicted or arrested. Eligibility depends on the offense type, sentence, and waiting period under ${stateName} law.` },
      { q: `Can I get a criminal record sealed in ${stateName}?`, a: `${stateName} offers record sealing for certain offenses. Once sealed, the record is hidden from most background checks. Our AI analyzes your eligibility instantly.` },
      { q: `What is the difference between expungement and sealing in ${stateName}?`, a: `Expungement destroys the record; sealing hides it from public view but law enforcement can still access it. Our platform explains ${stateName}'s specific rules.` },
    ],
    'cps': [
      { q: `What are my rights during a CPS investigation in ${stateName}?`, a: `You have the right to remain silent, to have an attorney, and to be notified of allegations. CPS in ${stateName} must follow strict procedural rules before removing a child.` },
      { q: `How do I fight a ${stateName} CPS case?`, a: `File ${formList} in the Dependency/Family court. You should also request a copy of the CPS report and respond to all allegations in writing.` },
      { q: `Can CPS remove my child without a court order in ${stateName}?`, a: `Only in emergency situations where a child faces imminent danger. Otherwise, ${stateName} CPS must obtain a court order before removal.` },
    ],
    'workers-rights': [
      { q: `How do I file a workers' compensation claim in ${stateName}?`, a: `Notify your employer immediately, seek medical treatment, and file ${formList} with ${stateName}'s Workers' Compensation agency within the required timeframe.` },
      { q: `What injuries are covered by workers' comp in ${stateName}?`, a: `${stateName} covers work-related injuries and occupational illnesses. This includes accidents, repetitive stress injuries, and illnesses caused by workplace exposure.` },
      { q: `Can I be fired for filing a workers' comp claim in ${stateName}?`, a: `No. Retaliation for filing a workers' compensation claim is illegal in ${stateName}. You can file a separate retaliation complaint if this occurs.` },
    ],
    'human-rights': [
      { q: `How do I file a discrimination complaint in ${stateName}?`, a: `File with the EEOC or ${stateName}'s civil rights agency using ${formList}. You generally have 180–300 days from the discriminatory act to file.` },
      { q: `What types of discrimination are illegal in ${stateName}?`, a: `${stateName} prohibits discrimination based on race, color, religion, sex, national origin, age, disability, and often additional protected classes under state law.` },
      { q: `Do I need a lawyer to file a civil rights complaint in ${stateName}?`, a: `No. You can file a discrimination charge yourself with ${formList}. Our platform helps you draft and submit the complaint for free.` },
    ],
    'agency-complaints': [
      { q: `How do I file a complaint against a doctor in ${stateName}?`, a: `Submit a complaint to the ${stateName} Medical Board using ${formList}. Include all relevant medical records and a detailed description of the misconduct.` },
      { q: `How do I file a complaint against a lawyer in ${stateName}?`, a: `Contact the ${stateName} State Bar and submit a formal grievance. Our platform provides the correct forms and submission instructions.` },
      { q: `How long does a professional complaint take in ${stateName}?`, a: `${stateName} agency investigations typically take 3–12 months. You will receive written updates and may be asked for additional information.` },
    ],
    'personal-injury': [
      { q: `What is the statute of limitations for personal injury in ${stateName}?`, a: `${stateName} generally allows 2–3 years to file a personal injury lawsuit. Missing this deadline means losing your right to compensation.` },
      { q: `Do I need a lawyer for a personal injury claim in ${stateName}?`, a: `Not always. Our platform helps you calculate settlement value, document your injury, and negotiate with insurance companies in ${stateName}.` },
      { q: `How much is my personal injury case worth in ${stateName}?`, a: `Compensation depends on medical costs, lost wages, pain and suffering, and ${stateName}'s comparative fault rules. Use our free settlement calculator for an estimate.` },
    ],
    'immigration': [
      { q: `What immigration help is available in ${stateName}?`, a: `${stateName} has legal aid organizations, sanctuary city policies (in some areas), and state-funded programs. Our platform connects you with resources and key forms.` },
      { q: `How do I apply for asylum in ${stateName}?`, a: `File Form I-589 with USCIS within one year of arrival. Our AI walks you through the process and helps document your claim.` },
      { q: `What are my rights if ICE contacts me in ${stateName}?`, a: `You have the right to remain silent, refuse warrantless entry, and speak to an attorney. Do not sign any documents without legal review.` },
    ],
    'bankruptcy': [
      { q: `How do I file Chapter 7 bankruptcy in ${stateName}?`, a: `File ${formList} in ${stateName} federal bankruptcy court, pass the means test, complete credit counseling, and attend a 341 Meeting of Creditors.` },
      { q: `What property is exempt from bankruptcy in ${stateName}?`, a: `${stateName} has specific exemptions for your home (homestead), car, retirement accounts, and household goods. Our platform lists current exemption amounts.` },
      { q: `How long does bankruptcy stay on my credit in ${stateName}?`, a: `Chapter 7 stays on your credit for 10 years; Chapter 13 for 7 years. However, you can start rebuilding credit immediately after discharge.` },
    ],
    'consumer-protection': [
      { q: `How do I file a consumer fraud complaint in ${stateName}?`, a: `File with the ${stateName} Attorney General's consumer protection division using ${formList}. Include all receipts, contracts, and communications.` },
      { q: `What consumer protections does ${stateName} have?`, a: `${stateName} has the ${stateName} Consumer Protection Act which prohibits unfair or deceptive trade practices. Violations can result in fines and restitution.` },
      { q: `Can I sue a business for consumer fraud in ${stateName}?`, a: `Yes. ${stateName} allows private lawsuits for consumer fraud. You may be entitled to actual damages, statutory damages, and attorney's fees.` },
    ],
  };

  const faqs = questions[legalArea] ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
};

/** HowTo schema for step-by-step legal process */
const buildHowToSchema = (stateName: string, areaName: string, forms: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: `How to File a ${areaName} Case in ${stateName}`,
  description: `Step-by-step guide to handling a ${areaName} matter in ${stateName} without an attorney.`,
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Describe Your Situation',
      text: 'Answer a few questions about your legal issue so our AI can analyze your case and identify the correct legal pathway.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Upload Evidence',
      text: `Attach any documents, photos, or records related to your ${areaName} matter. Our system securely stores and analyzes them.`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Review Your Case Analysis',
      text: `Get an AI-powered merit score, legal pathway, and list of required ${stateName} court forms${forms.length > 0 ? ` (${forms.slice(0, 2).join(', ')})` : ''}.`,
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Generate Court-Ready Documents',
      text: `Download pre-filled ${stateName} court forms and a cover letter ready to file with the appropriate court.`,
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Follow Your Action Plan',
      text: `Receive deadline reminders, next-step guidance, and filing instructions specific to ${stateName}'s court system.`,
    },
  ],
  totalTime: 'PT30M',
  tool: [{ '@type': 'HowToTool', name: 'Veritas Path AI Legal Platform' }],
});

/** BreadcrumbList for site hierarchy */
const buildBreadcrumbSchema = (stateName: string, areaName: string, route: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: stateName, item: `${BASE_URL}/legal-areas` },
    { '@type': 'ListItem', position: 3, name: areaName, item: `${BASE_URL}${route}` },
  ],
});

/** LegalService schema for the specific state+area page */
const buildLegalServiceSchema = (stateName: string, areaName: string, description: string, route: string) => ({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: `Veritas Path – ${stateName} ${areaName} Self-Help`,
  description,
  url: `${BASE_URL}${route}`,
  areaServed: {
    '@type': 'State',
    name: stateName,
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
  },
  serviceType: areaName,
  provider: {
    '@type': 'Organization',
    name: 'Veritas Path | Justice-Bot Technologies',
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free case analysis and form identification',
  },
});

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
              <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
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
  const forms = funnelConfig.forms;

  // Build all structured-data schemas
  const faqSchema       = buildFAQSchema(stateName, funnelConfig.legalArea, legalAreaName, forms);
  const howToSchema     = buildHowToSchema(stateName, legalAreaName, forms);
  const breadcrumbSchema = buildBreadcrumbSchema(stateName, legalAreaName, route);
  const legalServiceSchema = buildLegalServiceSchema(stateName, legalAreaName, seo.description, route);

  // Unique description: append the first 3 form names for true per-page uniqueness
  const uniqueDescription = forms.length > 0
    ? `${seo.description} Key forms: ${forms.slice(0, 3).join(', ')}.`
    : seo.description;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={uniqueDescription} />
        <meta name="keywords" content={seo.keywords.join(', ')} />

        {/* Open Graph */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={uniqueDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}${route}`} />
        <meta property="og:image" content={`${BASE_URL}/icon-512.png`} />
        <meta property="og:site_name" content="Veritas Path | Justice-Bot Technologies" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={uniqueDescription} />
        <meta name="twitter:image" content={`${BASE_URL}/icon-512.png`} />

        {/* Canonical */}
        <link rel="canonical" href={`${BASE_URL}${route}`} />

        {/* Structured Data – 4 separate schemas for maximum rich-result coverage */}
        <script type="application/ld+json">{JSON.stringify(legalServiceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
