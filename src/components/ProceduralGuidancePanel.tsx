import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertTriangle, ChevronDown, Clock, Gavel, BookOpen,
  FileText, Scale, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface ProceduralStep {
  title: string;
  description: string;
  timeframe?: string;
  glossaryTerms?: string[];
}

interface ProceduralGuide {
  label: string;
  steps: ProceduralStep[];
}

const PROCEDURAL_GUIDES: Record<string, ProceduralGuide> = {
  "family": {
    label: "Family Law",
    steps: [
      { title: "File your petition", description: "Submit your petition or complaint to the family court clerk. Pay the filing fee or request a fee waiver.", timeframe: "Day 1", glossaryTerms: ["filing", "fee waiver"] },
      { title: "Serve the other party", description: "Arrange service of process — the other party must receive copies of everything you filed.", timeframe: "Within 5–30 days", glossaryTerms: ["service of process", "summons"] },
      { title: "Wait for the response", description: "The other party typically has 20–30 days to file an answer or response.", timeframe: "20–30 days", glossaryTerms: ["answer"] },
      { title: "Attend initial hearing", description: "A judge may schedule a preliminary hearing to set temporary orders and a timeline.", timeframe: "4–8 weeks", glossaryTerms: ["hearing"] },
      { title: "Discovery period", description: "Both sides exchange relevant documents and information.", timeframe: "Varies", glossaryTerms: ["discovery"] },
      { title: "Mediation or trial", description: "Many family courts require mediation before trial. If no agreement, the case goes to trial.", timeframe: "3–12 months", glossaryTerms: ["mediation", "verdict"] },
    ],
  },
  "small-claims": {
    label: "Small Claims",
    steps: [
      { title: "Send a demand letter", description: "Before filing, send a written demand to the other party requesting payment or action.", timeframe: "Before filing" },
      { title: "File your claim", description: "Go to your local small claims court and fill out the claim form. Pay the filing fee.", timeframe: "Day 1", glossaryTerms: ["complaint", "filing"] },
      { title: "Serve the defendant", description: "The court or a process server must deliver the paperwork to the defendant.", timeframe: "Within 30 days", glossaryTerms: ["defendant", "service of process"] },
      { title: "Prepare your evidence", description: "Organize contracts, receipts, photos, and correspondence chronologically.", timeframe: "Before hearing", glossaryTerms: ["evidence", "exhibit"] },
      { title: "Attend the hearing", description: "Present your case clearly and factually. Bring 3 copies of all evidence.", timeframe: "30–70 days", glossaryTerms: ["hearing"] },
      { title: "Receive the judgment", description: "The judge decides the case, often the same day. If you win, you may need to collect.", timeframe: "Same day or mailed", glossaryTerms: ["judgment"] },
    ],
  },
  "housing": {
    label: "Housing / Eviction",
    steps: [
      { title: "Document the issue", description: "Keep records of all communication with your landlord, photos of conditions, and dates.", timeframe: "Ongoing", glossaryTerms: ["evidence"] },
      { title: "Send written notice", description: "Many housing issues require written notice to the landlord before any legal action.", timeframe: "Before filing" },
      { title: "File complaint or answer", description: "If suing, file a complaint. If being evicted, file an answer by the deadline.", timeframe: "Varies by state", glossaryTerms: ["complaint", "answer"] },
      { title: "Request a hearing", description: "Ask the court for a hearing date. Some jurisdictions schedule automatically.", timeframe: "5–30 days", glossaryTerms: ["hearing"] },
      { title: "Attend hearing or trial", description: "Present evidence of lease violations, repair requests, or your defense to eviction.", timeframe: "As scheduled", glossaryTerms: ["hearing", "evidence"] },
    ],
  },
  "employment": {
    label: "Employment",
    steps: [
      { title: "File an agency complaint", description: "Many employment claims require filing with the EEOC or state labor board first.", timeframe: "Check deadlines (often 180–300 days)" },
      { title: "Receive right-to-sue", description: "After the agency investigates, you may receive a notice allowing you to file in court.", timeframe: "Varies" },
      { title: "File your lawsuit", description: "File a civil complaint in the appropriate court within the deadline.", timeframe: "90 days after notice", glossaryTerms: ["complaint", "jurisdiction"] },
      { title: "Discovery and depositions", description: "Exchange evidence and take sworn testimony from witnesses.", timeframe: "Several months", glossaryTerms: ["discovery", "deposition"] },
      { title: "Settlement or trial", description: "Many employment cases settle before trial through negotiation or mediation.", timeframe: "6–18 months", glossaryTerms: ["settlement", "mediation"] },
    ],
  },
  "criminal": {
    label: "Criminal Defense",
    steps: [
      { title: "Arraignment", description: "You appear before a judge to hear the charges and enter a plea.", timeframe: "24–72 hours after arrest", glossaryTerms: ["arraignment", "plea"] },
      { title: "Bail hearing", description: "The court decides whether to set bail and under what conditions.", timeframe: "At arraignment", glossaryTerms: ["bail"] },
      { title: "Pre-trial motions", description: "Your side may file motions to dismiss, suppress evidence, or other requests.", timeframe: "Weeks–months", glossaryTerms: ["motion", "evidence"] },
      { title: "Discovery", description: "The prosecution must share evidence. You review police reports, witness statements, etc.", timeframe: "Ongoing", glossaryTerms: ["discovery"] },
      { title: "Plea negotiation or trial", description: "You may negotiate a plea deal, or proceed to a jury or bench trial.", timeframe: "Varies", glossaryTerms: ["plea", "verdict"] },
    ],
  },
};

// Fallback for case types not in the map
const DEFAULT_GUIDE: ProceduralGuide = {
  label: "General Civil",
  steps: [
    { title: "Identify the correct court", description: "Determine jurisdiction and venue based on your case type and location.", glossaryTerms: ["jurisdiction", "venue"] },
    { title: "File your initial documents", description: "Submit your complaint or petition with the court clerk.", glossaryTerms: ["complaint", "filing"] },
    { title: "Serve the other party", description: "Deliver copies of filed documents according to court rules.", glossaryTerms: ["service of process"] },
    { title: "Wait for a response", description: "The other party has a set number of days to respond.", glossaryTerms: ["answer"] },
    { title: "Attend hearings", description: "Appear at scheduled court dates. Be prepared and on time.", glossaryTerms: ["hearing"] },
    { title: "Await judgment", description: "The court issues a final decision after hearing both sides.", glossaryTerms: ["judgment"] },
  ],
};

interface Props {
  legalArea?: string;
  currentJourneyStep?: number;
  compact?: boolean;
}

export const ProceduralGuidancePanel = ({ legalArea, currentJourneyStep, compact = false }: Props) => {
  const [isOpen, setIsOpen] = useState(!compact);
  const guide = PROCEDURAL_GUIDES[legalArea || ""] || DEFAULT_GUIDE;

  return (
    <Card className="border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              What Typically Happens Next
              <Badge variant="secondary" className="text-xs">{guide.label}</Badge>
            </CardTitle>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              General procedural overview — not legal advice. Rules vary by jurisdiction.
            </p>

            <ol className="space-y-3">
              {guide.steps.map((step, i) => {
                const isCurrentish = currentJourneyStep !== undefined && i + 1 === currentJourneyStep;
                return (
                  <li
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      isCurrentish ? "bg-primary/10 border border-primary/20" : "bg-muted/40"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center mt-0.5 ${
                      isCurrentish ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{step.title}</span>
                        {step.timeframe && (
                          <Badge variant="outline" className="text-xs">{step.timeframe}</Badge>
                        )}
                        {isCurrentish && (
                          <Badge className="text-xs">You are here</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      {step.glossaryTerms && step.glossaryTerms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {step.glossaryTerms.map(term => (
                            <GlossaryTooltip key={term} term={term}>
                              <span className="text-xs text-primary">{term}</span>
                            </GlossaryTooltip>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/legal-glossary">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Legal Glossary
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/courtroom-prep">
                  <Gavel className="h-3 w-3 mr-1" />
                  Courtroom Prep
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/usa-forms">
                  <FileText className="h-3 w-3 mr-1" />
                  Find Forms
                </Link>
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ProceduralGuidancePanel;
