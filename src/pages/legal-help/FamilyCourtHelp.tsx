import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const FamilyCourtHelp = () => (
  <LegalHelpLayout
    title="Child Custody: How to Prepare for Family Court"
    metaTitle="Child Custody Guide | Family Court Preparation | Veritas Path"
    metaDescription="Step-by-step guide to child custody cases. Learn about custody factors, court preparation, required documents, and how to present your case in family court."
    keywords="child custody, family court, custody hearing, custody factors, best interests of child, custody documents, visitation rights, parenting plan"
    canonicalPath="/legal-help/child-custody"
    breadcrumbLabel="Child Custody"
    quickAnswer="In child custody cases, courts decide based on the 'best interests of the child.' Factors include each parent's relationship with the child, stability, ability to provide care, and the child's own preferences (depending on age). Preparation and documentation are essential."
    steps={[
      { title: "Understand Types of Custody", description: "Legal custody (decision-making authority) and physical custody (where the child lives) can be sole or joint. Learn your state's presumptions — many states start with a presumption of joint custody." },
      { title: "Document Your Involvement", description: "Keep records of your parenting activities: school involvement, medical appointments, daily routines, extracurricular activities, and communication with the child." },
      { title: "Create a Parenting Plan", description: "Draft a detailed parenting plan covering schedules, holidays, transportation, communication methods, and how decisions will be made. Courts favor parents who show willingness to cooperate." },
      { title: "Gather Essential Documents", description: "Collect school records, medical records, communication logs, photos, and any evidence of your parenting involvement and the child's well-being in your care." },
      { title: "Prepare for Court", description: "Dress professionally, be respectful to all parties, focus on the child's best interests (not attacking the other parent), and bring organized evidence." },
      { title: "Follow Court Orders", description: "Once orders are issued, follow them exactly. Document any violations by the other party with dates, times, and details." },
    ]}
    evidenceItems={[
      "School records and report cards",
      "Medical and dental records",
      "Photos of your home and the child's living space",
      "Records of extracurricular activities and involvement",
      "Communication logs with the other parent",
      "Character reference letters",
      "Income documentation for support calculations",
      "Proposed parenting plan/schedule",
    ]}
    commonMistakes={[
      "Badmouthing the other parent in court",
      "Not having a written parenting plan",
      "Ignoring temporary court orders",
      "Posting about the case on social media",
      "Refusing to cooperate or communicate with co-parent",
      "Failing to document your involvement with the child",
    ]}
    ctas={[
      { label: "Prepare Your Custody Case", href: "/case-analysis" },
      { label: "Generate Custody Documents", href: "/forms-library" },
      { label: "Organize Evidence", href: "/ai-tools/use" },
    ]}
    relatedPages={[
      { label: "Divorce Process", href: "/legal-help/divorce-process" },
      { label: "Child Support Guide", href: "/legal-help/child-support" },
      { label: "Protective Orders", href: "/legal-help/protective-orders" },
      { label: "Family Law Resources", href: "/legal-areas/family-law" },
    ]}
    faqItems={[
      { question: "At what age can a child choose which parent to live with?", answer: "This varies by state. Some states consider a child's preference at age 12-14, while others have no set age. The court always makes the final decision based on best interests." },
      { question: "Can a parent move to another state with the child?", answer: "Relocation usually requires court approval or the other parent's consent. Most states require advance notice and may hold a hearing to decide if the move is in the child's best interest." },
      { question: "What if the other parent violates the custody order?", answer: "Document the violation with dates and details, then file a motion for contempt with the court. Repeated violations can lead to modification of the custody arrangement." },
    ]}
  />
);

export default FamilyCourtHelp;
