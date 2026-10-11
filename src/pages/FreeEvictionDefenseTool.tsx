import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, FileText, Clock, Scale, CheckCircle, Home, ChevronRight } from "lucide-react";
import { GuideDisclaimer } from "@/components/legal-help/OfficialFormList";

const FreeEvictionDefenseTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Eviction Defense Tool | Prepare Your Case | Justice Bot USA</title>
        <meta name="description" content="Free eviction information for tenants in California and New York: deadlines to respond, defenses tenants commonly raise, and free help. In California, fill in the official eviction Answer (UD-105) for free." />
        <meta name="keywords" content="free eviction defense tool, eviction help, fight eviction free, tenant defense tool, eviction court preparation" />
        <link rel="canonical" href="https://justicebot-usa.com/free-eviction-defense-tool" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          name: "Free Eviction Defense Tool", description: "Fill in California's eviction Answer (UD-105) for free and learn about the eviction process. Legal information, not legal advice.",
          url: "https://justicebot-usa.com/free-eviction-defense-tool", applicationCategory: "ReferenceApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            Don't face eviction unprepared. Learn the deadline to respond and the defenses tenants commonly raise. In California, fill in the official eviction Answer form (UD-105) for free, then file it with the court yourself.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/fill/ca/ud-105">Fill the CA Answer (UD-105) <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Shield, title: "Learn About Defenses", desc: "Read plain-language information about defenses tenants commonly raise in California and New York. We don't tell you which defense applies to you." },
            { icon: FileText, title: "Answer Form (California)", desc: "In California, fill in the official eviction Answer form (UD-105) with your own answers, free. Other states are coming soon." },
            { icon: Clock, title: "Know Your Deadline", desc: "In California, the Answer is usually due within 10 court days after you are served. In New York City Housing Court, nonpayment cases usually need an answer within 10 days; holdover cases are answered at the first court date." },
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
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> What Tenants Usually Do</h2>
            <div className="space-y-3">
              {["Read the papers you were served and find the deadline to respond", "Read the eviction guide and the official California and New York court resources", "Gather your lease, rent receipts, photos, and messages with your landlord", "In California, fill in the official Answer form (UD-105) with your own answers and file it with the court; in New York City, free help is available from Housing Court Answers at (212) 962-4795", "Read general information about what happens at an eviction hearing"].map((s, i) => (
                <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{s}</p></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-foreground">Free legal help</h2>
            <p className="text-sm text-foreground/90">New York City: many tenants can get a free lawyer for a Housing Court eviction case under the city&apos;s right-to-counsel law, depending on household income. At your first court date, say &quot;I would like an attorney.&quot; Questions: Housing Court Answers, (212) 962-4795.</p>
            <p className="text-sm text-foreground/90">California: your court&apos;s self-help center (<a href="https://selfhelp.courts.ca.gov/eviction-tenant" className="text-primary underline" target="_blank" rel="noopener noreferrer">selfhelp.courts.ca.gov/eviction-tenant</a>) or local legal aid. Elsewhere in New York: <a href="https://www.lawhelpny.org/" className="text-primary underline" target="_blank" rel="noopener noreferrer">LawHelpNY.org</a>.</p>
            <p className="text-xs text-muted-foreground">These are outside organizations. Justice Bot USA does not refer you to a lawyer.</p>
          </CardContent>
        </Card>

        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">Served With Eviction Papers?</h2>
          <p className="text-muted-foreground mb-6">Deadlines are short. Check yours and get free help as soon as you can.</p>
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
        <GuideDisclaimer />
      </main>
      <Footer />
    </div>
  );
};

export default FreeEvictionDefenseTool;
