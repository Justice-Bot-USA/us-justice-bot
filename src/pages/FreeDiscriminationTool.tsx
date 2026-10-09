import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, FileText, Clock, CheckCircle, Home, ChevronRight } from "lucide-react";

const FreeDiscriminationTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Discrimination Complaint Helper | Get Organized | Justice Bot USA</title>
        <meta name="description" content="Free help getting ready to file a discrimination complaint. Document incidents, learn about protected characteristics, and find out where complaints are filed in California and New York." />
        <meta name="keywords" content="free discrimination complaint tool, EEOC complaint help, workplace discrimination tool, housing discrimination complaint" />
        <link rel="canonical" href="https://justicebot-usa.com/free-discrimination-complaint-helper" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Discrimination Complaint Helper</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Tool</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Free Discrimination Complaint Helper</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">Write down what happened, learn about discrimination protections, and find out where complaints are filed in California and New York.</p>
          <Button asChild size="lg" className="text-lg px-8"><Link to="/case-analysis">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Shield, title: "Know Your Rights", desc: "Read plain-language information about federal, California, and New York discrimination protections." },
            { icon: FileText, title: "Get Organized", desc: "Write down what happened, when, and who was involved, so you are ready to file with the right agency." },
            { icon: Clock, title: "Know the Deadlines", desc: "Workplace charges with the EEOC generally must be filed within 180 days, or 300 days where a state or local agency enforces a similar law. Federal employees have different rules." },
          ].map((f, i) => (
            <Card key={i}><CardContent className="p-6 text-center">
              <f.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent></Card>
          ))}
        </div>
        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to Take Action?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/case-analysis">Get a Plain-Language Summary <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/discrimination-law">Discrimination Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "CA Workplace Discrimination", href: "/legal-help/california-workplace-discrimination" },
            { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
            { label: "Civil Rights Guide", href: "/legal-help/discrimination-law" },
            { label: "California Civil Rights Steps", href: "/ca/legal-center?area=human-rights" },
            { label: "New York Human Rights Steps", href: "/ny/legal-center?area=human-rights" },
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
export default FreeDiscriminationTool;
