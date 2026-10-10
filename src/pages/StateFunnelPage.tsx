import React, { useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFunnelByRoute, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { LegalCategory } from '@/lib/funnels/types';
import { FunnelEngine } from '@/components/funnel';
import { StateComingSoon } from '@/components/funnel/StateComingSoon';
import { LaunchState, launchStateOf, stateRouteFor } from '@/lib/stateRouting';
import { PLAN } from '@/lib/pricing';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { parseStateToolSlug } from '@/lib/stateToolSeo';
import StateToolLandingPage from '@/pages/StateToolLandingPage';

// ---------------------------------------------------------------------------
// Helpers: structured data for the California and New York funnel pages.
// Funnel pages for other states show a "coming soon" page with no structured data.
// ---------------------------------------------------------------------------

const BASE_URL = 'https://justicebot-usa.com';

type FAQ = { q: string; a: string };

/**
 * FAQ items for a launched state. Answers stay general, cite the statute where they state a
 * rule, and point to the state's legal center for forms and steps. Not legal advice.
 */
const buildFAQs = (st: LaunchState, stateName: string, legalArea: LegalCategory): FAQ[] => {
  const ca = st === 'CA';
  const center = `our ${stateName} legal center`;
  const civilRightsAgency = ca ? 'California Civil Rights Department' : 'New York State Division of Human Rights';
  const wageAgency = ca ? "California Labor Commissioner's Office" : 'New York State Department of Labor';

  const questions: Partial<Record<LegalCategory, FAQ[]>> = {
    'family': [
      {
        q: `How do I file for divorce in ${stateName}?`,
        a: ca
          ? 'In California, a divorce (dissolution of marriage) starts with a Petition, form FL-100, filed with the superior court in your county. Before the court can grant the divorce, you or your spouse must have lived in California for 6 months and in that county for 3 months (Family Code § 2320). Our California legal center lists the official divorce forms and explains each one.'
          : 'In New York, divorces are handled by the Supreme Court in your county. You or your spouse must meet one of the residency rules in Domestic Relations Law § 230, which means either of you living in New York for two years without a break; or for one year without a break if you married in New York, lived here as a married couple, or the grounds for divorce happened here; or, if the grounds happened here, both of you living in New York when the case is filed. Our New York legal center links to the official forms and explains each one.',
      },
      {
        q: `Do I need a lawyer for a divorce in ${stateName}?`,
        a: `No. You can represent yourself in a ${stateName} divorce. Our tools explain the official forms and how filing generally works, and all forms and filling instructions are included in the ${PLAN.priceLabel} plan. This is legal information, not legal advice. If your case involves children, property or a disagreement, consider talking to a lawyer or legal aid.`,
      },
      {
        q: `How long does a divorce take in ${stateName}?`,
        a: ca
          ? 'A California divorce cannot become final until six months after the other spouse was served or first appeared in the case (Family Code § 2339). Many cases take longer, depending on the court and on whether you and your spouse agree.'
          : 'It depends on the court and on whether you and your spouse agree on everything. Uncontested divorces usually move faster than contested ones.',
      },
    ],
    'small-claims': [
      {
        q: `What is the small claims limit in ${stateName}?`,
        a: ca
          ? 'An individual can sue for up to $12,500 and a business for up to $6,250 (Code of Civil Procedure §§ 116.220 and 116.221). Generally, you can file no more than two claims over $2,500 anywhere in California in a calendar year. Check the court\'s small claims page before you file in case the limits change.'
          : 'It depends on the court: up to $10,000 in New York City Civil Court, generally $5,000 in City Courts outside New York City and in the District Courts (Nassau County and western Suffolk County), and $3,000 in Town and Village Courts. Check the court\'s small claims page before you file in case the limits change.',
      },
      {
        q: `How do I file a small claims case in ${stateName}?`,
        a: `You fill out the court's claim form, file it with the small claims court, and pay the filing fee or ask for a fee waiver. The other side must then get notice of the claim the way the court requires, and the court sets a hearing date. ${ca ? 'Our California' : 'Our New York'} legal center explains each step and the official forms.`,
      },
      {
        q: `Can I appeal a small claims judgment in ${stateName}?`,
        a: `Appeal rules and deadlines depend on the court and on whether you were the plaintiff or the defendant. Ask the ${stateName} small claims clerk or court self-help center about the deadline and the form to use.`,
      },
    ],
    'employment': [
      {
        q: `How do I file a wrongful termination claim in ${stateName}?`,
        a: `It depends on why you were fired. Discrimination or retaliation claims can go to the EEOC or the ${civilRightsAgency}, and unpaid wage claims go to the ${wageAgency}. Each agency has its own filing deadline and some are short, so check them early. The workplace section of ${center} explains the options.`,
      },
      {
        q: `What is the minimum wage in ${stateName}?`,
        a: `${stateName} sets its own minimum wage, which is higher than the federal minimum, and some ${ca ? 'cities and industries' : 'regions and industries'} have higher rates. Check the ${wageAgency} for the current rate.`,
      },
      {
        q: `How long do I have to file a wage claim in ${stateName}?`,
        a: `It depends on the kind of claim. Contact the ${wageAgency} or see the workplace section of ${center}, and act quickly so you don't miss a deadline.`,
      },
    ],
    'housing': [
      {
        q: `How do I respond to an eviction case in ${stateName}?`,
        a: `You have the right to respond to the eviction case in court. Deadlines are short, so read the papers you were served right away and respond by the deadline they give. ${ca ? 'Our California' : 'Our New York'} legal center explains how to respond and where to get help.`,
      },
      {
        q: `Can my landlord evict me without going to court in ${stateName}?`,
        a: `A landlord generally must give written notice and then win a court case before a tenant can be removed. Changing the locks, shutting off utilities or removing your belongings to force you out is illegal in ${stateName} (${ca ? 'Civil Code § 789.3' : 'Real Property Actions and Proceedings Law § 768'}).`,
      },
      {
        q: `Can I withhold rent for repairs in ${stateName}?`,
        a: `${stateName} law requires landlords to keep rental homes livable, but stopping rent payments can lead to an eviction case if it is not done exactly right. Talk to legal aid, a tenant organization or a lawyer before you withhold rent.`,
      },
    ],
    'criminal': [
      {
        q: `Can I clear my criminal record in ${stateName}?`,
        a: `Record-clearing options in ${stateName} depend on the offense, the sentence and how much time has passed. ${ca ? 'Our California' : 'Our New York'} legal center explains the options and the official forms, and a public defender or legal aid office can help you check whether you qualify.`,
      },
      {
        q: `Can I get a criminal record sealed in ${stateName}?`,
        a: `${stateName} offers record sealing for certain offenses. Once sealed, the record is hidden from most background checks. Eligibility depends on your record and ${stateName} law; the court self-help center or a legal aid office can help you check it.`,
      },
      {
        q: `What is the difference between expungement and sealing in ${stateName}?`,
        a: `The terms mean different things from state to state, and neither usually erases a record completely. ${ca ? 'Our California' : 'Our New York'} legal center explains which options ${stateName} has and what each one does.`,
      },
    ],
    'cps': [
      {
        q: `What are my rights in a CPS case in ${stateName}?`,
        a: `Parents have rights during a child welfare investigation and in court. If the case goes to court, the court often appoints a lawyer for a parent who cannot afford one, so ask about this at your first hearing. The CPS section of ${center} explains the process.`,
      },
      {
        q: `How do I respond to a CPS case in ${stateName}?`,
        a: `Child welfare cases are heard in ${ca ? 'juvenile court' : 'Family Court'} and follow their own process and deadlines. Go to every hearing, keep copies of all papers, and work with your lawyer. The CPS section of ${center} explains the process and the official forms.`,
      },
      {
        q: `Can CPS remove my child without a court order in ${stateName}?`,
        a: `Generally only in an emergency, when the child is believed to be in immediate danger. After an emergency removal the case goes to court quickly, so watch for hearing notices and ask for a lawyer.`,
      },
    ],
    'workers-rights': [
      {
        q: `How do I file a workers' compensation claim in ${stateName}?`,
        a: `Tell your employer about the injury in writing as soon as you can; ${stateName} law generally requires notice within 30 days (${ca ? 'Labor Code § 5400' : "Workers' Compensation Law § 18"}). Get medical care and follow the claim steps from the ${ca ? "Division of Workers' Compensation" : "Workers' Compensation Board"}. The workplace section of ${center} links to the official information.`,
      },
      {
        q: `What injuries are covered by workers' comp in ${stateName}?`,
        a: `${stateName} workers' compensation generally covers injuries and illnesses caused by work, including accidents, repetitive stress injuries and illnesses from workplace exposure. Some workers, such as true independent contractors, are not covered.`,
      },
      {
        q: `Can I be fired for filing a workers' comp claim in ${stateName}?`,
        a: `No. ${stateName} law makes it illegal to fire or punish a worker for claiming workers' compensation (${ca ? 'Labor Code § 132a' : "Workers' Compensation Law § 120"}). You can file a separate complaint if this happens.`,
      },
    ],
    'human-rights': [
      {
        q: `How do I file a discrimination complaint in ${stateName}?`,
        a: `You can file with the ${civilRightsAgency}, or with the EEOC for job discrimination. Each agency has its own deadline, so check it as soon as possible. The human rights section of ${center} explains the process.`,
      },
      {
        q: `What types of discrimination are illegal in ${stateName}?`,
        a: `${stateName} law prohibits discrimination based on race, color, religion, sex, national origin, age, disability and other traits, and it protects more groups than federal law does.`,
      },
      {
        q: `Do I need a lawyer to file a civil rights complaint in ${stateName}?`,
        a: `No. You can file a discrimination complaint with the agency yourself. Our guides explain the process; you prepare and submit the complaint yourself.`,
      },
    ],
    'agency-complaints': [
      {
        q: `How do I file a complaint against a doctor in ${stateName}?`,
        a: ca
          ? 'For a medical doctor (M.D.), file a complaint with the Medical Board of California. Include copies (not originals) of relevant records and a clear description of what happened.'
          : "File a complaint with the New York State Department of Health's Office of Professional Medical Conduct. Include copies (not originals) of relevant records and a clear description of what happened.",
      },
      {
        q: `How do I file a complaint against a lawyer in ${stateName}?`,
        a: ca
          ? 'File a complaint with the State Bar of California.'
          : "File a complaint with the Attorney Grievance Committee for the area where the lawyer's office is. The committees are appointed by the Appellate Division of the New York State Supreme Court.",
      },
      {
        q: `How long does a professional complaint take in ${stateName}?`,
        a: 'It varies by agency and by how complex the complaint is. Ask the agency how it reports progress on complaints.',
      },
    ],
    'personal-injury': [
      {
        q: `What is the statute of limitations for personal injury in ${stateName}?`,
        a: ca
          ? 'Generally 2 years from the injury (Code of Civil Procedure § 335.1). If a government agency is responsible, you usually must file a written claim with it within 6 months (Government Code § 911.2). Some cases have other deadlines, so check early.'
          : 'Generally 3 years (Civil Practice Law and Rules § 214). If a city, county or other public body is responsible, you usually must serve a notice of claim within 90 days (General Municipal Law § 50-e). Some cases have other deadlines, so check early.',
      },
      {
        q: `Do I need a lawyer for a personal injury claim in ${stateName}?`,
        a: `Not always, but injury claims can be complex and many personal injury lawyers offer free consultations. Our platform helps you organize your documents and find official ${stateName} resources.`,
      },
      {
        q: `How much is my personal injury case worth in ${stateName}?`,
        a: `Justice Bot does not estimate what a claim is worth. Compensation depends on the facts and on ${stateName} law, such as its comparative fault rules. A lawyer or legal aid office can advise you about your situation.`,
      },
    ],
  };

  return questions[legalArea] ?? [];
};

const buildFAQSchema = (faqs: FAQ[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/** HowTo schema for step-by-step legal process */
const buildHowToSchema = (stateName: string, areaName: string, forms: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: `How to File a ${areaName} Case in ${stateName}`,
  description: `General steps for handling a ${areaName} matter in ${stateName} on your own. Legal information, not legal advice.`,
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Describe Your Situation',
      text: 'Answer a few questions about your legal issue so we can summarize your situation in plain language.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Add Documents (Optional)',
      text: `Attach any documents, photos, or records related to your ${areaName} matter so your summary reflects them.`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Review Your Summary',
      text: `Get a plain-language summary of your situation and links to official ${stateName} resources${forms.length > 0 ? `, plus general information about forms commonly used in this area (such as ${forms.slice(0, 2).join(', ')})` : ''}.`,
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Get Your Form Guides',
      text: `With the $25 monthly plan you get a filing guide for each ${stateName} form, a link to the official court version, and official ${stateName} court forms filled from your answers. You check, sign and file them yourself.`,
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Get General Filing Information',
      text: `Review general filing information and links to ${stateName}'s court self-help resources. Talk to a lawyer or free legal aid about your own situation.`,
    },
  ],
  tool: [{ '@type': 'HowToTool', name: 'Justice Bot USA' }],
});

/** BreadcrumbList for site hierarchy */
const buildBreadcrumbSchema = (stateName: string, stateCode: string, areaName: string, route: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: stateName, item: `${BASE_URL}/states/${stateCode.toLowerCase()}` },
    { '@type': 'ListItem', position: 3, name: areaName, item: `${BASE_URL}${route}` },
  ],
});

/** LegalService schema for the specific state+area page */
const buildLegalServiceSchema = (stateName: string, areaName: string, description: string, route: string) => ({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: `Justice Bot USA – ${stateName} ${areaName} Self-Help`,
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
    name: 'Justice Bot USA',
    legalName: 'Justice Bot Technologies Inc.',
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
  },
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free questions about your situation and a plain-language summary',
    },
    {
      '@type': 'Offer',
      price: String(PLAN.price),
      priceCurrency: 'USD',
      description: 'Monthly plan: all California and New York forms and filling instructions included. Courts and agencies charge their own fees.',
    },
  ],
});

/** The state a slug starts with ("texas-legal-help" -> TX), longest state name first. */
const stateFromSlug = (slug: string): string | undefined =>
  Object.entries(US_STATE_NAMES)
    .map(([code, name]) => [code, name.toLowerCase().replace(/\s+/g, '-')] as const)
    .sort((a, b) => b[1].length - a[1].length)
    .find(([, nameSlug]) => slug.startsWith(`${nameSlug}-`))?.[0];

const StateFunnelPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');

  // Check for state-tool landing pages (e.g. ohio-warrant-lookup, california-court-forms)
  const stateToolMatch = slug ? parseStateToolSlug(slug) : null;

  // Get funnel config from route
  const route = `/${slug}`;
  const funnelConfig = getFunnelByRoute(route);
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Render state-tool landing page if matched
  if (stateToolMatch) {
    // Warrant lookup was removed; old state warrant URLs go to the criminal defense guide.
    if (stateToolMatch.toolType === 'warrant-lookup') {
      return <Navigate to="/criminal-defense-guide" replace />;
    }
    return <StateToolLandingPage />;
  }

  // Handle funnel completion
  // CA/NY users go on to their legal center (filing steps and form filling). Elsewhere, signed-in
  // users go to their saved cases; signed-out users have nothing saved, so they go home.
  const handleComplete = () => {
    const route = funnelConfig ? stateRouteFor(funnelConfig.jurisdiction, funnelConfig.legalArea) : null;
    navigate(route ? route.centerPath : user ? '/my-cases' : '/');
  };

  // Handle funnel exit
  const handleExit = () => {
    navigate('/');
  };

  // A state that has not launched: say it is coming soon. No funnel, paywall or checkout.
  const slugState = funnelConfig ? funnelConfig.jurisdiction : slug ? stateFromSlug(slug) : undefined;
  if (slugState && !launchStateOf(slugState)) {
    const comingSoonState = US_STATE_NAMES[slugState];
    const comingSoonArea = funnelConfig?.legalArea;
    const comingSoonTitle = comingSoonArea
      ? `${LEGAL_AREA_NAMES[comingSoonArea]} Help in ${comingSoonState}: Coming Soon | Justice Bot USA`
      : `${comingSoonState} Legal Help: Coming Soon | Justice Bot USA`;
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{comingSoonTitle}</title>
          <meta
            name="description"
            content={`Justice Bot USA is live in California and New York. ${comingSoonState} is coming soon.`}
          />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12">
          <StateComingSoon stateName={comingSoonState} legalArea={comingSoonArea} headingLevel="h1" />
        </main>
        <Footer />
      </div>
    );
  }

  // Funnel not found
  if (!funnelConfig) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Page Not Found | Justice Bot USA</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't find this page. Justice Bot USA is live in California and New York; other states are coming soon.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                <Button asChild>
                  <Link to="/ca/legal-center">California legal center</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/ny/legal-center">New York legal center</Link>
                </Button>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button variant="ghost" onClick={() => navigate('/')}>
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
  const launchState = launchStateOf(funnelConfig.jurisdiction) as LaunchState;
  const centerPath = stateRouteFor(launchState, funnelConfig.legalArea)?.centerPath;

  // Build all structured-data schemas
  const faqs = buildFAQs(launchState, stateName, funnelConfig.legalArea);
  const faqSchema       = buildFAQSchema(faqs);
  const howToSchema     = buildHowToSchema(stateName, legalAreaName, forms);
  const breadcrumbSchema = buildBreadcrumbSchema(stateName, funnelConfig.jurisdiction, legalAreaName, route);
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
        <meta property="og:site_name" content="Justice Bot USA" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={uniqueDescription} />
        <meta name="twitter:image" content={`${BASE_URL}/icon-512.png`} />

        {/* Canonical */}
        <link rel="canonical" href={`${BASE_URL}${route}`} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(legalServiceSchema)}</script>
        {faqs.length > 0 && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
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
              Self-help legal information for {legalAreaName.toLowerCase()} in {stateName}. Start with free questions;
              all forms and filling instructions are included in the {PLAN.priceLabel} plan.
            </p>
            {centerPath && (
              <p className="mt-3 text-sm">
                <Link to={centerPath} className="text-primary underline underline-offset-4">
                  Or go straight to the {stateName} legal center
                </Link>
              </p>
            )}
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
                Our platform gives you general information about your rights, links to the official court forms,
                and explains how the legal process generally works.
              </p>
              <h3>What You'll Get</h3>
              <ul>
                <li>Free: questions that help sort out your situation, and a plain-language summary</li>
                <li>A list of forms commonly used for {legalAreaName.toLowerCase()} matters in {stateName}, with links to the official court versions</li>
                <li>With the {PLAN.priceLabel} plan: official {stateName} court forms filled from your answers, with filling instructions. You check, sign and file them yourself.</li>
                <li>General legal information, not legal advice. Our content has not yet been reviewed by a licensed attorney.</li>
              </ul>
              {faqs.length > 0 && (
                <>
                  <h3>Common Questions</h3>
                  {faqs.map(({ q, a }) => (
                    <div key={q}>
                      <h4>{q}</h4>
                      <p>{a}</p>
                    </div>
                  ))}
                </>
              )}
              <h3>Disclaimer</h3>
              <p>
                Justice Bot USA provides self-help legal information and tools.
                We are not a law firm and do not provide legal advice.
                For complex matters, consider consulting with a licensed {stateName} attorney.
              </p>
            </div>
            {centerPath && (
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to={centerPath}>
                    Open the {stateName} legal center <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StateFunnelPage;
