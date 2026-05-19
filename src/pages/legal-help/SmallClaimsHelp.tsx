import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const SmallClaimsHelp = () => (
  <LegalHelpLayout
    title="Small Claims Court: How to File or Defend a Case"
    metaTitle="Small Claims Court Guide | How to File & Win | A.I. ANAL"
    metaDescription="Complete guide to small claims court. Learn how to file a claim, defend yourself, gather evidence, and prepare for your hearing. Free case preparation tools."
    keywords="small claims court, how to file small claims, small claims process, sue in small claims, small claims evidence, small claims hearing, small claims limit"
    canonicalPath="/legal-help/small-claims-court"
    breadcrumbLabel="Small Claims Court"
    quickAnswer="Small claims court is designed for disputes involving smaller amounts of money (usually $2,500–$25,000 depending on your state). You don't need a lawyer, and the process is simpler than regular court. File a claim at your local courthouse, serve the other party, gather evidence, and present your case at a hearing."
    steps={[
      { title: "Determine If Small Claims Is Right", description: "Check your state's dollar limit for small claims. Common cases include unpaid debts, security deposit disputes, property damage, breach of contract, and consumer complaints." },
      { title: "Try to Resolve It First", description: "Many courts require you to attempt resolution before filing. Send a demand letter explaining the dispute and what you want. Keep a copy — it shows the judge you tried to settle." },
      { title: "File Your Claim", description: "Go to your local courthouse (or file online if available) and fill out the small claims complaint form. You'll pay a filing fee (usually $30–$100) and provide details of your claim." },
      { title: "Serve the Defendant", description: "The other party must be officially notified of the lawsuit. Methods include certified mail, process server, or sheriff service. Each state has specific service rules." },
      { title: "Prepare Your Evidence", description: "Organize contracts, receipts, photos, text messages, emails, and any other proof. Create a timeline of events. Practice explaining your case clearly and concisely." },
      { title: "Attend the Hearing", description: "Present your case calmly and clearly. Bring all original documents and copies for the judge and opposing party. Stick to the facts and follow the judge's instructions." },
    ]}
    evidenceItems={[
      "Contracts or written agreements",
      "Receipts, invoices, or payment records",
      "Photos or videos of damage or defective products",
      "Written communications (emails, texts, letters)",
      "Demand letter sent to the opposing party",
      "Witness contact information and statements",
      "Estimates for repair costs or replacement value",
    ]}
    commonMistakes={[
      "Filing in the wrong court or jurisdiction",
      "Not sending a demand letter first",
      "Failing to properly serve the defendant",
      "Bringing unorganized or irrelevant evidence",
      "Getting emotional instead of sticking to facts",
      "Not showing up — results in dismissal or default judgment",
    ]}
    ctas={[
      { label: "Create Your Small Claims Case", href: "/case-analysis" },
      { label: "Generate Court Documents", href: "/forms-library" },
      { label: "Organize Evidence", href: "/ai-tools/use" },
    ]}
    relatedPages={[
      { label: "How to File Small Claims", href: "/legal-help/how-to-file-small-claims" },
      { label: "Defending Small Claims", href: "/legal-help/how-to-defend-small-claims" },
      { label: "Small Claims Evidence Guide", href: "/legal-help/small-claims-evidence" },
      { label: "Free Small Claims Case Builder", href: "/free-small-claims-case-builder" },
      { label: "Texas Small Claims Court", href: "/legal-help/texas-small-claims-court" },
      { label: "New York Small Claims Court", href: "/legal-help/new-york-small-claims-court" },
      { label: "Legal Glossary: Damages", href: "/legal-glossary#damages" },
      { label: "Legal Glossary: Summons", href: "/legal-glossary#summons" },
    ]}
    faqItems={[
      { question: "Do I need a lawyer for small claims court?", answer: "In most states, you don't need a lawyer and some states don't even allow them. Small claims is designed for self-represented individuals." },
      { question: "What's the dollar limit for small claims?", answer: "It varies by state. California allows up to $10,000 ($5,000 for businesses). New York allows up to $10,000. Texas allows up to $20,000. Check your state's specific limit." },
      { question: "What happens if I win?", answer: "The judge issues a judgment in your favor. If the other party doesn't pay voluntarily, you may need to take additional steps to collect, such as wage garnishment or bank levies." },
      { question: "Can I appeal a small claims decision?", answer: "In most states, the losing side can appeal to a higher court within a set timeframe (usually 30 days). Some states only allow the defendant to appeal." },
      { question: "What if the defendant doesn't show up?", answer: "If the defendant was properly served but doesn't appear, you may receive a default judgment in your favor." },
    ]}
  />
);

export default SmallClaimsHelp;
