import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const TribalJurisdictionHelp = () => (
  <LegalHelpLayout
    title="Tribal Jurisdiction: When Does Tribal, Federal, or State Court Apply?"
    metaTitle="Tribal Jurisdiction Explained | Federal vs State vs Tribal Court | A.I. ANAL"
    metaDescription="Understand when tribal, federal, or state jurisdiction applies to your legal matter. Learn about the Major Crimes Act, Public Law 280, and jurisdictional overlaps."
    keywords="tribal jurisdiction, federal vs state jurisdiction, tribal court jurisdiction, major crimes act, public law 280, indian country jurisdiction, tribal sovereignty jurisdiction"
    canonicalPath="/legal-help/tribal-jurisdiction"
    breadcrumbLabel="Tribal Jurisdiction"
    quickAnswer="Jurisdiction in Indian Country can involve tribal, federal, and sometimes state courts, depending on the type of case, the parties involved, and the location. Criminal jurisdiction depends on whether the suspect and victim are tribal members and the severity of the crime. Civil jurisdiction often depends on where the activity occurred."
    steps={[
      { title: "Determine If the Location Is 'Indian Country'", description: "Indian Country includes reservations, dependent Indian communities, and Indian allotments. The legal definition (18 U.S.C. § 1151) determines which jurisdictional rules apply." },
      { title: "Identify the Parties", description: "Whether the parties are tribal members (Indians) or non-Indians significantly affects jurisdiction. The status of both the defendant and the victim matters in criminal cases." },
      { title: "Classify the Type of Case", description: "Criminal and civil cases follow different jurisdictional rules. Criminal jurisdiction is divided between tribal, federal, and state courts based on specific federal laws." },
      { title: "Check for Public Law 280 (PL-280)", description: "In PL-280 states (including CA, MN, NE, OR, WI, AK), the state has broader criminal and some civil jurisdiction on tribal land. This changes the standard jurisdictional framework." },
      { title: "Understand the Major Crimes Act", description: "For 16 specified serious crimes (murder, manslaughter, kidnapping, etc.) committed by an Indian in Indian Country, the federal government has jurisdiction under the Major Crimes Act (18 U.S.C. § 1153)." },
      { title: "Consult Tribal and Federal Resources", description: "Jurisdictional questions can be complex. Contact the tribal court, U.S. Attorney's Office, or the Bureau of Indian Affairs for guidance on your specific situation." },
    ]}
    evidenceItems={[
      "Documentation establishing the location of the incident (on/off reservation)",
      "Tribal membership or enrollment records for all parties",
      "Maps showing reservation boundaries",
      "Relevant tribal, state, and federal laws",
      "Prior court orders from any jurisdiction",
    ]}
    commonMistakes={[
      "Assuming state law automatically applies on tribal land",
      "Not checking if your state is a PL-280 state",
      "Filing in the wrong court — which can result in dismissal",
      "Ignoring tribal court jurisdiction in civil matters",
      "Not considering concurrent jurisdiction possibilities",
    ]}
    ctas={[
      { label: "Analyze Your Jurisdictional Question", href: "/case-analysis" },
      { label: "Explore Legal Tools", href: "/ai-tools" },
    ]}
    relatedPages={[
      { label: "Native American Rights", href: "/legal-help/native-american-rights" },
      { label: "Tribal Courts Explained", href: "/legal-help/tribal-court" },
      { label: "Criminal Court Process", href: "/legal-help/criminal-court-process" },
    ]}
    faqItems={[
      { question: "What is Public Law 280?", answer: "PL-280 is a federal law that transferred criminal jurisdiction over offenses in Indian Country to certain state governments. Mandatory PL-280 states include California, Minnesota (except Red Lake), Nebraska, Oregon (except Warm Springs), Wisconsin, and Alaska." },
      { question: "Can a tribe and federal government both prosecute the same crime?", answer: "Yes, in some cases. Tribal courts and federal courts represent separate sovereigns, so prosecution in both does not constitute double jeopardy under current law." },
    ]}
  />
);

export default TribalJurisdictionHelp;
