import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const CivilRightsHelp = () => (
  <LegalHelpLayout
    title="How to File a Civil Rights or Discrimination Complaint"
    metaTitle="How to File a Discrimination Complaint | Civil Rights Guide | Justice Bot USA"
    metaDescription="Learn how to file a discrimination complaint. Understand protected classes, evidence requirements, and the complaint process for workplace, housing, and public accommodation discrimination."
    keywords="discrimination complaint, civil rights, workplace discrimination, housing discrimination, EEOC complaint, protected classes, file discrimination claim, civil rights violation"
    canonicalPath="/legal-help/discrimination-law"
    breadcrumbLabel="Civil Rights & Discrimination"
    quickAnswer="If you've experienced discrimination based on race, color, religion, sex, national origin, age, disability, or other protected characteristics, you can file a complaint with federal or state agencies. The process involves documenting the discrimination, filing within strict deadlines (usually 180-300 days), and cooperating with the investigation."
    steps={[
      { title: "Identify the Type of Discrimination", description: "Discrimination can occur in employment (hiring, firing, pay), housing (renting, buying, lending), public accommodations, education, or government services. Each has different complaint processes." },
      { title: "Know Your Protected Class", description: "Federal law protects against discrimination based on race, color, national origin, sex (including pregnancy and gender identity), religion, disability, age (40+), and genetic information. State laws may add more protections." },
      { title: "Document Everything", description: "Keep detailed records: dates, times, witnesses, what was said/done, who was involved, and how it affected you. Save emails, texts, policies, and any other evidence." },
      { title: "File with the Correct Agency", description: "Employment discrimination: EEOC or your state's civil rights agency. Housing discrimination: HUD or state agency. Public accommodation: DOJ Civil Rights Division or state agency." },
      { title: "Meet the Filing Deadline", description: "Federal employment complaints must be filed within 180 days (300 if your state has its own agency). Housing complaints: 1 year with HUD. Don't wait — deadlines are strictly enforced." },
      { title: "Cooperate with the Investigation", description: "The agency will investigate, possibly mediate, and determine whether there's reasonable cause. You may need to provide additional information or participate in mediation." },
    ]}
    evidenceItems={[
      "Written communications showing discriminatory statements",
      "Comparative evidence (how others were treated differently)",
      "Performance reviews and employment records",
      "Company policies that may be discriminatory",
      "Witness names and contact information",
      "Medical records (if discrimination caused harm)",
      "Timeline of events with specific dates",
      "Photos, recordings, or screenshots (where legally obtained)",
    ]}
    commonMistakes={[
      "Waiting too long to file — strict deadlines apply",
      "Not documenting incidents as they happen",
      "Filing with the wrong agency",
      "Quitting your job before filing (for employment cases)",
      "Not identifying all relevant protected characteristics",
      "Failing to exhaust administrative remedies before suing",
    ]}
    ctas={[
      { label: "Get a Plain-Language Summary", href: "/case-analysis" },
      { label: "Generate Complaint Draft", href: "/ai-tools/use" },
      { label: "Build Your Timeline", href: "/ai-tools/use" },
    ]}
    relatedPages={[
      { label: "Workplace Discrimination", href: "/legal-help/workplace-discrimination" },
      { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
      { label: "Free Discrimination Complaint Helper", href: "/free-discrimination-complaint-helper" },
      { label: "CA Workplace Discrimination", href: "/legal-help/california-workplace-discrimination" },
      { label: "FOIA Request Generator", href: "/foia-request-generator" },
      { label: "Legal Glossary: Due Process", href: "/legal-glossary#due-process" },
      { label: "Legal Glossary: Statute of Limitations", href: "/legal-glossary#statute-of-limitations" },
    ]}
    faqItems={[
      { question: "What is a protected class?", answer: "A protected class is a group of people sharing a common characteristic who are legally protected from discrimination. Federal protected classes include race, color, religion, sex, national origin, age (40+), disability, and genetic information." },
      { question: "Can I sue without filing a complaint first?", answer: "For employment discrimination, you typically must file with the EEOC first and receive a 'Right to Sue' letter. Housing discrimination allows both agency complaints and direct lawsuits." },
      { question: "What if my employer retaliates?", answer: "Retaliation for filing a discrimination complaint is illegal. Document any retaliatory actions and add them to your complaint. Retaliation claims can be filed even if the original discrimination claim is not sustained." },
      { question: "What counts as evidence of discrimination?", answer: "Direct evidence includes discriminatory statements. Circumstantial evidence includes being treated differently than similar employees of a different race, gender, etc. Statistical patterns and timing of adverse actions are also relevant." },
    ]}
  />
);

export default CivilRightsHelp;
