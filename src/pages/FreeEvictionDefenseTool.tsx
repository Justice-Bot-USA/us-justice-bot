import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, FileText, Clock, Scale, CheckCircle, Home, ChevronRight } from "lucide-react";

const FreeEvictionDefenseTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Eviction Defense Tool | Prepare Your Case | Justice Bot USA</title>
        <meta name="description" content="Free eviction help for tenants: organize your evidence, learn about possible defenses, and build a timeline. In California, fill in the official eviction Answer (UD-105) for free." />
        <meta name="keywords" content="free eviction defense tool, eviction help, fight eviction free, tenant defense tool, eviction court preparation" />
        <link rel="canonical" href="https://justicebot-usa.com/free-eviction-defense-tool" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          name: "Free Eviction Defense Tool", description: "Organize your evidence and learn about the eviction process. Legal information, not legal advice.",
          url: "https://justicebot-usa.com/free-eviction-defense-tool", applicationCategory: "LegalService", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        })}</script>
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Eviction Defense Tool</span>
        </nav>

        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Tool</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Free Eviction Defense Tool</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Don't face eviction unprepared. Organize your evidence, learn about defenses tenants commonly raise, and build a timeline. In California, fill in the official eviction Answer form (UD-105) for free.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/case-analysis">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Shield, title: "Learn About Defenses", desc: "Read plain-language information about defenses tenants commonly raise in California and New York. We don't tell you which defense applies to you." },
            { icon: FileText, title: "Answer Form (California)", desc: "In California, fill in the official eviction Answer form (UD-105) with your own answers, free. Other states are coming soon." },
            { icon: Clock, title: "Build a Timeline", desc: "Put what happened and your evidence in date order so the facts are easy to follow." },
          ].map((f, i) => (
            <Card key={i}><CardContent className="p-6 text-center">
              <f.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent></Card>
          ))}
        </div>

        <Card className="mb-12 border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> How It Works</h2>
            <div className="space-y-3">
              {["Tell us about your situation — state, notice type, and timeline", "Get a plain-language summary and links to official California and New York resources", "Upload evidence — photos, receipts, communications", "In California, fill in the official Answer form (UD-105) with your own answers", "Read general information about what happens at an eviction hearing"].map((s, i) => (
                <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{s}</p></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Build Your Defense?</h2>
          <p className="text-muted-foreground mb-6">Start organizing your eviction defense today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/fill/ca/ud-105">Fill the CA Answer (UD-105) <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/eviction">Read Eviction Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "California Eviction Process", href: "/legal-help/california-eviction-process" },
            { label: "New York Eviction Process", href: "/legal-help/new-york-eviction-process" },
            { label: "Tenant Rights Guide", href: "/legal-help/tenant-rights" },
            { label: "General Eviction Guide", href: "/legal-help/eviction" },
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

export default FreeEvictionDefenseTool;
