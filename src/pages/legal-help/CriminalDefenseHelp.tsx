import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const CriminalDefenseHelp = () => (
  <LegalHelpLayout
    title="Criminal Court Process: How to Prepare for Your Hearing"
    metaTitle="Criminal Court Process Explained | Court Preparation Guide | A.I. ANAL"
    metaDescription="Understand the criminal court process step by step. Learn what happens after an arrest, how hearings work, and how to prepare — procedural guidance only."
    keywords="criminal court process, what to do after arrest, criminal hearing, court preparation, criminal defense process, arraignment, plea hearing, criminal procedure"
    canonicalPath="/legal-help/criminal-court-process"
    breadcrumbLabel="Criminal Court Process"
    quickAnswer="The criminal court process generally follows these stages: arrest, booking, arraignment (where charges are read and you enter a plea), pre-trial hearings, possibly a trial, and sentencing. You have the right to an attorney at every stage. This guide explains the process — it does not provide legal advice."
    steps={[
      { title: "After Arrest: Know Your Rights", description: "You have the right to remain silent and the right to an attorney. Do not answer questions without a lawyer present. You will be booked (photographed, fingerprinted) and may be held or released on bail." },
      { title: "Arraignment", description: "Your first court appearance. The judge reads the charges, you enter a plea (guilty, not guilty, no contest), and bail may be set or reviewed. Request a public defender if you cannot afford an attorney." },
      { title: "Pre-Trial Proceedings", description: "Discovery (exchanging evidence), pre-trial motions (to suppress evidence, dismiss charges, etc.), and plea negotiations may occur. Your attorney handles most of this." },
      { title: "Prepare Your Defense Materials", description: "Organize all documents, identify witnesses, gather alibis, photos, receipts, or any evidence relevant to your case. Share everything with your attorney." },
      { title: "Trial (If Applicable)", description: "If you don't reach a plea agreement, the case goes to trial. The prosecution must prove guilt beyond a reasonable doubt. You have the right to a jury trial for serious offenses." },
      { title: "Sentencing", description: "If found guilty (or after a guilty plea), the judge imposes a sentence. This could include fines, probation, community service, or incarceration depending on the offense." },
    ]}
    evidenceItems={[
      "Police report and arrest records",
      "Any documents or evidence given by the prosecution (discovery)",
      "Alibi evidence (receipts, witnesses, photos with timestamps)",
      "Character reference letters",
      "Employment records and community ties",
      "Medical records (if relevant)",
      "Communication records that support your case",
    ]}
    commonMistakes={[
      "Talking to police without a lawyer present",
      "Discussing your case on social media",
      "Missing court dates — this can result in a warrant for your arrest",
      "Not requesting a public defender at arraignment",
      "Contacting victims or witnesses directly",
      "Violating bail conditions",
    ]}
    ctas={[
      { label: "Organize Your Case Materials", href: "/case-analysis" },
      { label: "Build Evidence Timeline", href: "/ai-tools/use" },
      { label: "Criminal Defense Guide", href: "/criminal-defense-guide" },
    ]}
    relatedPages={[
      { label: "What to Do After Arrest", href: "/legal-help/what-to-do-after-arrest" },
      { label: "Defense Evidence Guide", href: "/legal-help/defense-evidence" },
      { label: "Warrant Lookup", href: "/warrant-lookup" },
      { label: "Court Records Search", href: "/court-records" },
      { label: "Legal Glossary: Arraignment", href: "/legal-glossary#arraignment" },
      { label: "Legal Glossary: Bail", href: "/legal-glossary#bail" },
      { label: "Legal Glossary: Plea Bargain", href: "/legal-glossary#plea-bargain" },
    ]}
    faqItems={[
      { question: "What's the difference between a misdemeanor and a felony?", answer: "Misdemeanors are less serious offenses (punishable by up to 1 year in jail). Felonies are more serious (punishable by more than 1 year in prison). The classification affects the court process and potential penalties." },
      { question: "Can I represent myself in criminal court?", answer: "You have the right to represent yourself, but it's strongly discouraged in criminal cases. If you can't afford an attorney, request a public defender — they are provided free of charge." },
      { question: "What is a plea bargain?", answer: "A plea bargain is an agreement where you plead guilty to a lesser charge in exchange for a reduced sentence. Your attorney negotiates this with the prosecutor. You are not required to accept." },
      { question: "What happens if I miss a court date?", answer: "The judge will likely issue a bench warrant for your arrest. You could also lose your bail and face additional charges for failure to appear." },
      { question: "How long can the police hold me without charges?", answer: "Typically 48-72 hours, excluding weekends and holidays. After that, you must be formally charged or released. This varies by state and circumstance." },
    ]}
  />
);

export default CriminalDefenseHelp;
