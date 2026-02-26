import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, AlertTriangle } from "lucide-react";

interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  category: string;
}

const glossaryData: GlossaryEntry[] = [
  { term: "Affidavit", definition: "A written statement of facts made under oath. Used as evidence in court proceedings.", example: "You might file an affidavit to support your version of events when you can't testify in person.", category: "Documents" },
  { term: "Answer", definition: "The formal written response a defendant files in response to a complaint or petition.", example: "After being served with a lawsuit, you typically have 20-30 days to file an Answer.", category: "Pleadings" },
  { term: "Appeal", definition: "A request to a higher court to review and change the decision of a lower court.", example: "If you disagree with the judge's ruling, you can file an appeal within the time limit set by your state.", category: "Procedures" },
  { term: "Arraignment", definition: "A court hearing where a criminal defendant is formally told about the charges and asked to plead guilty or not guilty.", category: "Criminal" },
  { term: "Bail", definition: "Money or property given to the court to guarantee that a person released from jail will return for their court date.", category: "Criminal" },
  { term: "Brief", definition: "A written document submitted to a court that presents legal arguments supporting one side of a case.", category: "Documents" },
  { term: "Burden of Proof", definition: "The obligation to prove the facts in a case. In civil cases, this is 'preponderance of the evidence' (more likely than not). In criminal cases, it's 'beyond a reasonable doubt.'", category: "Concepts" },
  { term: "Cause of Action", definition: "The legal basis for a lawsuit — the facts and law that give you the right to sue.", example: "Breach of contract is a common cause of action in civil cases.", category: "Concepts" },
  { term: "Complaint", definition: "The first document filed in a civil lawsuit that describes the plaintiff's claims against the defendant.", category: "Pleadings" },
  { term: "Continuance", definition: "A postponement of a court hearing or trial to a later date.", example: "You can request a continuance if you need more time to prepare your case.", category: "Procedures" },
  { term: "Counterclaim", definition: "A claim made by a defendant against the plaintiff in the same lawsuit.", example: "If someone sues you for money, but they actually owe you money, you can file a counterclaim.", category: "Pleadings" },
  { term: "Cross-Examination", definition: "Questioning of a witness by the opposing party after direct examination.", category: "Trial" },
  { term: "Damages", definition: "Money a court orders the losing side to pay the winning side to compensate for harm or injury.", category: "Remedies" },
  { term: "Default Judgment", definition: "A ruling entered against a defendant who fails to respond to a lawsuit within the required time.", example: "If you don't file an Answer by the deadline, the court can enter a default judgment against you.", category: "Procedures" },
  { term: "Defendant", definition: "The person or entity being sued in a civil case or accused in a criminal case.", category: "Parties" },
  { term: "Deposition", definition: "Out-of-court testimony given under oath, recorded by a court reporter. Part of the discovery process.", category: "Discovery" },
  { term: "Discovery", definition: "The pre-trial process where both sides exchange information and evidence relevant to the case.", example: "During discovery, you can request documents, send written questions (interrogatories), and take depositions.", category: "Discovery" },
  { term: "Docket", definition: "A record of all filings, proceedings, and events in a case, maintained by the court clerk.", category: "Court Records" },
  { term: "Due Process", definition: "The constitutional right to fair treatment through the judicial system. Includes notice of proceedings and the opportunity to be heard.", category: "Concepts" },
  { term: "Evidence", definition: "Information presented in court to prove or disprove facts. Includes documents, testimony, photos, and physical objects.", category: "Trial" },
  { term: "Ex Parte", definition: "A proceeding or communication with the court involving only one party, without the other party present.", example: "Emergency protective orders are often granted ex parte because the situation requires immediate action.", category: "Procedures" },
  { term: "Exhibit", definition: "A document or physical item submitted as evidence during a trial or hearing.", category: "Trial" },
  { term: "Fee Waiver", definition: "A court order excusing a party from paying court fees due to financial hardship. Also called 'in forma pauperis.'", example: "If you can't afford the filing fee, you can request a fee waiver by showing proof of income.", category: "Procedures" },
  { term: "Filing", definition: "Submitting a document to the court clerk to become part of the official court record.", category: "Procedures" },
  { term: "FOIA (Freedom of Information Act)", definition: "A federal law that gives the public the right to request access to records from federal government agencies.", category: "Public Records" },
  { term: "Habeas Corpus", definition: "A legal action that requires a person being detained to be brought before a court to determine if their detention is lawful.", category: "Criminal" },
  { term: "Hearing", definition: "A court proceeding where a judge listens to arguments and evidence on a specific issue, shorter than a full trial.", category: "Procedures" },
  { term: "Injunction", definition: "A court order requiring a person to do or stop doing a specific action.", example: "A restraining order is a type of injunction that orders someone to stay away from you.", category: "Remedies" },
  { term: "Interrogatories", definition: "Written questions sent from one party to another that must be answered under oath as part of discovery.", category: "Discovery" },
  { term: "Judgment", definition: "The final decision of the court in a case.", category: "Procedures" },
  { term: "Jurisdiction", definition: "The authority of a court to hear a case. Determined by geography (where the dispute occurred) and subject matter (type of case).", category: "Concepts" },
  { term: "Lien", definition: "A legal claim against property as security for a debt. The property cannot be sold until the lien is satisfied.", category: "Remedies" },
  { term: "Mediation", definition: "A voluntary process where a neutral third party helps disputing parties reach a settlement. The mediator does not make a binding decision.", category: "Alternative Dispute Resolution" },
  { term: "Motion", definition: "A formal request to the court asking for a specific ruling or order.", example: "A 'Motion to Dismiss' asks the court to throw out the case. A 'Motion for Summary Judgment' asks for a ruling without trial.", category: "Pleadings" },
  { term: "Notarize", definition: "To have a notary public officially verify the identity of a person signing a document and witness the signature.", category: "Documents" },
  { term: "Objection", definition: "A formal protest raised during trial when a party believes the opposing side has violated a rule of evidence or procedure.", category: "Trial" },
  { term: "Plaintiff", definition: "The person or entity who starts a civil lawsuit by filing a complaint.", category: "Parties" },
  { term: "Plea", definition: "A defendant's formal response to criminal charges: guilty, not guilty, or no contest (nolo contendere).", category: "Criminal" },
  { term: "Precedent", definition: "A court decision from a previous case that guides how similar cases should be decided in the future.", category: "Concepts" },
  { term: "Pro Se / Pro Per", definition: "Representing yourself in court without an attorney. 'Pro se' means 'for oneself' in Latin.", example: "As a pro se litigant, you have the same rights as an attorney but are expected to follow the same court rules.", category: "Concepts" },
  { term: "Probation", definition: "A period of supervised release in the community instead of serving time in jail or prison.", category: "Criminal" },
  { term: "Restitution", definition: "Money a court orders a defendant to pay to a victim to compensate for losses caused by a crime.", category: "Remedies" },
  { term: "Service of Process", definition: "The formal delivery of legal documents (like a summons and complaint) to the other party, following specific rules.", example: "Most courts require personal service by a process server or sheriff, or certified mail.", category: "Procedures" },
  { term: "Settlement", definition: "An agreement between parties to resolve a dispute without going to trial.", category: "Alternative Dispute Resolution" },
  { term: "Standing", definition: "The legal right to bring a lawsuit. You must have been directly harmed or have a personal stake in the outcome.", category: "Concepts" },
  { term: "Statute of Limitations", definition: "The legal deadline for filing a lawsuit. After this time expires, you lose the right to sue.", example: "Personal injury claims typically have a 2-3 year statute of limitations depending on the state.", category: "Concepts" },
  { term: "Subpoena", definition: "A court order requiring a person to appear in court to testify or produce documents.", category: "Discovery" },
  { term: "Summary Judgment", definition: "A decision by the court without a full trial, granted when there are no disputed facts and one side is entitled to win as a matter of law.", category: "Procedures" },
  { term: "Summons", definition: "An official court document notifying a person that they are being sued and must respond within a specified time.", category: "Documents" },
  { term: "Testimony", definition: "Statements made by a witness under oath in court or in a deposition.", category: "Trial" },
  { term: "Tort", definition: "A wrongful act (other than breach of contract) that causes harm and can be the basis for a civil lawsuit.", example: "Negligence, defamation, and assault are common torts.", category: "Concepts" },
  { term: "Venue", definition: "The specific court location where a case should be filed, usually based on where the events occurred or where the parties live.", category: "Concepts" },
  { term: "Verdict", definition: "The jury's decision in a case, or a judge's decision in a bench trial.", category: "Trial" },
  { term: "Voir Dire", definition: "The process of questioning potential jurors to determine if they can be fair and impartial.", category: "Trial" },
  { term: "Writ", definition: "A formal written order issued by a court directing a person or entity to perform or stop performing a specific act.", category: "Documents" },
];

const categories = [...new Set(glossaryData.map(e => e.category))].sort();

const SelfHelpLegalGlossary = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return glossaryData
      .filter(e => {
        const matchesSearch = !q || e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q);
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

  return (
    <>
      <Helmet>
        <title>Legal Glossary | Veritas Path — Plain Language Legal Terms</title>
        <meta name="description" content="Look up legal terms in plain English. Understand motions, pleadings, discovery, evidence, and court procedures without a law degree. Free legal glossary for self-represented litigants." />
        <link rel="canonical" href="https://us-justice-bot.lovable.app/legal-glossary" />
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

        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No terms match your search.</p>
          ) : (
            Object.entries(letterGroups).map(([letter, entries]) => (
              <div key={letter} className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-3 border-b border-border pb-1">{letter}</h2>
                <div className="space-y-3">
                  {entries.map(entry => (
                    <Card key={entry.term} className="border-border">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{entry.term}</h3>
                          <Badge variant="secondary" className="text-xs shrink-0">{entry.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.definition}</p>
                        {entry.example && (
                          <p className="text-sm text-muted-foreground/80 mt-2 italic border-l-2 border-primary/20 pl-3">
                            Example: {entry.example}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SelfHelpLegalGlossary;
