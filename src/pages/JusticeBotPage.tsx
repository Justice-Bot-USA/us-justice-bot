import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Shield, Brain, Users, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import EnhancedSEO from "@/components/EnhancedSEO";
import veritasLogo from "@/assets/veritas-path-logo.png";
import { useState } from "react";

const whatItDoes = [
  "Understand legal and administrative processes in plain language",
  "Identify what records, documents, or procedures may exist",
  "Learn which agency or court handles a matter",
  "Prepare lawful, user-initiated documents",
  "Navigate systems as a self-represented individual",
];

const whatItIsNot = [
  "Provide legal advice",
  "Confirm warrants or enforcement actions",
  "Access government or law-enforcement databases",
  "Monitor individuals",
  "Predict outcomes",
  "Replace a lawyer, judge, or agency",
];

const howItWorksSteps = [
  { num: "1", text: "You provide information voluntarily" },
  { num: "2", text: "Justice-Bot™ analyzes your input only" },
  { num: "3", text: "It matches your situation to known public processes" },
  { num: "4", text: "It explains options and prepares guidance or documents" },
  { num: "5", text: "You decide what to do next" },
];

const JusticeBotPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Justice-Bot™",
    applicationCategory: "Legal",
    operatingSystem: "Web",
    description: "Justice-Bot™ is the guidance technology behind Veritas Path, helping people navigate complex legal and administrative systems without misinformation or false certainty.",
    url: "https://justicebot-usa.com/justice-bot",
    creator: {
      "@type": "Organization",
      name: "Justice-Bot Technologies",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="What Is Justice-Bot™? | Veritas Path — Legal Guidance Technology"
        description="Justice-Bot™ is the guidance technology behind Veritas Path. It helps people navigate legal and administrative systems with clarity — without legal advice, database access, or surveillance."
        keywords="Justice-Bot, legal guidance technology, informational guidance, legal information, civic guidance, self-represented individuals"
        url="https://justicebot-usa.com/justice-bot"
      />
      <EnhancedSEO
        title="What Is Justice-Bot™? | Veritas Path"
        description="Justice-Bot™ is the guidance technology behind Veritas Path, built by Justice-Bot Technologies to help people navigate complex legal and administrative systems."
        canonicalUrl="https://justicebot-usa.com/justice-bot"
        structuredData={structuredData}
      />

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Logo + H1 */}
        <div className="text-center mb-16">
          <img src={veritasLogo} alt="Veritas Path" className="w-16 h-16 mx-auto rounded-full bg-white p-1.5 shadow-lg mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What Is Justice-Bot™?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Justice-Bot™ is the guidance technology behind Veritas Path, built by Justice-Bot Technologies to help people navigate complex legal and administrative systems without misinformation or false certainty.
          </p>
        </div>

        {/* What It Does */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What Justice-Bot™ Does</h2>
          <p className="text-muted-foreground mb-6">Justice-Bot™ helps users:</p>
          <ul className="space-y-3">
            {whatItDoes.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-6 italic">
            Justice-Bot™ is designed to reduce confusion, not replace professionals.
          </p>
        </section>

        {/* What It Is NOT */}
        <section className="mb-16 p-8 rounded-xl border-2 border-destructive/30 bg-destructive/5">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-destructive flex items-center gap-2">
            <XCircle className="h-7 w-7" />
            What Justice-Bot™ Is Not
          </h2>
          <p className="text-muted-foreground mb-6">Justice-Bot™ does not:</p>
          <ul className="space-y-3">
            {whatItIsNot.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-6 italic">
            If information is not lawfully available to the public, Justice-Bot™ does not attempt to access it.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">How Justice-Bot™ Works</h2>
          <div className="space-y-4">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {step.num}
                </div>
                <span className="text-foreground">{step.text}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6 font-medium">
            You stay in control at every step.
          </p>
        </section>

        {/* Why This Exists */}
        <section className="mb-16 text-center p-8 rounded-xl bg-muted/30 border">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Justice-Bot™ Exists</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Legal systems are hard to navigate — especially without representation.
            Justice-Bot™ exists to make procedural knowledge accessible, boundaries explicit, and next steps clear.
          </p>
          <p className="text-muted-foreground italic">
            Not shortcuts. Not guarantees. Just clarity.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate('/start')}
            className="text-lg px-10 py-6 h-auto font-bold"
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JusticeBotPage;
