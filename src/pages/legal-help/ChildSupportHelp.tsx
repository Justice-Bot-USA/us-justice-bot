import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

// Official calculators and agencies. The calculators give estimates only; the court decides.
const CALCULATORS = [
  {
    label: "California Guideline Calculator (California Child Support Services)",
    href: "https://childsupport.ca.gov/guideline-calculator/",
    desc: "California's official child support calculator, using the guideline the courts use. Its result is an estimate, not a promise of what will be ordered; the commissioner or judge decides.",
  },
  {
    label: "New York Courts: Maintenance and Child Support Tools",
    href: "https://nycourts.gov/divorce-resources/maintenance-and-child-support-tools",
    desc: "Worksheets and calculators from the New York courts, including the Child Support Worksheet (UD-8(3)) used in uncontested divorces. Results are estimates; the court decides the amount.",
  },
];

const AGENCIES = [
  { label: "California Child Support Services", href: "https://childsupport.ca.gov/" },
  { label: "California Courts: Child support self-help", href: "https://selfhelp.courts.ca.gov/child-support" },
  { label: "New York State Child Support Services", href: "https://childsupport.ny.gov/" },
  { label: "New York Courts: Child support resources", href: "https://www.nycourts.gov/divorce-resources/child-support-resources" },
];

const ChildSupportHelp = () => (
  <LegalHelpLayout
    title="Child Support in California and New York: Calculators and How to Ask"
    metaTitle="Child Support Guide (CA & NY): Official Calculators and Forms | Justice Bot USA"
    metaDescription="How child support is set in California and New York, links to the official guideline calculators (their results are estimates), and the court forms used to ask for or change support. Legal information, not legal advice."
    keywords="child support calculator california, new york child support worksheet, child support guideline, how to ask for child support, change child support order"
    canonicalPath="/legal-help/child-support"
    breadcrumbLabel="Child Support"
    quickAnswer="Both California and New York set child support with a guideline formula based mainly on the parents' incomes. California's formula also uses how much time each parent spends with the child; New York applies a set percentage to the parents' combined income, up to a cap that is adjusted periodically (17% for one child, 25% for two, 29% for three, 31% for four, and at least 35% for five or more), and each parent's share follows their part of that income. The official calculators below give estimates only. The judge, commissioner, or support magistrate decides the actual amount."
    steps={[
      { title: "Gather income information", description: "Pay stubs, tax returns, and records of any other income, for both parents if you can get them, plus costs such as the child's health insurance and work-related child care. In California this information goes on the Income and Expense Declaration (FL-150)." },
      { title: "Get an estimate", description: "Use your state's official calculator (links below). The result is an estimate, not the amount a court will order." },
      { title: "Decide how to ask", description: "You can ask the court yourself, or apply to your state's child support agency, which can help establish parentage, get a support order, and collect payments." },
      { title: "California: ask in a family case", description: "If you already have a family case (such as a divorce, parentage, or custody case), ask for support with a Request for Order (FL-300) and an Income and Expense Declaration (FL-150). If you don't have a case, you open one first. Court fees usually apply unless you get a fee waiver (FW-001); papers the local child support agency files have no fee." },
      { title: "New York: file a support petition", description: "File a Support Petition (form 4-3) in Family Court, or a Petition for Modification (4-11) to change an existing order. Family Court does not charge filing fees. In a divorce, child support is handled in the divorce case, using the Child Support Worksheet (UD-8(3))." },
      { title: "Go to the hearing and follow the order", description: "Bring your financial documents. Keep paying, or keep records of payments received, exactly as the order says until a court changes it." },
    ]}
    evidenceItems={[
      "Recent pay stubs (yours, and the other parent's if you have them)",
      "Recent tax returns and W-2 or 1099 forms",
      "Records of other income, such as self-employment, overtime, or benefits",
      "Proof of the child's health insurance costs",
      "Work- or school-related child care costs",
      "A record of the time the child spends with each parent (used in California's formula)",
      "Any existing custody or support order",
      "Records of support payments made or received",
    ]}
    commonMistakes={[
      "Waiting to ask for a change: a new amount usually can't start before the date you asked for it",
      "Leaving out income, such as self-employment, cash work, or overtime",
      "Treating a calculator estimate as the amount the court will order",
      "Stopping or lowering payments without a new court order",
      "Relying on an informal agreement instead of a court order",
      "Not telling the court or agency when your address or income changes",
    ]}
    ctas={[
      { label: "California Support Steps & Forms", href: "/ca/legal-center?area=family" },
      { label: "New York Support Steps & Forms", href: "/ny/legal-center?area=family" },
      { label: "Fill the CA Fee Waiver (FW-001) Free", href: "/fill/ca/fw-001" },
    ]}
    relatedPages={[
      { label: "Child Custody Guide", href: "/legal-help/child-custody" },
      { label: "Free Custody Guide (CA & NY)", href: "/free-custody-case-organizer" },
      { label: "Divorce Process", href: "/legal-help/divorce-process" },
      { label: "Protective Orders", href: "/legal-help/protective-orders" },
    ]}
    faqItems={[
      { question: "Is the calculator result the amount I will pay or receive?", answer: "No. Both official calculators give estimates. The court looks at the full financial information and can order a different amount in some situations." },
      { question: "Can a child support order be changed?", answer: "Yes. In California you can ask the court to change support when circumstances change, such as income or parenting time; the change usually can't go back before the date you filed. In New York, you can ask for a change after a substantial change in circumstances. Unless the parents opted out in a written agreement, you can also ask once 3 years have passed since the order was made or last changed, or if either parent's gross income has changed by 15% or more. A drop in income counts only if it was involuntary and you have tried hard to find comparable work." },
      { question: "How long does child support last?", answer: "In California, generally until the child turns 18. If an unmarried 18-year-old is still a full-time high school student and not self-supporting, support generally continues until the child finishes 12th grade or turns 19, whichever comes first. In New York, generally until the child turns 21." },
      { question: "Does it cost anything to ask for child support?", answer: "New York Family Court does not charge filing fees. In California, court filing fees usually apply unless you qualify for a fee waiver, and papers filed by the local child support agency have no fee. Ask the child support agency about any fees for its services." },
      { question: "What if the other parent doesn't pay?", answer: "The child support agency or the court can enforce an order, for example through wage withholding. In New York, you can also file a violation petition in Family Court." },
    ]}
  >
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-foreground mb-5">Official Child Support Calculators</h2>
      <div className="space-y-3">
        {CALCULATORS.map((c) => (
          <Card key={c.href}>
            <CardContent className="p-5">
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                {c.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-3">
        Calculator results are estimates only. Justice Bot USA does not calculate support or predict what a court will order.
      </p>
      <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">Child Support Agencies and Court Self-Help</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {AGENCIES.map((a) => (
          <a key={a.href} href={a.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors text-sm text-foreground">
            <ExternalLink className="h-4 w-4 text-primary" />{a.label}
          </a>
        ))}
      </div>
    </section>
  </LegalHelpLayout>
);

export default ChildSupportHelp;
