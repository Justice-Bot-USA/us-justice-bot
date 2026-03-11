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
      metaTitle: "California Eviction Process | How to Fight Eviction in CA | Veritas Path",
      metaDescription: "Step-by-step guide to the California eviction process. Learn your tenant rights under CA law, how to respond to a 3-day or 30/60-day notice, and prepare your defense.",
      keywords: "california eviction process, CA tenant rights, fight eviction california, 3-day notice california, unlawful detainer CA",
      canonicalPath: "/legal-help/california-eviction-process",
      breadcrumbLabel: "California Eviction",
      quickAnswer: "In California, landlords must follow strict unlawful detainer procedures. You typically get 5 days to respond to the court summons after a notice period expires. California has strong tenant protections including just-cause eviction requirements in many cities.",
      steps: [
        { title: "Identify the Notice Type", description: "California uses 3-Day Pay or Quit, 3-Day Cure or Quit, 30-Day (tenancy <1 year), or 60-Day (tenancy >1 year) notices. AB 1482 requires just cause for most tenancies over 12 months." },
        { title: "Check for Defects in the Notice", description: "CA courts are strict about notice requirements. The notice must state the correct amount owed, be properly served, and comply with local rent control ordinances if applicable." },
        { title: "File Your Answer Within 5 Days", description: "After an Unlawful Detainer complaint is served, you have only 5 calendar days to file a written Answer (form UD-105). Missing this deadline results in a default judgment." },
        { title: "Raise Affirmative Defenses", description: "Common CA defenses: breach of warranty of habitability (Civil Code §1941-1942.5), retaliatory eviction (CC §1942.5), discrimination, improper notice, and rent control violations." },
        { title: "Request a Jury Trial", description: "You have the right to a jury trial in an unlawful detainer case. Check the box on the Answer form. This can add time for preparation." },
        { title: "Attend the Hearing", description: "Bring organized evidence. CA courts often schedule unlawful detainer trials within 20 days. Many courts offer free mediation." },
      ],
      evidenceItems: ["Lease agreement", "All notices received", "Rent payment receipts or bank statements", "Photos/videos of property conditions", "Written repair requests (especially for habitability claims)", "Communication records with landlord", "Local rent control ordinance documentation", "Witness statements"],
      commonMistakes: ["Missing the 5-day Answer deadline", "Not raising habitability defenses when conditions are poor", "Ignoring local rent control protections", "Not requesting a jury trial when beneficial", "Withholding rent without following CA escrow procedures"],
      ctas: [{ label: "Prepare Your CA Eviction Defense", href: "/case-analysis" }, { label: "Generate CA Court Documents", href: "/forms-library" }, { label: "Build Evidence Timeline", href: "/ai-tools/use" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "California Legal Help", href: "/california-legal-help" }],
      faqItems: [
        { question: "How long does a California eviction take?", answer: "From initial notice to court hearing, a California unlawful detainer typically takes 30-45 days. If you request a jury trial, it may take longer." },
        { question: "Does California require just cause for eviction?", answer: "Yes, under AB 1482 (the Tenant Protection Act), most tenancies over 12 months require just cause for eviction. Many cities have additional rent control ordinances." },
        { question: "Can my landlord raise rent to force me out in CA?", answer: "AB 1482 caps annual rent increases at 5% plus local CPI (max 10%) for covered units. Some cities have stricter caps." },
      ],
    },
    "child-custody": {
      title: "California Child Custody Guide: How Courts Decide Custody in CA",
      metaTitle: "California Child Custody | How CA Courts Decide Custody | Veritas Path",
      metaDescription: "Understand California child custody laws. Learn about legal vs physical custody, the best interest standard, and how to prepare for family court in CA.",
      keywords: "california child custody, CA custody laws, family court california, best interest of child CA, custody hearing california",
      canonicalPath: "/legal-help/california-child-custody",
      breadcrumbLabel: "California Child Custody",
      quickAnswer: "California courts decide custody based on the 'best interest of the child' standard (Family Code §3011). Both parents start with equal rights. Courts consider health/safety, nature of contact with each parent, history of abuse, and substance abuse.",
      steps: [
        { title: "Understand Custody Types", description: "California distinguishes legal custody (decision-making) from physical custody (where the child lives). Both can be sole or joint. Joint legal custody is the default starting point." },
        { title: "File the Right Forms", description: "Use FL-300 (Request for Order) for custody motions. Include FL-311 (Child Custody Information) and FL-105 (Declaration Under UCCJEA). File in the county where the child has lived for the past 6 months." },
        { title: "Attend Mandatory Mediation", description: "California requires mediation before a custody hearing (Family Code §3170). In some counties (like LA), the mediator makes a recommendation to the judge if parents don't agree." },
        { title: "Prepare Your Evidence", description: "Document your involvement in the child's life: school records, medical appointments, daily routines, communication logs, and any safety concerns about the other parent." },
        { title: "Understand the Best Interest Factors", description: "CA courts consider: child's health/safety, nature of contact with each parent, history of abuse or substance use, child's preference (if age-appropriate), and stability." },
        { title: "Attend the Hearing", description: "Present your case clearly. Focus on what's best for the child, not attacks on the other parent. Bring organized evidence and any witnesses." },
      ],
      evidenceItems: ["School records showing involvement", "Medical/dental appointment records", "Daily schedule and parenting plan proposal", "Communication logs with co-parent", "Photos/videos of home environment", "Character reference letters", "Any documented safety concerns", "Child's activity records (sports, classes)"],
      commonMistakes: ["Badmouthing the other parent in court", "Not attending mandatory mediation", "Filing in the wrong county", "Failing to follow existing court orders", "Not documenting your parenting involvement"],
      ctas: [{ label: "Prepare Custody Case", href: "/case-analysis" }, { label: "Generate CA Family Court Forms", href: "/forms-library" }, { label: "Build Parenting Timeline", href: "/ai-tools/use" }],
      relatedPages: [{ label: "General Custody Guide", href: "/legal-help/child-custody" }, { label: "Divorce Process", href: "/legal-help/divorce-process" }, { label: "CA Custody Hub", href: "/ca/family-law/custody-visitation" }],
      faqItems: [
        { question: "At what age can a child choose which parent to live with in CA?", answer: "There's no specific age. Courts may consider a child's preference if the child is 'of sufficient age and capacity to form an intelligent preference' (typically around 14+)." },
        { question: "Is California a 50/50 custody state?", answer: "Not automatically. While courts favor frequent and continuing contact with both parents, the custody split depends on the best interest analysis. Joint legal custody is common; physical custody varies." },
      ],
    },
    discrimination: {
      title: "California Workplace Discrimination: How to File a Complaint in CA",
      metaTitle: "California Workplace Discrimination | File a Complaint | Veritas Path",
      metaDescription: "Guide to filing a workplace discrimination complaint in California. Learn about FEHA protections, the CRD complaint process, and your rights as a CA employee.",
      keywords: "california workplace discrimination, FEHA complaint, CRD complaint california, employment discrimination CA",
      canonicalPath: "/legal-help/california-workplace-discrimination",
      breadcrumbLabel: "CA Workplace Discrimination",
      quickAnswer: "California's Fair Employment and Housing Act (FEHA) provides some of the strongest anti-discrimination protections in the U.S. File complaints with the Civil Rights Department (CRD, formerly DFEH). You have 3 years from the discriminatory act to file.",
      steps: [
        { title: "Identify Protected Categories", description: "FEHA protects against discrimination based on race, religion, color, national origin, ancestry, physical/mental disability, medical condition, genetic information, marital status, sex, gender, gender identity, gender expression, age (40+), sexual orientation, and military/veteran status." },
        { title: "Document the Discrimination", description: "Keep detailed records: dates, witnesses, emails, texts, and any written complaints you've made. Note any changes in your work conditions after reporting." },
        { title: "File an Internal Complaint", description: "Report discrimination to your HR department or supervisor. Keep copies of everything. This creates a paper trail and may be required before external filing." },
        { title: "File with the CRD", description: "File a complaint with the California Civil Rights Department (CRD) online, by mail, or by phone. You have 3 years from the last discriminatory act. The CRD will investigate." },
        { title: "Get a Right-to-Sue Notice", description: "You can request an immediate right-to-sue notice from the CRD if you want to skip the investigation and file a lawsuit directly." },
        { title: "Consider Filing a Lawsuit", description: "After receiving a right-to-sue notice, you have 1 year to file a civil lawsuit in Superior Court. FEHA allows recovery of damages, attorney's fees, and injunctive relief." },
      ],
      evidenceItems: ["Written complaints to HR/management", "Emails, texts, or messages showing discrimination", "Performance reviews (before and after complaints)", "Witness contact information", "Pay stubs showing wage disparities", "Company policies or handbook", "Medical records if health impacted", "Notes with dates and details of incidents"],
      commonMistakes: ["Waiting too long to document incidents", "Not filing within the 3-year deadline", "Quitting before exhausting internal remedies", "Not keeping copies of complaints", "Discussing the case widely at work"],
      ctas: [{ label: "Analyze Your Discrimination Case", href: "/case-analysis" }, { label: "Generate Complaint Documents", href: "/forms-library" }, { label: "Build Evidence Timeline", href: "/ai-tools/use" }],
      relatedPages: [{ label: "Civil Rights Guide", href: "/legal-help/discrimination-law" }, { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" }, { label: "Workers' Compensation", href: "/legal-help/workers-compensation" }],
      faqItems: [
        { question: "How long do I have to file a discrimination complaint in CA?", answer: "You have 3 years from the last discriminatory act to file with the CRD. After receiving a right-to-sue notice, you have 1 year to file a lawsuit." },
        { question: "Does FEHA apply to small employers?", answer: "FEHA applies to employers with 5 or more employees for most protections, and 1 or more employees for harassment claims." },
      ],
    },
  },
  texas: {
    eviction: {
      title: "Texas Eviction Process: How to Fight an Eviction in TX",
      metaTitle: "Texas Eviction Process | How to Fight Eviction in TX | Veritas Path",
      metaDescription: "Step-by-step guide to the Texas eviction process. Learn about notice requirements, Justice Court procedures, and tenant rights under Texas Property Code.",
      keywords: "texas eviction process, TX tenant rights, fight eviction texas, eviction notice texas, justice court eviction TX",
      canonicalPath: "/legal-help/texas-eviction-process",
      breadcrumbLabel: "Texas Eviction",
      quickAnswer: "In Texas, evictions are handled in Justice Court. Landlords must give written notice to vacate (usually 3 days unless the lease says otherwise). After filing, you'll receive a citation and have until 10:00 AM on the Monday after 10 days to file an Answer.",
      steps: [
        { title: "Review the Notice to Vacate", description: "Texas Property Code §24.005 requires a written notice to vacate, typically 3 days for nonpayment unless the lease specifies a different period. Check if the notice was properly delivered." },
        { title: "File an Answer", description: "After the landlord files an eviction suit, you must file a written Answer by 10:00 AM on the first Monday after 10 days from service. Filing an Answer is critical to avoiding default judgment." },
        { title: "Attend the Trial", description: "Justice Court trials are typically scheduled 10-21 days after filing. Texas eviction trials are relatively quick. You can represent yourself. Bring all evidence." },
        { title: "Know Your Defenses", description: "Texas defenses include: landlord failed to maintain property (Property Code §92.052), improper notice, retaliatory eviction (Property Code §92.331), and discrimination." },
        { title: "Appeal if Necessary", description: "If you lose, you can appeal to County Court within 5 days. You may need to post an appeal bond or pay rent into the court registry during the appeal." },
        { title: "Understand Lockout Rules", description: "Texas allows landlords to change locks for nonpayment ONLY if the lease allows it and specific conditions are met (Property Code §92.0081). Illegal lockouts can be challenged." },
      ],
      evidenceItems: ["Lease agreement", "Notice to vacate", "Rent payment records", "Photos of property conditions", "Repair requests and landlord responses", "Communication with landlord", "Witness statements"],
      commonMistakes: ["Not filing an Answer by the Monday 10 AM deadline", "Not appearing at the trial", "Missing the 5-day appeal window", "Not knowing about the appeal bond requirement", "Ignoring the notice to vacate"],
      ctas: [{ label: "Prepare TX Eviction Defense", href: "/case-analysis" }, { label: "Generate TX Court Documents", href: "/forms-library" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "Texas Legal Help", href: "/texas-legal-help" }],
      faqItems: [
        { question: "How fast can I be evicted in Texas?", answer: "The fastest a Texas eviction can proceed is about 3 weeks from notice: 3-day notice + filing + 10-day citation period + trial. Appeals can add weeks." },
        { question: "Can a Texas landlord lock me out?", answer: "Only under very specific conditions for nonpayment, if the lease allows it. The landlord must leave a notice on the door with a 24-hour phone number to get a key." },
      ],
    },
    "small-claims": {
      title: "Texas Small Claims Court: How to File or Defend in Justice Court",
      metaTitle: "Texas Small Claims Court | Justice Court Guide | Veritas Path",
      metaDescription: "Guide to filing or defending a small claims case in Texas Justice Court. Learn filing limits, procedures, and how to prepare for your hearing.",
      keywords: "texas small claims court, justice court texas, small claims limit texas, file small claims TX",
      canonicalPath: "/legal-help/texas-small-claims-court",
      breadcrumbLabel: "Texas Small Claims",
      quickAnswer: "Texas small claims cases are heard in Justice Court. The maximum amount you can sue for is $20,000. Filing fees are typically $54-$100+. Cases are usually resolved within 30-60 days.",
      steps: [
        { title: "Determine if Justice Court Is Right", description: "Justice Court handles claims up to $20,000, evictions, and repair-and-deduct cases. For amounts over $20,000, you need County Court." },
        { title: "File Your Petition", description: "File a small claims petition at the Justice Court in the precinct where the defendant lives or where the issue occurred. Include the amount owed and a brief explanation." },
        { title: "Serve the Defendant", description: "The court will issue a citation. Service can be by constable, sheriff, or authorized process server. The defendant has until 10 AM on the Monday after 10 days to respond." },
        { title: "Prepare Your Evidence", description: "Organize contracts, receipts, photos, text messages, and any other documentation. Texas Justice Courts are informal but evidence matters." },
        { title: "Attend the Hearing", description: "Present your case clearly and concisely. Bring original documents plus copies for the judge and opposing party." },
        { title: "Collect Your Judgment", description: "If you win, you may need to take additional steps to collect. Texas allows abstract of judgment liens, bank levies, and wage garnishment." },
      ],
      evidenceItems: ["Contracts or agreements", "Invoices and receipts", "Photos or videos", "Text messages and emails", "Witness contact information", "Repair estimates", "Bank statements"],
      commonMistakes: ["Filing in the wrong precinct", "Not serving the defendant properly", "Not bringing enough copies of evidence", "Suing for more than $20,000", "Not following up on judgment collection"],
      ctas: [{ label: "Prepare Small Claims Case", href: "/case-analysis" }, { label: "Generate Court Documents", href: "/forms-library" }],
      relatedPages: [{ label: "General Small Claims Guide", href: "/legal-help/small-claims-court" }, { label: "Texas Legal Help", href: "/texas-legal-help" }],
      faqItems: [
        { question: "What is the small claims limit in Texas?", answer: "The maximum amount for Texas Justice Court (small claims) is $20,000 as of 2024." },
        { question: "Do I need a lawyer for Texas small claims court?", answer: "No, Justice Court is designed for self-representation. However, both sides can have attorneys." },
      ],
    },
  },
  florida: {
    eviction: {
      title: "Florida Eviction Process: How to Fight an Eviction in FL",
      metaTitle: "Florida Eviction Process | How to Fight Eviction in FL | Veritas Path",
      metaDescription: "Step-by-step guide to the Florida eviction process. Learn about 3-day and 15-day notices, filing deadlines, and tenant defenses under Florida Statute 83.",
      keywords: "florida eviction process, FL tenant rights, fight eviction florida, 3-day notice florida, florida statute 83",
      canonicalPath: "/legal-help/florida-eviction-process",
      breadcrumbLabel: "Florida Eviction",
      quickAnswer: "Florida landlords must follow Florida Statute Chapter 83 (Residential Landlord and Tenant Act). For nonpayment, a 3-day notice is required. You have 5 days to file an Answer after being served. Florida courts move quickly on evictions.",
      steps: [
        { title: "Review the Notice", description: "Florida uses 3-Day Notice (nonpayment), 7-Day Notice (lease violation with cure option), and 15-Day Notice (month-to-month termination). Verify the notice complies with §83.56." },
        { title: "File Your Answer Within 5 Days", description: "After being served with the eviction complaint, you have only 5 business days to file a written Answer. In Florida, you must also deposit rent into the court registry." },
        { title: "Deposit Rent into Court Registry", description: "Florida requires tenants to deposit accrued rent into the court registry when filing an Answer (§83.60). Failure to do this can result in a default judgment." },
        { title: "Raise Your Defenses", description: "Florida defenses include: improper notice, landlord's failure to maintain (§83.51), retaliatory eviction (§83.64), and discrimination. Material noncompliance by landlord is a strong defense." },
        { title: "Attend the Hearing", description: "Florida eviction hearings are typically scheduled quickly. Bring organized evidence, especially proof of payment and property condition documentation." },
        { title: "Know Your Post-Judgment Rights", description: "If you lose, the judge issues a Final Judgment. You typically have 24 hours before a Writ of Possession is issued. Appeal within 30 days." },
      ],
      evidenceItems: ["Lease agreement", "All notices received", "Rent payment receipts", "Bank statements showing payments", "Photos of property conditions", "Repair requests", "Communication with landlord", "Any code violation reports"],
      commonMistakes: ["Not depositing rent into the court registry", "Missing the 5-day Answer deadline", "Not documenting property conditions", "Ignoring the notice entirely", "Not seeking legal aid (Florida has many free tenant resources)"],
      ctas: [{ label: "Prepare FL Eviction Defense", href: "/case-analysis" }, { label: "Generate FL Court Documents", href: "/forms-library" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "Florida Legal Help", href: "/florida-legal-help" }],
      faqItems: [
        { question: "Do I have to pay rent into court during a Florida eviction?", answer: "Yes. Florida Statute §83.60 requires you to deposit rent into the court registry when filing your Answer, or show good cause for not doing so." },
        { question: "How fast can I be evicted in Florida?", answer: "Florida evictions can proceed quickly — as fast as 2-3 weeks from notice to judgment if you don't respond." },
      ],
    },
    "child-custody": {
      title: "Florida Child Custody (Time-Sharing): How FL Courts Decide Parenting Plans",
      metaTitle: "Florida Child Custody | Time-Sharing & Parenting Plans | Veritas Path",
      metaDescription: "Understand Florida child custody laws. Learn about time-sharing plans, parental responsibility, and how Florida courts determine the best interest of the child.",
      keywords: "florida child custody, FL time-sharing, parenting plan florida, best interest of child FL, custody florida",
      canonicalPath: "/legal-help/florida-child-custody",
      breadcrumbLabel: "Florida Child Custody",
      quickAnswer: "Florida doesn't use the term 'custody' — instead it uses 'time-sharing' and 'parental responsibility.' Both parents are presumed to share equal parental responsibility. The court evaluates 20 specific factors under FL Statute §61.13.",
      steps: [
        { title: "Understand Florida's Terminology", description: "Florida uses 'parental responsibility' (decision-making) and 'time-sharing' (parenting schedule) instead of 'custody' and 'visitation.' This shift reflects the state's preference for shared parenting." },
        { title: "Develop a Parenting Plan", description: "Florida requires a Parenting Plan (§61.13(2)(b)) that details daily tasks, time-sharing schedule, health care, school, and how parents will communicate and make decisions." },
        { title: "File the Required Forms", description: "Use the Family Law forms from the Florida Courts website. Include a Parenting Plan proposal, UCCJEA Affidavit, and financial affidavit." },
        { title: "Attend Mediation", description: "Florida requires mediation before trial in most family law cases. A certified mediator will help you try to reach agreement on time-sharing." },
        { title: "Know the Best Interest Factors", description: "FL §61.13(3) lists 20 factors including: each parent's capacity, willingness to support the child's relationship with the other parent, evidence of domestic violence, and the child's preference." },
        { title: "Attend the Final Hearing", description: "If mediation fails, present your case at a final hearing. Focus on the statutory factors and your proposed Parenting Plan." },
      ],
      evidenceItems: ["Proposed Parenting Plan", "Financial affidavit", "Child's school records", "Medical/dental records", "Communication logs with co-parent", "Daily routine documentation", "Home environment photos", "Activity and involvement records"],
      commonMistakes: ["Using 'custody' language in court filings", "Not submitting a detailed Parenting Plan", "Failing to attend mediation", "Not completing the required parenting course", "Ignoring the 20 statutory factors"],
      ctas: [{ label: "Prepare FL Custody Case", href: "/case-analysis" }, { label: "Generate FL Family Forms", href: "/forms-library" }],
      relatedPages: [{ label: "General Custody Guide", href: "/legal-help/child-custody" }, { label: "Divorce Process", href: "/legal-help/divorce-process" }, { label: "Florida Legal Help", href: "/florida-legal-help" }],
      faqItems: [
        { question: "Does Florida prefer 50/50 time-sharing?", answer: "Florida law creates a presumption that equal time-sharing is in the child's best interest (as of 2023 SB 1416), but the court can deviate based on the statutory factors." },
        { question: "At what age can a child choose which parent in Florida?", answer: "There's no specific age. The court may consider the child's preference as one of the 20 factors, particularly for older, more mature children." },
      ],
    },
  },
  "new-york": {
    eviction: {
      title: "New York Eviction Process: How to Fight an Eviction in NY",
      metaTitle: "New York Eviction Process | How to Fight Eviction in NY | Veritas Path",
      metaDescription: "Step-by-step guide to the New York eviction process. Learn about ERAP, good cause eviction, tenant protections, and how to defend an eviction in Housing Court.",
      keywords: "new york eviction process, NY tenant rights, fight eviction new york, housing court NY, good cause eviction NY",
      canonicalPath: "/legal-help/new-york-eviction-process",
      breadcrumbLabel: "New York Eviction",
      quickAnswer: "New York has strong tenant protections. Eviction cases are heard in Housing Court (NYC) or local courts. Landlords must provide proper notice and cannot evict without a court order. Recent 'good cause' eviction protections (2024) add additional safeguards for many tenants.",
      steps: [
        { title: "Review the Notice", description: "NY notices vary: 14-day demand for rent, 30/60/90-day termination notice (depending on tenancy length), or cure notice for lease violations. NYC rent-stabilized tenants have additional protections." },
        { title: "File Your Answer", description: "After being served with a petition, you must appear in court on the return date (typically 10-17 days). In NYC Housing Court, you can file an Answer on the court date." },
        { title: "Know Your Protections", description: "NY protections include: rent stabilization (NYC/some suburbs), good cause eviction (2024 statewide), warranty of habitability (RPL §235-b), and anti-retaliation protections." },
        { title: "Request Adjournments if Needed", description: "NY courts generally grant at least one adjournment. Use this time to consult with a free legal services organization — NYC guarantees free legal counsel for low-income tenants in eviction cases." },
        { title: "Raise Defenses", description: "Common NY defenses: breach of warranty of habitability, retaliatory eviction, improper service, landlord harassment, rent overcharge (stabilized units), and failure to provide proper notice." },
        { title: "Negotiate a Stipulation", description: "Many NY eviction cases settle with a stipulation (agreement). This might include a payment plan, time to move, or conditions the landlord must meet." },
      ],
      evidenceItems: ["Lease agreement", "Rent receipts or bank records", "HPD violation history (NYC)", "Photos of apartment conditions", "311 complaints filed", "Communication with landlord", "Rent stabilization records (if applicable)", "Income documentation (for assistance programs)"],
      commonMistakes: ["Not appearing on the court return date", "Not knowing about free legal representation programs", "Not checking rent stabilization status", "Ignoring HPD violations as defense evidence", "Not applying for rental assistance programs"],
      ctas: [{ label: "Prepare NY Eviction Defense", href: "/case-analysis" }, { label: "Generate NY Court Documents", href: "/forms-library" }],
      relatedPages: [{ label: "General Eviction Guide", href: "/legal-help/eviction" }, { label: "Tenant Rights", href: "/legal-help/tenant-rights" }, { label: "New York Legal Help", href: "/new-york-legal-help" }],
      faqItems: [
        { question: "Does NYC provide free lawyers for eviction cases?", answer: "Yes, NYC's Right to Counsel program provides free legal representation for tenants in eviction cases who meet income eligibility requirements." },
        { question: "What is 'good cause' eviction in NY?", answer: "New York's 2024 good cause eviction law protects most tenants from eviction without a legitimate reason and limits rent increases to prevent 'economic eviction.'" },
      ],
    },
    "small-claims": {
      title: "New York Small Claims Court: How to File or Defend in NY",
      metaTitle: "New York Small Claims Court Guide | File or Defend | Veritas Path",
      metaDescription: "Guide to New York Small Claims Court. Learn the $10,000 limit, filing process, night court options, and how to prepare for your hearing.",
      keywords: "new york small claims court, NY small claims limit, file small claims new york, NYC small claims",
      canonicalPath: "/legal-help/new-york-small-claims-court",
      breadcrumbLabel: "NY Small Claims",
      quickAnswer: "New York Small Claims Court handles cases up to $10,000 ($5,000 in town/village courts). NYC offers evening Small Claims Court sessions. Filing fees are $15-$20. No lawyers needed.",
      steps: [
        { title: "Determine the Right Court", description: "File in the court where the defendant lives or works, or where the problem occurred. NYC has Small Claims Courts in each borough. Outside NYC, file in City, Town, or Village Court." },
        { title: "File Your Claim", description: "File in person or online (NYC). Pay the filing fee ($15 for claims under $1,000, $20 for $1,000+). Provide the defendant's correct name and address." },
        { title: "Serve the Defendant", description: "In NYC, the court sends notice by certified mail. Outside NYC, the clerk will arrange service. The defendant must receive proper notice." },
        { title: "Prepare Your Evidence", description: "Organize all documentation: contracts, receipts, photos, estimates. NY Small Claims Court is informal — judges actively question both sides." },
        { title: "Attend the Hearing", description: "NYC offers night court (6 PM). Tell your story clearly, show your evidence. The judge may try to mediate first. Decisions are usually mailed within a few days." },
        { title: "Collect Your Judgment", description: "If you win, the defendant has 30 days to pay. If they don't, you can use enforcement measures: income execution, bank restraint, or property lien." },
      ],
      evidenceItems: ["Contracts or written agreements", "Receipts and invoices", "Photos or videos", "Estimates for repairs", "Text messages and emails", "Witness information", "Any prior demand letters sent"],
      commonMistakes: ["Filing in the wrong court location", "Not having the defendant's correct legal name", "Not bringing organized evidence", "Suing for more than $10,000", "Not following up on judgment collection"],
      ctas: [{ label: "Prepare Small Claims Case", href: "/case-analysis" }, { label: "Generate Court Documents", href: "/forms-library" }],
      relatedPages: [{ label: "General Small Claims Guide", href: "/legal-help/small-claims-court" }, { label: "New York Legal Help", href: "/new-york-legal-help" }],
      faqItems: [
        { question: "What is the small claims limit in New York?", answer: "The limit is $10,000 in NYC and City Courts, and $5,000 in Town and Village Courts." },
        { question: "Can I file small claims at night in NYC?", answer: "Yes, NYC Small Claims Courts offer evening sessions starting at 6 PM." },
      ],
    },
  },
};

const StateLegalHelp = () => {
  const { stateSlug, topicSlug } = useParams<{ stateSlug: string; topicSlug: string }>();
  
  const state = stateSlug || "";
  const topic = topicSlug || "";
  
  const stateContent = stateData[state];
  const pageContent = stateContent?.[topic];
  
  if (!pageContent) {
    return (
      <LegalHelpLayout
        title="Legal Help Page Not Found"
        metaTitle="Legal Help | Veritas Path"
        metaDescription="Find legal help guides for your state."
        keywords="legal help"
        canonicalPath={`/legal-help/${state}-${topic}`}
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
