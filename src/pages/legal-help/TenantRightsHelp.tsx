import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const TenantRightsHelp = () => (
  <LegalHelpLayout
    title="Tenant Rights in the United States: What Every Renter Should Know"
    metaTitle="Tenant Rights Guide | Know Your Rights as a Renter | A.I. ANAL"
    metaDescription="Complete guide to tenant rights in the US. Learn about habitability, security deposits, privacy rights, discrimination protections, and what to do when your landlord violates the law."
    keywords="tenant rights, renter rights, landlord tenant law, habitability, security deposit, lease agreement, landlord responsibilities, right to privacy, fair housing"
    canonicalPath="/legal-help/tenant-rights"
    breadcrumbLabel="Tenant Rights"
    quickAnswer="As a tenant, you have the right to habitable housing, privacy, protection from discrimination, return of your security deposit, and proper eviction procedures. Your landlord cannot lock you out, shut off utilities, or retaliate against you for exercising your rights."
    steps={[
      { title: "Understand Your Lease", description: "Read your lease carefully before signing. It outlines rent amount, lease term, rules, and responsibilities. Verbal agreements may also be enforceable depending on your state." },
      { title: "Know Your Right to Habitable Housing", description: "Landlords must provide safe, livable conditions: working plumbing, heating, electricity, structural safety, and pest control. This is called the 'implied warranty of habitability.'" },
      { title: "Understand Security Deposit Rules", description: "Most states limit deposit amounts and require landlords to return deposits within a set timeframe (14-60 days). Landlords must provide itemized deductions. You can dispute unfair charges." },
      { title: "Exercise Your Right to Privacy", description: "Landlords generally must provide 24-48 hours notice before entering your unit (except emergencies). They cannot enter at will or harass you." },
      { title: "Report Violations Properly", description: "Put repair requests in writing (email or letter). If the landlord doesn't fix issues, contact your local housing code enforcement. Keep records of all communications." },
      { title: "Know Anti-Retaliation Protections", description: "In most states, landlords cannot raise rent, reduce services, or evict you in retaliation for reporting code violations, organizing tenants, or exercising legal rights." },
    ]}
    evidenceItems={[
      "Copy of your lease or rental agreement",
      "Photos/videos of property conditions or code violations",
      "Written repair requests with dates",
      "Rent payment receipts",
      "Communication records with landlord",
      "Move-in/move-out inspection reports",
      "Security deposit receipt and any deduction letters",
    ]}
    commonMistakes={[
      "Not reading the lease before signing",
      "Making verbal complaints instead of writing",
      "Withholding rent without following your state's legal process",
      "Not documenting the condition of the unit at move-in and move-out",
      "Assuming you have no rights without a written lease",
      "Not knowing your state's specific tenant protection laws",
    ]}
    ctas={[
      { label: "Analyze Your Housing Issue", href: "/case-analysis" },
      { label: "Generate a Repair Request", href: "/ai-tools/use" },
      { label: "Find Housing Forms", href: "/forms-library" },
    ]}
    relatedPages={[
      { label: "How to Fight an Eviction", href: "/legal-help/eviction" },
      { label: "Landlord Refusing Repairs", href: "/legal-help/landlord-refusing-repairs" },
      { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
      { label: "Housing Legal Resources", href: "/legal-areas/housing" },
    ]}
    faqItems={[
      { question: "Can my landlord evict me without cause?", answer: "It depends on your lease type and state. Month-to-month tenants can usually be given notice to vacate (30-60 days). Fixed-term lease tenants generally can't be evicted without cause during the lease period." },
      { question: "What if my landlord won't return my security deposit?", answer: "Send a written demand letter. If they don't respond, you can file a small claims court case. Many states allow tenants to recover double or triple the deposit amount if it's wrongfully withheld." },
    ]}
  />
);

export default TenantRightsHelp;
