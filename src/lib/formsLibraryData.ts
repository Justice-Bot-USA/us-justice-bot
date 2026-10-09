export interface CourtForm {
  formNumber: string;
  name: string;
  description: string;
  url: string;
  category: string;
  feeAmount?: string;
  feeWaiverAvailable?: boolean;
}

export interface StateFormsData {
  stateName: string;
  courtWebsite: string;
  selfHelpUrl: string;
  forms: Record<string, CourtForm[]>;
}

export const stateFormsLibrary: Record<string, StateFormsData> = {
  // ==================== CALIFORNIA ====================
  "CA": {
    stateName: "California",
    courtWebsite: "https://www.courts.ca.gov",
    selfHelpUrl: "https://selfhelp.courts.ca.gov",
    forms: {
      "family": [
        { formNumber: "FL-100", name: "Petition - Marriage/Domestic Partnership", description: "Start divorce or legal separation proceedings", url: "https://www.courts.ca.gov/documents/fl100.pdf", category: "Divorce", feeAmount: "$435-$450", feeWaiverAvailable: true },
        { formNumber: "FL-110", name: "Summons (Family Law)", description: "Official notice to spouse/partner", url: "https://www.courts.ca.gov/documents/fl110.pdf", category: "Divorce" },
        { formNumber: "FL-115", name: "Proof of Service of Summons", description: "Confirm spouse was properly served", url: "https://www.courts.ca.gov/documents/fl115.pdf", category: "Divorce" },
        { formNumber: "FL-120", name: "Response - Marriage/Domestic Partnership", description: "Respond to divorce petition", url: "https://www.courts.ca.gov/documents/fl120.pdf", category: "Divorce", feeAmount: "$435-$450", feeWaiverAvailable: true },
        { formNumber: "FL-150", name: "Income and Expense Declaration", description: "Financial disclosure for support calculations", url: "https://www.courts.ca.gov/documents/fl150.pdf", category: "Financial" },
        { formNumber: "FL-160", name: "Property Declaration", description: "List community and separate property", url: "https://www.courts.ca.gov/documents/fl160.pdf", category: "Financial" },
        { formNumber: "FL-300", name: "Request for Order", description: "Request temporary orders from court", url: "https://www.courts.ca.gov/documents/fl300.pdf", category: "Motions", feeAmount: "$60", feeWaiverAvailable: true },
        { formNumber: "FL-311", name: "Child Custody and Visitation Application", description: "Request custody/visitation orders", url: "https://www.courts.ca.gov/documents/fl311.pdf", category: "Custody" },
        { formNumber: "FL-341", name: "Child Custody and Visitation Order", description: "Final custody order attachment", url: "https://www.courts.ca.gov/documents/fl341.pdf", category: "Custody" },
        { formNumber: "FL-342", name: "Child Support Information and Order Attachment", description: "Child support order details", url: "https://www.courts.ca.gov/documents/fl342.pdf", category: "Support" },
        { formNumber: "DV-100", name: "Request for Domestic Violence Restraining Order", description: "Protection from abuse", url: "https://www.courts.ca.gov/documents/dv100.pdf", category: "Protection Orders", feeAmount: "Free", feeWaiverAvailable: true },
        { formNumber: "DV-110", name: "Temporary Restraining Order", description: "Emergency protection order", url: "https://www.courts.ca.gov/documents/dv110.pdf", category: "Protection Orders" },
      ],
      "small-claims": [
        { formNumber: "SC-100", name: "Plaintiff's Claim and ORDER to Go to Small Claims Court", description: "Start your small claims case", url: "https://www.courts.ca.gov/documents/sc100.pdf", category: "Filing", feeAmount: "$30-$75", feeWaiverAvailable: true },
        { formNumber: "SC-103", name: "Small Claims Case Questionnaire", description: "Help court understand your case", url: "https://www.courts.ca.gov/documents/sc103.pdf", category: "Filing" },
        { formNumber: "SC-104", name: "Defendant's Claim and ORDER to Go to Small Claims Court", description: "Counter-claim against plaintiff", url: "https://www.courts.ca.gov/documents/sc104.pdf", category: "Response", feeAmount: "$30-$75", feeWaiverAvailable: true },
        { formNumber: "SC-105", name: "Amendment to Claim", description: "Change your claim before hearing", url: "https://www.courts.ca.gov/documents/sc105.pdf", category: "Amendments" },
        { formNumber: "SC-107", name: "Request to Amend Claim Before Hearing", description: "Modify claim details", url: "https://www.courts.ca.gov/documents/sc107.pdf", category: "Amendments" },
        { formNumber: "SC-120", name: "Request to Pay Judgment in Installments", description: "Payment plan request", url: "https://www.courts.ca.gov/documents/sc120.pdf", category: "Judgment" },
        { formNumber: "SC-133", name: "Request to Postpone Trial", description: "Ask for new hearing date", url: "https://www.courts.ca.gov/documents/sc133.pdf", category: "Motions" },
        { formNumber: "SC-134", name: "Declaration and Order (Postponement)", description: "Declaration supporting postponement", url: "https://www.courts.ca.gov/documents/sc134.pdf", category: "Motions" },
        { formNumber: "SC-500", name: "Subpoena for Personal Appearance", description: "Require witness to appear", url: "https://www.courts.ca.gov/documents/sc500.pdf", category: "Discovery" },
      ],
      "employment": [
        { formNumber: "DLSE-1", name: "Initial Report or Claim", description: "File wage claim with Labor Commissioner", url: "https://www.dir.ca.gov/dlse/howtofilewageclaim.htm", category: "Wage Claims" },
        { formNumber: "CRD Complaint", name: "Pre-Complaint Inquiry", description: "File discrimination complaint", url: "https://calcivilrights.ca.gov/complaintprocess/", category: "Discrimination", feeAmount: "Free" },
        { formNumber: "DWC-1", name: "Workers' Compensation Claim Form", description: "Report workplace injury", url: "https://www.dir.ca.gov/dwc/DWCForm1.pdf", category: "Workers Comp" },
        { formNumber: "WCAB Application", name: "Application for Adjudication of Claim", description: "Start workers comp case", url: "https://www.dir.ca.gov/dwc/wcab.htm", category: "Workers Comp" },
        { formNumber: "DE 2501", name: "Claim for Disability Insurance Benefits", description: "Apply for state disability", url: "https://edd.ca.gov/en/disability/how_to_file_a_di_claim_by_mail/", category: "Disability" },
        { formNumber: "DE 2501F", name: "Claim for Paid Family Leave Benefits", description: "Apply for paid family leave", url: "https://edd.ca.gov/en/disability/how_to_file_a_pfl_claim_by_mail/", category: "Family Leave" },
      ],
      "housing": [
        { formNumber: "UD-100", name: "Complaint - Unlawful Detainer", description: "Landlord eviction lawsuit", url: "https://www.courts.ca.gov/documents/ud100.pdf", category: "Eviction", feeAmount: "$240-$450", feeWaiverAvailable: true },
        { formNumber: "UD-101", name: "Plaintiff's Mandatory Cover Sheet", description: "Required cover sheet for UD", url: "https://www.courts.ca.gov/documents/ud101.pdf", category: "Eviction" },
        { formNumber: "UD-105", name: "Answer - Unlawful Detainer", description: "Tenant response to eviction", url: "https://www.courts.ca.gov/documents/ud105.pdf", category: "Defense", feeAmount: "$240-$450", feeWaiverAvailable: true },
        { formNumber: "UD-115", name: "Request for Entry of Default", description: "Request default judgment", url: "https://www.courts.ca.gov/documents/ud115.pdf", category: "Default" },
        { formNumber: "SC-500A", name: "Security Deposit Demand Letter", description: "Demand return of deposit", url: "https://selfhelp.courts.ca.gov/small-claims/security-deposit", category: "Deposits" },
        { formNumber: "MC-030", name: "Declaration", description: "Written statement under penalty of perjury", url: "https://www.courts.ca.gov/documents/mc030.pdf", category: "General" },
      ],
      "criminal": [
        { formNumber: "CR-180", name: "Petition for Dismissal", description: "Request expungement (PC 1203.4)", url: "https://www.courts.ca.gov/documents/cr180.pdf", category: "Expungement", feeAmount: "$120-$150", feeWaiverAvailable: true },
        { formNumber: "CR-181", name: "Order for Dismissal", description: "Court order granting expungement", url: "https://www.courts.ca.gov/documents/cr181.pdf", category: "Expungement" },
        { formNumber: "CR-105", name: "Petition for Reduction to Misdemeanor", description: "Reduce felony wobbler to misdemeanor", url: "https://www.courts.ca.gov/documents/cr105.pdf", category: "Record Relief" },
        { formNumber: "GC-310", name: "Petition for Appointment of Guardian", description: "Seek guardianship of minor", url: "https://www.courts.ca.gov/documents/gc310.pdf", category: "Guardianship" },
      ],
      "general": [
        { formNumber: "FW-001", name: "Request to Waive Court Fees", description: "Apply for fee waiver", url: "https://www.courts.ca.gov/documents/fw001.pdf", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "FW-003", name: "Order on Court Fee Waiver", description: "Court decision on fee waiver", url: "https://www.courts.ca.gov/documents/fw003.pdf", category: "Fee Waiver" },
        { formNumber: "MC-025", name: "Attachment to Judicial Council Form", description: "Extra pages for any form", url: "https://www.courts.ca.gov/documents/mc025.pdf", category: "General" },
        { formNumber: "POS-010", name: "Proof of Service of Summons", description: "Confirm service of process", url: "https://www.courts.ca.gov/documents/pos010.pdf", category: "Service" },
        { formNumber: "POS-030", name: "Proof of Service by First-Class Mail", description: "Confirm mailed service", url: "https://www.courts.ca.gov/documents/pos030.pdf", category: "Service" },
        { formNumber: "CM-010", name: "Civil Case Cover Sheet", description: "Required for civil cases", url: "https://www.courts.ca.gov/documents/cm010.pdf", category: "Civil" },
      ],
      "personal-injury": [
        { formNumber: "CM-010", name: "Civil Case Cover Sheet", description: "Required cover sheet for all civil cases including personal injury", url: "https://www.courts.ca.gov/documents/cm010.pdf", category: "Filing", feeAmount: "$435-$450", feeWaiverAvailable: true },
        { formNumber: "PLD-PI-001", name: "Complaint - Personal Injury, Property Damage, Wrongful Death", description: "Main complaint form for personal injury lawsuits", url: "https://www.courts.ca.gov/documents/pldpi001.pdf", category: "Filing" },
        { formNumber: "PLD-PI-002", name: "Cause of Action - Motor Vehicle", description: "Attachment for motor vehicle accident claims", url: "https://www.courts.ca.gov/documents/pldpi002.pdf", category: "Auto Accident" },
        { formNumber: "PLD-PI-003", name: "Cause of Action - Premises Liability", description: "Attachment for slip and fall/property injuries", url: "https://www.courts.ca.gov/documents/pldpi003.pdf", category: "Premises Liability" },
        { formNumber: "SUM-100", name: "Summons", description: "Notice to defendant of lawsuit", url: "https://www.courts.ca.gov/documents/sum100.pdf", category: "Service" },
        { formNumber: "POS-010", name: "Proof of Service of Summons", description: "Confirm defendant was properly served", url: "https://www.courts.ca.gov/documents/pos010.pdf", category: "Service" },
        { formNumber: "CM-110", name: "Case Management Statement", description: "Required case management document", url: "https://www.courts.ca.gov/documents/cm110.pdf", category: "Case Management" },
        { formNumber: "DISC-001", name: "Form Interrogatories - General", description: "Standard discovery questions for opposing party", url: "https://www.courts.ca.gov/documents/disc001.pdf", category: "Discovery" },
        { formNumber: "FW-001", name: "Request to Waive Court Fees", description: "Apply for fee waiver if low income", url: "https://www.courts.ca.gov/documents/fw001.pdf", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== TEXAS ====================
  "TX": {
    stateName: "Texas",
    courtWebsite: "https://www.txcourts.gov",
    selfHelpUrl: "https://texaslawhelp.org",
    forms: {
      "family": [
        { formNumber: "Original Petition for Divorce", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://texaslawhelp.org/form/divorce", category: "Divorce", feeAmount: "$300-$350", feeWaiverAvailable: true },
        { formNumber: "Waiver of Citation", name: "Waiver of Citation", description: "Spouse agrees to skip formal service", url: "https://texaslawhelp.org/form/divorce", category: "Divorce" },
        { formNumber: "Final Decree of Divorce", name: "Final Decree of Divorce", description: "Final divorce order", url: "https://texaslawhelp.org/form/divorce", category: "Divorce" },
        { formNumber: "Suit Affecting Parent-Child Relationship", name: "SAPCR Petition", description: "Custody and child support case", url: "https://texaslawhelp.org/form/child-custody", category: "Custody", feeAmount: "$300-$350", feeWaiverAvailable: true },
        { formNumber: "Application for Protective Order", name: "Protective Order Application", description: "Request protection from abuse", url: "https://texaslawhelp.org/form/protective-orders", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "Temporary Ex Parte Order", name: "Emergency Protective Order", description: "Immediate protection order", url: "https://texaslawhelp.org/form/protective-orders", category: "Protection Orders" },
      ],
      "small-claims": [
        { formNumber: "Petition (Small Claims)", name: "Small Claims Petition", description: "Start small claims case (up to $20,000)", url: "https://texaslawhelp.org/form/small-claims", category: "Filing", feeAmount: "$54-$95", feeWaiverAvailable: true },
        { formNumber: "Citation", name: "Citation (Small Claims)", description: "Notice to defendant", url: "https://texaslawhelp.org/form/small-claims", category: "Service" },
        { formNumber: "Answer", name: "Answer to Small Claims", description: "Respond to small claims lawsuit", url: "https://texaslawhelp.org/form/small-claims", category: "Response" },
        { formNumber: "Default Judgment", name: "Motion for Default Judgment", description: "Win case if no response", url: "https://texaslawhelp.org/form/small-claims", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "TWC Initial Claim", name: "Unemployment Benefits Claim", description: "Apply for unemployment", url: "https://www.twc.texas.gov/jobseekers/how-apply-unemployment-benefits", category: "Unemployment" },
        { formNumber: "TWC Wage Claim", name: "Wage Claim Form", description: "Report unpaid wages", url: "https://www.twc.texas.gov/jobseekers/how-submit-wage-claim-under-texas-payday-law", category: "Wage Claims" },
        { formNumber: "EEOC Charge", name: "EEOC Charge of Discrimination", description: "Federal discrimination complaint", url: "https://www.eeoc.gov/how-file-charge-employment-discrimination", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction Petition", name: "Petition for Eviction", description: "Landlord eviction lawsuit", url: "https://texaslawhelp.org/form/eviction", category: "Eviction", feeAmount: "$54-$95", feeWaiverAvailable: true },
        { formNumber: "Answer to Eviction", name: "Answer to Eviction Petition", description: "Tenant response to eviction", url: "https://texaslawhelp.org/form/eviction", category: "Defense" },
        { formNumber: "Request for Jury Trial", name: "Jury Trial Request (Eviction)", description: "Request jury trial in eviction", url: "https://texaslawhelp.org/form/eviction", category: "Trial" },
        { formNumber: "Security Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return", url: "https://texaslawhelp.org/form/security-deposit", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "Expunction Petition", name: "Petition for Expunction", description: "Clear criminal record", url: "https://texaslawhelp.org/form/expunction", category: "Expungement", feeAmount: "$300+", feeWaiverAvailable: true },
        { formNumber: "Order of Nondisclosure", name: "Petition for Nondisclosure", description: "Seal criminal record", url: "https://texaslawhelp.org/form/nondisclosure", category: "Record Sealing", feeAmount: "$28-$280" },
      ],
      "general": [
        { formNumber: "Statement of Inability", name: "Statement of Inability to Afford Payment", description: "Request fee waiver", url: "https://texaslawhelp.org/form/fee-waiver", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Service", description: "Confirm service of process", url: "https://texaslawhelp.org", category: "Service" },
      ],
      "personal-injury": [
        { formNumber: "Original Petition", name: "Original Petition (Personal Injury)", description: "Main complaint for personal injury cases in Texas district court", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Filing", feeAmount: "$300-$350", feeWaiverAvailable: true },
        { formNumber: "Citation", name: "Citation", description: "Official notice to defendant", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Service" },
        { formNumber: "Discovery Request", name: "Request for Disclosure", description: "Standard Texas discovery requesting basic case information", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Discovery" },
        { formNumber: "Interrogatories", name: "Interrogatories to Defendant", description: "Written questions to opposing party", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Discovery" },
        { formNumber: "Request for Production", name: "Request for Production of Documents", description: "Request defendant's documents and records", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Discovery" },
        { formNumber: "Medical Authorization", name: "Authorization for Release of Medical Records", description: "HIPAA-compliant medical records release", url: "https://texaslawhelp.org/legal-help/personal-injury", category: "Medical Records" },
        { formNumber: "Statement of Inability", name: "Statement of Inability to Afford Payment", description: "Texas fee waiver application", url: "https://texaslawhelp.org/form/fee-waiver", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NEW YORK ====================
  "NY": {
    stateName: "New York",
    courtWebsite: "https://www.nycourts.gov",
    selfHelpUrl: "https://www.nycourts.gov/courthelp/",
    forms: {
      "family": [
        { formNumber: "UD-2", name: "Summons With Notice (Divorce)", description: "Start uncontested divorce", url: "https://www.nycourts.gov/divorce-resources/statewide-divorce-forms", category: "Divorce", feeAmount: "$335", feeWaiverAvailable: true },
        { formNumber: "UD-11", name: "Verified Complaint for Divorce", description: "Detailed divorce allegations", url: "https://www.nycourts.gov/divorce-resources/statewide-divorce-forms", category: "Divorce" },
        { formNumber: "UD-6", name: "Affidavit of Defendant", description: "Defendant's consent to divorce", url: "https://www.nycourts.gov/divorce-resources/statewide-divorce-forms", category: "Divorce" },
        { formNumber: "UD-8", name: "Sworn Statement of Removal of Barriers", description: "Religious barriers statement", url: "https://www.nycourts.gov/divorce-resources/statewide-divorce-forms", category: "Divorce" },
        { formNumber: "Order of Protection Petition", name: "Family Offense Petition", description: "Request protection order", url: "https://www.nycourts.gov/help/safety-violence/filing-family-offense-petition-domestic-violence", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "Custody Petition", name: "Petition for Custody", description: "Request child custody", url: "https://www.nycourts.gov/help/family-issues-divorce", category: "Custody", feeAmount: "Free" },
        { formNumber: "Support Petition", name: "Petition for Child Support", description: "Request child support order", url: "https://www.nycourts.gov/help/family-issues-divorce", category: "Support", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CIV-SC-50", name: "Small Claims Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.nycourts.gov/forms/statement-claim-small-claims", category: "Filing", feeAmount: "$15-$20", feeWaiverAvailable: true },
        { formNumber: "Commercial Claims Form", name: "Commercial Small Claims", description: "Business small claims (up to $10,000)", url: "https://www.nycourts.gov/forms/statement-claim-small-claims", category: "Filing", feeAmount: "$25-$35" },
        { formNumber: "Motion to Vacate Default", name: "Motion to Vacate Default", description: "Reopen case after default", url: "https://www.nycourts.gov/forms/statement-claim-small-claims", category: "Motions" },
        { formNumber: "Subpoena", name: "Small Claims Subpoena", description: "Compel witness attendance", url: "https://www.nycourts.gov/forms/statement-claim-small-claims", category: "Discovery" },
      ],
      "employment": [
        { formNumber: "DOL UI-1", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dol.ny.gov/unemployment/file-your-first-claim-background", category: "Unemployment" },
        { formNumber: "DOL LS-223", name: "Claim for Unpaid Wages", description: "Report wage theft", url: "https://dol.ny.gov/unpaidwithheld-wages-and-டமages", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "DHR Complaint", name: "Human Rights Complaint", description: "File discrimination complaint", url: "https://dhr.ny.gov/complaint", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "NYLP-1", name: "Notice of Petition (Eviction)", description: "Landlord eviction notice", url: "https://www.nycourts.gov/help/homes-evictions", category: "Eviction", feeAmount: "$45" },
        { formNumber: "Answer in Eviction", name: "Answer in Housing Court", description: "Tenant response to eviction", url: "https://www.nycourts.gov/help/homes-evictions", category: "Defense", feeAmount: "Free" },
        { formNumber: "HP Action", name: "HP Action for Repairs", description: "Sue landlord for repairs", url: "https://www.nycourts.gov/new-york-city-housing-court/starting-hp-proceeding-obtain-repairs", category: "Repairs", feeAmount: "Free" },
        { formNumber: "Order to Show Cause", name: "Order to Show Cause (Housing)", description: "Emergency housing motion", url: "https://www.nycourts.gov/help/homes-evictions", category: "Motions" },
      ],
      "criminal": [
        { formNumber: "CPL 160.59 Motion", name: "Motion to Seal Criminal Record", description: "Seal eligible convictions", url: "https://www.nycourts.gov/help/criminal/criminal-records-sealing", category: "Record Sealing", feeAmount: "Free" },
        { formNumber: "Certificate of Relief", name: "Application for Certificate of Relief", description: "Remove legal disabilities from conviction", url: "https://www.nycourts.gov/help/criminal/getting-rights-back", category: "Certificates", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "Fee Waiver Application", name: "Poor Person Application", description: "Request court fee waiver", url: "https://www.nycourts.gov/help/representing-yourself-court/fee-waivers-poor-persons-relief", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Service", description: "Prove papers were served", url: "https://www.nycourts.gov/help/representing-yourself-court/how-legal-papers-are-delivered-service", category: "Service" },
      ],
      "personal-injury": [
        { formNumber: "Summons", name: "Summons in Supreme Court", description: "Official notice initiating personal injury lawsuit", url: "https://www.nycourts.gov/forms/", category: "Filing", feeAmount: "$335", feeWaiverAvailable: true },
        { formNumber: "Verified Complaint", name: "Verified Complaint (Personal Injury)", description: "Detailed complaint for personal injury claims", url: "https://www.nycourts.gov/forms/", category: "Filing" },
        { formNumber: "RJI", name: "Request for Judicial Intervention", description: "Requests court assignment for case management", url: "https://www.nycourts.gov/forms/", category: "Case Management", feeAmount: "$95" },
        { formNumber: "Bill of Particulars", name: "Bill of Particulars", description: "Detailed statement of injuries and damages claimed", url: "https://www.nycourts.gov/forms/", category: "Pleadings" },
        { formNumber: "Demand for Discovery", name: "Combined Demands for Discovery", description: "Request for interrogatories, documents, and admissions", url: "https://www.nycourts.gov/forms/", category: "Discovery" },
        { formNumber: "Notice of Medical Exam", name: "Notice of Independent Medical Examination", description: "Notice for defense medical examination (IME)", url: "https://www.nycourts.gov/forms/", category: "Discovery" },
        { formNumber: "Note of Issue", name: "Note of Issue and Certificate of Readiness", description: "Certifies case is ready for trial", url: "https://www.nycourts.gov/forms/", category: "Trial Prep", feeAmount: "$125" },
        { formNumber: "Poor Person Application", name: "Poor Persons Application", description: "Fee waiver for low-income litigants", url: "https://www.nycourts.gov/help/representing-yourself-court/fee-waivers-poor-persons-relief", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== FLORIDA ====================
  "FL": {
    stateName: "Florida",
    courtWebsite: "https://www.flcourts.gov",
    selfHelpUrl: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information",
    forms: {
      "family": [
        { formNumber: "12.901(a)", name: "Petition for Dissolution of Marriage", description: "Start divorce with children", url: "https://www.flcourts.gov/content/download/403203", category: "Divorce", feeAmount: "$409", feeWaiverAvailable: true },
        { formNumber: "12.901(b)(1)", name: "Petition for Simplified Dissolution", description: "Simple uncontested divorce", url: "https://www.flcourts.gov/content/download/403205", category: "Divorce", feeAmount: "$409", feeWaiverAvailable: true },
        { formNumber: "12.902(b)", name: "Family Law Financial Affidavit (Short)", description: "Financial disclosure (<$50k income)", url: "https://www.flcourts.gov/content/download/403224", category: "Financial" },
        { formNumber: "12.902(c)", name: "Family Law Financial Affidavit (Long)", description: "Financial disclosure (>$50k income)", url: "https://www.flcourts.gov/content/download/403226", category: "Financial" },
        { formNumber: "12.903(a)", name: "Answer, Waiver, and Request for Copy", description: "Respond to divorce petition", url: "https://www.flcourts.gov/content/download/403228", category: "Divorce" },
        { formNumber: "12.947(a)", name: "Motion for Temporary Support", description: "Request temporary alimony/support", url: "https://www.flcourts.gov/content/download/403291", category: "Support" },
        { formNumber: "12.980(a)", name: "Petition for Injunction (Domestic Violence)", description: "Request protection from abuse", url: "https://www.flcourts.gov/content/download/403315", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "7.010", name: "Statement of Claim (Small Claims)", description: "Start small claims case (up to $8,000)", url: "https://www.flcourts.gov/content/download/403083", category: "Filing", feeAmount: "$55-$300", feeWaiverAvailable: true },
        { formNumber: "7.020", name: "Summons/Notice to Appear", description: "Notice of hearing to defendant", url: "https://www.flcourts.gov/content/download/403085", category: "Service" },
        { formNumber: "7.050", name: "Counterclaim", description: "Defendant's claim against plaintiff", url: "https://www.flcourts.gov/content/download/403089", category: "Response" },
        { formNumber: "7.060", name: "Third-Party Complaint", description: "Bring additional party into case", url: "https://www.flcourts.gov/content/download/403091", category: "Third Party" },
        { formNumber: "7.340", name: "Execution - Final Judgment", description: "Collect on judgment", url: "https://www.flcourts.gov/content/download/403117", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "UCB-500", name: "Reemployment Assistance Claim", description: "Apply for unemployment benefits", url: "https://floridajobs.org/reemployment-assistance-service-center", category: "Unemployment" },
        { formNumber: "FCHR Complaint", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://fchr.myflorida.com/", category: "Discrimination", feeAmount: "Free" },
        { formNumber: "Wage Claim", name: "Private Action Wage Claim", description: "Sue for unpaid wages in court", url: "https://www.floridabar.org", category: "Wage Claims" },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Eviction", description: "Landlord eviction lawsuit", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Eviction-Forms", category: "Eviction", feeAmount: "$185-$400", feeWaiverAvailable: true },
        { formNumber: "Motion to Determine Rent", name: "Motion to Determine Rent", description: "Court sets rent during case", url: "https://www.flcourts.gov", category: "Eviction" },
        { formNumber: "Answer to Eviction", name: "Answer to Eviction Complaint", description: "Tenant defense to eviction", url: "https://www.flcourts.gov", category: "Defense" },
        { formNumber: "Security Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return", url: "https://www.floridabar.org/public/consumer/tip014/", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition to Expunge", description: "Clear criminal record", url: "https://www.fdle.state.fl.us/Seal-and-Expunge/Expunge-Background", category: "Expungement", feeAmount: "$75", feeWaiverAvailable: false },
        { formNumber: "Seal Petition", name: "Petition to Seal", description: "Seal criminal record", url: "https://www.fdle.state.fl.us/Seal-and-Expunge/Seal-Background", category: "Record Sealing", feeAmount: "$75" },
        { formNumber: "Certificate of Eligibility", name: "Application for Certificate of Eligibility", description: "Required for seal/expunge", url: "https://www.fdle.state.fl.us/Seal-and-Expunge", category: "Prerequisites" },
      ],
      "general": [
        { formNumber: "1.996", name: "Application for Civil Indigent Status", description: "Request court fee waiver", url: "https://www.flcourts.gov/content/download/403076", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "1.902", name: "Summons: Personal Service", description: "Civil case summons", url: "https://www.flcourts.gov/content/download/403068", category: "Service" },
      ],
      "personal-injury": [
        { formNumber: "Civil Cover Sheet", name: "Civil Cover Sheet", description: "Required cover sheet for circuit court civil filings", url: "https://www.flcourts.gov/content/download/403019", category: "Filing", feeAmount: "$400", feeWaiverAvailable: true },
        { formNumber: "Complaint", name: "Complaint for Negligence/Personal Injury", description: "Main complaint form for PI cases in Florida", url: "https://www.flcourts.gov/", category: "Filing" },
        { formNumber: "1.902", name: "Summons: Personal Service on Natural Person", description: "Official summons for personal service", url: "https://www.flcourts.gov/content/download/403068", category: "Service" },
        { formNumber: "Interrogatories", name: "Standard Interrogatories (Negligence)", description: "Form 1.977 - Standard discovery interrogatories", url: "https://www.flcourts.gov/content/download/403049", category: "Discovery" },
        { formNumber: "Request for Production", name: "Request for Production of Documents", description: "Request defendant's documents and records", url: "https://www.flcourts.gov/", category: "Discovery" },
        { formNumber: "Authorization", name: "Medical Records Authorization", description: "HIPAA-compliant authorization for medical records", url: "https://www.flcourts.gov/", category: "Medical Records" },
        { formNumber: "1.996", name: "Application for Civil Indigent Status", description: "Florida fee waiver application", url: "https://www.flcourts.gov/content/download/403076", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "PIP Forms", name: "PIP Insurance Claim Forms", description: "Personal Injury Protection insurance forms", url: "https://www.floir.com/", category: "Insurance" },
      ],
    }
  },

  // ==================== ILLINOIS ====================
  "IL": {
    stateName: "Illinois",
    courtWebsite: "https://www.illinoiscourts.gov",
    selfHelpUrl: "https://www.illinoislegalaid.org",
    forms: {
      "family": [
        { formNumber: "D-301", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/dissolution-of-marriage/", category: "Divorce", feeAmount: "$289-$337", feeWaiverAvailable: true },
        { formNumber: "D-302", name: "Summons for Dissolution", description: "Notice to spouse", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/dissolution-of-marriage/", category: "Divorce" },
        { formNumber: "D-311", name: "Financial Affidavit", description: "Required financial disclosure", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/dissolution-of-marriage/", category: "Financial" },
        { formNumber: "D-350", name: "Parenting Plan", description: "Child custody and visitation plan", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/dissolution-of-marriage/", category: "Custody" },
        { formNumber: "OP-403", name: "Petition for Order of Protection", description: "Request protection from abuse", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/order-of-protection/", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "OP-405", name: "Emergency Order of Protection", description: "Immediate protection order", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/order-of-protection/", category: "Protection Orders" },
      ],
      "small-claims": [
        { formNumber: "SC-001", name: "Small Claims Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/small-claims/", category: "Filing", feeAmount: "$75-$224", feeWaiverAvailable: true },
        { formNumber: "SC-002", name: "Small Claims Summons", description: "Notice to defendant", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/small-claims/", category: "Service" },
        { formNumber: "SC-007", name: "Motion for Default Judgment", description: "Win if no response", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/small-claims/", category: "Judgment" },
        { formNumber: "SC-008", name: "Appearance", description: "Enter appearance in case", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/small-claims/", category: "Response" },
      ],
      "employment": [
        { formNumber: "IDES Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://ides.illinois.gov/unemployment/file-a-claim.html", category: "Unemployment" },
        { formNumber: "IDOL Wage Claim", name: "Wage Payment Complaint", description: "Report unpaid wages", url: "https://www2.illinois.gov/idol/laws-rules/fls/pages/minimum-wage-law.aspx", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "IDHR Charge", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://dhr.illinois.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "EV-001", name: "Eviction Complaint", description: "Landlord eviction lawsuit", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/eviction/", category: "Eviction", feeAmount: "$166-$282", feeWaiverAvailable: true },
        { formNumber: "EV-002", name: "Eviction Summons", description: "Notice to tenant", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/eviction/", category: "Service" },
        { formNumber: "EV-005", name: "Answer to Eviction Complaint", description: "Tenant response to eviction", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/eviction/", category: "Defense" },
        { formNumber: "EV-010", name: "Motion to Seal Eviction Record", description: "Seal eviction from record", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/eviction/", category: "Record Sealing" },
      ],
      "criminal": [
        { formNumber: "CR-410", name: "Petition to Expunge/Seal", description: "Clear or seal criminal record", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/expungement-sealing/", category: "Expungement", feeAmount: "$60-$120", feeWaiverAvailable: true },
        { formNumber: "CR-411", name: "Order to Expunge/Seal", description: "Court order for expungement", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/expungement-sealing/", category: "Expungement" },
        { formNumber: "CR-420", name: "Objection to Expungement", description: "State's response form", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/expungement-sealing/", category: "Expungement" },
      ],
      "general": [
        { formNumber: "FW-001", name: "Application for Waiver of Court Fees", description: "Request fee waiver", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/fee-waiver/", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "FW-002", name: "Order on Fee Waiver", description: "Court decision on fee waiver", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-circuit-court/fee-waiver/", category: "Fee Waiver" },
        { formNumber: "GEN-001", name: "Affidavit/Declaration", description: "General declaration form", url: "https://www.illinoiscourts.gov/Forms/approved-forms/", category: "General" },
      ],
    }
  },

  // ==================== PENNSYLVANIA ====================
  "PA": {
    stateName: "Pennsylvania",
    courtWebsite: "https://www.pacourts.us",
    selfHelpUrl: "https://www.palawhelp.org",
    forms: {
      "family": [
        { formNumber: "Complaint in Divorce", name: "Complaint in Divorce", description: "Start divorce proceedings", url: "https://www.pacourts.us/forms/for-the-public/divorce-forms", category: "Divorce", feeAmount: "$333.75", feeWaiverAvailable: true },
        { formNumber: "Waiver of Notice", name: "Waiver of Notice of Intention to File", description: "Spouse consents to divorce filing", url: "https://www.pacourts.us/forms/for-the-public/divorce-forms", category: "Divorce" },
        { formNumber: "Affidavit of Consent", name: "Affidavit of Consent (3301c)", description: "Mutual consent divorce affidavit", url: "https://www.pacourts.us/forms/for-the-public/divorce-forms", category: "Divorce" },
        { formNumber: "Counter-Affidavit", name: "Counter-Affidavit (3301d)", description: "Separation-based divorce response", url: "https://www.pacourts.us/forms/for-the-public/divorce-forms", category: "Divorce" },
        { formNumber: "PFA Petition", name: "Petition for Protection From Abuse", description: "Request domestic violence protection", url: "https://www.pacourts.us/forms/for-the-public/pfa-forms", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "Custody Complaint", name: "Complaint for Custody", description: "Request child custody determination", url: "https://www.pacourts.us/forms/for-the-public/custody-forms", category: "Custody", feeAmount: "$107.21", feeWaiverAvailable: true },
      ],
      "small-claims": [
        { formNumber: "MDJ Statement of Claim", name: "Statement of Claim", description: "Start case in Magisterial District Court (up to $12,000)", url: "https://www.pacourts.us/forms/for-the-public/minor-court-forms", category: "Filing", feeAmount: "$50-$125", feeWaiverAvailable: true },
        { formNumber: "Notice of Intent to Defend", name: "Notice of Intent to Defend", description: "Notify court you'll contest claim", url: "https://www.pacourts.us/forms/for-the-public/minor-court-forms", category: "Response" },
        { formNumber: "Appeal from MDJ", name: "Notice of Appeal", description: "Appeal magisterial court decision", url: "https://www.pacourts.us/forms/for-the-public/minor-court-forms", category: "Appeals" },
      ],
      "employment": [
        { formNumber: "UC-42", name: "Unemployment Compensation Claim", description: "Apply for unemployment benefits", url: "https://www.uc.pa.gov/unemployment-benefits/file/Pages/Filing-for-UC.aspx", category: "Unemployment" },
        { formNumber: "LLC-1", name: "Wage Claim Form", description: "Report unpaid wages", url: "https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc/Pages/Wage-Complaints.aspx", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "PHRC Complaint", name: "Complaint of Discrimination", description: "File discrimination complaint", url: "https://www.phrc.pa.gov/File-A-Complaint/Pages/default.aspx", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Landlord-Tenant Complaint", name: "Landlord-Tenant Complaint", description: "Eviction lawsuit", url: "https://www.pacourts.us/forms/for-the-public/landlord-tenant-forms", category: "Eviction", feeAmount: "$50-$125", feeWaiverAvailable: true },
        { formNumber: "Answer to L-T Complaint", name: "Answer to Landlord-Tenant Complaint", description: "Tenant response to eviction", url: "https://www.pacourts.us/forms/for-the-public/landlord-tenant-forms", category: "Defense" },
        { formNumber: "Security Deposit Complaint", name: "Small Claims for Security Deposit", description: "Sue for security deposit return", url: "https://www.pacourts.us/forms/for-the-public/minor-court-forms", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://www.pacourts.us/forms/for-the-public/criminal-forms", category: "Expungement", feeAmount: "$132", feeWaiverAvailable: true },
        { formNumber: "Clean Slate Petition", name: "Petition for Limited Access", description: "Seal eligible records under Clean Slate", url: "https://www.pacourts.us/forms/for-the-public/criminal-forms", category: "Record Sealing" },
        { formNumber: "Pardon Application", name: "Application for Clemency", description: "Apply for Governor's pardon", url: "https://www.bop.pa.gov/application-process/Pages/default.aspx", category: "Pardon" },
      ],
      "general": [
        { formNumber: "IFP Petition", name: "Petition to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.pacourts.us/forms/for-the-public/fee-waiver-forms", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Proof of Service", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.pacourts.us/forms", category: "Service" },
      ],
    }
  },

  // ==================== OHIO ====================
  "OH": {
    stateName: "Ohio",
    courtWebsite: "https://www.supremecourt.ohio.gov",
    selfHelpUrl: "https://www.ohiolegalhelp.org",
    forms: {
      "family": [
        { formNumber: "DR 25.01", name: "Complaint for Divorce", description: "Start divorce with children", url: "https://www.supremecourt.ohio.gov/JCS/CFC/DRForms/", category: "Divorce", feeAmount: "$350", feeWaiverAvailable: true },
        { formNumber: "DR 25.10", name: "Complaint for Divorce (No Children)", description: "Divorce without minor children", url: "https://www.supremecourt.ohio.gov/JCS/CFC/DRForms/", category: "Divorce", feeAmount: "$350", feeWaiverAvailable: true },
        { formNumber: "DR 25.20", name: "Financial Disclosure Affidavit", description: "Required financial information", url: "https://www.supremecourt.ohio.gov/JCS/CFC/DRForms/", category: "Financial" },
        { formNumber: "DR 25.04", name: "Shared Parenting Plan", description: "Joint custody arrangement", url: "https://www.supremecourt.ohio.gov/JCS/CFC/DRForms/", category: "Custody" },
        { formNumber: "DV 1-2", name: "Petition for Domestic Violence CPO", description: "Request civil protection order", url: "https://www.supremecourt.ohio.gov/JCS/domesticViolence/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims Complaint", name: "Statement of Claim", description: "Start small claims case (up to $6,000)", url: "https://www.ohiolegalhelp.org/topic/small-claims", category: "Filing", feeAmount: "$35-$85", feeWaiverAvailable: true },
        { formNumber: "Counterclaim", name: "Counterclaim Form", description: "Defendant's claim against plaintiff", url: "https://www.ohiolegalhelp.org/topic/small-claims", category: "Response" },
        { formNumber: "Motion for Default", name: "Motion for Default Judgment", description: "Win case if no response", url: "https://www.ohiolegalhelp.org/topic/small-claims", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "ODJFS UI Claim", name: "Unemployment Benefits Claim", description: "Apply for unemployment", url: "https://unemployment.ohio.gov/", category: "Unemployment" },
        { formNumber: "Wage Complaint", name: "Wage and Hour Complaint", description: "Report unpaid wages", url: "https://com.ohio.gov/wps/portal/gov/com/divisions/industrial-compliance/wage-and-hour", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "OCRC Charge", name: "Charge of Discrimination", description: "File employment discrimination complaint", url: "https://crc.ohio.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint in Forcible Entry and Detainer", description: "Landlord eviction lawsuit", url: "https://www.ohiolegalhelp.org/topic/eviction", category: "Eviction", feeAmount: "$112-$175", feeWaiverAvailable: true },
        { formNumber: "Answer to Eviction", name: "Answer to Eviction Complaint", description: "Tenant defense to eviction", url: "https://www.ohiolegalhelp.org/topic/eviction", category: "Defense" },
        { formNumber: "Motion to Stay", name: "Motion to Stay Execution of Writ", description: "Delay eviction execution", url: "https://www.ohiolegalhelp.org/topic/eviction", category: "Motions" },
      ],
      "criminal": [
        { formNumber: "Expungement Application", name: "Application to Seal Record", description: "Seal eligible criminal records", url: "https://www.ohiolegalhelp.org/topic/expungement", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
        { formNumber: "CQE Application", name: "Certificate of Qualification for Employment", description: "Remove employment barriers", url: "https://www.drc.ohio.gov/cqe", category: "Certificates" },
      ],
      "general": [
        { formNumber: "Affidavit of Indigency", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.ohiolegalhelp.org", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.ohiolegalhelp.org", category: "Service" },
      ],
    }
  },

  // ==================== GEORGIA ====================
  "GA": {
    stateName: "Georgia",
    courtWebsite: "https://georgiacourts.gov",
    selfHelpUrl: "https://georgialegalaid.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://georgiacourts.gov/resources/court-forms/", category: "Divorce", feeAmount: "$212-$250", feeWaiverAvailable: true },
        { formNumber: "Domestic Relations Case Filing Info", name: "Domestic Relations Case Filing Information Form", description: "Required case information", url: "https://georgiacourts.gov/resources/court-forms/", category: "Divorce" },
        { formNumber: "Acknowledgement of Service", name: "Acknowledgement of Service and Consent", description: "Spouse accepts service", url: "https://georgiacourts.gov/resources/court-forms/", category: "Divorce" },
        { formNumber: "Legitimation Petition", name: "Petition for Legitimation", description: "Establish father's rights", url: "https://georgiacourts.gov/resources/court-forms/", category: "Paternity" },
        { formNumber: "TPO Petition", name: "Petition for Temporary Protective Order", description: "Request family violence protection", url: "https://georgiacourts.gov/resources/court-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Magistrate Court Claim", name: "Statement of Claim", description: "Start case in Magistrate Court (up to $15,000)", url: "https://georgiacourts.gov/resources/court-forms/", category: "Filing", feeAmount: "$45-$75", feeWaiverAvailable: true },
        { formNumber: "Answer", name: "Answer to Claim", description: "Respond to claim against you", url: "https://georgiacourts.gov/resources/court-forms/", category: "Response" },
        { formNumber: "Counterclaim", name: "Counterclaim", description: "Sue the person suing you", url: "https://georgiacourts.gov/resources/court-forms/", category: "Response" },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.dol.state.ga.us/public/uiben/", category: "Unemployment" },
        { formNumber: "DOL Wage Complaint", name: "Wage Complaint Form", description: "Report unpaid wages", url: "https://dol.georgia.gov/wage-and-hour-complaints", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "GCHR Complaint", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://gceo.georgia.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Dispossessory Affidavit", name: "Affidavit for Dispossessory Warrant", description: "Landlord eviction filing", url: "https://georgialegalaid.org/resource/eviction-dispossessory-georgia", category: "Eviction", feeAmount: "$56-$76", feeWaiverAvailable: true },
        { formNumber: "Answer to Dispossessory", name: "Answer to Dispossessory", description: "Tenant response to eviction", url: "https://georgialegalaid.org/resource/eviction-dispossessory-georgia", category: "Defense" },
        { formNumber: "Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return", url: "https://georgialegalaid.org", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "Record Restriction Petition", name: "Petition to Restrict Record", description: "Seal eligible criminal records", url: "https://georgialegalaid.org/resource/record-restriction", category: "Record Restriction", feeAmount: "$50-$150", feeWaiverAvailable: true },
        { formNumber: "First Offender Discharge", name: "Petition for First Offender Discharge", description: "Complete First Offender sentence", url: "https://georgialegalaid.org", category: "First Offender" },
      ],
      "general": [
        { formNumber: "Affidavit of Indigence", name: "Affidavit of Indigence", description: "Request court fee waiver", url: "https://georgiacourts.gov/resources/court-forms/", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Personal Service", description: "Confirm papers were served", url: "https://georgiacourts.gov/resources/court-forms/", category: "Service" },
      ],
    }
  },

  // ==================== NORTH CAROLINA ====================
  "NC": {
    stateName: "North Carolina",
    courtWebsite: "https://www.nccourts.gov",
    selfHelpUrl: "https://www.nccourts.gov/help-topics",
    forms: {
      "family": [
        { formNumber: "AOC-CV-802", name: "Complaint for Absolute Divorce", description: "Start divorce proceedings", url: "https://www.nccourts.gov/documents/forms/complaint-for-absolute-divorce", category: "Divorce", feeAmount: "$225", feeWaiverAvailable: true },
        { formNumber: "AOC-CV-100", name: "Civil Summons", description: "Notice to defendant", url: "https://www.nccourts.gov/documents/forms/civil-summons-alias-and-pluries-summons", category: "Service" },
        { formNumber: "AOC-CV-304", name: "Custody Complaint/Motion", description: "Request child custody", url: "https://www.nccourts.gov/documents/forms/complaint-motion-for-child-custody", category: "Custody", feeAmount: "$225", feeWaiverAvailable: true },
        { formNumber: "AOC-CV-305", name: "Child Support Complaint", description: "Request child support order", url: "https://www.nccourts.gov/documents/forms/complaint-for-child-support", category: "Support", feeAmount: "$225", feeWaiverAvailable: true },
        { formNumber: "AOC-CV-303", name: "Domestic Violence Complaint", description: "Request DVPO protection", url: "https://www.nccourts.gov/documents/forms/complaint-and-motion-for-domestic-violence-protective-order", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "AOC-CVM-100", name: "Complaint to Enforce Claim", description: "Start small claims case (up to $10,000)", url: "https://www.nccourts.gov/documents/forms/magistrate-summons-complaint-to-enforce-claim", category: "Filing", feeAmount: "$96", feeWaiverAvailable: true },
        { formNumber: "AOC-CVM-200", name: "Answer to Small Claim", description: "Respond to small claims lawsuit", url: "https://www.nccourts.gov/documents/forms", category: "Response" },
        { formNumber: "AOC-CVM-203", name: "Counterclaim", description: "Sue the person suing you", url: "https://www.nccourts.gov/documents/forms", category: "Response" },
        { formNumber: "AOC-CVM-220", name: "Appeal from Magistrate", description: "Appeal to District Court", url: "https://www.nccourts.gov/documents/forms", category: "Appeals" },
      ],
      "employment": [
        { formNumber: "DES UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://des.nc.gov/apply-unemployment", category: "Unemployment" },
        { formNumber: "DOL Wage Complaint", name: "Wage and Hour Complaint", description: "Report unpaid wages", url: "https://www.labor.nc.gov/workplace-rights/employee-rights-regarding-time-worked-and-wages-earned/how-file-wage-complaint", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "HRC Complaint", name: "Charge of Discrimination", description: "File employment discrimination complaint", url: "https://www.oah.nc.gov/civil-rights-division/employment-discrimination", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "AOC-CVM-201", name: "Complaint in Summary Ejectment", description: "Landlord eviction lawsuit", url: "https://www.nccourts.gov/documents/forms/magistrate-summons-complaint-in-summary-ejectment", category: "Eviction", feeAmount: "$96", feeWaiverAvailable: true },
        { formNumber: "AOC-CVM-202", name: "Answer to Summary Ejectment", description: "Tenant response to eviction", url: "https://www.nccourts.gov/documents/forms", category: "Defense" },
        { formNumber: "Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return within 30 days", url: "https://www.nclegalaid.org", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "AOC-CR-285", name: "Petition for Expunction", description: "Clear eligible criminal records", url: "https://www.nccourts.gov/documents/forms/petition-and-order-of-expunction-under-g-s-15a-145", category: "Expungement", feeAmount: "$175", feeWaiverAvailable: true },
        { formNumber: "AOC-CR-287", name: "Affidavit of Indigency (Expunction)", description: "Request fee waiver for expunction", url: "https://www.nccourts.gov/documents/forms", category: "Expungement" },
      ],
      "general": [
        { formNumber: "AOC-G-106", name: "Petition to Proceed as Indigent", description: "Request court fee waiver", url: "https://www.nccourts.gov/documents/forms/petition-to-sue-appeal-or-defend-as-an-indigent", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "AOC-CV-101", name: "Proof of Service", description: "Confirm papers were served", url: "https://www.nccourts.gov/documents/forms", category: "Service" },
      ],
    }
  },

  // ==================== MICHIGAN ====================
  "MI": {
    stateName: "Michigan",
    courtWebsite: "https://courts.michigan.gov",
    selfHelpUrl: "https://michiganlegalhelp.org",
    forms: {
      "family": [
        { formNumber: "FOC 101", name: "Complaint for Divorce", description: "Start divorce with children", url: "https://courts.michigan.gov/administration/admin/op/pages/foc.aspx", category: "Divorce", feeAmount: "$175-$255", feeWaiverAvailable: true },
        { formNumber: "FOC 102", name: "Complaint for Divorce (No Children)", description: "Divorce without minor children", url: "https://courts.michigan.gov/administration/admin/op/pages/foc.aspx", category: "Divorce", feeAmount: "$175-$255", feeWaiverAvailable: true },
        { formNumber: "FOC 1a", name: "Verified Statement", description: "Required case information", url: "https://courts.michigan.gov/administration/admin/op/pages/foc.aspx", category: "Divorce" },
        { formNumber: "CC 375", name: "Personal Protection Order Petition", description: "Request PPO protection", url: "https://courts.michigan.gov/administration/admin/op/pages/cc.aspx", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "FOC 89", name: "Uniform Child Custody Jurisdiction Act", description: "Required custody jurisdiction form", url: "https://courts.michigan.gov/administration/admin/op/pages/foc.aspx", category: "Custody" },
      ],
      "small-claims": [
        { formNumber: "DC 84", name: "Small Claims Affidavit and Claim", description: "Start small claims case (up to $6,500)", url: "https://courts.michigan.gov/administration/admin/op/pages/dc.aspx", category: "Filing", feeAmount: "$30-$70", feeWaiverAvailable: true },
        { formNumber: "DC 84a", name: "Counterclaim", description: "Sue the person suing you", url: "https://courts.michigan.gov/administration/admin/op/pages/dc.aspx", category: "Response" },
        { formNumber: "DC 85", name: "Small Claims Judgment", description: "Court judgment form", url: "https://courts.michigan.gov/administration/admin/op/pages/dc.aspx", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "UIA Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://michigan.gov/leo/bureaus-agencies/uia", category: "Unemployment" },
        { formNumber: "LEO Wage Complaint", name: "Wage and Hour Complaint", description: "Report unpaid wages", url: "https://www.michigan.gov/leo/bureaus-agencies/ber", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "MDCR Complaint", name: "Complaint of Discrimination", description: "File discrimination complaint", url: "https://www.michigan.gov/mdcr/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "DC 102a", name: "Summons and Complaint (Land Contract Forfeiture)", description: "Eviction for land contract default", url: "https://courts.michigan.gov/administration/admin/op/pages/dc.aspx", category: "Eviction", feeAmount: "$45-$70", feeWaiverAvailable: true },
        { formNumber: "DC 104a", name: "Summons and Complaint (Termination of Tenancy)", description: "Standard eviction lawsuit", url: "https://courts.michigan.gov/administration/admin/op/pages/dc.aspx", category: "Eviction", feeAmount: "$45-$70", feeWaiverAvailable: true },
        { formNumber: "Answer to Eviction", name: "Answer to Summary Proceedings", description: "Tenant response to eviction", url: "https://michiganlegalhelp.org/self-help-tools/housing/i-am-being-evicted", category: "Defense" },
      ],
      "criminal": [
        { formNumber: "MC 227", name: "Application to Set Aside Conviction", description: "Expunge eligible criminal records", url: "https://courts.michigan.gov/administration/admin/op/pages/mc.aspx", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
        { formNumber: "MC 227a", name: "Affidavit in Support of Application", description: "Required expungement affidavit", url: "https://courts.michigan.gov/administration/admin/op/pages/mc.aspx", category: "Expungement" },
      ],
      "general": [
        { formNumber: "MC 20", name: "Fee Waiver Request", description: "Request court fee waiver", url: "https://courts.michigan.gov/administration/admin/op/pages/mc.aspx", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "MC 14", name: "Proof of Service", description: "Confirm papers were served", url: "https://courts.michigan.gov/administration/admin/op/pages/mc.aspx", category: "Service" },
      ],
    }
  },

  // ==================== NEW JERSEY ====================
  "NJ": {
    stateName: "New Jersey",
    courtWebsite: "https://www.njcourts.gov",
    selfHelpUrl: "https://www.njcourts.gov/self-help",
    forms: {
      "family": [
        { formNumber: "FM Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.njcourts.gov/forms/family", category: "Divorce", feeAmount: "$300", feeWaiverAvailable: true },
        { formNumber: "Acknowledgment of Service", name: "Acknowledgment of Service", description: "Spouse accepts service", url: "https://www.njcourts.gov/forms/family", category: "Divorce" },
        { formNumber: "Case Information Statement", name: "Case Information Statement", description: "Required financial disclosure", url: "https://www.njcourts.gov/forms/family", category: "Financial" },
        { formNumber: "TRO Complaint", name: "Complaint for Temporary Restraining Order", description: "Request domestic violence protection", url: "https://www.njcourts.gov/forms/family", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "Non-Dissolution Complaint", name: "Complaint for Custody/Support", description: "Custody/support without divorce", url: "https://www.njcourts.gov/forms/family", category: "Custody", feeAmount: "$50-$175", feeWaiverAvailable: true },
      ],
      "small-claims": [
        { formNumber: "SC Complaint", name: "Small Claims Complaint", description: "Start small claims case (up to $3,000)", url: "https://www.njcourts.gov/forms/small-claims", category: "Filing", feeAmount: "$15-$35", feeWaiverAvailable: true },
        { formNumber: "SC Special Civil Part", name: "Special Civil Part Complaint", description: "Claims $3,001-$20,000", url: "https://www.njcourts.gov/forms/special-civil-part", category: "Filing", feeAmount: "$35-$75", feeWaiverAvailable: true },
        { formNumber: "Counterclaim", name: "Counterclaim Form", description: "Sue the person suing you", url: "https://www.njcourts.gov/forms/small-claims", category: "Response" },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.nj.gov/labor/myunemployment/", category: "Unemployment" },
        { formNumber: "Wage Claim", name: "Wage Collection Claim", description: "Report unpaid wages", url: "https://www.nj.gov/labor/wageandhour/", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "DCR Complaint", name: "Complaint of Discrimination", description: "File discrimination complaint", url: "https://www.njoag.gov/about/divisions-and-offices/division-on-civil-rights-home/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "LT Complaint", name: "Landlord Tenant Complaint", description: "Eviction lawsuit", url: "https://www.njcourts.gov/forms/landlord-tenant", category: "Eviction", feeAmount: "$50", feeWaiverAvailable: true },
        { formNumber: "LT Answer", name: "Answer to Landlord Tenant Complaint", description: "Tenant response to eviction", url: "https://www.njcourts.gov/forms/landlord-tenant", category: "Defense" },
        { formNumber: "LT Hardship Application", name: "Hardship Stay Application", description: "Request delay of eviction", url: "https://www.njcourts.gov/forms/landlord-tenant", category: "Motions" },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://www.njcourts.gov/forms/expungement", category: "Expungement", feeAmount: "$75", feeWaiverAvailable: true },
        { formNumber: "Expungement Order", name: "Order for Expungement", description: "Court order granting expungement", url: "https://www.njcourts.gov/forms/expungement", category: "Expungement" },
      ],
      "general": [
        { formNumber: "Fee Waiver Application", name: "Application for Fee Waiver", description: "Request court fee waiver", url: "https://www.njcourts.gov/forms/fee-waiver", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.njcourts.gov/forms", category: "Service" },
      ],
    }
  },

  // ==================== VIRGINIA ====================
  "VA": {
    stateName: "Virginia",
    courtWebsite: "https://www.vacourts.gov",
    selfHelpUrl: "https://www.valegalaid.org",
    forms: {
      "family": [
        { formNumber: "CC-1402", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.vacourts.gov/forms/circuit/cc1402.pdf", category: "Divorce", feeAmount: "$86-$101", feeWaiverAvailable: true },
        { formNumber: "CC-1403", name: "Answer to Divorce Complaint", description: "Respond to divorce filing", url: "https://www.vacourts.gov/forms/circuit/cc1403.pdf", category: "Divorce" },
        { formNumber: "DC-620", name: "Petition for Protective Order", description: "Request family abuse protection", url: "https://www.vacourts.gov/forms/district/dc620.pdf", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "DC-610", name: "Petition for Custody/Visitation", description: "Request custody determination", url: "https://www.vacourts.gov/forms/district/dc610.pdf", category: "Custody", feeAmount: "$25", feeWaiverAvailable: true },
        { formNumber: "DC-601", name: "Petition for Child Support", description: "Request child support order", url: "https://www.vacourts.gov/forms/district/dc601.pdf", category: "Support", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "DC-402", name: "Civil Claim for Warrant in Debt", description: "Start small claims case (up to $5,000)", url: "https://www.vacourts.gov/forms/district/dc402.pdf", category: "Filing", feeAmount: "$33-$76", feeWaiverAvailable: true },
        { formNumber: "DC-432", name: "Motion for Judgment", description: "Civil claims over $5,000", url: "https://www.vacourts.gov/forms/district/dc432.pdf", category: "Filing", feeAmount: "$58-$82", feeWaiverAvailable: true },
        { formNumber: "DC-405", name: "Grounds of Defense", description: "Respond to claim against you", url: "https://www.vacourts.gov/forms/district/dc405.pdf", category: "Response" },
      ],
      "employment": [
        { formNumber: "VEC Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.vec.virginia.gov/unemployed", category: "Unemployment" },
        { formNumber: "DOLI Wage Claim", name: "Claim for Unpaid Wages", description: "Report wage violations", url: "https://www.doli.virginia.gov/labor-law/payment-of-wage-702/", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "EEOC/Local Complaint", name: "Charge of Discrimination", description: "File employment discrimination complaint", url: "https://www.eeoc.gov/field-office/richmond/location", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "DC-421", name: "Summons for Unlawful Detainer", description: "Eviction lawsuit", url: "https://www.vacourts.gov/forms/district/dc421.pdf", category: "Eviction", feeAmount: "$44-$58", feeWaiverAvailable: true },
        { formNumber: "Answer to UD", name: "Answer to Unlawful Detainer", description: "Tenant response to eviction", url: "https://www.valegalaid.org/issues/housing/eviction", category: "Defense" },
        { formNumber: "Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return within 45 days", url: "https://www.valegalaid.org/issues/housing", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "CC-1475", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://www.vacourts.gov/forms/circuit/cc1475.pdf", category: "Expungement", feeAmount: "Free", feeWaiverAvailable: true },
        { formNumber: "Order of Expungement", name: "Order of Expungement", description: "Court order granting expungement", url: "https://www.vacourts.gov/forms/circuit/", category: "Expungement" },
      ],
      "general": [
        { formNumber: "DC-420", name: "Affidavit for Proceeding Without Payment of Fees", description: "Request court fee waiver", url: "https://www.vacourts.gov/forms/district/dc420.pdf", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Proof of Service", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.vacourts.gov/forms", category: "Service" },
      ],
    }
  },

  // ==================== WASHINGTON ====================
  "WA": {
    stateName: "Washington",
    courtWebsite: "https://www.courts.wa.gov",
    selfHelpUrl: "https://www.washingtonlawhelp.org",
    forms: {
      "family": [
        { formNumber: "FL Divorce 201", name: "Petition for Dissolution (Divorce)", description: "Start divorce proceedings", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=79", category: "Divorce", feeAmount: "$314", feeWaiverAvailable: true },
        { formNumber: "FL All Family 101", name: "Confidential Information Form", description: "Required confidential information", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=79", category: "Divorce" },
        { formNumber: "FL All Family 130", name: "Summons", description: "Notice to spouse", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=79", category: "Service" },
        { formNumber: "FL All Family 140", name: "Motion for Temporary Orders", description: "Request temporary orders", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=79", category: "Motions" },
        { formNumber: "DV 1.015", name: "Petition for Order for Protection", description: "Request domestic violence protection", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=19", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC 100", name: "Small Claims Notice of Claim", description: "Start small claims case (up to $10,000)", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=2", category: "Filing", feeAmount: "$35-$50", feeWaiverAvailable: true },
        { formNumber: "SC 200", name: "Small Claims Response", description: "Respond to claim against you", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=2", category: "Response" },
        { formNumber: "SC 300", name: "Small Claims Counterclaim", description: "Sue the person suing you", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=2", category: "Response" },
        { formNumber: "SC 400", name: "Small Claims Subpoena", description: "Require witness to appear", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=2", category: "Discovery" },
      ],
      "employment": [
        { formNumber: "ESD Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://esd.wa.gov/unemployment", category: "Unemployment" },
        { formNumber: "L&I Wage Complaint", name: "Workplace Rights Complaint", description: "Report wage violations", url: "https://lni.wa.gov/workers-rights/workplace-complaints/", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "HRC Complaint", name: "Complaint of Discrimination", description: "File discrimination complaint", url: "https://www.hum.wa.gov/file-complaint", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Unlawful Detainer", name: "Summons - Unlawful Detainer", description: "Eviction lawsuit", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=20", category: "Eviction", feeAmount: "$45-$60", feeWaiverAvailable: true },
        { formNumber: "UD Answer", name: "Answer to Unlawful Detainer", description: "Tenant response to eviction", url: "https://www.washingtonlawhelp.org/issues/housing/eviction", category: "Defense" },
        { formNumber: "Order to Show Cause", name: "Motion for Order to Show Cause", description: "Request eviction hearing", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=20", category: "Motions" },
      ],
      "criminal": [
        { formNumber: "CrRLJ 09.0400", name: "Petition for Vacation", description: "Clear eligible criminal records", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=14", category: "Vacation", feeAmount: "Free", feeWaiverAvailable: true },
        { formNumber: "CrRLJ 09.0500", name: "Order Vacating Conviction", description: "Court order vacating conviction", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=14", category: "Vacation" },
      ],
      "general": [
        { formNumber: "GR 34", name: "Application for Waiver of Civil Filing Fees", description: "Request court fee waiver", url: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=38", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Proof of Service", name: "Proof of Service", description: "Confirm papers were served", url: "https://www.courts.wa.gov/forms", category: "Service" },
      ],
    }
  },

  // ==================== ARIZONA ====================
  "AZ": {
    stateName: "Arizona",
    courtWebsite: "https://www.azcourts.gov",
    selfHelpUrl: "https://azcourthelp.org",
    forms: {
      "family": [
        { formNumber: "DRP11f", name: "Petition for Dissolution of Marriage", description: "Start divorce with children", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Dissolution-of-Marriage-Divorce", category: "Divorce", feeAmount: "$349", feeWaiverAvailable: true },
        { formNumber: "DRP11g", name: "Petition for Dissolution (No Children)", description: "Divorce without minor children", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Dissolution-of-Marriage-Divorce", category: "Divorce", feeAmount: "$349", feeWaiverAvailable: true },
        { formNumber: "DRP13f", name: "Summons", description: "Notice to spouse", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Dissolution-of-Marriage-Divorce", category: "Service" },
        { formNumber: "DRPOP1f", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Protective-Orders", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "DRCV11f", name: "Petition for Custody/Parenting Time", description: "Request custody determination", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Custody-Parenting-Time", category: "Custody", feeAmount: "$256", feeWaiverAvailable: true },
      ],
      "small-claims": [
        { formNumber: "CV2000f", name: "Complaint", description: "Start small claims case (up to $3,500)", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Small-Claims", category: "Filing", feeAmount: "$20-$75", feeWaiverAvailable: true },
        { formNumber: "CV2010f", name: "Summons", description: "Notice to defendant", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Small-Claims", category: "Service" },
        { formNumber: "CV2020f", name: "Counterclaim", description: "Sue the person suing you", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Small-Claims", category: "Response" },
        { formNumber: "CV2030f", name: "Motion for Default Judgment", description: "Win if no response", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Small-Claims", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "DES UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://des.az.gov/services/employment/unemployment-individual", category: "Unemployment" },
        { formNumber: "ICA Wage Claim", name: "Wage Claim Application", description: "Report unpaid wages", url: "https://www.azica.gov/forms/labor-forms", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "ACRD Complaint", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://www.azag.gov/civil-rights", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED1f", name: "Complaint for Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Eviction-Actions", category: "Eviction", feeAmount: "$35-$65", feeWaiverAvailable: true },
        { formNumber: "FED Answer", name: "Answer to Eviction Complaint", description: "Tenant response to eviction", url: "https://azcourthelp.org/self-service-center/eviction", category: "Defense" },
        { formNumber: "Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return within 14 days", url: "https://azcourthelp.org", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "Set Aside Application", name: "Application to Set Aside Judgment", description: "Clear eligible criminal records (ARS 13-905)", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Criminal-Set-Aside-of-Judgment", category: "Set Aside", feeAmount: "Free", feeWaiverAvailable: true },
        { formNumber: "Restoration of Rights", name: "Petition for Restoration of Civil Rights", description: "Restore voting and other rights", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms", category: "Restoration" },
      ],
      "general": [
        { formNumber: "FW1f", name: "Application to Defer Filing Fee", description: "Request court fee waiver", url: "https://www.azcourts.gov/selfservicecenter/Self-Service-Forms/Fee-Deferral-and-Waiver", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Proof of Service", name: "Acceptance of Service", description: "Confirm papers were served", url: "https://www.azcourts.gov/selfservicecenter", category: "Service" },
      ],
    }
  },

  // ==================== MASSACHUSETTS ====================
  "MA": {
    stateName: "Massachusetts",
    courtWebsite: "https://www.mass.gov/orgs/massachusetts-court-system",
    selfHelpUrl: "https://www.masslegalhelp.org",
    forms: {
      "family": [
        { formNumber: "CJD 101A", name: "Complaint for Divorce", description: "Start divorce proceedings (1A - joint)", url: "https://www.mass.gov/lists/probate-and-family-court-forms", category: "Divorce", feeAmount: "$215", feeWaiverAvailable: true },
        { formNumber: "CJD 101B", name: "Complaint for Divorce (Contested)", description: "Contested divorce filing (1B)", url: "https://www.mass.gov/lists/probate-and-family-court-forms", category: "Divorce", feeAmount: "$215", feeWaiverAvailable: true },
        { formNumber: "CJD 106", name: "Financial Statement (Short)", description: "Financial disclosure (<$75k income)", url: "https://www.mass.gov/lists/probate-and-family-court-forms", category: "Financial" },
        { formNumber: "CJD 106L", name: "Financial Statement (Long)", description: "Financial disclosure (>$75k income)", url: "https://www.mass.gov/lists/probate-and-family-court-forms", category: "Financial" },
        { formNumber: "FA-2", name: "Complaint for Protection from Abuse", description: "Request 209A restraining order", url: "https://www.mass.gov/lists/abuse-prevention-209a-forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-1", name: "Statement of Claim and Notice", description: "Start small claims case (up to $7,000)", url: "https://www.mass.gov/lists/small-claims-forms", category: "Filing", feeAmount: "$40-$50", feeWaiverAvailable: true },
        { formNumber: "SC-2", name: "Counterclaim", description: "Sue the person suing you", url: "https://www.mass.gov/lists/small-claims-forms", category: "Response" },
        { formNumber: "SC-5", name: "Motion to Remove to Superior Court", description: "Move case to higher court", url: "https://www.mass.gov/lists/small-claims-forms", category: "Motions" },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.mass.gov/how-to/apply-for-unemployment-benefits", category: "Unemployment" },
        { formNumber: "AGO Wage Complaint", name: "Wage Complaint Form", description: "Report unpaid wages to Attorney General", url: "https://www.mass.gov/how-to/file-a-wage-complaint", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "MCAD Complaint", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://www.mass.gov/how-to/file-a-complaint-of-discrimination", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Summary Process Summons", name: "Summary Process Summons and Complaint", description: "Eviction lawsuit", url: "https://www.mass.gov/lists/summary-process-eviction-forms", category: "Eviction", feeAmount: "$195", feeWaiverAvailable: true },
        { formNumber: "SP Answer", name: "Answer and Defenses", description: "Tenant response to eviction", url: "https://www.masslegalhelp.org/housing/evictions", category: "Defense" },
        { formNumber: "Discovery Request", name: "Discovery Request", description: "Request documents from landlord", url: "https://www.masslegalhelp.org/housing/evictions", category: "Discovery" },
      ],
      "criminal": [
        { formNumber: "Sealing Petition", name: "Petition to Seal Record", description: "Seal eligible criminal records", url: "https://www.mass.gov/how-to/request-a-copy-of-your-criminal-record", category: "Sealing", feeAmount: "Free", feeWaiverAvailable: true },
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Expunge eligible records (limited)", url: "https://www.mass.gov/expungement", category: "Expungement" },
      ],
      "general": [
        { formNumber: "AFE", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.mass.gov/lists/court-forms", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Proof of Service", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.mass.gov/lists/court-forms", category: "Service" },
      ],
    }
  },

  // ==================== COLORADO ====================
  "CO": {
    stateName: "Colorado",
    courtWebsite: "https://www.courts.state.co.us",
    selfHelpUrl: "https://www.courts.state.co.us/Self_Help/",
    forms: {
      "family": [
        { formNumber: "JDF 1101", name: "Petition for Dissolution of Marriage", description: "Start divorce with children", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Divorce", category: "Divorce", feeAmount: "$230", feeWaiverAvailable: true },
        { formNumber: "JDF 1000", name: "Case Information Sheet", description: "Required case information", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Divorce", category: "Divorce" },
        { formNumber: "JDF 1104", name: "Summons for Dissolution", description: "Notice to spouse", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Divorce", category: "Service" },
        { formNumber: "JDF 1111", name: "Sworn Financial Statement", description: "Required financial disclosure", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Divorce", category: "Financial" },
        { formNumber: "JDF 402", name: "Verified Complaint for Protection Order", description: "Request civil protection order", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Protection%20Orders", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JDF 250", name: "Notice, Claim and Summons to Appear for Trial", description: "Start small claims case (up to $7,500)", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Small%20Claims", category: "Filing", feeAmount: "$31-$55", feeWaiverAvailable: true },
        { formNumber: "JDF 252", name: "Counterclaim", description: "Sue the person suing you", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Small%20Claims", category: "Response" },
        { formNumber: "JDF 253", name: "Motion for Default Judgment", description: "Win if no response", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Small%20Claims", category: "Judgment" },
      ],
      "employment": [
        { formNumber: "CDLE UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://cdle.colorado.gov/unemployment", category: "Unemployment" },
        { formNumber: "CDLE Wage Complaint", name: "Wage Complaint", description: "Report unpaid wages", url: "https://cdle.colorado.gov/wage-and-hour-law/how-to-file-a-wage-complaint", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "CCRD Charge", name: "Charge of Discrimination", description: "File discrimination complaint", url: "https://ccrd.colorado.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "JDF 99", name: "Complaint in Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Eviction", category: "Eviction", feeAmount: "$85-$97", feeWaiverAvailable: true },
        { formNumber: "Answer to FED", name: "Answer to Eviction Complaint", description: "Tenant response to eviction", url: "https://www.courts.state.co.us/Self_Help/eviction/", category: "Defense" },
        { formNumber: "Deposit Demand", name: "Security Deposit Demand Letter", description: "Demand deposit return within 30 days", url: "https://www.coloradolegalservices.org", category: "Deposits" },
      ],
      "criminal": [
        { formNumber: "JDF CR 320", name: "Motion to Seal Criminal Records", description: "Seal eligible criminal records", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Criminal", category: "Sealing", feeAmount: "$65", feeWaiverAvailable: true },
        { formNumber: "JDF CR 325", name: "Order Sealing Criminal Records", description: "Court order sealing records", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Criminal", category: "Sealing" },
      ],
      "general": [
        { formNumber: "JDF 205", name: "Motion to File Without Payment of Filing Fee", description: "Request court fee waiver", url: "https://www.courts.state.co.us/Forms/SubCategory.cfm?Category=Fee%20Waivers", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "JDF 105", name: "Affidavit of Service", description: "Confirm papers were served", url: "https://www.courts.state.co.us/Forms", category: "Service" },
      ],
    }
  },
};

// Generate default forms for states without detailed data
const defaultForms: StateFormsData = {
  stateName: "Default",
  courtWebsite: "",
  selfHelpUrl: "",
  forms: {
    "family": [
      { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings - check your state court website", url: "", category: "Divorce", feeWaiverAvailable: true },
      { formNumber: "Answer", name: "Answer to Divorce Petition", description: "Respond to divorce filing", url: "", category: "Divorce" },
      { formNumber: "Financial Affidavit", name: "Financial Disclosure Form", description: "Required financial information", url: "", category: "Financial" },
      { formNumber: "Custody Petition", name: "Petition for Child Custody", description: "Request custody determination", url: "", category: "Custody" },
      { formNumber: "Protection Order", name: "Petition for Protection Order", description: "Request domestic violence protection", url: "", category: "Protection Orders", feeAmount: "Free" },
    ],
    "small-claims": [
      { formNumber: "Complaint", name: "Small Claims Complaint", description: "Start small claims case", url: "", category: "Filing", feeWaiverAvailable: true },
      { formNumber: "Summons", name: "Small Claims Summons", description: "Notice to defendant", url: "", category: "Service" },
      { formNumber: "Answer", name: "Answer to Small Claims", description: "Respond to lawsuit", url: "", category: "Response" },
    ],
    "employment": [
      { formNumber: "Wage Claim", name: "Wage Claim Form", description: "Report unpaid wages to labor department", url: "", category: "Wage Claims", feeAmount: "Free" },
      { formNumber: "Discrimination Charge", name: "Charge of Discrimination", description: "File employment discrimination complaint", url: "", category: "Discrimination", feeAmount: "Free" },
      { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "", category: "Unemployment" },
    ],
    "housing": [
      { formNumber: "Eviction Complaint", name: "Eviction Complaint", description: "Landlord lawsuit to remove tenant", url: "", category: "Eviction", feeWaiverAvailable: true },
      { formNumber: "Eviction Answer", name: "Answer to Eviction", description: "Tenant response to eviction", url: "", category: "Defense" },
      { formNumber: "Deposit Demand", name: "Security Deposit Demand", description: "Demand return of security deposit", url: "", category: "Deposits" },
    ],
    "criminal": [
      { formNumber: "Expungement", name: "Petition for Expungement", description: "Request to clear criminal record", url: "", category: "Expungement", feeWaiverAvailable: true },
      { formNumber: "Record Seal", name: "Petition to Seal Record", description: "Request to seal criminal record", url: "", category: "Record Sealing" },
    ],
    "general": [
      { formNumber: "Fee Waiver", name: "Fee Waiver Application", description: "Request court fee waiver", url: "", category: "Fee Waiver", feeAmount: "Free" },
      { formNumber: "Proof of Service", name: "Proof of Service", description: "Confirm papers were served", url: "", category: "Service" },
    ],
  }
};

// State court websites for generating proper URLs
export const stateCourtWebsites: Record<string, { name: string; website: string; selfHelp: string }> = {
  "AL": { name: "Alabama", website: "https://judicial.alabama.gov", selfHelp: "https://alacourt.gov/SelfHelp.aspx" },
  "AK": { name: "Alaska", website: "https://courts.alaska.gov", selfHelp: "https://courts.alaska.gov/shc/" },
  "AZ": { name: "Arizona", website: "https://www.azcourts.gov", selfHelp: "https://azcourthelp.org" },
  "AR": { name: "Arkansas", website: "https://www.arcourts.gov", selfHelp: "https://www.arcourts.gov/forms-and-publications" },
  "CA": { name: "California", website: "https://www.courts.ca.gov", selfHelp: "https://selfhelp.courts.ca.gov" },
  "CO": { name: "Colorado", website: "https://www.courts.state.co.us", selfHelp: "https://www.courts.state.co.us/Self_Help/" },
  "CT": { name: "Connecticut", website: "https://jud.ct.gov", selfHelp: "https://jud.ct.gov/lawlib/selfhelp.htm" },
  "DE": { name: "Delaware", website: "https://courts.delaware.gov", selfHelp: "https://courts.delaware.gov/Help/" },
  "FL": { name: "Florida", website: "https://www.flcourts.gov", selfHelp: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information" },
  "GA": { name: "Georgia", website: "https://georgiacourts.gov", selfHelp: "https://georgialegalaid.org" },
  "HI": { name: "Hawaii", website: "https://www.courts.state.hi.us", selfHelp: "https://www.courts.state.hi.us/self-help" },
  "ID": { name: "Idaho", website: "https://isc.idaho.gov", selfHelp: "https://courtselfhelp.idaho.gov" },
  "IL": { name: "Illinois", website: "https://www.illinoiscourts.gov", selfHelp: "https://www.illinoislegalaid.org" },
  "IN": { name: "Indiana", website: "https://www.in.gov/courts", selfHelp: "https://indianalegalhelp.org" },
  "IA": { name: "Iowa", website: "https://www.iowacourts.gov", selfHelp: "https://www.iowacourts.gov/for-the-public/representing-yourself" },
  "KS": { name: "Kansas", website: "https://www.kscourts.org", selfHelp: "https://www.kansasjudicialcouncil.org/legal-forms" },
  "KY": { name: "Kentucky", website: "https://courts.ky.gov", selfHelp: "https://kyjustice.org" },
  "LA": { name: "Louisiana", website: "https://www.lasc.org", selfHelp: "https://louisianalawhelp.org" },
  "ME": { name: "Maine", website: "https://www.courts.maine.gov", selfHelp: "https://www.courts.maine.gov/self-help/" },
  "MD": { name: "Maryland", website: "https://www.courts.state.md.us", selfHelp: "https://www.mdcourts.gov/legalhelp" },
  "MA": { name: "Massachusetts", website: "https://www.mass.gov/orgs/massachusetts-court-system", selfHelp: "https://www.masslegalhelp.org" },
  "MI": { name: "Michigan", website: "https://courts.michigan.gov", selfHelp: "https://michiganlegalhelp.org" },
  "MN": { name: "Minnesota", website: "https://www.mncourts.gov", selfHelp: "https://www.mncourts.gov/Help-Topics.aspx" },
  "MS": { name: "Mississippi", website: "https://courts.ms.gov", selfHelp: "https://mslegalservices.org" },
  "MO": { name: "Missouri", website: "https://www.courts.mo.gov", selfHelp: "https://www.courts.mo.gov/page.jsp?id=704" },
  "MT": { name: "Montana", website: "https://courts.mt.gov", selfHelp: "https://courts.mt.gov/selfhelp" },
  "NE": { name: "Nebraska", website: "https://supremecourt.nebraska.gov", selfHelp: "https://supremecourt.nebraska.gov/self-help" },
  "NV": { name: "Nevada", website: "https://nvcourts.gov", selfHelp: "https://selfhelp.nvcourts.gov" },
  "NH": { name: "New Hampshire", website: "https://www.courts.nh.gov", selfHelp: "https://www.courts.nh.gov/self-help" },
  "NJ": { name: "New Jersey", website: "https://www.njcourts.gov", selfHelp: "https://www.njcourts.gov/self-help" },
  "NM": { name: "New Mexico", website: "https://www.nmcourts.gov", selfHelp: "https://www.nmcourts.gov/self-help/" },
  "NY": { name: "New York", website: "https://www.nycourts.gov", selfHelp: "https://www.nycourts.gov/courthelp/" },
  "NC": { name: "North Carolina", website: "https://www.nccourts.gov", selfHelp: "https://www.nccourts.gov/help-topics" },
  "ND": { name: "North Dakota", website: "https://www.ndcourts.gov", selfHelp: "https://www.ndcourts.gov/legal-self-help" },
  "OH": { name: "Ohio", website: "https://www.supremecourt.ohio.gov", selfHelp: "https://www.ohiolegalhelp.org" },
  "OK": { name: "Oklahoma", website: "https://www.oscn.net", selfHelp: "https://oklaw.org" },
  "OR": { name: "Oregon", website: "https://www.courts.oregon.gov", selfHelp: "https://www.courts.oregon.gov/programs/sflp" },
  "PA": { name: "Pennsylvania", website: "https://www.pacourts.us", selfHelp: "https://www.palawhelp.org" },
  "RI": { name: "Rhode Island", website: "https://www.courts.ri.gov", selfHelp: "https://www.courts.ri.gov/PublicResources/selfhelpcenter/" },
  "SC": { name: "South Carolina", website: "https://www.sccourts.org", selfHelp: "https://www.sclegal.org" },
  "SD": { name: "South Dakota", website: "https://ujs.sd.gov", selfHelp: "https://ujs.sd.gov/Self_Help/" },
  "TN": { name: "Tennessee", website: "https://www.tncourts.gov", selfHelp: "https://www.justiceforalltn.org" },
  "TX": { name: "Texas", website: "https://www.txcourts.gov", selfHelp: "https://texaslawhelp.org" },
  "UT": { name: "Utah", website: "https://www.utcourts.gov", selfHelp: "https://www.utcourts.gov/selfhelp/" },
  "VT": { name: "Vermont", website: "https://www.vermontjudiciary.org", selfHelp: "https://www.vermontjudiciary.org/self-help" },
  "VA": { name: "Virginia", website: "https://www.vacourts.gov", selfHelp: "https://www.valegalaid.org" },
  "WA": { name: "Washington", website: "https://www.courts.wa.gov", selfHelp: "https://www.washingtonlawhelp.org" },
  "WV": { name: "West Virginia", website: "https://www.courtswv.gov", selfHelp: "https://www.lawv.net" },
  "WI": { name: "Wisconsin", website: "https://www.wicourts.gov", selfHelp: "https://www.wicourts.gov/services/public/selfhelp/" },
  "WY": { name: "Wyoming", website: "https://www.courts.state.wy.us", selfHelp: "https://www.courts.state.wy.us/self-help-center/" },
  "DC": { name: "District of Columbia", website: "https://www.dccourts.gov", selfHelp: "https://www.dccourts.gov/services/family-matters/self-help-center" },
};

// Get forms for a specific state
export function getStateFormsData(stateCode: string): StateFormsData {
  const detailedData = stateFormsLibrary[stateCode];
  if (detailedData) {
    return detailedData;
  }

  // Return default forms with state-specific court website info
  const stateInfo = stateCourtWebsites[stateCode];
  if (stateInfo) {
    return {
      ...defaultForms,
      stateName: stateInfo.name,
      courtWebsite: stateInfo.website,
      selfHelpUrl: stateInfo.selfHelp,
    };
  }

  return defaultForms;
}

// Get all legal area categories
export const legalAreaCategories = [
  { id: "family", name: "Family Law / Divorce", icon: "Heart" },
  { id: "small-claims", name: "Small Claims", icon: "DollarSign" },
  { id: "personal-injury", name: "Personal Injury", icon: "HeartPulse" },
  { id: "employment", name: "Employment", icon: "Briefcase" },
  { id: "housing", name: "Housing & Eviction", icon: "Home" },
  { id: "criminal", name: "Criminal Defense", icon: "Shield" },
  { id: "cps", name: "CPS / Child Welfare", icon: "Baby" },
  { id: "workers-rights", name: "Workers Rights", icon: "HardHat" },
  { id: "human-rights", name: "Human Rights", icon: "Users" },
  { id: "agency-complaints", name: "Agency Complaints", icon: "AlertTriangle" },
  { id: "federal", name: "Federal Court", icon: "Scale" },
  { id: "general", name: "General Forms", icon: "FileText" },
];

// Federal Court Forms (applies to all states)
export const federalCourtForms: CourtForm[] = [
  // Civil Filing Forms
  { formNumber: "AO-440", name: "Summons in a Civil Action", description: "Official summons for federal civil cases", url: "https://www.uscourts.gov/forms/civil-forms/summons-civil-action", category: "Civil Filing", feeAmount: "$405", feeWaiverAvailable: true },
  { formNumber: "CV-071", name: "Civil Cover Sheet", description: "Required cover sheet for all civil filings", url: "https://www.uscourts.gov/forms/civil-forms/civil-cover-sheet", category: "Civil Filing" },
  { formNumber: "AO-441", name: "Summons on Third-Party Complaint", description: "Summons for third-party defendants", url: "https://www.uscourts.gov/forms/civil-forms/summons-third-party-complaint", category: "Civil Filing" },
  { formNumber: "CV-060", name: "Request to Proceed In Forma Pauperis", description: "Request fee waiver for filing", url: "https://www.uscourts.gov/forms/fee-schedule/application-proceed-district-court-without-prepaying-fees-or-costs", category: "Fee Waiver", feeAmount: "Free", feeWaiverAvailable: true },
  
  // Habeas Corpus & Post-Conviction
  { formNumber: "CV-069", name: "Petition for Writ of Habeas Corpus (State Custody)", description: "Challenge state imprisonment under 28 U.S.C. § 2254", url: "https://www.uscourts.gov/forms/habeas-forms/petition-relief-person-state-custody", category: "Habeas Corpus", feeAmount: "$5", feeWaiverAvailable: true },
  { formNumber: "CV-027", name: "Petition for Writ of Habeas Corpus (Federal Custody)", description: "Challenge federal imprisonment under 28 U.S.C. § 2241", url: "https://www.uscourts.gov/forms/habeas-forms/petition-writ-habeas-corpus-under-28-usc-2241", category: "Habeas Corpus", feeAmount: "$5", feeWaiverAvailable: true },
  { formNumber: "CV-067", name: "Motion to Vacate Sentence (§2255)", description: "Challenge federal sentence under 28 U.S.C. § 2255", url: "https://www.uscourts.gov/forms/habeas-forms/motion-vacate-set-aside-or-correct-sentence-person-federal-custody", category: "Post-Conviction", feeAmount: "$5", feeWaiverAvailable: true },
  
  // Civil Rights
  { formNumber: "CV-066", name: "Civil Rights Complaint", description: "File civil rights lawsuit (42 U.S.C. § 1983)", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CV-066.pdf", category: "Civil Rights", feeAmount: "$405", feeWaiverAvailable: true },
  { formNumber: "CV-066A", name: "Prisoner Civil Rights Instructions", description: "Instructions for prisoner civil rights complaints", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CV-66A.pdf", category: "Civil Rights" },
  
  // Subpoenas
  { formNumber: "AO-88", name: "Subpoena to Appear and Testify (Civil)", description: "Compel witness testimony in civil case", url: "https://www.uscourts.gov/forms/subpoena-forms/subpoena-appear-and-testify-hearing-or-trial-civil-action", category: "Subpoenas" },
  { formNumber: "AO-88A", name: "Subpoena to Testify at Deposition", description: "Compel witness for deposition", url: "https://www.uscourts.gov/forms/subpoena-forms/subpoena-testify-deposition-civil-action", category: "Subpoenas" },
  { formNumber: "AO-88B", name: "Subpoena to Produce Documents", description: "Compel document production", url: "https://www.uscourts.gov/forms/subpoena-forms/subpoena-produce-documents-information-or-objects-or-permit-inspection", category: "Subpoenas" },
  { formNumber: "CR-021", name: "Subpoena in Criminal Case", description: "Compel witness in criminal case", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CR-021.pdf", category: "Subpoenas" },
  
  // Appeals
  { formNumber: "A-002", name: "Notice of Appeal", description: "Appeal district court decision to circuit court", url: "https://www.uscourts.gov/forms/appellate-forms/notice-appeal-district-court", category: "Appeals", feeAmount: "$605", feeWaiverAvailable: true },
  { formNumber: "A-018", name: "Motion to Appeal In Forma Pauperis", description: "Request fee waiver for appeal", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/A-018.pdf", category: "Appeals", feeAmount: "Free" },
  
  // Judgment Enforcement
  { formNumber: "CV-023", name: "Writ of Execution", description: "Enforce federal court judgment", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CV-023.pdf", category: "Enforcement" },
  { formNumber: "CV-088", name: "Wage Garnishment Package", description: "Garnish wages to satisfy judgment", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CV-088.pdf", category: "Enforcement" },
  { formNumber: "AO-451", name: "Register Judgment in Another District", description: "Enforce judgment in another federal district", url: "https://www.uscourts.gov/forms/judgment-forms/clerks-certification-judgment-be-registered-another-district", category: "Enforcement" },
  
  // Criminal Forms
  { formNumber: "CR-010", name: "Advisement of Constitutional Rights", description: "Initial appearance rights advisement", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CR-010.pdf", category: "Criminal" },
  { formNumber: "CR-014", name: "Designation of Counsel", description: "Attorney appearance in criminal case", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CR-014.pdf", category: "Criminal" },
  { formNumber: "CR-032", name: "Waiver of Right to Counsel", description: "Proceed without attorney (pro se)", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CR-032.pdf", category: "Criminal" },
  { formNumber: "CJA-23", name: "Financial Affidavit (Public Defender)", description: "Apply for appointed counsel", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/CJA-23.pdf", category: "Criminal", feeAmount: "Free" },
  { formNumber: "AO-455", name: "Waiver of Indictment", description: "Waive grand jury indictment", url: "https://www.uscourts.gov/forms/criminal-forms/waiver-indictment", category: "Criminal" },
  
  // ADR/Mediation
  { formNumber: "ADR-001", name: "Request for ADR Selection", description: "Request alternative dispute resolution", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/ADR-001.pdf", category: "Mediation" },
  { formNumber: "ADR-003", name: "Mediation Report", description: "Report mediation outcome to court", url: "https://apps.cacd.uscourts.gov/cm-api/dwwwroot/ADR-003.pdf", category: "Mediation" },
  
  // Bankruptcy (Basic)
  { formNumber: "B-101", name: "Voluntary Petition (Individual)", description: "File for personal bankruptcy", url: "https://www.uscourts.gov/forms/bankruptcy-forms/voluntary-petition-individuals-filing-bankruptcy", category: "Bankruptcy", feeAmount: "$338 (Ch7) / $313 (Ch13)", feeWaiverAvailable: true },
  { formNumber: "B-103A", name: "Application to Pay Filing Fee in Installments", description: "Pay bankruptcy fee over time", url: "https://www.uscourts.gov/forms/bankruptcy-forms/application-individuals-pay-filing-fee-installments", category: "Bankruptcy" },
  { formNumber: "B-103B", name: "Application to Waive Bankruptcy Filing Fee", description: "Request fee waiver for bankruptcy", url: "https://www.uscourts.gov/forms/bankruptcy-forms/application-waive-chapter-7-filing-fee", category: "Bankruptcy", feeAmount: "Free" },
  
  // Intellectual Property
  { formNumber: "AO-120", name: "Patent/Trademark Report", description: "Report patent or trademark filing", url: "https://www.uscourts.gov/forms/other-forms/report-filing-or-determination-action-regarding-patent-or-trademark", category: "IP" },
  { formNumber: "AO-121", name: "Copyright Report", description: "Report copyright filing or determination", url: "https://www.uscourts.gov/forms/other-forms/report-filing-or-determination-action-or-appeal-regarding-copyright", category: "IP" },
];

// Federal court info
export const federalCourtInfo = {
  name: "Federal Courts",
  website: "https://www.uscourts.gov",
  selfHelp: "https://www.uscourts.gov/forms",
  pacer: "https://pacer.uscourts.gov",
  findCourt: "https://www.uscourts.gov/federal-court-finder",
};
