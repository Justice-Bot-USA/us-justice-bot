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
    }
  },

  // ==================== NEW YORK ====================
  "NY": {
    stateName: "New York",
    courtWebsite: "https://www.nycourts.gov",
    selfHelpUrl: "https://www.nycourts.gov/courthelp/",
    forms: {
      "family": [
        { formNumber: "UD-2", name: "Summons With Notice (Divorce)", description: "Start uncontested divorce", url: "https://www.nycourts.gov/divorce/forms.shtml", category: "Divorce", feeAmount: "$335", feeWaiverAvailable: true },
        { formNumber: "UD-11", name: "Verified Complaint for Divorce", description: "Detailed divorce allegations", url: "https://www.nycourts.gov/divorce/forms.shtml", category: "Divorce" },
        { formNumber: "UD-6", name: "Affidavit of Defendant", description: "Defendant's consent to divorce", url: "https://www.nycourts.gov/divorce/forms.shtml", category: "Divorce" },
        { formNumber: "UD-8", name: "Sworn Statement of Removal of Barriers", description: "Religious barriers statement", url: "https://www.nycourts.gov/divorce/forms.shtml", category: "Divorce" },
        { formNumber: "Order of Protection Petition", name: "Family Offense Petition", description: "Request protection order", url: "https://www.nycourts.gov/courthelp/safety/familyOffense.shtml", category: "Protection Orders", feeAmount: "Free" },
        { formNumber: "Custody Petition", name: "Petition for Custody", description: "Request child custody", url: "https://www.nycourts.gov/courthelp/family/custody.shtml", category: "Custody", feeAmount: "Free" },
        { formNumber: "Support Petition", name: "Petition for Child Support", description: "Request child support order", url: "https://www.nycourts.gov/courthelp/family/support.shtml", category: "Support", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CIV-SC-50", name: "Small Claims Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.nycourts.gov/courts/nyc/smallclaims/forms.shtml", category: "Filing", feeAmount: "$15-$20", feeWaiverAvailable: true },
        { formNumber: "Commercial Claims Form", name: "Commercial Small Claims", description: "Business small claims (up to $10,000)", url: "https://www.nycourts.gov/courts/nyc/smallclaims/forms.shtml", category: "Filing", feeAmount: "$25-$35" },
        { formNumber: "Motion to Vacate Default", name: "Motion to Vacate Default", description: "Reopen case after default", url: "https://www.nycourts.gov/courts/nyc/smallclaims/forms.shtml", category: "Motions" },
        { formNumber: "Subpoena", name: "Small Claims Subpoena", description: "Compel witness attendance", url: "https://www.nycourts.gov/courts/nyc/smallclaims/forms.shtml", category: "Discovery" },
      ],
      "employment": [
        { formNumber: "DOL UI-1", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dol.ny.gov/unemployment/file-your-first-claim-background", category: "Unemployment" },
        { formNumber: "DOL LS-223", name: "Claim for Unpaid Wages", description: "Report wage theft", url: "https://dol.ny.gov/unpaidwithheld-wages-and-டமages", category: "Wage Claims", feeAmount: "Free" },
        { formNumber: "DHR Complaint", name: "Human Rights Complaint", description: "File discrimination complaint", url: "https://dhr.ny.gov/complaint", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "NYLP-1", name: "Notice of Petition (Eviction)", description: "Landlord eviction notice", url: "https://www.nycourts.gov/courthelp/Homes/evictions.shtml", category: "Eviction", feeAmount: "$45" },
        { formNumber: "Answer in Eviction", name: "Answer in Housing Court", description: "Tenant response to eviction", url: "https://www.nycourts.gov/courthelp/Homes/evictions.shtml", category: "Defense", feeAmount: "Free" },
        { formNumber: "HP Action", name: "HP Action for Repairs", description: "Sue landlord for repairs", url: "https://www.nycourts.gov/courthelp/Homes/repairs.shtml", category: "Repairs", feeAmount: "Free" },
        { formNumber: "Order to Show Cause", name: "Order to Show Cause (Housing)", description: "Emergency housing motion", url: "https://www.nycourts.gov/courthelp/Homes/evictions.shtml", category: "Motions" },
      ],
      "criminal": [
        { formNumber: "CPL 160.59 Motion", name: "Motion to Seal Criminal Record", description: "Seal eligible convictions", url: "https://www.nycourts.gov/courthelp/Criminal/sealingRecords.shtml", category: "Record Sealing", feeAmount: "Free" },
        { formNumber: "Certificate of Relief", name: "Application for Certificate of Relief", description: "Remove legal disabilities from conviction", url: "https://www.nycourts.gov/courthelp/Criminal/certificates.shtml", category: "Certificates", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "Fee Waiver Application", name: "Poor Person Application", description: "Request court fee waiver", url: "https://www.nycourts.gov/courthelp/goingtocourt/feeWaiver.shtml", category: "Fee Waiver", feeAmount: "Free" },
        { formNumber: "Affidavit of Service", name: "Affidavit of Service", description: "Prove papers were served", url: "https://www.nycourts.gov/courthelp/goingtocourt/serving.shtml", category: "Service" },
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
  { id: "family", name: "Family Law", icon: "Heart" },
  { id: "small-claims", name: "Small Claims", icon: "DollarSign" },
  { id: "employment", name: "Employment", icon: "Briefcase" },
  { id: "housing", name: "Housing & Eviction", icon: "Home" },
  { id: "criminal", name: "Criminal Defense", icon: "Shield" },
  { id: "general", name: "General Forms", icon: "FileText" },
];
