import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const TribalCourtHelp = () => (
  <LegalHelpLayout
    title="Tribal Courts: How They Work and When They Apply"
    metaTitle="Tribal Courts Explained | Native American Court System | Justice Bot USA"
    metaDescription="Understand how tribal courts work, what types of cases they handle, and when tribal jurisdiction applies. Educational guide for Native Americans and legal practitioners."
    keywords="tribal court, tribal jurisdiction, native american court, tribal law, tribal court process, tribal sovereignty, indian country, tribal justice system"
    canonicalPath="/legal-help/tribal-court"
    breadcrumbLabel="Tribal Courts"
    quickAnswer="Tribal courts are judicial bodies established by federally recognized tribes to adjudicate matters under tribal law. They handle civil disputes, family law, some criminal cases, and regulatory matters on tribal land. Each tribe's court operates under its own codes and procedures."
    steps={[
      { title: "Determine If Tribal Court Has Jurisdiction", description: "Tribal courts generally have jurisdiction over cases involving tribal members on tribal land. Jurisdiction can depend on the type of case, location, and parties involved." },
      { title: "Identify the Correct Tribal Court", description: "Each tribe operates its own court system. Contact the tribal government where the issue occurred to find the appropriate court. Not all tribes have formal court systems." },
      { title: "Understand Tribal Court Procedures", description: "Tribal courts may follow different procedures than state or federal courts. Some incorporate traditional dispute resolution methods. Request the tribal court's rules of procedure." },
      { title: "File Your Case", description: "Obtain the correct forms from the tribal court clerk. Filing fees, procedures, and required documents vary by tribe. Some courts allow self-representation." },
      { title: "Attend Hearings", description: "Follow the tribal court's rules regarding evidence, testimony, and conduct. Some tribal courts incorporate traditional practices such as peacemaking or talking circles." },
      { title: "Enforce Tribal Court Orders", description: "Tribal court orders are enforceable on tribal land. For enforcement off tribal land, you may need to register the order with a state court through comity or full faith and credit." },
    ]}
    evidenceItems={[
      "Tribal enrollment documentation",
      "Evidence that the matter is connected to tribal land",
      "Relevant tribal codes or ordinances",
      "Documents from any prior state or federal proceedings",
      "Tribal court forms and filing requirements",
    ]}
    commonMistakes={[
      "Assuming tribal courts follow the same rules as state courts",
      "Filing in state court when tribal court has exclusive jurisdiction",
      "Not checking whether the tribe has an established court system",
      "Ignoring tribal court deadlines and procedures",
    ]}
    ctas={[
      { label: "Analyze Your Case", href: "/case-analysis" },
      { label: "Explore Legal Tools", href: "/ai-tools" },
    ]}
    relatedPages={[
      { label: "Native American Rights", href: "/legal-help/native-american-rights" },
      { label: "Tribal Jurisdiction Guide", href: "/legal-help/tribal-jurisdiction" },
      { label: "Family Law Resources", href: "/legal-areas/family-law" },
    ]}
    faqItems={[
      { question: "Are tribal court decisions recognized by state courts?", answer: "Many states recognize tribal court decisions under principles of comity. Some states have specific laws governing recognition of tribal court orders. Full faith and credit may also apply under federal law." },
      { question: "Can non-Native Americans be subject to tribal court jurisdiction?", answer: "In limited circumstances, yes — particularly in civil cases involving transactions on tribal land. The scope of tribal court jurisdiction over non-members is defined by federal case law." },
    ]}
  />
);

export default TribalCourtHelp;
