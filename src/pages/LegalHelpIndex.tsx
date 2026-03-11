import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Home as HomeIcon, ChevronRight, Building, Gavel, Users, Shield, Scale, Briefcase, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  {
    title: "Eviction & Tenant Rights",
    description: "Understand the eviction process, your rights as a tenant, and how to respond to eviction notices.",
    href: "/legal-help/eviction",
    icon: Building,
    pages: [
      { label: "Eviction Process Explained", href: "/legal-help/eviction-process" },
      { label: "How to Fight an Eviction", href: "/legal-help/how-to-fight-an-eviction" },
      { label: "Tenant Rights", href: "/legal-help/tenant-rights" },
      { label: "Landlord Refusing Repairs", href: "/legal-help/landlord-refusing-repairs" },
      { label: "Eviction Notice: What to Do", href: "/legal-help/eviction-notice-what-to-do" },
    ],
  },
  {
    title: "Small Claims Court",
    description: "Learn how to file or defend a small claims case, gather evidence, and prepare for your hearing.",
    href: "/legal-help/small-claims-court",
    icon: Gavel,
    pages: [
      { label: "How to File Small Claims", href: "/legal-help/how-to-file-small-claims" },
      { label: "Defending Small Claims", href: "/legal-help/how-to-defend-small-claims" },
      { label: "Small Claims Evidence", href: "/legal-help/small-claims-evidence" },
    ],
  },
  {
    title: "Family Court",
    description: "Navigate child custody, divorce, child support, and protective orders with step-by-step guidance.",
    href: "/legal-help/child-custody",
    icon: Users,
    pages: [
      { label: "Child Custody", href: "/legal-help/child-custody" },
      { label: "Divorce Process", href: "/legal-help/divorce-process" },
      { label: "Child Support", href: "/legal-help/child-support" },
      { label: "Protective Orders", href: "/legal-help/protective-orders" },
    ],
  },
  {
    title: "Civil Rights & Discrimination",
    description: "Learn about protected classes, how to document discrimination, and file complaints.",
    href: "/legal-help/discrimination-law",
    icon: Shield,
    pages: [
      { label: "Discrimination Law", href: "/legal-help/discrimination-law" },
      { label: "Filing a Civil Rights Complaint", href: "/legal-help/how-to-file-civil-rights-complaint" },
      { label: "Workplace Discrimination", href: "/legal-help/workplace-discrimination" },
      { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
    ],
  },
  {
    title: "Criminal Case Preparation",
    description: "Understand the criminal court process and how to prepare for your hearing — procedural guidance only.",
    href: "/legal-help/criminal-court-process",
    icon: Scale,
    pages: [
      { label: "What to Do After Arrest", href: "/legal-help/what-to-do-after-arrest" },
      { label: "Criminal Court Process", href: "/legal-help/criminal-court-process" },
      { label: "How to Prepare for Court", href: "/legal-help/how-to-prepare-for-court" },
      { label: "Defense Evidence", href: "/legal-help/defense-evidence" },
    ],
  },
  {
    title: "Workplace Injury & Workers' Comp",
    description: "Navigate the workers' compensation claims process, appeals, and required documentation.",
    href: "/legal-help/workers-compensation",
    icon: Briefcase,
    pages: [
      { label: "Workers' Compensation", href: "/legal-help/workers-compensation" },
      { label: "Workplace Injury Claim", href: "/legal-help/workplace-injury-claim" },
      { label: "Workers' Comp Denied", href: "/legal-help/workers-comp-denied" },
    ],
  },
  {
    title: "Native American & Tribal Rights",
    description: "Understand tribal jurisdiction, tribal courts, and how tribal membership may affect your legal matter.",
    href: "/legal-help/native-american-rights",
    icon: Heart,
    pages: [
      { label: "Native American Rights", href: "/legal-help/native-american-rights" },
      { label: "Tribal Court Explained", href: "/legal-help/tribal-court" },
      { label: "Tribal Jurisdiction", href: "/legal-help/tribal-jurisdiction" },
    ],
  },
];

const LegalHelpIndex = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Legal Help Library",
    description: "Free legal information covering eviction, small claims, family court, civil rights, criminal defense, workers' compensation, and Native American rights.",
    url: "https://justicebot-usa.com/legal-help",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Legal Help Library | Eviction, Small Claims, Family Court | Veritas Path</title>
        <meta name="description" content="Free legal help guides covering eviction defense, small claims court, family law, civil rights, criminal defense, workers' comp, and Native American tribal rights. Step-by-step guidance for all 50 states." />
        <meta name="keywords" content="free legal help, eviction help, small claims court, tenant rights, child custody, discrimination complaint, workers compensation, tribal rights, legal guide" />
        <link rel="canonical" href="https://justicebot-usa.com/legal-help" />
        <meta property="og:title" content="Free Legal Help Library | Veritas Path" />
        <meta property="og:description" content="Step-by-step legal guides for tenants, parents, workers, and more." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><HomeIcon className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Legal Help Library</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Free Legal Help Library</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Plain-language guides to common legal issues in the United States. Understand the process, know your rights, and prepare your case with free tools.
        </p>

        <div className="space-y-8">
          {categories.map((cat) => (
            <Card key={cat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{cat.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{cat.description}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 ml-14">
                  {cat.pages.map((page) => (
                    <Link
                      key={page.href}
                      to={page.href}
                      className="flex items-center gap-2 text-sm p-2 rounded hover:bg-accent/50 transition-colors text-foreground/80 hover:text-foreground"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      {page.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground border-t pt-6 mt-10">
          <p><strong>Disclaimer:</strong> This is legal information, not legal advice. For advice specific to your situation, consult a licensed attorney.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalHelpIndex;
