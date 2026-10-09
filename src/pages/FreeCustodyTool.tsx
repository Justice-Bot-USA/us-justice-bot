import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, FileText, Calendar, CheckCircle, Home, ChevronRight } from "lucide-react";

const FreeCustodyTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Custody Case Organizer | Prepare for Family Court | Justice Bot USA</title>
        <meta name="description" content="Free child custody case organizer. Write down your parenting involvement, organize your evidence, and learn what to expect at a custody hearing. Live in California and New York; other states coming soon." />
        <meta name="keywords" content="free custody tool, child custody organizer, custody case preparation, family court preparation free" />
        <link rel="canonical" href="https://justicebot-usa.com/free-custody-case-organizer" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Custody Case Organizer</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Tool</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Free Custody Case Organizer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">Write down your parenting involvement, organize your evidence, and learn what to expect in family court.</p>
          <Button asChild size="lg" className="text-lg px-8"><Link to="/case-analysis">Start Organizing Now <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, title: "Parenting Documentation", desc: "Log your involvement in your child's daily life, education, health, and activities." },
            { icon: FileText, title: "Organize Your Facts", desc: "Write down your parenting involvement in one place so you are ready when you fill out your court's forms." },
            { icon: Calendar, title: "Think Through a Schedule", desc: "Write down the parenting schedule you would ask for, so you can explain it clearly." },
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
            {["Describe your custody situation and select your state", "Document your parenting involvement and the child's needs", "Upload evidence: school records, communications, photos", "Find the official California or New York custody forms in our legal centers", "Read general information about custody hearings"].map((s, i) => (
              <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{s}</p></div>
            ))}
          </div>
        </CardContent></Card>
        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to Prepare Your Custody Case?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/case-analysis">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/child-custody">Custody Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "California Child Custody", href: "/legal-help/california-child-custody" },
            { label: "New York Family Steps & Forms", href: "/ny/legal-center?area=family" },
            { label: "Divorce Process Guide", href: "/legal-help/divorce-process" },
            { label: "Protective Orders", href: "/legal-help/protective-orders" },
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
export default FreeCustodyTool;
