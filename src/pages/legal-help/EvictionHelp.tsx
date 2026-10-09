import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const EvictionHelp = () => (
  <LegalHelpLayout
    title="How to Fight an Eviction in the United States"
    metaTitle="How to Fight an Eviction | Free Eviction Defense Guide | Justice Bot USA"
    metaDescription="Learn how to fight an eviction step by step. Understand your tenant rights, common eviction defenses, and how to prepare for court. State-specific steps for California and New York; other states coming soon."
    keywords="fight eviction, eviction defense, tenant rights, how to stop eviction, eviction process, landlord eviction, eviction notice response, eviction hearing"
    canonicalPath="/legal-help/eviction"
    breadcrumbLabel="Eviction Defense"
    quickAnswer="If you receive an eviction notice, don't ignore it. You typically have a limited number of days to respond. Read the notice carefully, gather evidence, file an answer with the court, and attend your hearing. Responding by the deadline preserves your right to a hearing."
    steps={[
      { title: "Read the Eviction Notice Carefully", description: "Check the type of notice (pay or quit, cure or quit, unconditional quit), the deadline to respond, and verify the landlord followed proper procedures. Errors in the notice may be a valid defense." },
      { title: "Understand Your Rights", description: "Every state has tenant protection laws. Common rights include the right to habitable housing, protection against retaliation, and requirements for landlords to follow proper procedures before evicting." },
      { title: "File an Answer with the Court", description: "If you want to fight the eviction, you typically must file a written response (Answer) with the court by the deadline stated on the summons. This preserves your right to a hearing." },
      { title: "Gather Your Evidence", description: "Collect lease agreements, rent receipts, photos of property conditions, repair requests, communication records with your landlord, and any other documents supporting your case." },
      { title: "Learn About Common Defenses", description: "Defenses tenants commonly raise include: landlord didn't follow proper notice requirements, retaliatory eviction (you complained about conditions), discriminatory eviction, acceptance of rent after notice, or uninhabitable conditions." },
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
    ]}
    ctas={[
      { label: "Get a Plain-Language Summary", href: "/case-analysis" },
      { label: "California Eviction Steps & Forms", href: "/ca/legal-center?area=civil" },
      { label: "New York Housing Steps & Forms", href: "/ny/legal-center?area=civil" },
    ]}
    relatedPages={[
      { label: "Tenant Rights Guide", href: "/legal-help/tenant-rights" },
      { label: "Eviction Notice: What to Do", href: "/legal-help/eviction-notice-what-to-do" },
      { label: "Free Eviction Defense Tool", href: "/free-eviction-defense-tool" },
      { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
      { label: "California Eviction Process", href: "/legal-help/california-eviction-process" },
      { label: "New York Eviction Process", href: "/legal-help/new-york-eviction-process" },
      { label: "Legal Glossary: Eviction Notice", href: "/legal-glossary#eviction-notice" },
      { label: "Legal Glossary: Default Judgment", href: "/legal-glossary#default-judgment" },
    ]}
    faqItems={[
      { question: "Can I be evicted without a court order?", answer: "In California and New York, no. The landlord must go through the court process. California law bars landlords from shutting off utilities, changing locks, or removing a tenant's belongings to force them out (Civil Code §789.3). In New York, evicting someone who has lived in the home for 30 days or more, or who has a lease, without a court order is a crime (Real Property Actions and Proceedings Law §768). Other states have their own rules." },
      { question: "How long does an eviction take?", answer: "It depends on the state, the type of notice, how you were served, and whether you respond. In California, after you are served with the court papers you generally have 10 court days to file an Answer. See our California and New York legal centers for each state's steps." },
      { question: "Can I fight an eviction if I owe rent?", answer: "Yes. You may have defenses related to habitability, improper notice, retaliation, or discrimination. Some courts also allow you to pay owed rent to stop the eviction." },
      { question: "Can I be evicted without notice?", answer: "Usually not. In California and New York, a landlord generally must give written notice before filing an eviction case. The notice period depends on the state and the reason, from a few days to 90 days." },
      { question: "What happens at an eviction hearing?", answer: "Both sides present evidence and arguments to a judge. The landlord must prove grounds for eviction. You can present defenses, cross-examine witnesses, and show your evidence. The judge decides whether to grant the eviction." },
      { question: "What evidence helps in an eviction case?", answer: "Rent receipts, repair request records, photos of property conditions, communication with your landlord, witness statements, and any documentation showing the landlord violated procedures or the law." },
      { question: "Can a landlord evict me for complaining about repairs?", answer: "Retaliating against a tenant for good-faith complaints about conditions is against the law in California (Civil Code §1942.5) and New York (Real Property Law §223-b). These laws have conditions and exceptions, so read the rules for your state or talk to a tenant lawyer or legal aid office." },
    ]}
  />
);

export default EvictionHelp;
