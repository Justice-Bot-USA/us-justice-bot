import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const EvictionHelp = () => (
  <LegalHelpLayout
    title="How to Fight an Eviction in the United States"
    metaTitle="How to Fight an Eviction | Free Eviction Defense Guide | A.I. ANAL"
    metaDescription="Learn how to fight an eviction step by step. Understand your tenant rights, common eviction defenses, and how to prepare for court. Free eviction defense tools."
    keywords="fight eviction, eviction defense, tenant rights, how to stop eviction, eviction process, landlord eviction, eviction notice response, eviction hearing"
    canonicalPath="/legal-help/eviction"
    breadcrumbLabel="Eviction Defense"
    quickAnswer="If you receive an eviction notice, don't ignore it. You typically have a limited number of days to respond. Read the notice carefully, gather evidence, file an answer with the court, and attend your hearing. Many evictions can be fought successfully if you act quickly."
    steps={[
      { title: "Read the Eviction Notice Carefully", description: "Check the type of notice (pay or quit, cure or quit, unconditional quit), the deadline to respond, and verify the landlord followed proper procedures. Errors in the notice may be a valid defense." },
      { title: "Understand Your Rights", description: "Every state has tenant protection laws. Common rights include the right to habitable housing, protection against retaliation, and requirements for landlords to follow proper procedures before evicting." },
      { title: "File an Answer with the Court", description: "If you want to fight the eviction, you typically must file a written response (Answer) with the court by the deadline stated on the summons. This preserves your right to a hearing." },
      { title: "Gather Your Evidence", description: "Collect lease agreements, rent receipts, photos of property conditions, repair requests, communication records with your landlord, and any other documents supporting your case." },
      { title: "Identify Your Defenses", description: "Common defenses include: landlord didn't follow proper notice requirements, retaliatory eviction (you complained about conditions), discriminatory eviction, acceptance of rent after notice, or uninhabitable conditions." },
      { title: "Attend Your Court Hearing", description: "Dress professionally, bring organized evidence, arrive early, and be prepared to explain your side. Many courts also offer free mediation before hearings." },
    ]}
    evidenceItems={[
      "Lease or rental agreement",
      "All eviction notices received",
      "Rent payment receipts or bank records",
      "Photos/videos of property conditions",
      "Written repair requests to landlord",
      "Text messages, emails, or letters with landlord",
      "Witness statements from neighbors",
      "Records of code violation complaints",
    ]}
    commonMistakes={[
      "Ignoring the eviction notice — this can result in a default judgment",
      "Moving out immediately — you may have legal rights to stay and fight",
      "Not filing a written Answer with the court by the deadline",
      "Withholding rent without following your state's legal process",
      "Not bringing organized evidence to your hearing",
      "Failing to request a jury trial when available",
    ]}
    ctas={[
      { label: "Prepare Your Eviction Defense", href: "/case-analysis" },
      { label: "Generate Court Documents", href: "/forms-library" },
      { label: "Build Evidence Timeline", href: "/ai-tools/use" },
    ]}
    relatedPages={[
      { label: "Tenant Rights Guide", href: "/legal-help/tenant-rights" },
      { label: "Eviction Notice: What to Do", href: "/legal-help/eviction-notice-what-to-do" },
      { label: "Free Eviction Defense Tool", href: "/free-eviction-defense-tool" },
      { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
      { label: "California Eviction Process", href: "/legal-help/california-eviction-process" },
      { label: "Texas Eviction Process", href: "/legal-help/texas-eviction-process" },
      { label: "Legal Glossary: Eviction Notice", href: "/legal-glossary#eviction-notice" },
      { label: "Legal Glossary: Default Judgment", href: "/legal-glossary#default-judgment" },
    ]}
    faqItems={[
      { question: "Can I be evicted without a court order?", answer: "In most states, no. Landlords must go through the court process. 'Self-help' evictions (changing locks, removing belongings, shutting off utilities) are illegal in nearly every state." },
      { question: "How long does an eviction take?", answer: "Timelines vary by state, but the process typically takes 2-8 weeks from notice to hearing. Some states allow expedited processes for certain situations." },
      { question: "Can I fight an eviction if I owe rent?", answer: "Yes. You may have defenses related to habitability, improper notice, retaliation, or discrimination. Some courts also allow you to pay owed rent to stop the eviction." },
      { question: "Can I be evicted without notice?", answer: "Generally no. Almost every state requires written notice before a landlord can file for eviction. The notice period varies (3-30+ days) depending on the state and reason." },
      { question: "What happens at an eviction hearing?", answer: "Both sides present evidence and arguments to a judge. The landlord must prove grounds for eviction. You can present defenses, cross-examine witnesses, and show your evidence. The judge decides whether to grant the eviction." },
      { question: "What evidence helps in an eviction case?", answer: "Rent receipts, repair request records, photos of property conditions, communication with your landlord, witness statements, and any documentation showing the landlord violated procedures or the law." },
      { question: "Can a landlord evict me for complaining about repairs?", answer: "No — this is called retaliatory eviction and is illegal in most states. If you can show the eviction was filed after you complained about conditions or exercised a legal right, it can be a strong defense." },
    ]}
  />
);

export default EvictionHelp;
