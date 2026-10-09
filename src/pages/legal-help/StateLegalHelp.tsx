import { useLocation } from "react-router-dom";
import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

// State-specific content data
const stateData: Record<string, Record<string, {
  title: string; metaTitle: string; metaDescription: string; keywords: string;
  canonicalPath: string; breadcrumbLabel: string; quickAnswer: string;
  steps: { title: string; description: string }[];
  evidenceItems: string[]; commonMistakes: string[];
  ctas: { label: string; href: string }[];
  relatedPages: { label: string; href: string }[];
  faqItems: { question: string; answer: string }[];
}>> = {
  california: {
    eviction: {
      title: "California Eviction Process: How to Fight an Eviction in CA",
      metaTitle: "California Eviction Process | How to Fight Eviction in CA | Justice Bot USA",
      metaDescription: "Step-by-step guide to the California eviction process. Learn your tenant rights under CA law, how to respond to a 3-day or 30/60-day notice, and the 10-court-day deadline to file an Answer.",
      keywords: "california eviction process, CA tenant rights, fight eviction california, 3-day notice california, unlawful detainer CA",
      canonicalPath: "/legal-help/california-eviction-process",
      breadcrumbLabel: "California Eviction",
      quickAnswer: "In California, a landlord must file a court case (an unlawful detainer) to evict you. If you are served with a Summons and Complaint, you generally have 10 court days to file a written Answer; Saturdays, Sundays and court holidays don't count (Code of Civil Procedure §1167, since January 1, 2025). Many tenants are also protected by state just-cause rules (AB 1482), and some cities have their own rules.",
      steps: [
        { title: "Identify the Notice Type", description: "California uses 3-Day Pay or Quit, 3-Day Cure or Quit, 30-Day (tenancy <1 year), or 60-Day (tenancy >1 year) notices. AB 1482 requires just cause for most tenancies over 12 months." },
        { title: "Check for Defects in the Notice", description: "CA courts are strict about notice requirements. The notice must state the correct amount owed, be properly served, and comply with local rent control ordinances if applicable." },
        { title: "File Your Answer Within 10 Court Days", description: "After the Summons and Complaint are served, you generally have 10 court days to file a written Answer (form UD-105). Saturdays, Sundays and court holidays don't count (CCP §1167). If the papers were left with someone else or posted and mailed, service finishes later, which moves the deadline; ask your court's self-help center to count it. If you miss the deadline, the landlord can ask for a default judgment." },
        { title: "Raise Affirmative Defenses", description: "Common CA defenses: breach of warranty of habitability (Civil Code §1941-1942.5), retaliatory eviction (CC §1942.5), discrimination, improper notice, and rent control violations." },
        { title: "Ask for a Jury Trial if You Want One", description: "You can ask for a jury trial, for example on the Request to Set Case for Trial (form UD-150). A $150 jury deposit is due 5 days before trial (CCP §631)." },
        { title: "Go to Trial Prepared", description: "The trial must be set no later than 20 days after someone asks the court to set it (CCP §1170.5). Bring organized evidence, witnesses and copies. Ask your court's self-help center about free tenant legal help." },
      ],
      evidenceItems: ["Lease agreement", "All notices received", "Rent payment receipts or bank statements", "Photos/videos of property conditions", "Written repair requests (especially for habitability claims)", "Communication records with landlord", "Local rent control ordinance documentation", "Witness statements"],
      commonMistakes: ["Missing the 10-court-day Answer deadline", "Not raising habitability defenses when conditions are poor", "Ignoring local rent control protections", "Not requesting a jury trial when beneficial", "Withholding rent or using repair-and-deduct (Civil Code §1942) without checking the rules first"],
      ctas: [{ label: "Get a Plain-Language Summary", href: "/case-analysis" }, { label: "California Eviction Steps & Forms", href: "/ca/legal-center?area=civil" }, { label: "Fill California Court Forms", href: "/fill/ca" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "California Legal Help", href: "/california-legal-help" }],
      faqItems: [
        { question: "How long does a California eviction take?", answer: "It depends on how and when you were served, whether you file an Answer, and what happens in the case. After you are served you generally have 10 court days to file an Answer (CCP §1167). Once someone asks the court to set a trial, the trial must be set no later than 20 days after that request (CCP §1170.5)." },
        { question: "Does California require just cause for eviction?", answer: "Often. Under AB 1482 (the Tenant Protection Act), once a tenant has lived in a unit for 12 months, many landlords need a just cause to end the tenancy. Some housing is exempt, and many cities have additional rules." },
        { question: "Can my landlord raise rent to force me out in CA?", answer: "AB 1482 caps annual rent increases at 5% plus local CPI (max 10%) for covered units. Some cities have stricter caps." },
      ],
    },
    "child-custody": {
      title: "California Child Custody Guide: How Courts Decide Custody in CA",
      metaTitle: "California Child Custody | How CA Courts Decide Custody | Justice Bot USA",
      metaDescription: "Understand California child custody laws. Learn about legal vs physical custody, the best interest standard, and how to prepare for family court in CA.",
      keywords: "california child custody, CA custody laws, family court california, best interest of child CA, custody hearing california",
      canonicalPath: "/legal-help/california-child-custody",
      breadcrumbLabel: "California Child Custody",
      quickAnswer: "California courts decide custody based on the 'best interest of the child' standard (Family Code §3011). Both parents start with equal rights. Courts consider health/safety, nature of contact with each parent, history of abuse, and substance abuse.",
      steps: [
        { title: "Understand Custody Types", description: "California distinguishes legal custody (decision-making) from physical custody (where the child lives). Both can be sole or joint; the judge decides based on the child's best interest." },
        { title: "File the Right Forms", description: "If there is already a family case about the child in California (like a divorce or parentage case), ask for custody orders in that case with FL-300 (Request for Order), plus FL-311 and FL-105 (Declaration Under UCCJEA). If there is no case yet, ask your court's self-help center which case to start and where to file." },
        { title: "Attend Mandatory Mediation", description: "When custody or visitation is contested, the court sends the parents to mediation (Family Code §3170). In some counties, the mediator makes a recommendation to the judge if parents don't agree." },
        { title: "Prepare Your Evidence", description: "Document your involvement in the child's life: school records, medical appointments, daily routines, communication logs, and any safety concerns about the other parent." },
        { title: "Understand the Best Interest Factors", description: "CA courts consider: child's health/safety, nature of contact with each parent, history of abuse or substance use, child's preference (if age-appropriate), and stability." },
        { title: "Attend the Hearing", description: "Present your case clearly. Focus on what's best for the child, not attacks on the other parent. Bring organized evidence and any witnesses." },
      ],
      evidenceItems: ["School records showing involvement", "Medical/dental appointment records", "Daily schedule and parenting plan proposal", "Communication logs with co-parent", "Photos/videos of home environment", "Character reference letters", "Any documented safety concerns", "Child's activity records (sports, classes)"],
      commonMistakes: ["Badmouthing the other parent in court", "Not attending mandatory mediation", "Filing in the wrong county", "Failing to follow existing court orders", "Not documenting your parenting involvement"],
      ctas: [{ label: "Get a Plain-Language Summary", href: "/case-analysis" }, { label: "California Family Steps & Forms", href: "/ca/legal-center?area=family" }, { label: "Build Parenting Timeline", href: "/ai-tools/use" }],
      relatedPages: [{ label: "General Custody Guide", href: "/legal-help/child-custody" }, { label: "Divorce Process", href: "/legal-help/divorce-process" }, { label: "California Family Law Center", href: "/ca/legal-center?area=family" }],
      faqItems: [
        { question: "At what age can a child choose which parent to live with in CA?", answer: "There's no age at which a child decides. The judge must consider the wishes of a child old enough to form an intelligent preference. A child 14 or older who wants to speak to the court must be allowed to, unless the judge finds that is not in the child's best interest (Family Code §3042)." },
        { question: "Is California a 50/50 custody state?", answer: "Not automatically. While courts favor frequent and continuing contact with both parents, the custody split depends on the best interest analysis. Joint legal custody is common; physical custody varies." },
      ],
    },
    discrimination: {
      title: "California Workplace Discrimination: How to File a Complaint in CA",
      metaTitle: "California Workplace Discrimination | File a Complaint | Justice Bot USA",
      metaDescription: "Guide to filing a workplace discrimination complaint in California. Learn about FEHA protections, the CRD complaint process, and your rights as a CA employee.",
      keywords: "california workplace discrimination, FEHA complaint, CRD complaint california, employment discrimination CA",
      canonicalPath: "/legal-help/california-workplace-discrimination",
      breadcrumbLabel: "CA Workplace Discrimination",
      quickAnswer: "California's Fair Employment and Housing Act (FEHA) provides some of the strongest anti-discrimination protections in the U.S. File complaints with the Civil Rights Department (CRD, formerly DFEH). You have 3 years from the discriminatory act to file.",
      steps: [
        { title: "Identify Protected Categories", description: "FEHA protects against discrimination based on race, religion, color, national origin, ancestry, physical/mental disability, medical condition, genetic information, marital status, sex, gender, gender identity, gender expression, age (40+), sexual orientation, and military/veteran status." },
        { title: "Document the Discrimination", description: "Keep detailed records: dates, witnesses, emails, texts, and any written complaints you've made. Note any changes in your work conditions after reporting." },
        { title: "Consider an Internal Complaint", description: "You can report discrimination to your HR department or supervisor. Keep copies of everything; this creates a paper trail." },
        { title: "File with the CRD", description: "File a complaint with the California Civil Rights Department (CRD) online, by mail, or by phone. You have 3 years from the last discriminatory act. The CRD will investigate." },
        { title: "Get a Right-to-Sue Notice", description: "You can request an immediate right-to-sue notice from the CRD if you want to skip the investigation and file a lawsuit directly." },
        { title: "Consider Filing a Lawsuit", description: "After receiving a right-to-sue notice, you have 1 year to file a civil lawsuit in Superior Court. FEHA allows recovery of damages, attorney's fees, and injunctive relief." },
      ],
      evidenceItems: ["Written complaints to HR/management", "Emails, texts, or messages showing discrimination", "Performance reviews (before and after complaints)", "Witness contact information", "Pay stubs showing wage disparities", "Company policies or handbook", "Medical records if health impacted", "Notes with dates and details of incidents"],
      commonMistakes: ["Waiting too long to document incidents", "Not filing within the 3-year deadline", "Not keeping copies of performance reviews and pay records", "Not keeping copies of complaints", "Discussing the case widely at work"],
      ctas: [{ label: "Get a Plain-Language Summary", href: "/case-analysis" }, { label: "California Civil Rights Complaint Steps", href: "/ca/legal-center?area=human-rights" }, { label: "Build Evidence Timeline", href: "/ai-tools/use" }],
      relatedPages: [{ label: "Civil Rights Guide", href: "/legal-help/discrimination-law" }, { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" }, { label: "Workers' Compensation", href: "/legal-help/workers-compensation" }],
      faqItems: [
        { question: "How long do I have to file a discrimination complaint in CA?", answer: "You have 3 years from the last discriminatory act to file with the CRD. After receiving a right-to-sue notice, you have 1 year to file a lawsuit." },
        { question: "Does FEHA apply to small employers?", answer: "FEHA applies to employers with 5 or more employees for most protections, and 1 or more employees for harassment claims." },
      ],
    },
  },
  "new-york": {
    eviction: {
      title: "New York Eviction Process: How to Fight an Eviction in NY",
      metaTitle: "New York Eviction Process | How to Fight Eviction in NY | Justice Bot USA",
      metaDescription: "Step-by-step guide to the New York eviction process. Learn about answer deadlines, Good Cause Eviction, tenant protections, and how to defend an eviction in Housing Court.",
      keywords: "new york eviction process, NY tenant rights, fight eviction new york, housing court NY, good cause eviction NY",
      canonicalPath: "/legal-help/new-york-eviction-process",
      breadcrumbLabel: "New York Eviction",
      quickAnswer: "New York landlords cannot evict you without a court case. Eviction cases are heard in Housing Court (NYC) or local courts. In a nonpayment case in NYC Housing Court, you answer within 10 days of being served (RPAPL 732); in a holdover case, you answer on the first court date. The Good Cause Eviction Law (2024) protects many tenants in New York City and in cities, towns and villages that opt in; some housing is exempt.",
      steps: [
        { title: "Review the Notice", description: "NY notices vary: 14-day demand for rent, 30/60/90-day termination notice (depending on tenancy length), or cure notice for lease violations. NYC rent-stabilized tenants have additional protections." },
        { title: "Answer on Time", description: "Nonpayment case in NYC Housing Court (and courts whose rules adopt RPAPL 732): answer within 10 days of being served, in person at the clerk or in writing. In other courts, you answer on the court date shown on your papers. Holdover case: answer on the first court date, or 3 days before it if the notice of petition demands that (RPAPL 743). If you do not answer or appear, the landlord can ask for a default judgment." },
        { title: "Know Your Protections", description: "NY protections include: rent stabilization (NYC/some suburbs), Good Cause Eviction (Real Property Law Article 6-A: New York City and localities that opt in, with exemptions such as many small landlords), warranty of habitability (RPL §235-b), and anti-retaliation protections." },
        { title: "Adjournments and Free Help", description: "The first time either side asks, the court must adjourn the trial for at least 14 days; later requests are up to the judge (RPAPL 745). In NYC, eligible tenants can get a free lawyer through the Right to Counsel program; Housing Court Answers ((212) 962-4795) can explain the process and refer you." },
        { title: "Raise Defenses", description: "Common NY defenses: breach of warranty of habitability, retaliatory eviction, improper service, landlord harassment, rent overcharge (stabilized units), and failure to provide proper notice." },
        { title: "Negotiate a Stipulation", description: "Many NY eviction cases settle with a stipulation (agreement). This might include a payment plan, time to move, or conditions the landlord must meet." },
      ],
      evidenceItems: ["Lease agreement", "Rent receipts or bank records", "HPD violation history (NYC)", "Photos of apartment conditions", "311 complaints filed", "Communication with landlord", "Rent stabilization records (if applicable)", "Income documentation (for assistance programs)"],
      commonMistakes: ["Missing the answer deadline in a nonpayment case (10 days in NYC Housing Court)", "Not appearing on the court date", "Not knowing about free legal representation programs", "Not checking rent stabilization or Good Cause Eviction coverage", "Ignoring HPD violations as defense evidence"],
      ctas: [{ label: "Get a Plain-Language Summary", href: "/case-analysis" }, { label: "New York Housing Steps & Forms", href: "/ny/legal-center?area=civil" }, { label: "Fill New York Court Forms", href: "/fill/ny" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "New York Legal Help", href: "/new-york-legal-help" }],
      faqItems: [
        { question: "Does NYC provide free lawyers for eviction cases?", answer: "Yes, NYC's Right to Counsel program provides free legal representation for tenants in eviction cases who meet income eligibility requirements." },
        { question: "What is 'good cause' eviction in NY?", answer: "New York's Good Cause Eviction Law (Real Property Law Article 6-A, in effect since April 20, 2024) means a covered tenant can be evicted or not renewed only for a reason the law allows, and it limits rent increases above a set standard. It applies in New York City and in cities, towns and villages outside NYC that adopt it. Some housing is exempt, such as many units owned by small landlords." },
        { question: "Can I still apply to New York's Emergency Rental Assistance Program (ERAP)?", answer: "No. The state ERAP program closed in November 2025. Ask your local social services office or a tenant legal services group about other help." },
      ],
    },
    "small-claims": {
      title: "New York Small Claims Court: How to File or Defend in NY",
      metaTitle: "New York Small Claims Court Guide | File or Defend | Justice Bot USA",
      metaDescription: "Guide to New York Small Claims Court. Learn the limits ($10,000 in NYC, $5,000 in City and District Courts, $3,000 in Town and Village Courts), filing fees, and how to prepare for your hearing.",
      keywords: "new york small claims court, NY small claims limit, file small claims new york, NYC small claims",
      canonicalPath: "/legal-help/new-york-small-claims-court",
      breadcrumbLabel: "NY Small Claims",
      quickAnswer: "New York Small Claims Court handles money claims up to $10,000 in New York City, $5,000 in City Courts (and District Courts in Nassau and Suffolk), and $3,000 in Town and Village Courts. Filing fees are $10 to $20 depending on the court and the amount. You do not need a lawyer.",
      steps: [
        { title: "Determine the Right Court", description: "File in the court for the place where the defendant lives, works, or has a business office. A tenant can also sue the landlord where the rented property is. NYC has a Small Claims Court in each borough. Outside NYC, file in City, District, Town, or Village Court." },
        { title: "File Your Claim", description: "File with the small claims clerk and give the defendant's correct name and address. Fees: NYC and City Courts $15 for claims of $1,000 or less and $20 for larger claims; Town and Village Courts $10 and $15. You can ask to have fees waived if you cannot afford them." },
        { title: "Notice to the Defendant", description: "You do not serve the papers yourself. The clerk mails the notice of claim to the defendant by first-class mail and certified mail." },
        { title: "Prepare Your Evidence", description: "Organize all documentation: contracts, receipts, photos, estimates. NY Small Claims Court is informal — judges actively question both sides." },
        { title: "Attend the Hearing", description: "Tell your story clearly and show your evidence. If both sides agree, the case may be heard by an arbitrator instead of a judge. Bring copies for the court and the other side." },
        { title: "Collect Your Judgment", description: "If you win and the other side does not pay, ask the small claims clerk how to enforce the judgment, for example through an income execution or a bank restraint." },
      ],
      evidenceItems: ["Contracts or written agreements", "Receipts and invoices", "Photos or videos", "Estimates for repairs", "Text messages and emails", "Witness information", "Any prior demand letters sent"],
      commonMistakes: ["Filing in the wrong court location", "Not having the defendant's correct legal name", "Not bringing organized evidence", "Suing for more than the court's limit ($10,000 NYC, $5,000 City Court, $3,000 Town or Village Court)", "Not following up on judgment collection"],
      ctas: [{ label: "Get a Plain-Language Summary", href: "/case-analysis" }, { label: "New York Small Claims Steps & Forms", href: "/ny/legal-center?area=civil" }, { label: "Fill New York Court Forms", href: "/fill/ny" }],
      relatedPages: [{ label: "General Small Claims Guide", href: "/legal-help/small-claims-court" }, { label: "New York Legal Help", href: "/new-york-legal-help" }],
      faqItems: [
        { question: "What is the small claims limit in New York?", answer: "$10,000 in New York City Civil Court, $5,000 in City Courts outside NYC (and District Courts in Nassau and Suffolk), and $3,000 in Town and Village Courts." },
        { question: "Can a business sue in NYC small claims?", answer: "In NYC, a corporation, partnership or association sues in the Commercial Claims part, for up to $10,000, and can start no more than five claims a month." },
      ],
    },
  },
};

// Texas and Florida are not live on Justice Bot USA yet. Their old pages are kept as
// "coming soon" pages so existing links still land somewhere honest.
const comingSoonPages: Record<string, { stateName: string; topic: string; topicLabel: string; helpSite: string }> = {
  "texas-eviction-process": { stateName: "Texas", topic: "eviction", topicLabel: "Eviction", helpSite: "TexasLawHelp.org" },
  "texas-small-claims-court": { stateName: "Texas", topic: "small claims", topicLabel: "Small Claims", helpSite: "TexasLawHelp.org" },
  "florida-eviction-process": { stateName: "Florida", topic: "eviction", topicLabel: "Eviction", helpSite: "FloridaLawHelp.org" },
  "florida-child-custody": { stateName: "Florida", topic: "child custody", topicLabel: "Child Custody", helpSite: "FloridaLawHelp.org" },
};

const StateLegalHelp = () => {
  const location = useLocation();
  // Parse state and topic from path like /legal-help/california-eviction-process
  const pathSegment = location.pathname.split("/legal-help/")[1] || "";
  // Map URL slugs to state/topic keys
  const slugMap: Record<string, { state: string; topic: string }> = {
    "california-eviction-process": { state: "california", topic: "eviction" },
    "new-york-eviction-process": { state: "new-york", topic: "eviction" },
    "california-child-custody": { state: "california", topic: "child-custody" },
    "california-workplace-discrimination": { state: "california", topic: "discrimination" },
    "new-york-small-claims-court": { state: "new-york", topic: "small-claims" },
  };
  const mapped = slugMap[pathSegment];
  const state = mapped?.state || "";
  const topic = mapped?.topic || "";
  
  const stateContent = stateData[state];
  const pageContent = stateContent?.[topic];

  const comingSoon = comingSoonPages[pathSegment];
  if (!pageContent && comingSoon) {
    const { stateName, topic: topicName, topicLabel, helpSite } = comingSoon;
    return (
      <LegalHelpLayout
        title={`${stateName} ${topicLabel} Guide: Coming Soon`}
        metaTitle={`${stateName} ${topicLabel} Guide (Coming Soon) | Justice Bot USA`}
        metaDescription={`Justice Bot USA is live in California and New York. ${stateName} is coming soon.`}
        keywords={`${stateName.toLowerCase()} ${topicName}, legal help`}
        canonicalPath={`/legal-help/${pathSegment}`}
        breadcrumbLabel={`${stateName} ${topicLabel}`}
        quickAnswer={`Justice Bot USA is live in California and New York. ${stateName} is coming soon, so we don't have a ${stateName} ${topicName} guide yet. For ${stateName} rules, deadlines and forms, check your local court's self-help resources or ${helpSite}.`}
        steps={[
          { title: "Read every paper you received", description: "Court papers and notices list deadlines and court dates. Deadlines in court cases can be very short." },
          { title: "Contact the court or a self-help center", description: `The clerk or a self-help center can explain the procedure and the forms ${stateName} courts use. Court staff cannot give legal advice.` },
          { title: "Look for free legal help", description: `Legal aid organizations may be able to help if you qualify. ${helpSite} lists resources.` },
        ]}
        evidenceItems={["Every notice and court paper you received", "Any written agreement or lease", "Payment records", "Photos, messages and other records about the problem"]}
        commonMistakes={["Ignoring court papers", "Missing a court date or filing deadline", "Assuming another state's rules apply in your state"]}
        ctas={[{ label: "Browse Legal Help Library", href: "/legal-help" }]}
        relatedPages={[{ label: "Legal Help Index", href: "/legal-help" }, { label: "California Legal Help", href: "/california-legal-help" }, { label: "New York Legal Help", href: "/new-york-legal-help" }]}
      />
    );
  }

  if (!pageContent) {
    return (
      <LegalHelpLayout
        title="Legal Help Page Not Found"
        metaTitle="Legal Help | Justice Bot USA"
        metaDescription="Find legal help guides for your state."
        keywords="legal help"
        canonicalPath="/legal-help"
        breadcrumbLabel="Not Found"
        quickAnswer="This state-specific legal help page is coming soon. Check our general legal help guides in the meantime."
        steps={[]}
        evidenceItems={[]}
        commonMistakes={[]}
        ctas={[{ label: "Browse Legal Help Library", href: "/legal-help" }]}
        relatedPages={[{ label: "Legal Help Index", href: "/legal-help" }]}
      />
    );
  }
  
  return <LegalHelpLayout {...pageContent} />;
};

export default StateLegalHelp;
