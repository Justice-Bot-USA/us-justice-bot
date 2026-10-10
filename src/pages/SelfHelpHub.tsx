import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Scale, FileText, Search, FolderOpen, BookOpen, Gavel,
  CheckCircle, AlertTriangle, ArrowRight, Users, ClipboardList,
  Building2, Clock, Shield, MapPin, GraduationCap
} from "lucide-react";

const SelfHelpHub = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toolCards = [
    {
      icon: ClipboardList, title: "Identify Your Case Type",
      description: "Answer simple questions to understand what kind of legal matter you have — civil, family, housing, employment, or administrative.",
      link: "/case-analysis", linkText: "Start Case Analysis",
    },
    {
      icon: MapPin, title: "Find Your Court & Jurisdiction",
      description: "Determine whether your case belongs in federal, state, or local court based on your location and issue type.",
      link: "/court-records", linkText: "Court Records Lookup",
    },
    {
      icon: Search, title: "Research Public Case Law",
      description: "Search opinions, dockets, and oral arguments from CourtListener — all publicly available federal and state court data.",
      link: "/courtlistener", linkText: "Search CourtListener",
    },
    {
      icon: FileText, title: "Find Court Forms",
      description: "Browse official California and New York court forms. Learn what each form is for and where it is generally filed. Other states coming soon.",
      link: "/usa-forms", linkText: "US Forms Catalog",
    },
    {
      icon: FolderOpen, title: "Organize Your Documents",
      description: "Upload your documents and put them into one PDF with numbered exhibits and a table of contents. Check your court's rules for exhibits before you file.",
      link: "/book-of-documents", linkText: "Book of Documents",
    },
    {
      icon: BookOpen, title: "Legal Glossary",
      description: "Look up legal terms in plain English. Understand motions, pleadings, discovery, and more without a law degree.",
      link: "/legal-glossary", linkText: "Browse Glossary",
    },
    {
      icon: Gavel, title: "Courtroom Preparation",
      description: "Learn what to expect in court, how to address a judge, what to bring, and how to present your case professionally.",
      link: "/courtroom-prep", linkText: "Prepare for Court",
    },
    {
      icon: GraduationCap, title: "Parenting Courses",
      description: "Find parenting and co-parenting courses offered by outside providers, and keep your own record of enrollment and certificates. Check with your court that a course is accepted.",
      link: "/courses", linkText: "Course Hub",
    },
  ];

  const proceduralChecklists = [
    {
      title: "Filing a Civil Complaint",
      steps: [
        "Identify the correct court (jurisdiction and venue)",
        "Obtain the complaint form from your court clerk's office or website",
        "Write a clear statement of facts describing what happened",
        "Identify the legal basis for your claim (statute or common law)",
        "List the relief you are seeking (money damages, injunction, etc.)",
        "File the complaint with the court clerk and pay the filing fee (or request a fee waiver)",
        "Serve the defendant with a copy of the complaint and summons",
        "Keep proof of service for your records",
        "Wait for the defendant's response (usually 20-30 days)",
      ],
    },
    {
      title: "Responding to a Lawsuit",
      steps: [
        "Read the complaint carefully — note the deadline to respond",
        "Determine if you need to file an Answer or a Motion to Dismiss",
        "Obtain the correct response form from your court",
        "Address each allegation in the complaint (admit, deny, or insufficient knowledge)",
        "Include any affirmative defenses you may have",
        "Include any counterclaims if the plaintiff owes you something",
        "File your response with the court clerk before the deadline",
        "Serve a copy on the plaintiff or their attorney",
        "Keep copies of everything you file",
      ],
    },
    {
      title: "Requesting Public Records (FOIA)",
      steps: [
        "Identify the government agency that holds the records you need",
        "Determine whether the request is federal (FOIA) or state-specific",
        "Draft your request letter with specific descriptions of records sought",
        "Include your contact information and preferred format (electronic/paper)",
        "Submit via the agency's preferred method (online portal, email, or mail)",
        "Note the agency's statutory response deadline (usually 20 business days for federal)",
        "Follow up if you don't receive a response within the deadline",
        "If denied, review the exemption cited and consider filing an appeal",
      ],
    },
    {
      title: "Small Claims Court",
      steps: [
        "Verify your claim amount is within your state's small claims limit",
        "Attempt to resolve the dispute informally first (demand letter)",
        "File a claim at your local small claims court",
        "Pay the filing fee set by the court, or ask the clerk about a fee waiver if you cannot afford it",
        "Serve the defendant according to your court's rules",
        "Gather your evidence: contracts, receipts, photos, correspondence",
        "Organize evidence chronologically",
        "Prepare a brief, clear statement of your case",
        "Attend your hearing on time, dressed appropriately",
        "Bring copies of all evidence for the judge and defendant",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Self-Help Legal Guide | Justice Bot USA — Tools for Self-Represented Litigants</title>
        <meta name="description" content="Free self-help legal tools for self-represented litigants. Identify your case type, find court forms, research case law, organize evidence, and prepare for court. Not legal advice." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://justicebot-usa.com/self-help" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Self-Help Legal Guide</h1>
            </div>
            <p className="text-lg opacity-90 max-w-3xl mx-auto mb-6">
              Practical tools and guidance for self-represented litigants navigating the U.S. legal system.
              Understand your case, find your court, organize your evidence, and prepare with confidence.
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Live in CA & NY • Public Information Only • Not Legal Advice
            </Badge>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="container mx-auto px-4 py-6 max-w-5xl">
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Justice Bot USA is <strong>not a law firm</strong> and does not provide legal advice.
              All information on this page is publicly available and provided for educational purposes only.
              No attorney-client relationship is created by using these tools. <strong>Use at your own risk.</strong>{" "}
              For advice specific to your situation, consult a licensed attorney.{" "}
              <Link to="/disclaimer" className="underline font-medium">Read full disclaimer →</Link>
            </AlertDescription>
          </Alert>
        </section>

        {/* Tool Cards */}
        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <h2 className="text-2xl font-bold mb-2 text-center">Your Self-Help Toolkit</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Each tool helps you with a specific part of your legal journey. Start anywhere — they all work independently.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolCards.map((tool) => (
              <Card key={tool.title} className="border-border hover:border-primary/40 transition-colors flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <tool.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{tool.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={tool.link}>
                      {tool.linkText}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Procedural Checklists */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Common Procedural Checklists
            </h2>
            <p className="text-muted-foreground mb-6">
              High-level steps for common legal procedures. These are <strong>general guides</strong> — your specific court may have additional requirements.
            </p>

            <Accordion type="single" collapsible className="w-full">
              {proceduralChecklists.map((checklist, idx) => (
                <AccordionItem key={idx} value={`checklist-${idx}`}>
                  <AccordionTrigger className="text-lg font-semibold">{checklist.title}</AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-3 pl-1">
                      {checklist.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-xs text-muted-foreground italic">
                      This is general procedural information, not legal advice. Rules vary by jurisdiction.
                      Always verify requirements with your local court clerk.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* What This Platform Does / Does Not */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  What Justice Bot USA Does
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Help you understand legal processes in plain language</li>
                  <li>✓ Identify which records or documents may exist</li>
                  <li>✓ Identify relevant courts or agencies</li>
                  <li>✓ Let you fill in official California and New York forms, and draft public records requests, with your own answers</li>
                  <li>✓ Provide procedural guidance for self-represented individuals</li>
                  <li>✓ Organize your evidence chronologically</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  What Justice Bot USA Does NOT Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✗ Provide legal advice or representation</li>
                  <li>✗ Confirm active warrants or enforcement actions</li>
                  <li>✗ Access sealed or private databases</li>
                  <li>✗ Monitor or surveil individuals</li>
                  <li>✗ Predict case outcomes</li>
                  <li>✗ File documents on your behalf</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-primary/5 border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-xl font-bold mb-4">Need More Help?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/legal-areas">Browse Legal Areas</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/criminal-defense-guide">Criminal Defense Guide</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/public-records-request">FOIA Request Generator</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/support">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/disclaimer">Legal Disclaimer</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/terms">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SelfHelpHub;
