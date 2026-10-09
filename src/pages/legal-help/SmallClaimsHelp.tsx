import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const SmallClaimsHelp = () => (
  <LegalHelpLayout
    title="Small Claims Court: How to File or Defend a Case"
    metaTitle="Small Claims Court Guide | How to File or Defend | Justice Bot USA"
    metaDescription="Guide to small claims court: how to file a claim, defend yourself, gather evidence, and prepare for your hearing. Live in California and New York; other states coming soon."
    keywords="small claims court, how to file small claims, small claims process, sue in small claims, small claims evidence, small claims hearing, small claims limit"
    canonicalPath="/legal-help/small-claims-court"
    breadcrumbLabel="Small Claims Court"
    quickAnswer="Small claims court is designed for disputes involving smaller amounts of money. The limit depends on the state and the court: for example, $12,500 for individuals in California and $10,000 in New York City. You don't need a lawyer, and the process is simpler than regular court. File a claim at your local courthouse, serve the other party, gather evidence, and present your case at a hearing."
    steps={[
      { title: "Determine If Small Claims Is Right", description: "Check your state's dollar limit for small claims. Common cases include unpaid debts, security deposit disputes, property damage, breach of contract, and consumer complaints." },
      { title: "Try to Resolve It First", description: "Some courts expect you to ask the other party to pay before you file; California's claim form, for example, asks whether you did. A short letter explaining the dispute and what you want is a common way to ask. Keep a copy." },
      { title: "File Your Claim", description: "Go to your local courthouse (or file online if available) and fill out the small claims complaint form. You'll pay a filing fee set by the court (in California, $30 to $100) and provide details of your claim. If you can't afford the fee, you can ask the court for a fee waiver." },
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
      "Not asking the other party to pay before filing, where the court expects it",
      "Failing to properly serve the defendant",
      "Bringing unorganized or irrelevant evidence",
      "Getting emotional instead of sticking to facts",
      "Not showing up — results in dismissal or default judgment",
    ]}
    ctas={[
      { label: "Get a Plain-Language Summary", href: "/case-analysis" },
      { label: "California Small Claims Steps & Forms", href: "/ca/legal-center?area=civil" },
      { label: "New York Small Claims Steps & Forms", href: "/ny/legal-center?area=civil" },
    ]}
    relatedPages={[
      { label: "How to File Small Claims", href: "/legal-help/how-to-file-small-claims" },
      { label: "Defending Small Claims", href: "/legal-help/how-to-defend-small-claims" },
      { label: "Small Claims Evidence Guide", href: "/legal-help/small-claims-evidence" },
      { label: "Free Small Claims Case Builder", href: "/free-small-claims-case-builder" },
      { label: "New York Small Claims Court", href: "/legal-help/new-york-small-claims-court" },
      { label: "Legal Glossary: Damages", href: "/legal-glossary#damages" },
      { label: "Legal Glossary: Summons", href: "/legal-glossary#summons" },
    ]}
    faqItems={[
      { question: "Do I need a lawyer for small claims court?", answer: "No. Small claims is designed for people representing themselves. In California, lawyers generally can't represent parties at the small claims hearing, though you can ask a lawyer for advice (Code of Civil Procedure §116.530). In New York, you may hire a lawyer, but you don't need one." },
      { question: "What's the dollar limit for small claims?", answer: "It varies by state and court. In California, individuals can sue for up to $12,500 and businesses for up to $6,250 (Code of Civil Procedure §§116.220–116.221). In New York, the limit is $10,000 in New York City Civil Court, $5,000 in City Courts outside New York City, and $3,000 in Town and Village Courts." },
      { question: "What happens if I win?", answer: "The judge issues a judgment in your favor. If the other party doesn't pay voluntarily, you may need to take additional steps to collect, such as wage garnishment or bank levies." },
      { question: "Can I appeal a small claims decision?", answer: "It depends on the state. In California, the person who filed the claim can't appeal a loss on their own claim; the side that was sued can. In New York, appeals are limited to whether 'substantial justice' was done. Deadlines are short, so ask the court clerk or self-help center right away." },
      { question: "What if the defendant doesn't show up?", answer: "If the defendant was properly served but doesn't appear, you may receive a default judgment in your favor." },
    ]}
  />
);

export default SmallClaimsHelp;
