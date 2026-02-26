import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface GlossaryTerm {
  term: string;
  definition: string;
}

const GLOSSARY: Record<string, GlossaryTerm> = {
  affidavit: { term: "Affidavit", definition: "A written statement of facts made under oath, used as evidence in court." },
  answer: { term: "Answer", definition: "The formal written response a defendant files in response to a complaint." },
  appeal: { term: "Appeal", definition: "A request to a higher court to review and change a lower court's decision." },
  arraignment: { term: "Arraignment", definition: "A hearing where a criminal defendant is told about charges and asked to plead." },
  bail: { term: "Bail", definition: "Money or property given to guarantee a person will return for their court date." },
  brief: { term: "Brief", definition: "A written document submitted to a court presenting legal arguments." },
  complaint: { term: "Complaint", definition: "The first document filed in a civil lawsuit describing the plaintiff's claims." },
  continuance: { term: "Continuance", definition: "A postponement of a court hearing or trial to a later date." },
  counterclaim: { term: "Counterclaim", definition: "A claim made by a defendant against the plaintiff in the same lawsuit." },
  damages: { term: "Damages", definition: "Money a court orders the losing side to pay to compensate for harm." },
  "default judgment": { term: "Default Judgment", definition: "A ruling entered against a defendant who fails to respond in time." },
  defendant: { term: "Defendant", definition: "The person or entity being sued in a civil case or accused in a criminal case." },
  deposition: { term: "Deposition", definition: "Out-of-court testimony given under oath, part of the discovery process." },
  discovery: { term: "Discovery", definition: "The pre-trial process where both sides exchange information and evidence." },
  "due process": { term: "Due Process", definition: "The constitutional right to fair treatment through the judicial system." },
  evidence: { term: "Evidence", definition: "Information presented in court to prove or disprove facts." },
  exhibit: { term: "Exhibit", definition: "A document or item submitted as evidence during a trial or hearing." },
  "fee waiver": { term: "Fee Waiver", definition: "A court order excusing a party from paying court fees due to financial hardship." },
  filing: { term: "Filing", definition: "Submitting a document to the court clerk for the official record." },
  hearing: { term: "Hearing", definition: "A court proceeding where a judge listens to arguments on a specific issue." },
  injunction: { term: "Injunction", definition: "A court order requiring someone to do or stop doing a specific action." },
  judgment: { term: "Judgment", definition: "The final decision of the court in a case." },
  jurisdiction: { term: "Jurisdiction", definition: "The authority of a court to hear a case, based on geography and subject matter." },
  mediation: { term: "Mediation", definition: "A voluntary process where a neutral third party helps parties reach a settlement." },
  motion: { term: "Motion", definition: "A formal request to the court asking for a specific ruling or order." },
  objection: { term: "Objection", definition: "A formal protest raised during trial about a rule violation." },
  plaintiff: { term: "Plaintiff", definition: "The person or entity who starts a civil lawsuit." },
  plea: { term: "Plea", definition: "A defendant's formal response to criminal charges." },
  precedent: { term: "Precedent", definition: "A prior court decision that guides how similar cases should be decided." },
  "pro se": { term: "Pro Se", definition: "Representing yourself in court without an attorney." },
  "service of process": { term: "Service of Process", definition: "The formal delivery of legal documents to the other party." },
  settlement: { term: "Settlement", definition: "An agreement between parties to resolve a dispute without trial." },
  "statute of limitations": { term: "Statute of Limitations", definition: "The legal deadline for filing a lawsuit." },
  subpoena: { term: "Subpoena", definition: "A court order requiring a person to testify or produce documents." },
  summons: { term: "Summons", definition: "An official document notifying a person they are being sued." },
  venue: { term: "Venue", definition: "The specific court location where a case should be filed." },
  verdict: { term: "Verdict", definition: "The jury's or judge's decision in a case." },
};

/**
 * Renders a legal term with a hover tooltip showing its plain-language definition.
 * Usage: <GlossaryTooltip term="affidavit">affidavit</GlossaryTooltip>
 */
export const GlossaryTooltip = ({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) => {
  const entry = GLOSSARY[term.toLowerCase()];
  if (!entry) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="border-b border-dotted border-primary/50 cursor-help inline-flex items-center gap-1">
          {children}
          <BookOpen className="h-3 w-3 text-primary/60 inline" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-left">
        <p className="font-semibold text-sm mb-1">{entry.term}</p>
        <p className="text-xs text-muted-foreground">{entry.definition}</p>
        <Link to="/legal-glossary" className="text-xs text-primary underline mt-1 block">
          Full glossary →
        </Link>
      </TooltipContent>
    </Tooltip>
  );
};

export default GlossaryTooltip;
