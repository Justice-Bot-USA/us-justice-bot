import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, AlertTriangle, ArrowRight } from "lucide-react";

interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
  plainLanguage: string;
  example?: string;
  category: string;
  relatedPages?: { label: string; href: string }[];
}

const glossaryData: GlossaryEntry[] = [
  { term: "Affidavit", slug: "affidavit", definition: "A written statement of facts made under oath. Used as evidence in court proceedings.", plainLanguage: "A sworn written statement you sign in front of a notary. Courts treat it like testimony.", example: "You might file an affidavit to support your version of events when you can't testify in person.", category: "Documents", relatedPages: [{ label: "How to Prepare for Court", href: "/legal-help/how-to-prepare-for-court" }, { label: "Family Court Guide", href: "/legal-help/child-custody" }] },
  { term: "Alimony", slug: "alimony", definition: "Financial support paid by one spouse to another after divorce, also called spousal support or maintenance.", plainLanguage: "Money one spouse pays the other after divorce to help maintain their standard of living.", example: "A court may order alimony if one spouse earned significantly more during the marriage.", category: "Family Law", relatedPages: [{ label: "Divorce Process", href: "/legal-help/divorce-process" }, { label: "Family Court Guide", href: "/legal-help/child-custody" }] },
  { term: "Answer", slug: "answer", definition: "The formal written response a defendant files in response to a complaint or petition.", plainLanguage: "Your official reply to a lawsuit. If you don't file one, you could lose by default.", example: "After being served with a lawsuit, you typically have 20-30 days to file an Answer.", category: "Pleadings", relatedPages: [{ label: "Eviction Defense", href: "/legal-help/eviction" }, { label: "Small Claims Court", href: "/legal-help/small-claims-court" }] },
  { term: "Appeal", slug: "appeal", definition: "A request to a higher court to review and change the decision of a lower court.", plainLanguage: "Asking a higher court to look at your case again because you think the first court got it wrong.", category: "Procedures" },
  { term: "Arraignment", slug: "arraignment", definition: "A court hearing where a criminal defendant is formally told about the charges and asked to plead guilty or not guilty.", plainLanguage: "Your first appearance in criminal court where the judge reads your charges and you say guilty or not guilty.", category: "Criminal", relatedPages: [{ label: "Criminal Court Process", href: "/legal-help/criminal-court-process" }, { label: "What to Do After Arrest", href: "/legal-help/what-to-do-after-arrest" }] },
  { term: "Bail", slug: "bail", definition: "Money or property given to the court to guarantee that a person released from jail will return for their court date.", plainLanguage: "Money you pay so you can leave jail while waiting for your court date. You get it back if you show up.", category: "Criminal", relatedPages: [{ label: "Criminal Court Process", href: "/legal-help/criminal-court-process" }] },
  { term: "Burden of Proof", slug: "burden-of-proof", definition: "The obligation to prove the facts in a case. In civil cases, this is 'preponderance of the evidence' (more likely than not). In criminal cases, it's 'beyond a reasonable doubt.'", plainLanguage: "Who has to prove what. In civil court, you need to show something is 'more likely than not.' In criminal court, the prosecution must prove guilt 'beyond a reasonable doubt.'", category: "Concepts" },
  { term: "Child Support Arrears", slug: "child-support-arrears", definition: "Unpaid child support that has accumulated over time. Courts can enforce collection through wage garnishment, tax refund interception, or contempt proceedings.", plainLanguage: "Child support payments you owe but haven't paid. The court can take money from your paycheck or tax refund to collect.", category: "Family Law", relatedPages: [{ label: "Child Support Guide", href: "/legal-help/child-support" }, { label: "Family Court", href: "/legal-help/child-custody" }] },
  { term: "Complaint", slug: "complaint", definition: "The first document filed in a civil lawsuit that describes the plaintiff's claims against the defendant.", plainLanguage: "The document that starts a lawsuit. It explains who is suing whom and why.", category: "Pleadings" },
  { term: "Continuance", slug: "continuance", definition: "A postponement of a court hearing or trial to a later date.", plainLanguage: "Asking the judge to reschedule your court date. You usually need a good reason.", example: "You can request a continuance if you need more time to prepare your case.", category: "Procedures" },
  { term: "Counterclaim", slug: "counterclaim", definition: "A claim made by a defendant against the plaintiff in the same lawsuit.", plainLanguage: "When someone sues you and you sue them back in the same case.", example: "If someone sues you for money, but they actually owe you money, you can file a counterclaim.", category: "Pleadings" },
  { term: "Damages", slug: "damages", definition: "Money a court orders the losing side to pay the winning side to compensate for harm or injury.", plainLanguage: "The money you can win in a lawsuit to make up for what happened to you.", category: "Remedies", relatedPages: [{ label: "Settlement Calculator", href: "/injury-settlement-calculator" }, { label: "Small Claims Court", href: "/legal-help/small-claims-court" }] },
  { term: "Default Judgment", slug: "default-judgment", definition: "A ruling entered against a defendant who fails to respond to a lawsuit within the required time.", plainLanguage: "If you don't respond to a lawsuit on time, the court can automatically rule against you.", example: "If you don't file an Answer by the deadline, the court can enter a default judgment against you.", category: "Procedures", relatedPages: [{ label: "Eviction Defense", href: "/legal-help/eviction" }] },
  { term: "Deposition", slug: "deposition", definition: "Out-of-court testimony given under oath, recorded by a court reporter. Part of the discovery process.", plainLanguage: "Answering questions under oath before the trial, usually in a lawyer's office. It's recorded and can be used in court.", category: "Discovery" },
  { term: "Discovery", slug: "discovery", definition: "The pre-trial process where both sides exchange information and evidence relevant to the case.", plainLanguage: "The part before trial where both sides share documents and information with each other.", category: "Discovery" },
  { term: "Due Process", slug: "due-process", definition: "The constitutional right to fair treatment through the judicial system. Includes notice of proceedings and the opportunity to be heard.", plainLanguage: "Your right to be treated fairly by the legal system — including being told about your case and getting a chance to speak.", category: "Concepts", relatedPages: [{ label: "Civil Rights Guide", href: "/legal-help/discrimination-law" }] },
  { term: "Eviction Notice", slug: "eviction-notice", definition: "A written notice from a landlord informing a tenant that they must fix a problem (like unpaid rent) or leave the property within a specified time period.", plainLanguage: "A letter from your landlord saying you need to pay rent, fix something, or move out — usually within 3 to 30 days.", example: "Common types include 3-Day Pay or Quit, 30-Day Notice to Vacate, and Cure or Quit notices.", category: "Housing", relatedPages: [{ label: "How to Fight Eviction", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "Free Eviction Defense Tool", href: "/free-eviction-defense-tool" }] },
  { term: "Ex Parte", slug: "ex-parte", definition: "A proceeding or communication with the court involving only one party, without the other party present.", plainLanguage: "Going to court without the other side being there, usually for emergencies like restraining orders.", category: "Procedures" },
  { term: "Fee Waiver", slug: "fee-waiver", definition: "A court order excusing a party from paying court fees due to financial hardship.", plainLanguage: "If you can't afford court filing fees, you can ask the court to waive them by showing proof of low income.", category: "Procedures", relatedPages: [{ label: "Small Claims Court", href: "/legal-help/small-claims-court" }] },
  { term: "Habeas Corpus", slug: "habeas-corpus", definition: "A legal action that requires a person being detained to be brought before a court to determine if their detention is lawful.", plainLanguage: "A way to challenge being held in jail by asking a court to decide if you're being detained legally.", category: "Criminal" },
  { term: "Injunction", slug: "injunction", definition: "A court order requiring a person to do or stop doing a specific action.", plainLanguage: "A court order that tells someone they must do something or stop doing something.", category: "Remedies" },
  { term: "Interrogatories", slug: "interrogatories", definition: "Written questions sent from one party to another that must be answered under oath as part of discovery.", plainLanguage: "Written questions the other side sends you that you have to answer honestly, under oath.", category: "Discovery" },
  { term: "Jurisdiction", slug: "jurisdiction", definition: "The authority of a court to hear a case. Determined by geography (where the dispute occurred) and subject matter (type of case).", plainLanguage: "Whether a particular court has the power to handle your case. It depends on where you are and what the case is about.", category: "Concepts", relatedPages: [{ label: "Tribal Jurisdiction Check", href: "/legal-help/tribal-jurisdiction-check" }, { label: "Tribal Jurisdiction", href: "/legal-help/tribal-jurisdiction" }] },
  { term: "Lien", slug: "lien", definition: "A legal claim against property as security for a debt. The property cannot be sold until the lien is satisfied.", plainLanguage: "A legal hold on your property because you owe money. You can't sell or refinance until it's paid off.", category: "Remedies" },
  { term: "Mediation", slug: "mediation", definition: "A voluntary process where a neutral third party helps disputing parties reach a settlement.", plainLanguage: "Sitting down with a neutral person who helps you and the other side try to work out a deal without going to trial.", category: "Alternative Dispute Resolution" },
  { term: "Motion", slug: "motion", definition: "A formal request to the court asking for a specific ruling or order.", plainLanguage: "A written request asking the judge to do something, like dismiss the case or exclude evidence.", category: "Pleadings" },
  { term: "Motion to Dismiss", slug: "motion-to-dismiss", definition: "A motion asking the court to throw out the case, arguing there is no valid legal claim or the court lacks jurisdiction.", plainLanguage: "Asking the judge to throw out the entire case because the other side doesn't have a valid legal reason to sue.", example: "A defendant might file a motion to dismiss if the statute of limitations has expired.", category: "Pleadings", relatedPages: [{ label: "Criminal Defense", href: "/legal-help/criminal-court-process" }, { label: "Small Claims Court", href: "/legal-help/small-claims-court" }] },
  { term: "Plaintiff", slug: "plaintiff", definition: "The person or entity who starts a civil lawsuit by filing a complaint.", plainLanguage: "The person who files the lawsuit — the one doing the suing.", category: "Parties" },
  { term: "Plea Bargain", slug: "plea-bargain", definition: "An agreement between the defendant and prosecutor where the defendant pleads guilty to a lesser charge in exchange for a lighter sentence.", plainLanguage: "A deal where you agree to plead guilty to a less serious charge to avoid the risk of a harsher sentence at trial.", category: "Criminal", relatedPages: [{ label: "Criminal Court Process", href: "/legal-help/criminal-court-process" }] },
  { term: "Probate", slug: "probate", definition: "The legal process of administering a deceased person's estate, including validating their will, paying debts, and distributing assets.", plainLanguage: "The court process for handling someone's property and debts after they die, including following their will.", category: "Estates" },
  { term: "Pro Se", slug: "pro-se", definition: "Representing yourself in court without an attorney. Also called 'pro per.'", plainLanguage: "Going to court without a lawyer and speaking for yourself. You have the right to do this but must follow court rules.", category: "Concepts", relatedPages: [{ label: "How to Prepare for Court", href: "/legal-help/how-to-prepare-for-court" }, { label: "Courtroom Prep", href: "/courtroom-prep" }] },
  { term: "Restraining Order", slug: "restraining-order", definition: "A court order that prohibits a person from contacting or coming near another person. Also called a protective order.", plainLanguage: "A court order that legally requires someone to stay away from you and not contact you.", example: "Victims of domestic violence can request emergency restraining orders.", category: "Remedies", relatedPages: [{ label: "Protective Orders", href: "/legal-help/protective-orders" }, { label: "Family Court", href: "/legal-help/child-custody" }] },
  { term: "Service of Process", slug: "service-of-process", definition: "The formal delivery of legal documents (like a summons and complaint) to the other party.", plainLanguage: "Officially delivering court papers to the person being sued so they know about the case.", category: "Procedures" },
  { term: "Statute of Limitations", slug: "statute-of-limitations", definition: "The legal deadline for filing a lawsuit. After this time expires, you lose the right to sue.", plainLanguage: "The clock on how long you have to file a lawsuit. Once time runs out, you can't sue anymore.", example: "Personal injury claims typically have a 2-3 year statute of limitations depending on the state.", category: "Concepts" },
  { term: "Subpoena", slug: "subpoena", definition: "A court order requiring a person to appear in court to testify or produce documents.", plainLanguage: "An official order from the court saying you must show up to testify or bring certain documents.", category: "Discovery", relatedPages: [{ label: "Defense Evidence Guide", href: "/legal-help/defense-evidence" }] },
  { term: "Summons", slug: "summons", definition: "An official court document notifying a person that they are being sued and must respond within a specified time.", plainLanguage: "The official paper telling you someone has filed a lawsuit against you and you need to respond by a deadline.", category: "Documents", relatedPages: [{ label: "Eviction Defense", href: "/legal-help/eviction" }, { label: "Small Claims Court", href: "/legal-help/small-claims-court" }] },
  { term: "Tort", slug: "tort", definition: "A wrongful act (other than breach of contract) that causes harm and can be the basis for a civil lawsuit.", plainLanguage: "Something someone did wrong that hurt you, like negligence or defamation, that you can sue over.", category: "Concepts" },
  { term: "Venue", slug: "venue", definition: "The specific court location where a case should be filed.", plainLanguage: "Which specific courthouse your case should go to, usually based on where you live or where the problem happened.", category: "Concepts" },
  { term: "Verdict", slug: "verdict", definition: "The jury's decision in a case, or a judge's decision in a bench trial.", plainLanguage: "The final decision — guilty or not guilty in criminal court, or who wins in civil court.", category: "Trial" },
  { term: "Writ", slug: "writ", definition: "A formal written order issued by a court directing a person or entity to perform or stop performing a specific act.", plainLanguage: "A written court order telling someone to do something or stop doing something.", category: "Documents" },
];

const categories = [...new Set(glossaryData.map(e => e.category))].sort();

const LegalGlossary = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return glossaryData
      .filter(e => {
        const matchesSearch = !q || e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q) || e.plainLanguage.toLowerCase().includes(q);
        const matchesCat = !selectedCategory || e.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  const letterGroups = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {};
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(entry);
    }
    return groups;
  }, [filtered]);

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Legal Glossary",
    description: "Plain-language definitions of common legal terms for self-represented litigants.",
    url: "https://justicebot-usa.com/legal-glossary",
    hasDefinedTerm: glossaryData.map(entry => ({
      "@type": "DefinedTerm",
      name: entry.term,
      description: entry.definition,
      url: `https://justicebot-usa.com/legal-glossary#${entry.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://justicebot-usa.com" },
      { "@type": "ListItem", position: 2, name: "Legal Glossary", item: "https://justicebot-usa.com/legal-glossary" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Legal Glossary | Plain Language Legal Terms | A.I. ANAL</title>
        <meta name="description" content="Look up legal terms in plain English. Understand arraignment, probate, alimony, subpoena, affidavit, restraining orders, and 30+ more terms. Free legal glossary for self-represented litigants." />
        <meta name="keywords" content="legal glossary, legal terms, what is arraignment, what is probate, what is alimony, legal definitions, court terminology, legal vocabulary" />
        <link rel="canonical" href="https://justicebot-usa.com/legal-glossary" />
        <meta property="og:title" content="Legal Glossary | Plain Language Legal Terms" />
        <meta property="og:description" content="Free legal glossary with plain-language definitions of 40+ common court and legal terms." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(definedTermSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Legal Glossary</h1>
            </div>
            <p className="opacity-90 max-w-2xl mx-auto">
              Plain-language definitions of common legal terms. Written for people, not lawyers.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6 max-w-4xl">
          <Alert className="border-border">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This glossary provides general definitions for educational purposes only. Legal terms may have specific meanings in your jurisdiction.
              This is not legal advice. <Link to="/disclaimer" className="underline">Full disclaimer →</Link>
            </AlertDescription>
          </Alert>
        </section>

        <section className="container mx-auto px-4 pb-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms or definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All ({glossaryData.length})
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-4xl">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No terms match your search.</p>
          ) : (
            Object.entries(letterGroups).map(([letter, entries]) => (
              <div key={letter} className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-3 border-b border-border pb-1">{letter}</h2>
                <div className="space-y-3">
                  {entries.map(entry => (
                    <Card key={entry.term} id={entry.slug} className="border-border scroll-mt-20">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-lg">{entry.term}</h3>
                          <Badge variant="secondary" className="text-xs shrink-0">{entry.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{entry.definition}</p>
                        <p className="text-sm text-foreground/80 bg-accent/30 rounded p-2 mb-2">
                          <strong>In plain language:</strong> {entry.plainLanguage}
                        </p>
                        {entry.example && (
                          <p className="text-sm text-muted-foreground/80 italic border-l-2 border-primary/20 pl-3 mb-2">
                            Example: {entry.example}
                          </p>
                        )}
                        {entry.relatedPages && entry.relatedPages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {entry.relatedPages.map(rp => (
                              <Link key={rp.href} to={rp.href} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                <ArrowRight className="h-3 w-3" /> {rp.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Cross-linking section */}
        <section className="container mx-auto px-4 pb-12 max-w-4xl">
          <Card className="bg-primary/5">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-3">Need Help With a Legal Issue?</h2>
              <p className="text-muted-foreground mb-4 text-sm">Browse our free legal help guides for step-by-step guidance on common legal issues.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild variant="default" size="sm">
                  <Link to="/legal-help">Legal Help Library <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/case-analysis">Analyze Your Case <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/courtroom-prep">Courtroom Prep <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="container mx-auto px-4 pb-8 max-w-4xl">
          <div className="text-xs text-muted-foreground border-t pt-6">
            <p><strong>Disclaimer:</strong> This glossary provides general definitions for educational purposes only. This is legal information, not legal advice. <Link to="/disclaimer" className="underline">Full disclaimer →</Link></p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LegalGlossary;
