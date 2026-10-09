import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Target, Briefcase, CheckCircle, Home, ChevronRight } from "lucide-react";

const FreeSmallClaimsTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Small Claims Case Builder | Prepare Your Case | Justice Bot USA</title>
        <meta name="description" content="Prepare for small claims court: organize your evidence and learn the process. Live in California and New York; other states coming soon." />
        <meta name="keywords" content="free small claims tool, small claims case builder, small claims court help, prepare small claims case free" />
        <link rel="canonical" href="https://justicebot-usa.com/free-small-claims-case-builder" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Small Claims Case Builder</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">California &amp; New York</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Small Claims Case Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">Prepare for small claims court step by step: organize your evidence and learn the process. In California and New York City, fill in the official small claims form with your own answers; all forms and filling instructions are included in the monthly plan, and the New York City form is free.</p>
          <Button asChild size="lg" className="text-lg px-8"><Link to="/case-analysis">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Target, title: "Add Up Your Claim", desc: "List what you're asking for and compare it with the small claims limit for your court." },
            { icon: FileText, title: "Official Claim Form", desc: "Fill in California's SC-100 or New York City's CIV-SC-50 with your own answers." },
            { icon: Briefcase, title: "Court Preparation", desc: "General information about what to bring to a small claims hearing and what usually happens there." },
          ].map((f, i) => (
            <Card key={i}><CardContent className="p-6 text-center">
              <f.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent></Card>
          ))}
        </div>
        <Card className="mb-12 border-l-4 border-l-primary bg-primary/5"><CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <div className="space-y-3">
            {["Describe your dispute and select your state", "Add up what you're asking for and check the limit for your court", "Upload contracts, receipts, and communication records", "In California or New York City, fill in the official small claims form with your own answers", "Read general information about preparing for your hearing"].map((s, i) => (
              <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{s}</p></div>
            ))}
          </div>
        </CardContent></Card>
        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to File Your Claim?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/case-analysis">Get a Plain-Language Summary <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/small-claims-court">Read Small Claims Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "California Small Claims Steps & Forms", href: "/ca/legal-center?area=civil" },
            { label: "New York Small Claims Court", href: "/legal-help/new-york-small-claims-court" },
            { label: "General Small Claims Guide", href: "/legal-help/small-claims-court" },
            { label: "Small Claims Evidence Guide", href: "/legal-help/small-claims-evidence" },
          ].map((p, i) => (
            <Link key={i} to={p.href} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors text-sm text-foreground">
              <ArrowRight className="h-4 w-4 text-primary" />{p.label}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default FreeSmallClaimsTool;
