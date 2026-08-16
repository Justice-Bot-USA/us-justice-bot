import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const DivorceProcessHelp = () => (
  <LegalHelpLayout
    title="Divorce Process in the United States: A Step-by-Step Guide"
    metaTitle="Divorce Process Guide | How to File for Divorce | Justice Bot USA"
    metaDescription="Understand the divorce process step by step. Learn about filing requirements, property division, child custody, and how to prepare your case."
    keywords="divorce process, how to file for divorce, divorce papers, divorce requirements, uncontested divorce, contested divorce, property division, divorce filing"
    canonicalPath="/legal-help/divorce-process"
    breadcrumbLabel="Divorce Process"
    quickAnswer="To file for divorce, you must meet your state's residency requirements, file a petition with the court, serve your spouse, and resolve issues like property division, custody, and support. Uncontested divorces (where both parties agree) are faster and cheaper than contested ones."
    steps={[
      { title: "Check Residency Requirements", description: "Most states require you to have lived there for 3-12 months before filing. Some also require you to file in the county where you or your spouse resides." },
      { title: "File the Divorce Petition", description: "File the petition (or complaint) with your local family court. This document states you want a divorce and outlines your initial requests regarding property, custody, and support." },
      { title: "Serve Your Spouse", description: "Your spouse must be officially served with the divorce papers. Methods include personal service, certified mail, or (in some cases) publication. Your spouse then has a deadline to respond." },
      { title: "Negotiate or Mediate", description: "Try to reach agreements on property division, child custody, child support, and spousal support. Mediation is often cheaper and less adversarial than going to trial." },
      { title: "Complete Required Disclosures", description: "Both parties must disclose financial information: income, assets, debts, and expenses. This is required in all states and must be accurate." },
      { title: "Finalize the Divorce", description: "If you agree on all terms, submit a settlement agreement for court approval. If not, the judge decides contested issues at trial. The court issues the final divorce decree." },
    ]}
    evidenceItems={[
      "Marriage certificate",
      "Financial records (bank statements, tax returns, pay stubs)",
      "Property deeds, vehicle titles, retirement account statements",
      "Debt records (mortgages, credit cards, loans)",
      "Prenuptial or postnuptial agreements",
      "Records of children (birth certificates, school, medical)",
      "Documentation of any domestic violence",
    ]}
    commonMistakes={[
      "Hiding assets — this can result in severe penalties",
      "Making verbal agreements instead of putting everything in writing",
      "Not understanding the difference between separate and marital property",
      "Moving out of state before filing (may affect jurisdiction)",
      "Using children as leverage in negotiations",
      "Not getting a qualified appraisal of major assets",
    ]}
    ctas={[
      { label: "Prepare Your Divorce Case", href: "/case-analysis" },
      { label: "Find Divorce Forms", href: "/forms-library" },
      { label: "Organize Documents", href: "/ai-tools/use" },
    ]}
    relatedPages={[
      { label: "Child Custody Guide", href: "/legal-help/child-custody" },
      { label: "Child Support", href: "/legal-help/child-support" },
      { label: "Protective Orders", href: "/legal-help/protective-orders" },
      { label: "Family Law Resources", href: "/legal-areas/family-law" },
    ]}
    faqItems={[
      { question: "How long does a divorce take?", answer: "Uncontested divorces can take 1-6 months. Contested divorces can take 1-3 years. Many states also have mandatory waiting periods (30-365 days)." },
      { question: "Do I need a lawyer?", answer: "While not required, a lawyer is recommended especially if you have children, significant assets, or disagreements. For uncontested divorces, self-representation with proper forms may be sufficient." },
    ]}
  />
);

export default DivorceProcessHelp;
