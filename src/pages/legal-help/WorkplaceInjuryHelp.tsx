import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";

const WorkplaceInjuryHelp = () => (
  <LegalHelpLayout
    title="Workers' Compensation: How to File a Workplace Injury Claim"
    metaTitle="Workers' Compensation Guide | Workplace Injury Claims | Veritas Path"
    metaDescription="Step-by-step guide to filing a workers' compensation claim. Learn the claims process, what to do if denied, and how to document your workplace injury."
    keywords="workers compensation, workplace injury, work injury claim, workers comp denied, workers comp appeal, on the job injury, workers comp process, filing workers comp"
    canonicalPath="/legal-help/workers-compensation"
    breadcrumbLabel="Workers' Compensation"
    quickAnswer="If you're injured at work, report the injury to your employer immediately, seek medical treatment, and file a workers' compensation claim. Workers' comp covers medical expenses and a portion of lost wages regardless of fault. Most states require employers to carry this insurance."
    steps={[
      { title: "Report the Injury Immediately", description: "Notify your employer in writing as soon as possible. Most states have strict deadlines (30-90 days). Include the date, time, location, and how the injury occurred." },
      { title: "Seek Medical Treatment", description: "Get medical care right away. Tell the doctor your injury is work-related. Follow all treatment plans. In some states, your employer may direct you to a specific doctor initially." },
      { title: "File the Workers' Comp Claim", description: "Complete your state's workers' comp claim form. Your employer should provide the form or file it for you. Keep copies of everything." },
      { title: "Document Everything", description: "Keep records of medical treatments, prescriptions, work restrictions, missed work days, and all communications with your employer and the insurance company." },
      { title: "Follow Through on Treatment", description: "Attend all medical appointments, follow your doctor's orders, and don't return to work until cleared. Non-compliance can jeopardize your claim." },
      { title: "Appeal If Denied", description: "If your claim is denied, you have the right to appeal. Request the denial in writing, review the reason, and file an appeal within your state's deadline (usually 30-60 days)." },
    ]}
    evidenceItems={[
      "Written injury report filed with employer",
      "Medical records and treatment documentation",
      "Photographs of injuries and the accident scene",
      "Witness statements from coworkers",
      "Pay stubs showing lost wages",
      "Workers' compensation claim forms",
      "Correspondence with insurance company",
      "Doctor's work restrictions and disability ratings",
    ]}
    commonMistakes={[
      "Waiting too long to report the injury to your employer",
      "Not seeking immediate medical attention",
      "Failing to mention the injury is work-related to your doctor",
      "Not following the prescribed treatment plan",
      "Returning to work before being medically cleared",
      "Accepting a settlement without understanding its full impact",
    ]}
    ctas={[
      { label: "Prepare Your Workers' Comp Case", href: "/case-analysis" },
      { label: "Generate Claim Documents", href: "/forms-library" },
      { label: "Settlement Calculator", href: "/injury-settlement-calculator" },
    ]}
    relatedPages={[
      { label: "Workplace Injury Claim", href: "/legal-help/workplace-injury-claim" },
      { label: "Workers' Comp Denied", href: "/legal-help/workers-comp-denied" },
      { label: "Personal Injury Calculator", href: "/injury-settlement-calculator" },
      { label: "Legal Glossary: Damages", href: "/legal-glossary#damages" },
      { label: "Legal Glossary: Statute of Limitations", href: "/legal-glossary#statute-of-limitations" },
    ]}
    faqItems={[
      { question: "Can I be fired for filing a workers' comp claim?", answer: "It is illegal for an employer to retaliate against you for filing a workers' comp claim. If you believe you were terminated in retaliation, you may have grounds for a separate legal claim." },
      { question: "What if my employer doesn't have workers' comp insurance?", answer: "In most states, employers are required to carry workers' comp insurance. If they don't, you may be able to sue them directly or file a claim through your state's uninsured employer fund." },
      { question: "Can I see my own doctor?", answer: "This varies by state. Some states allow you to choose your own doctor from the start, while others require you to see the employer's designated physician initially." },
      { question: "How long do I have to file a workers' comp claim?", answer: "Deadlines vary by state, typically from 30 days to 2 years from the date of injury. Report the injury to your employer as soon as possible to preserve your rights." },
    ]}
  />
);

export default WorkplaceInjuryHelp;
