import { Scale, Briefcase, Shield, Users, DollarSign, Home, Gavel, Heart } from "lucide-react";

export interface StateGuidance {
  forms: { name: string; description: string; url?: string }[];
  deadlines: { name: string; timeframe: string }[];
  fees: { name: string; amount: string }[];
  laws: { name: string; summary: string }[];
}

export interface LegalAreaData {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  badge?: { text: string; variant: string };
  commonTopics: string[];
  stateGuidance: Record<string, StateGuidance>;
}

// California and New York (the live states) are not listed here: LegalAreaPage sends them to
// the source-checked legal centers (/ca/legal-center, /ny/legal-center). The guidance below is
// for states that are coming soon and has not been checked.

// Default guidance template
const createDefaultGuidance = (area: string): StateGuidance => ({
  forms: [
    { name: "Initial Complaint/Petition", description: "Primary filing document to start your case" },
    { name: "Summons", description: "Official notice to the other party" },
    { name: "Fee Waiver Application", description: "Request to waive court fees if you qualify" },
  ],
  deadlines: [
    { name: "Statute of Limitations", timeframe: "Varies by claim type - consult state laws" },
    { name: "Response Deadline", timeframe: "Typically 20-30 days after service" },
  ],
  fees: [
    { name: "Filing Fee", amount: "Varies by court and case type" },
    { name: "Service Fee", amount: "$50-150 typically" },
  ],
  laws: [
    { name: "State Civil Code", summary: "Governs civil matters and procedures" },
    { name: "Court Rules", summary: "Local court procedures and requirements" },
  ],
});

// ==================== FLORIDA ====================

const floridaFamilyLaw: StateGuidance = {
  forms: [
    { name: "Form 12.901(a)", description: "Petition for Dissolution (no children)", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
    { name: "Form 12.901(b)(1)", description: "Petition for Dissolution (with children)", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
    { name: "Form 12.902(b)", description: "Family Law Financial Affidavit (Short)", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
    { name: "Form 12.902(c)", description: "Family Law Financial Affidavit (Long)", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
    { name: "Form 12.995(a)", description: "Parenting Plan", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
  ],
  deadlines: [
    { name: "Waiting Period", timeframe: "20 days from filing before final hearing" },
    { name: "Response Deadline", timeframe: "20 days from service" },
    { name: "Mandatory Disclosure", timeframe: "45 days from service of petition" },
  ],
  fees: [
    { name: "Dissolution Filing Fee", amount: "$409" },
    { name: "Answer Filing Fee", amount: "$309" },
    { name: "Parenting Course", amount: "$20-$50" },
    { name: "Indigent Status", amount: "Fee waiver available with Form 12.910(a)" },
  ],
  laws: [
    { name: "Florida Statutes Chapter 61", summary: "Dissolution of Marriage laws" },
    { name: "Equitable Distribution", summary: "Marital assets divided fairly" },
    { name: "F.S. § 61.13", summary: "Time-sharing and parental responsibility" },
    { name: "F.S. § 61.08", summary: "Alimony guidelines" },
  ],
};

const floridaSmallClaims: StateGuidance = {
  forms: [
    { name: "Statement of Claim", description: "Initiates small claims action", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Summons", description: "Notice to defendant", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Affidavit of Non-Military Service", description: "Required for default judgment", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Motion for Default", description: "When defendant fails to respond", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
  ],
  deadlines: [
    { name: "Written Contract", timeframe: "5 years" },
    { name: "Oral Contract", timeframe: "4 years" },
    { name: "Personal Injury", timeframe: "4 years" },
    { name: "Property Damage", timeframe: "4 years" },
  ],
  fees: [
    { name: "Claims up to $500", amount: "$55" },
    { name: "Claims $501-$2,500", amount: "$80" },
    { name: "Claims $2,501-$8,000", amount: "$175" },
    { name: "Service Fee", amount: "$40-$70" },
  ],
  laws: [
    { name: "F.S. Chapter 34", summary: "County court jurisdiction (up to $8,000)" },
    { name: "Florida Small Claims Rules", summary: "Simplified procedure rules" },
    { name: "F.S. § 34.041", summary: "Filing fee schedule" },
  ],
};

const floridaEmployment: StateGuidance = {
  forms: [
    { name: "FCHR Complaint Form", description: "Florida Civil Rights Act complaint", url: "https://fchr.myflorida.com/complaint-process" },
    { name: "DOL Reemployment Assistance", description: "Unemployment benefits application", url: "https://floridajobs.org/Reemployment-Assistance-Service-Center" },
    { name: "EEOC Intake Questionnaire", description: "Federal discrimination complaint", url: "https://www.eeoc.gov/federal-sector/filing-formal-complaint" },
  ],
  deadlines: [
    { name: "FCHR Complaint", timeframe: "365 days from violation" },
    { name: "EEOC Filing", timeframe: "300 days from violation" },
    { name: "Wage Claims", timeframe: "2-5 years depending on claim" },
    { name: "Retaliation Claims", timeframe: "180 days (whistleblower)" },
  ],
  fees: [
    { name: "FCHR Filing", amount: "Free" },
    { name: "EEOC Filing", amount: "Free" },
    { name: "Civil Court Filing", amount: "$400+" },
  ],
  laws: [
    { name: "Florida Civil Rights Act", summary: "F.S. Chapter 760 - discrimination protections" },
    { name: "At-Will Employment", summary: "FL is at-will state with exceptions" },
    { name: "F.S. § 448.110", summary: "Minimum wage requirements" },
    { name: "F.S. § 112.3187", summary: "Public employee whistleblower protections" },
  ],
};

const floridaHousing: StateGuidance = {
  forms: [
    { name: "Complaint for Eviction", description: "Landlord's eviction filing", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "3-Day Notice", description: "Notice to pay rent or quit", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "7-Day Notice", description: "Notice to cure lease violation", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Answer to Eviction", description: "Tenant's response", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
  ],
  deadlines: [
    { name: "Answer to Eviction", timeframe: "5 days from service" },
    { name: "Security Deposit Return", timeframe: "15-30 days after move-out" },
    { name: "3-Day Notice Period", timeframe: "3 business days to pay or vacate" },
    { name: "7-Day Notice Period", timeframe: "7 days to cure violation" },
  ],
  fees: [
    { name: "Eviction Filing", amount: "$185-$300" },
    { name: "Writ of Possession", amount: "$70-$90" },
    { name: "Small Claims (Deposit)", amount: "$55-$175" },
  ],
  laws: [
    { name: "F.S. Chapter 83", summary: "Florida Residential Landlord-Tenant Act" },
    { name: "F.S. § 83.49", summary: "Security deposit requirements" },
    { name: "F.S. § 83.56", summary: "Termination of rental agreements" },
    { name: "No Rent Control", summary: "FL prohibits local rent control ordinances" },
  ],
};

const floridaCriminal: StateGuidance = {
  forms: [
    { name: "Application for Sealing", description: "Seal eligible criminal records", url: "https://www.fdle.state.fl.us/Seal-and-Expunge-Process/Seal-and-Expunge-Home.aspx" },
    { name: "Application for Expungement", description: "Expunge eligible records", url: "https://www.fdle.state.fl.us/Seal-and-Expunge-Process/Seal-and-Expunge-Home.aspx" },
    { name: "Certificate of Eligibility", description: "Required before sealing/expungement", url: "https://www.fdle.state.fl.us/Seal-and-Expunge-Process/Seal-and-Expunge-Home.aspx" },
  ],
  deadlines: [
    { name: "First Appearance", timeframe: "24 hours if in custody" },
    { name: "Speedy Trial (Felony)", timeframe: "175 days" },
    { name: "Speedy Trial (Misdemeanor)", timeframe: "90 days" },
    { name: "Expungement Eligibility", timeframe: "After case dismissal or completion" },
  ],
  fees: [
    { name: "Certificate of Eligibility", amount: "$75" },
    { name: "Sealing/Expungement Filing", amount: "$0-$50 per county" },
    { name: "Public Defender", amount: "$50-$100 application fee" },
  ],
  laws: [
    { name: "F.S. § 943.0585", summary: "Expungement of criminal records" },
    { name: "F.S. § 943.059", summary: "Sealing of criminal records" },
    { name: "F.S. Chapter 903", summary: "Bail and bond procedures" },
    { name: "Stand Your Ground (F.S. § 776.012)", summary: "Self-defense without duty to retreat" },
  ],
};

// ==================== ILLINOIS ====================

const illinoisFamilyLaw: StateGuidance = {
  forms: [
    { name: "Petition for Dissolution", description: "Initiates divorce proceedings", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-702-marriage-family" },
    { name: "Summons", description: "Notice to respondent", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-702-marriage-family" },
    { name: "Financial Affidavit", description: "Disclosure of income and expenses", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-702-marriage-family" },
    { name: "Parenting Plan", description: "Allocation of parental responsibilities", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-702-marriage-family" },
    { name: "Judgment of Dissolution", description: "Final divorce decree", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-702-marriage-family" },
  ],
  deadlines: [
    { name: "Waiting Period", timeframe: "None (eliminated in 2016)" },
    { name: "Response Deadline", timeframe: "30 days from service" },
    { name: "Separation Requirement", timeframe: "6 months living separate and apart" },
  ],
  fees: [
    { name: "Dissolution Filing Fee", amount: "$289-$388 (varies by county)" },
    { name: "Appearance Fee", amount: "$200-$250" },
    { name: "Fee Waiver", amount: "Form available for low income" },
  ],
  laws: [
    { name: "750 ILCS 5 (IMDMA)", summary: "Illinois Marriage and Dissolution of Marriage Act" },
    { name: "Equitable Distribution", summary: "Marital property divided fairly" },
    { name: "750 ILCS 5/505", summary: "Child support guidelines" },
    { name: "750 ILCS 5/602.5", summary: "Allocation of parental responsibilities" },
  ],
};

const illinoisSmallClaims: StateGuidance = {
  forms: [
    { name: "Small Claims Complaint", description: "Initiates small claims action", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-705-small-claims" },
    { name: "Summons", description: "Notice to defendant", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-705-small-claims" },
    { name: "Affidavit of Service", description: "Proof of service", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-705-small-claims" },
    { name: "Garnishment Forms", description: "Wage garnishment after judgment", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-705-small-claims" },
  ],
  deadlines: [
    { name: "Written Contract", timeframe: "10 years" },
    { name: "Oral Contract", timeframe: "5 years" },
    { name: "Personal Injury", timeframe: "2 years" },
    { name: "Property Damage", timeframe: "5 years" },
  ],
  fees: [
    { name: "Claims up to $1,500", amount: "$40-$65" },
    { name: "Claims $1,501-$10,000", amount: "$55-$85" },
    { name: "Cook County Filing", amount: "$167-$277" },
    { name: "Service Fee", amount: "$30-$60" },
  ],
  laws: [
    { name: "735 ILCS 5/Art. II", summary: "Small claims limit is $10,000" },
    { name: "Supreme Court Rule 281-289", summary: "Small claims procedure" },
    { name: "Cook County Rules", summary: "Special rules for Cook County" },
  ],
};

const illinoisEmployment: StateGuidance = {
  forms: [
    { name: "IDHR Complaint Form", description: "Illinois discrimination complaint", url: "https://www2.illinois.gov/dhr/FilingaCharge/Pages/default.aspx" },
    { name: "IDOL Wage Claim", description: "Unpaid wage complaint", url: "https://www2.illinois.gov/idol/Laws-Rules/FLS/Pages/Minimum-Wage-Law.aspx" },
    { name: "EEOC Intake Questionnaire", description: "Federal discrimination complaint", url: "https://www.eeoc.gov/federal-sector/filing-formal-complaint" },
  ],
  deadlines: [
    { name: "IDHR Complaint", timeframe: "300 days from violation" },
    { name: "EEOC Filing", timeframe: "300 days from violation" },
    { name: "Wage Claims", timeframe: "3 years for most claims" },
    { name: "Workers Comp", timeframe: "3 years from injury" },
  ],
  fees: [
    { name: "IDHR Filing", amount: "Free" },
    { name: "IDOL Wage Claim", amount: "Free" },
    { name: "EEOC Filing", amount: "Free" },
  ],
  laws: [
    { name: "Illinois Human Rights Act", summary: "Broad discrimination protections" },
    { name: "820 ILCS 105", summary: "Minimum Wage Law" },
    { name: "820 ILCS 115", summary: "Wage Payment and Collection Act" },
    { name: "Chicago Human Rights Ordinance", summary: "Additional city protections" },
  ],
};

const illinoisHousing: StateGuidance = {
  forms: [
    { name: "Forcible Entry Complaint", description: "Eviction complaint", url: "https://www.illinoiscourts.gov/Forms/approved-forms" },
    { name: "5-Day Notice", description: "Non-payment of rent notice", url: "https://www.illinoiscourts.gov/Forms/approved-forms" },
    { name: "10-Day Notice", description: "Lease violation notice", url: "https://www.illinoiscourts.gov/Forms/approved-forms" },
    { name: "Appearance Form", description: "Tenant's response to eviction", url: "https://www.illinoiscourts.gov/Forms/approved-forms" },
  ],
  deadlines: [
    { name: "Answer to Eviction", timeframe: "At first court date" },
    { name: "Security Deposit Return", timeframe: "30-45 days after move-out" },
    { name: "5-Day Notice Period", timeframe: "5 days to pay or vacate" },
    { name: "Chicago RLTO Notice", timeframe: "Written notice of rights required" },
  ],
  fees: [
    { name: "Eviction Filing", amount: "$200-$350" },
    { name: "Cook County Filing", amount: "$262-$352" },
    { name: "Small Claims (Deposit)", amount: "$40-$85" },
  ],
  laws: [
    { name: "735 ILCS 5/9-101", summary: "Forcible Entry and Detainer Act" },
    { name: "765 ILCS 710", summary: "Security Deposit Return Act" },
    { name: "Chicago RLTO", summary: "Residential Landlord-Tenant Ordinance" },
    { name: "Cook County RTLO", summary: "County-wide tenant protections" },
  ],
};

const illinoisCriminal: StateGuidance = {
  forms: [
    { name: "Petition for Expungement", description: "Expunge eligible records", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-708-criminal-traffic" },
    { name: "Petition for Sealing", description: "Seal eligible records", url: "https://www.illinoiscourts.gov/Forms/approved-forms/forms-approved-forms-708-criminal-traffic" },
    { name: "Certificate of Eligibility", description: "For executive clemency", url: "https://www.illinois.gov/pjb" },
  ],
  deadlines: [
    { name: "First Appearance", timeframe: "48 hours if in custody" },
    { name: "Speedy Trial", timeframe: "120 days (custody), 160 days (bond)" },
    { name: "Expungement Wait (Acquittal)", timeframe: "Immediately eligible" },
    { name: "Sealing Wait", timeframe: "2-3 years after completion" },
  ],
  fees: [
    { name: "Expungement Filing", amount: "$60-$120" },
    { name: "Sealing Filing", amount: "$60-$120" },
    { name: "Public Defender", amount: "$10-$500 (sliding scale)" },
  ],
  laws: [
    { name: "20 ILCS 2630", summary: "Criminal Identification Act (expungement/sealing)" },
    { name: "SAFE-T Act", summary: "Pretrial fairness and police accountability" },
    { name: "Cannabis Regulation Act", summary: "Legalization and automatic expungement" },
    { name: "725 ILCS 5/103", summary: "Speedy trial rights" },
  ],
};

// ==================== TEXAS ====================

const texasFamilyLaw: StateGuidance = {
  forms: [
    { name: "Original Petition for Divorce", description: "Initiates divorce proceedings", url: "https://www.txcourts.gov/programs-services/self-help/self-represented-litigant-resources/" },
    { name: "Waiver of Citation", description: "If spouse agrees to skip formal service", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Final Decree of Divorce", description: "Court order finalizing divorce", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Financial Information Statement", description: "Required disclosure of finances", url: "https://www.txcourts.gov/programs-services/self-help/" },
  ],
  deadlines: [
    { name: "Waiting Period", timeframe: "60 days minimum from filing" },
    { name: "Answer Deadline", timeframe: "First Monday after 20 days from service" },
    { name: "Temporary Orders", timeframe: "Set within 14 days if requested" },
  ],
  fees: [
    { name: "Divorce Filing Fee", amount: "$250-$350 depending on county" },
    { name: "Citation/Service Fee", amount: "$50-$100" },
    { name: "Fee Waiver", amount: "Statement of Inability to Afford" },
  ],
  laws: [
    { name: "Texas Family Code", summary: "Governs all family law matters" },
    { name: "Community Property State", summary: "Marital property divided equitably" },
    { name: "TFC § 6.001", summary: "No-fault divorce (insupportability)" },
    { name: "TFC Chapter 153", summary: "Conservatorship (custody) standards" },
  ],
};

const texasSmallClaims: StateGuidance = {
  forms: [
    { name: "Small Claims Petition", description: "Initial filing for Justice Court", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Citation", description: "Served on defendant", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Proof of Service", description: "Documents proper service", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Motion for Default Judgment", description: "When defendant fails to appear", url: "https://www.txcourts.gov/programs-services/self-help/" },
  ],
  deadlines: [
    { name: "Contract Claims", timeframe: "4 years" },
    { name: "Personal Injury", timeframe: "2 years" },
    { name: "Property Damage", timeframe: "2 years" },
    { name: "Fraud Claims", timeframe: "4 years" },
  ],
  fees: [
    { name: "Filing Fee", amount: "$50-$75" },
    { name: "Service Fee", amount: "$75-$125" },
    { name: "Appeal Bond", amount: "Varies by judgment amount" },
  ],
  laws: [
    { name: "Texas Justice Court Rules", summary: "Governs small claims procedure" },
    { name: "Limit: $20,000", summary: "Maximum claim amount in Justice Court" },
    { name: "CPRC § 16", summary: "Statutes of limitations" },
  ],
};

// ==================== PERSONAL INJURY STATE-SPECIFIC ====================

const texasPersonalInjury: StateGuidance = {
  forms: [
    { name: "Original Petition", description: "Initial complaint document (no standard form)", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Citation", description: "Official summons to defendant", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Statement of Inability to Afford Payment of Court Costs", description: "Fee waiver form", url: "https://www.txcourts.gov/rules-forms/rules-standards/" },
    { name: "Discovery Requests", description: "Interrogatories, Requests for Production, Admissions", url: "https://www.txcourts.gov/programs-services/self-help/" },
    { name: "Motion for Summary Judgment", description: "Request judgment without trial", url: "https://www.txcourts.gov/programs-services/self-help/" },
  ],
  deadlines: [
    { name: "Personal Injury (General)", timeframe: "2 years from date of injury (CPRC § 16.003)" },
    { name: "Medical Malpractice", timeframe: "2 years from date of injury or last treatment (CPRC § 74.251)" },
    { name: "Wrongful Death", timeframe: "2 years from date of death (CPRC § 16.003)" },
    { name: "Government Claims", timeframe: "6 months notice required under Tort Claims Act" },
    { name: "Product Liability", timeframe: "2 years, with 15-year statute of repose (CPRC § 16.012)" },
    { name: "Minor's Claims", timeframe: "Tolled until age 18, then 2 years (max toll: until age 20)" },
  ],
  fees: [
    { name: "District Court Filing", amount: "$250-$350" },
    { name: "County Court Filing", amount: "$200-$275" },
    { name: "Service of Citation", amount: "$75-$125" },
    { name: "Jury Fee", amount: "$30-$40" },
    { name: "Fee Waiver", amount: "Statement of Inability to Afford" },
  ],
  laws: [
    { name: "CPRC § 16.003", summary: "2-year statute of limitations for personal injury" },
    { name: "Modified Comparative Fault (51% Bar)", summary: "No recovery if you're 51%+ at fault" },
    { name: "CPRC Chapter 74", summary: "Medical liability reform (caps, expert reports required)" },
    { name: "Non-Economic Damage Cap (Med Mal)", summary: "$250K per defendant, $500K total for non-economic damages" },
    { name: "CPRC § 41.008", summary: "Exemplary damages cap (2x economic + up to $750K non-economic)" },
  ],
};

const floridaPersonalInjury: StateGuidance = {
  forms: [
    { name: "Civil Cover Sheet", description: "Required for all civil filings", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Summons", description: "Official notice to defendant", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Complaint for Negligence", description: "Personal injury complaint (no standard form)", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
    { name: "Form 1.997", description: "Civil Cover Sheet for Complex Litigation", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms" },
    { name: "Application to Sue as Indigent", description: "Fee waiver application", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
  ],
  deadlines: [
    { name: "Personal Injury (General)", timeframe: "2 years from date of injury (NEW: reduced from 4 years as of 3/24/2023)" },
    { name: "Medical Malpractice", timeframe: "2 years from incident, or 2 years from discovery (max 4 years)" },
    { name: "Wrongful Death", timeframe: "2 years from date of death (F.S. § 95.11)" },
    { name: "Government Claims", timeframe: "3 years, but 6-month pre-suit notice required" },
    { name: "Product Liability", timeframe: "2 years, with 12-year statute of repose" },
    { name: "Minor's Claims", timeframe: "Tolled until age 18 (must file by age 25 for med mal)" },
  ],
  fees: [
    { name: "Circuit Court Filing (over $30K)", amount: "$400" },
    { name: "County Court Filing (under $30K)", amount: "$300" },
    { name: "Service of Process", amount: "$40-$100" },
    { name: "Jury Demand", amount: "$10-$50" },
    { name: "Fee Waiver", amount: "Available for indigent litigants" },
  ],
  laws: [
    { name: "F.S. § 95.11", summary: "2-year statute of limitations (changed 2023)" },
    { name: "Modified Comparative Negligence (NEW 2023)", summary: "No recovery if you're 51%+ at fault (changed from pure comparative)" },
    { name: "F.S. § 768.81", summary: "Comparative fault statute" },
    { name: "PIP/No-Fault Law", summary: "Florida is a no-fault auto insurance state" },
    { name: "Bad Faith Insurance Claims", summary: "3rd party bad faith claims allowed in FL" },
  ],
};

// Remaining states get default guidance
const remainingStates = ["AL", "AK", "AZ", "AR", "CO", "CT", "DE", "GA", "HI", "ID", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];

export const legalAreaData: Record<string, LegalAreaData> = {
  "family": {
    title: "Family Law",
    description: "Navigate divorce, child custody, support matters, and domestic issues with state-specific guidance and forms.",
    icon: Heart,
    keywords: ["Divorce", "Child Custody", "Child Support", "Alimony", "Domestic Violence", "Adoption"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Filing for Divorce", "Child Custody Arrangements", "Child Support Calculations",
      "Spousal Support/Alimony", "Property Division", "Domestic Violence Orders",
      "Paternity Cases", "Adoption Process", "Guardianship", "Prenuptial Agreements",
      "Modification of Orders", "Enforcement of Orders",
    ],
    stateGuidance: {
      "TX": texasFamilyLaw,
      "FL": floridaFamilyLaw,
      "IL": illinoisFamilyLaw,
      ...Object.fromEntries(remainingStates.map(s => [s, createDefaultGuidance("family")])),
    },
  },
  "small-claims": {
    title: "Small Claims Court",
    description: "Resolve disputes under state limits without a lawyer. Get forms, understand procedures, and prepare your case.",
    icon: DollarSign,
    keywords: ["Money Owed", "Property Damage", "Security Deposits", "Contract Disputes", "Unpaid Debts"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Collecting Money Owed", "Security Deposit Disputes", "Property Damage Claims",
      "Breach of Contract", "Consumer Complaints", "Service Disputes",
      "Auto Accident Claims", "Landlord Issues", "Defective Products",
      "Unpaid Wages", "Neighbor Disputes", "Pet-Related Damages",
    ],
    stateGuidance: {
      "TX": texasSmallClaims,
      "FL": floridaSmallClaims,
      "IL": illinoisSmallClaims,
      ...Object.fromEntries(remainingStates.map(s => [s, createDefaultGuidance("small-claims")])),
    },
  },
  "workplace": {
    title: "Employment & Workplace",
    description: "Address wrongful termination, discrimination, harassment, and wage issues with federal and state-specific resources.",
    icon: Briefcase,
    keywords: ["Wrongful Termination", "Discrimination", "Harassment", "Wage Theft", "Retaliation", "FMLA"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Wrongful Termination", "Workplace Discrimination", "Sexual Harassment",
      "Unpaid Wages/Overtime", "Hostile Work Environment", "Retaliation Claims",
      "FMLA Violations", "ADA Accommodations", "Non-Compete Agreements",
      "Severance Negotiations", "Unemployment Benefits", "EEOC Complaints",
    ],
    stateGuidance: {
      "FL": floridaEmployment,
      "IL": illinoisEmployment,
      ...Object.fromEntries([...remainingStates, "TX"].map(s => [s, createDefaultGuidance("employment")])),
    },
  },
  "criminal": {
    title: "Criminal Defense",
    description: "Understand your rights, find resources for criminal charges, and navigate the criminal justice system.",
    icon: Shield,
    keywords: ["DUI/DWI", "Drug Charges", "Theft", "Assault", "Traffic Violations", "Expungement"],
    badge: { text: "Urgent", variant: "destructive" },
    commonTopics: [
      "DUI/DWI Defense", "Drug Possession", "Theft Charges", "Assault/Battery",
      "Traffic Violations", "Expungement/Sealing Records", "Probation Violations",
      "Bail & Bond", "Public Defender Requests", "Plea Bargaining",
      "Misdemeanor vs Felony", "Juvenile Offenses",
    ],
    stateGuidance: {
      "FL": floridaCriminal,
      "IL": illinoisCriminal,
      ...Object.fromEntries([...remainingStates, "TX"].map(s => [s, createDefaultGuidance("criminal")])),
    },
  },
  "housing": {
    title: "Housing & Tenant Rights",
    description: "Protect your housing rights, fight unfair evictions, and resolve landlord-tenant disputes.",
    icon: Home,
    keywords: ["Eviction", "Security Deposits", "Lease Disputes", "Habitability", "Fair Housing", "Rent Control"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Eviction Defense", "Security Deposit Return", "Habitability Issues",
      "Lease Violations", "Rent Increases", "Fair Housing Complaints",
      "Landlord Retaliation", "Subletting Rights", "Early Lease Termination",
      "Mold/Pest Issues", "Utility Disputes", "Section 8 Issues",
    ],
    stateGuidance: {
      "FL": floridaHousing,
      "IL": illinoisHousing,
      ...Object.fromEntries([...remainingStates, "TX"].map(s => [s, createDefaultGuidance("housing")])),
    },
  },
  "civil": {
    title: "Civil Rights",
    description: "Fight discrimination, police misconduct, and constitutional violations with proper legal channels.",
    icon: Users,
    keywords: ["Discrimination", "Police Misconduct", "Constitutional Rights", "Section 1983", "Voting Rights"],
    badge: { text: "Important", variant: "secondary" },
    commonTopics: [
      "Police Misconduct", "Racial Discrimination", "Disability Discrimination",
      "Voting Rights", "Free Speech Issues", "Religious Discrimination",
      "Prison Rights", "Section 1983 Claims", "Qualified Immunity",
      "ACLU Assistance", "DOJ Complaints", "Class Action Suits",
    ],
    stateGuidance: Object.fromEntries(
      ["TX", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("civil-rights")])
    ),
  },
  "consumer": {
    title: "Consumer Protection",
    description: "Combat fraud, scams, unfair debt collection, and warranty violations with federal and state protections.",
    icon: Scale,
    keywords: ["Fraud", "Scams", "Debt Collection", "Warranty Issues", "Identity Theft", "Lemon Law"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Debt Collection Harassment", "Credit Report Errors", "Identity Theft",
      "Lemon Law Claims", "Warranty Disputes", "Fraudulent Charges",
      "Deceptive Advertising", "Unfair Business Practices", "FTC Complaints",
      "CFPB Complaints", "Class Action Eligibility", "Bankruptcy Options",
    ],
    stateGuidance: Object.fromEntries(
      ["TX", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("consumer")])
    ),
  },
  "personal-injury": {
    title: "Personal Injury",
    description: "Deadlines, official forms and filing steps after an injury, such as a car crash, fall or dog bite, including claims against government agencies and responding to an injury lawsuit. Legal information, not legal advice.",
    icon: Heart,
    keywords: ["Car Accident", "Slip and Fall", "Dog Bite", "Wrongful Death", "Statute of Limitations", "Notice of Claim"],
    commonTopics: [
      "Car Accidents", "Truck Accidents", "Motorcycle Accidents",
      "Slip and Fall", "Medical Malpractice", "Product Liability",
      "Dog Bites", "Wrongful Death", "Workers Compensation",
      "Time Limits to Sue", "Claims Against Government Agencies", "Responding to an Injury Lawsuit",
    ],
    stateGuidance: {
      "TX": texasPersonalInjury,
      "FL": floridaPersonalInjury,
      ...Object.fromEntries(["IL", ...remainingStates].map(s => [s, createDefaultGuidance("personal-injury")])),
    },
  },
  "immigration": {
    title: "Immigration",
    description: "Navigate deportation defense, asylum applications, visas, and citizenship with comprehensive guidance.",
    icon: Gavel,
    keywords: ["Deportation", "Asylum", "Citizenship", "Green Card", "Work Permits", "DACA"],
    badge: { text: "Urgent", variant: "destructive" },
    commonTopics: [
      "Deportation Defense", "Asylum Applications", "Green Card Process",
      "Naturalization", "Work Permits (EAD)", "DACA Renewal",
      "Family Sponsorship", "Visa Overstay", "Immigration Court",
      "Detention Issues", "Travel Documents", "Removal Proceedings",
    ],
    stateGuidance: Object.fromEntries(
      ["TX", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("immigration")])
    ),
  },
  "federal": {
    title: "Federal Court & Government",
    description: "Address federal agency issues, government accountability, and oversight of financial institutions.",
    icon: Scale,
    keywords: ["Federal Agencies", "Government Claims", "FOIA Requests", "Federal Court", "Regulatory Issues"],
    badge: { text: "Important", variant: "secondary" },
    commonTopics: [
      "FOIA Requests", "Federal Agency Appeals", "Social Security Appeals",
      "VA Benefits", "Federal Employment", "Government Contracts",
      "Federal Tax Issues", "Banking Complaints", "SEC Complaints",
      "Federal Tort Claims", "Administrative Hearings", "Whistleblower Protection",
    ],
    stateGuidance: Object.fromEntries(
      ["TX", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("federal")])
    ),
  },

  // ==================== WORKERS' COMPENSATION ====================
  "workers-comp": {
    title: "Workers' Compensation",
    description: "On-the-job injury claims, occupational diseases, employer disputes, and disability benefit appeals.",
    icon: Briefcase,
    keywords: ["Work Injury", "Workers Comp Claim", "Occupational Disease", "Employer Dispute", "Disability Benefits", "Medical Coverage"],
    badge: { text: "Important", variant: "secondary" },
    commonTopics: [
      "Report a Work Injury", "File a Workers Comp Claim", "Occupational Disease Claims",
      "Denied Claim Appeals", "Permanent Disability Rating", "Temporary Disability Benefits",
      "Medical Treatment Disputes", "Return-to-Work Rights", "Independent Medical Exam",
      "Third-Party Liability Suits", "Death Benefits", "Retaliation for Filing",
    ],
    stateGuidance: {
      "TX": {
        forms: [
          { name: "DWC Form-041 (Employer First Report)", description: "Employer's first report of injury or illness", url: "https://www.tdi.texas.gov/wc/forms/dwcforms.html" },
          { name: "DWC Form-045 (Employee Claim)", description: "Employee's claim for compensation", url: "https://www.tdi.texas.gov/wc/forms/dwcforms.html" },
          { name: "DWC Form-052 (Dispute)", description: "Request for benefit review conference", url: "https://www.tdi.texas.gov/wc/forms/dwcforms.html" },
          { name: "DWC Form-069 (Medical Dispute)", description: "Dispute about medical necessity", url: "https://www.tdi.texas.gov/wc/forms/dwcforms.html" },
        ],
        deadlines: [
          { name: "Report Injury to Employer", timeframe: "30 days from injury date" },
          { name: "File DWC-045 Claim", timeframe: "1 year from injury or last benefit payment" },
          { name: "Request Benefit Review Conference", timeframe: "Within 90 days of dispute" },
          { name: "NOTE: Texas opt-out", timeframe: "TX allows employers to opt out — check if your employer subscribes" },
        ],
        fees: [
          { name: "Filing a Claim (TDI-covered employer)", amount: "Free" },
          { name: "Attorney Fees", amount: "Capped at 25% of disputed amount — court must approve" },
          { name: "Non-subscriber employer claim", amount: "Civil suit — standard court filing fees apply" },
        ],
        laws: [
          { name: "Texas Labor Code Chapter 406", summary: "Workers' compensation system structure" },
          { name: "Labor Code § 451.001", summary: "Retaliation prohibition — cannot fire for filing a claim" },
          { name: "Labor Code § 408.001", summary: "Exclusive remedy — if employer subscribes, no civil suit" },
          { name: "Non-subscriber Liability", summary: "Non-subscribing employers lose common law defenses" },
        ],
      },
      "FL": {
        forms: [
          { name: "DWC-1 (First Report of Injury)", description: "Employer or carrier files within 7 days of knowledge of injury", url: "https://www.myfloridacfo.com/division/wc/employee/forms.htm" },
          { name: "DWC-25 (Request for Assistance)", description: "Request help from Division of Workers' Comp", url: "https://www.myfloridacfo.com/division/wc/employee/forms.htm" },
          { name: "DWC-19 (Employee Earnings)", description: "Employee earnings statement", url: "https://www.myfloridacfo.com/division/wc/employee/forms.htm" },
          { name: "Petition for Benefits", description: "Filed through JCC system to claim denied benefits", url: "https://www.fljcc.org" },
        ],
        deadlines: [
          { name: "Report Injury to Employer", timeframe: "30 days from injury date" },
          { name: "File Petition for Benefits", timeframe: "2 years from injury OR 1 year from last benefit payment" },
          { name: "Employer/Carrier Must Accept or Deny", timeframe: "Within 120 days of accident report" },
        ],
        fees: [
          { name: "Filing a Claim / Petition", amount: "Free" },
          { name: "Attorney Fees", amount: "Set by statute — typically 20% of benefits recovered" },
          { name: "Mediation", amount: "Carrier-paid in most cases" },
        ],
        laws: [
          { name: "F.S. Chapter 440", summary: "Florida Workers' Compensation Law — comprehensive framework" },
          { name: "F.S. § 440.105", summary: "Fraud prevention — misrepresentation is a felony" },
          { name: "F.S. § 440.205", summary: "Anti-retaliation — cannot be fired for filing a legitimate claim" },
          { name: "F.S. § 440.13", summary: "Medical benefits — authorized treating physician system" },
        ],
      },
      "IL": {
        forms: [
          { name: "Application for Adjustment of Claim", description: "Primary filing with the Illinois WCC", url: "https://www2.illinois.gov/sites/iwcc/Pages/forms.aspx" },
          { name: "Employer's Report (Form 45)", description: "Employer's first accident report", url: "https://www2.illinois.gov/sites/iwcc/Pages/forms.aspx" },
          { name: "Petition for Review", description: "Appeal arbitrator's decision to full Commission", url: "https://www2.illinois.gov/sites/iwcc/Pages/forms.aspx" },
        ],
        deadlines: [
          { name: "File Application with IWCC", timeframe: "3 years from accident or 2 years from last benefit payment, whichever is later" },
          { name: "Petition for Review (Arbitrator Decision)", timeframe: "30 days from arbitrator's decision" },
          { name: "Report Injury to Employer", timeframe: "45 days (notice required)" },
        ],
        fees: [
          { name: "Filing with IWCC", amount: "Free" },
          { name: "Attorney Fees", amount: "Maximum 20% of settlement, plus costs — IWCC approved" },
        ],
        laws: [
          { name: "820 ILCS 305 (Workers' Comp Act)", summary: "Illinois Workers' Compensation Act" },
          { name: "820 ILCS 310 (Occupational Diseases Act)", summary: "Coverage for work-related diseases" },
          { name: "Section 4(h)", summary: "Anti-retaliation — protects workers who file claims" },
          { name: "Section 8.1a", summary: "Fee schedule for medical services" },
        ],
      },
      ...Object.fromEntries(remainingStates.filter(s => !["TX","FL","IL"].includes(s)).map(s => [s, createDefaultGuidance("workers-comp")])),
    },
  },

  // ==================== CONSUMER RIGHTS ====================
  "consumer-rights": {
    title: "Consumer Protection & Rights",
    description: "Fight fraud, debt collection harassment, predatory lending, warranty violations, and FCRA errors with state and federal consumer protections.",
    icon: Scale,
    keywords: ["Consumer Fraud", "Debt Collection", "FDCPA", "FCRA Credit Report", "Lemon Law", "Predatory Lending", "FTC Complaint"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Debt Collection Harassment (FDCPA)", "Credit Report Errors (FCRA)", "Identity Theft",
      "Lemon Law / Defective Vehicle", "Warranty Disputes", "Predatory Lending",
      "Fraudulent Charges / Scams", "Deceptive Advertising", "Data Breach Claims",
      "CFPB Complaints", "FTC Complaints", "Class Action Eligibility",
    ],
    stateGuidance: {
      "TX": {
        forms: [
          { name: "TX AG Consumer Complaint Form", description: "File complaint with Texas Attorney General Consumer Protection Division", url: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint" },
          { name: "OCCC Complaint Form", description: "Complaint against lenders/creditors with Office of Consumer Credit Commissioner", url: "https://occc.texas.gov/consumers/consumer-complaints" },
          { name: "CFPB Online Complaint", description: "Federal complaint portal for financial products", url: "https://www.consumerfinance.gov/complaint/" },
          { name: "Small Claims Petition", description: "Sue for consumer damages up to $20,000 in Justice Court", url: "https://guides.sll.texas.gov/small-claims-court" },
        ],
        deadlines: [
          { name: "DTPA Lawsuit", timeframe: "2 years from discovery of deceptive act" },
          { name: "FDCPA Lawsuit", timeframe: "1 year from violation" },
          { name: "Lemon Law (TX)", timeframe: "Must exhaust manufacturer's BBB/arbitration program first; file within reasonable time" },
          { name: "Fraud Claim", timeframe: "4 years from discovery" },
        ],
        fees: [
          { name: "AG / OCCC Complaint", amount: "Free" },
          { name: "Justice Court (Small Claims)", amount: "$46–$100 depending on county" },
          { name: "DTPA Lawsuit", amount: "Attorney fees recoverable if you prevail" },
        ],
        laws: [
          { name: "DTPA (Bus. & Commerce Code Ch. 17)", summary: "Texas Deceptive Trade Practices Act — 3× damages available" },
          { name: "Finance Code § 392", summary: "Texas version of FDCPA — debt collection regulations" },
          { name: "TX Lemon Law (Transportation Code Ch. 2301)", summary: "Defective vehicle repurchase or replacement" },
          { name: "FCRA (federal)", summary: "Fair Credit Reporting Act — dispute rights for credit errors" },
        ],
      },
      "FL": {
        forms: [
          { name: "FL AG Consumer Complaint", description: "Complaint with Florida AG Consumer Protection Division", url: "https://myfloridalegal.com/contact#Consumer-Protection" },
          { name: "FDACS Consumer Complaint", description: "Complaint against businesses via Dept of Agriculture & Consumer Services", url: "https://www.fdacs.gov/Consumer-Resources/File-a-Complaint" },
          { name: "CFPB Complaint Form", description: "Federal portal for financial product complaints", url: "https://www.consumerfinance.gov/complaint/" },
          { name: "Small Claims Statement of Claim", description: "Sue for consumer damages up to $8,000 in County Court", url: "https://www.flcourts.gov/Resources-Services/Court-Improvement/Self-Help-Information" },
        ],
        deadlines: [
          { name: "FDUTPA Lawsuit", timeframe: "4 years from violation" },
          { name: "FDCPA Lawsuit", timeframe: "1 year from violation" },
          { name: "Florida Lemon Law Claim", timeframe: "24 months from original delivery of vehicle to buyer" },
          { name: "Fraud Claim", timeframe: "4 years from discovery" },
        ],
        fees: [
          { name: "AG / FDACS Complaint", amount: "Free" },
          { name: "County Court Small Claims Filing", amount: "$55–$175" },
          { name: "FDUTPA Lawsuit", amount: "Prevailing party may recover attorney fees" },
        ],
        laws: [
          { name: "FDUTPA (F.S. § 501.201)", summary: "Florida Deceptive and Unfair Trade Practices Act — private right of action" },
          { name: "Florida Lemon Law (F.S. § 681)", summary: "3 repair attempts or 30 cumulative days out-of-service triggers buyback" },
          { name: "Florida Consumer Collection Practices Act", summary: "F.S. § 559.72 — stricter than federal FDCPA" },
          { name: "FCRA (federal)", summary: "Fair Credit Reporting Act — free disputes, 7-year negative reporting limit" },
        ],
      },
      "IL": {
        forms: [
          { name: "IL AG Consumer Complaint Form", description: "File complaint with Illinois Attorney General Consumer Protection Bureau", url: "https://illinoisattorneygeneral.gov/consumers/filecomplaint.html" },
          { name: "IDFPR Complaint", description: "Complaints against licensed businesses (lenders, brokers)", url: "https://idfpr.illinois.gov/about/fileacomplaint.asp" },
          { name: "CFPB Complaint Form", description: "Federal financial product complaint portal", url: "https://www.consumerfinance.gov/complaint/" },
          { name: "Small Claims Complaint", description: "Sue for consumer damages up to $10,000 in Circuit Court", url: "https://www.illinoislegalaid.org/legal-information/small-claims-court" },
        ],
        deadlines: [
          { name: "ICFA Lawsuit", timeframe: "3 years from discovery of deceptive practice" },
          { name: "FDCPA Lawsuit", timeframe: "1 year from violation" },
          { name: "Lemon Law Claim (IL)", timeframe: "Within 1 year from expiration of the express warranty" },
          { name: "Fraud Claim", timeframe: "5 years from discovery" },
        ],
        fees: [
          { name: "AG / IDFPR Complaint", amount: "Free" },
          { name: "Small Claims Filing", amount: "$50–$200 depending on county and amount" },
          { name: "ICFA Lawsuit", amount: "Attorney fees and costs recoverable if you prevail" },
        ],
        laws: [
          { name: "ICFA (815 ILCS 505)", summary: "Illinois Consumer Fraud Act — broad protections; $50,000 per violation penalty" },
          { name: "Consumer Installment Loan Act", summary: "815 ILCS 205 — regulates interest rates on loans" },
          { name: "IL Lemon Law (815 ILCS 380)", summary: "4 repair attempts or 30 days out of service triggers repurchase" },
          { name: "IL Collection Agency Act (225 ILCS 425)", summary: "Licensing and conduct requirements for debt collectors" },
          { name: "FCRA (federal)", summary: "Fair Credit Reporting Act — governs credit bureau accuracy" },
        ],
      },
      ...Object.fromEntries(remainingStates.filter(s => !["TX","FL","IL"].includes(s)).map(s => [s, createDefaultGuidance("consumer-rights")])),
    },
  },
};
