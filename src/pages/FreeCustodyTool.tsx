import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Home, ChevronRight, ExternalLink } from "lucide-react";
import { OfficialFormList, GuideDisclaimer, pickForms } from "@/components/legal-help/OfficialFormList";
import { CA_FAMILY_FORMS, CA_CIVIL_FORMS } from "@/lib/ca/forms";
import { NY_FAMILY_FORMS } from "@/lib/ny/forms";

// A free guide page (the route keeps its old "organizer" slug so existing links work). There is no
// custody form filler, so it links to the official forms and the fee waiver we can fill.
const CA_STEPS = [
  "Custody orders are made in a family case. If there is already one about your child in California (such as a divorce or parentage case), you ask in that case. If not, you open one first; the court's self-help guide explains which kind.",
  "Fill out a Request for Order (FL-300). It is usually filed with FL-311 (the parenting schedule you are asking for) and FL-105 (where the child has lived for the last 5 years).",
  "File with the family court clerk. Someone 18 or older who is not you serves the other parent and fills out a proof of service. Many courthouses have a free Family Law Facilitator or self-help center that will review your forms.",
  "Go to mediation with Family Court Services. It is required when custody or visitation is contested (Family Code § 3170). Some courts use confidential mediation; others use \"recommending counseling,\" where the counselor can make a recommendation to the judge, so ask which your court uses. If there has been domestic violence or there is a protective order, you can ask to meet with the mediator separately (Family Code § 3181).",
  "Go to the hearing with copies of everything you filed. The judge may make temporary or final orders, which can be enforced once signed.",
];

const NY_STEPS = [
  "Choose the petition: Custody or Visitation (GF-17), or a change to an existing order (GF-40).",
  "File it with the Family Court intake clerk, usually in the county where the child lives. Family Court does not charge filing fees.",
  "The court issues a summons that must be delivered to the other parent before the court date. Follow the instructions on your summons.",
  "At the first court date, the judge must tell each parent about the right to a lawyer. If you can't afford one, you can ask the court to assign a lawyer for free (Family Court Act § 262). The judge may also make temporary orders, refer you to mediation, or appoint an Attorney for the Child.",
  "Many cases settle by agreement; otherwise the judge decides after a trial. If a custody or visitation order is not followed, a Petition for Enforcement of Order of Custody or Visitation (GF-41) asks the court to enforce it, and the court's free DIY program can help you prepare it.",
];

const SECTIONS = [
  {
    state: "CA" as const,
    heading: "How it usually works in California",
    steps: CA_STEPS,
    forms: [...pickForms(CA_FAMILY_FORMS, ["FL-300", "FL-311", "FL-105"]), ...pickForms(CA_CIVIL_FORMS, ["FW-001"])],
    help: { label: "California Courts: Child custody self-help", href: "https://selfhelp.courts.ca.gov/child-custody" },
  },
  {
    state: "NY" as const,
    heading: "How it usually works in New York",
    steps: NY_STEPS,
    forms: pickForms(NY_FAMILY_FORMS, ["GF-17", "GF-40", "GF-41"]),
    help: { label: "NY Courts: Family issues and divorce help", href: "https://www.nycourts.gov/help/family-issues-divorce" },
  },
];

const FreeCustodyTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Child Custody Guide: California and New York Forms | Justice Bot USA</title>
        <meta name="description" content="How a child custody or visitation case usually works in California and New York, the official court forms, filing fees, and free court help. Legal information, not legal advice. Other states coming soon." />
        <meta name="keywords" content="child custody guide, california custody forms FL-300, new york custody petition GF-17, family court custody process" />
        <link rel="canonical" href="https://justicebot-usa.com/free-custody-case-organizer" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Child Custody Guide</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Guide · California &amp; New York</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Child Custody: A Free Guide</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            How a custody or visitation case usually works in California and New York, the official forms each court uses,
            and where to get free help. Custody forms can't be filled on Justice Bot USA yet, so this page links to the
            official forms. Other states are coming soon.
          </p>
          <Button asChild size="lg" className="text-lg px-8"><Link to="/legal-help/child-custody">Read the Custody Guide <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>

        {SECTIONS.map((s) => (
          <section key={s.state} className="mb-12">
            <Card className="mb-6 border-l-4 border-l-primary bg-primary/5"><CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{s.heading}</h2>
              <div className="space-y-3">
                {s.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{step}</p></div>
                ))}
              </div>
              <a href={s.help.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline">
                {s.help.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent></Card>
            <h3 className="text-lg font-semibold mb-1">Official {s.state === "CA" ? "California" : "New York"} forms</h3>
            <p className="text-sm text-muted-foreground mb-3">Forms commonly used in these cases. You decide which ones apply to you.</p>
            <OfficialFormList state={s.state} forms={s.forms} />
          </section>
        ))}

        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">More Custody Information</h2>
          <p className="text-muted-foreground mb-6">In California, if you can't afford the court's filing fee, you can fill in the fee waiver request (FW-001) here for free.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/fill/ca/fw-001">Fill the CA Fee Waiver (FW-001) <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/child-custody">Custody Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "California Child Custody", href: "/legal-help/california-child-custody" },
            { label: "California Family Steps & Forms", href: "/ca/legal-center?area=family" },
            { label: "New York Family Steps & Forms", href: "/ny/legal-center?area=family" },
            { label: "Child Support Guide", href: "/legal-help/child-support" },
            { label: "Divorce Process Guide", href: "/legal-help/divorce-process" },
            { label: "Protective Orders", href: "/legal-help/protective-orders" },
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
export default FreeCustodyTool;
