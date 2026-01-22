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

// ==================== CALIFORNIA ====================

const californiaFamilyLaw: StateGuidance = {
  forms: [
    { name: "FL-100 (Petition)", description: "Marriage/Domestic Partnership petition", url: "https://www.courts.ca.gov/documents/fl100.pdf" },
    { name: "FL-110 (Summons)", description: "Family Law Summons", url: "https://www.courts.ca.gov/documents/fl110.pdf" },
    { name: "FL-150 (Income & Expense)", description: "Declaration of Income and Expenses", url: "https://www.courts.ca.gov/documents/fl150.pdf" },
    { name: "FL-160 (Property Declaration)", description: "Property Declaration form", url: "https://www.courts.ca.gov/documents/fl160.pdf" },
    { name: "FL-300 (Request for Order)", description: "Request temporary orders", url: "https://www.courts.ca.gov/documents/fl300.pdf" },
  ],
  deadlines: [
    { name: "Divorce Waiting Period", timeframe: "6 months minimum from service" },
    { name: "Response Deadline", timeframe: "30 days after service" },
    { name: "Temporary Orders", timeframe: "File within 30 days for urgent matters" },
  ],
  fees: [
    { name: "Petition Filing Fee", amount: "$435-$450" },
    { name: "Response Filing Fee", amount: "$435-$450" },
    { name: "Fee Waiver Available", amount: "Form FW-001 if income qualifies" },
  ],
  laws: [
    { name: "California Family Code", summary: "Governs divorce, custody, support, and property division" },
    { name: "Community Property Law", summary: "CA is a community property state - assets split 50/50" },
    { name: "Best Interests of Child Standard", summary: "Custody decisions based on child's wellbeing" },
  ],
};

const californiaSmallClaims: StateGuidance = {
  forms: [
    { name: "SC-100 (Plaintiff's Claim)", description: "Main small claims filing form", url: "https://www.courts.ca.gov/documents/sc100.pdf" },
    { name: "SC-104 (Defendant's Claim)", description: "Counter-claim by defendant", url: "https://www.courts.ca.gov/documents/sc104.pdf" },
    { name: "SC-500 (Subpoena)", description: "To compel witness attendance", url: "https://www.courts.ca.gov/documents/sc500.pdf" },
    { name: "SC-105 (Amendment)", description: "Amend your claim", url: "https://www.courts.ca.gov/documents/sc105.pdf" },
  ],
  deadlines: [
    { name: "Contract Claims", timeframe: "4 years written, 2 years oral" },
    { name: "Property Damage", timeframe: "3 years from incident" },
    { name: "Personal Injury", timeframe: "2 years from injury" },
  ],
  fees: [
    { name: "Claims up to $1,500", amount: "$30" },
    { name: "Claims $1,501-$5,000", amount: "$50" },
    { name: "Claims $5,001-$10,000", amount: "$75" },
  ],
  laws: [
    { name: "CCP § 116.220", summary: "Small claims limit is $10,000 ($5,000 for businesses)" },
    { name: "No Attorney Representation", summary: "Parties must represent themselves" },
    { name: "One Venue Appeal", summary: "Losing party can request new trial" },
  ],
};

const californiaEmployment: StateGuidance = {
  forms: [
    { name: "DFEH Complaint Form", description: "File discrimination complaint with Civil Rights Dept", url: "https://calcivilrights.ca.gov/complaintprocess/" },
    { name: "DIR Wage Claim (DLSE-1)", description: "File wage theft claim", url: "https://www.dir.ca.gov/dlse/howtofilewageclaim.htm" },
    { name: "WCAB Application", description: "Workers compensation claim", url: "https://www.dir.ca.gov/dwc/iwguides.html" },
  ],
  deadlines: [
    { name: "DFEH Complaint", timeframe: "3 years from discriminatory act" },
    { name: "Wage Claims", timeframe: "3 years for most claims" },
    { name: "Wrongful Termination", timeframe: "2 years from termination" },
  ],
  fees: [
    { name: "DFEH Filing", amount: "Free" },
    { name: "Labor Board Claim", amount: "Free" },
    { name: "Civil Court Filing", amount: "$435+" },
  ],
  laws: [
    { name: "FEHA", summary: "Fair Employment & Housing Act - broadest protections in US" },
    { name: "Labor Code § 201-204", summary: "Final pay requirements" },
    { name: "Labor Code § 1102.5", summary: "Whistleblower protections" },
  ],
};

const californiaHousing: StateGuidance = {
  forms: [
    { name: "UD-100 (Unlawful Detainer)", description: "Landlord's eviction complaint", url: "https://www.courts.ca.gov/documents/ud100.pdf" },
    { name: "UD-105 (Answer)", description: "Tenant's response to eviction", url: "https://www.courts.ca.gov/documents/ud105.pdf" },
    { name: "SC-500 (Small Claims)", description: "Security deposit claims", url: "https://www.courts.ca.gov/documents/sc500.pdf" },
  ],
  deadlines: [
    { name: "Answer to Eviction", timeframe: "5 days from service" },
    { name: "Security Deposit Return", timeframe: "21 days after move-out" },
    { name: "Rent Increase Notice", timeframe: "30-90 days depending on amount" },
  ],
  fees: [
    { name: "Unlawful Detainer Filing", amount: "$240-$450" },
    { name: "Small Claims Filing", amount: "$30-$75" },
  ],
  laws: [
    { name: "Civil Code § 1940-1954", summary: "Landlord-tenant rights and obligations" },
    { name: "AB 1482 (Tenant Protection Act)", summary: "Rent caps and just cause eviction statewide" },
    { name: "Civil Code § 1950.5", summary: "Security deposit rules" },
  ],
};

const californiaCriminal: StateGuidance = {
  forms: [
    { name: "CR-180 (Expungement)", description: "Petition for dismissal of conviction", url: "https://www.courts.ca.gov/documents/cr180.pdf" },
    { name: "CR-181 (Reduction)", description: "Petition to reduce felony to misdemeanor", url: "https://www.courts.ca.gov/documents/cr181.pdf" },
    { name: "CR-105 (Bail Application)", description: "Motion to reduce bail", url: "https://www.courts.ca.gov/documents/cr105.pdf" },
  ],
  deadlines: [
    { name: "Arraignment", timeframe: "48 hours if in custody (excluding weekends)" },
    { name: "Speedy Trial", timeframe: "60 days felony, 45 days misdemeanor" },
    { name: "Expungement Eligibility", timeframe: "After probation completion" },
  ],
  fees: [
    { name: "Expungement Filing", amount: "$120-$150" },
    { name: "Public Defender", amount: "Free if income qualifies" },
  ],
  laws: [
    { name: "Penal Code § 1203.4", summary: "Expungement/dismissal of convictions" },
    { name: "Prop 47", summary: "Reduced penalties for certain felonies" },
    { name: "Prop 64", summary: "Cannabis legalization and resentencing" },
  ],
};

// ==================== NEW YORK ====================

const newYorkFamilyLaw: StateGuidance = {
  forms: [
    { name: "UD-2 (Summons with Notice)", description: "Initiates matrimonial action", url: "https://nycourts.gov/divorce/forms.shtml" },
    { name: "UD-3 (Verified Complaint)", description: "Details grounds for divorce", url: "https://nycourts.gov/divorce/forms.shtml" },
    { name: "Statement of Net Worth", description: "Mandatory financial disclosure", url: "https://nycourts.gov/divorce/forms.shtml" },
    { name: "UD-8 (Affidavit of Defendant)", description: "Defendant's sworn statement", url: "https://nycourts.gov/divorce/forms.shtml" },
    { name: "UD-11 (Findings of Fact)", description: "Proposed findings for judge", url: "https://nycourts.gov/divorce/forms.shtml" },
  ],
  deadlines: [
    { name: "No Waiting Period", timeframe: "NY has no mandatory waiting period" },
    { name: "Response (Personal Service)", timeframe: "20 days after service" },
    { name: "Response (Other Service)", timeframe: "30 days after service" },
    { name: "Separation Agreement", timeframe: "Must be signed 1 year before filing" },
  ],
  fees: [
    { name: "Index Number Fee", amount: "$210" },
    { name: "Request for Judicial Intervention", amount: "$95" },
    { name: "Note of Issue", amount: "$30" },
    { name: "Poor Person Application", amount: "Free filing if approved" },
  ],
  laws: [
    { name: "Domestic Relations Law § 170", summary: "Grounds for divorce including no-fault" },
    { name: "Equitable Distribution Law", summary: "Property divided fairly, not necessarily equally" },
    { name: "DRL § 236", summary: "Maintenance (alimony) guidelines" },
    { name: "DRL § 240", summary: "Child custody and support standards" },
  ],
};

const newYorkSmallClaims: StateGuidance = {
  forms: [
    { name: "Small Claims Summons", description: "Initiates small claims action", url: "https://nycourts.gov/courts/nyc/smallclaims/forms.shtml" },
    { name: "Commercial Claims Form", description: "For business plaintiffs", url: "https://nycourts.gov/courts/nyc/smallclaims/forms.shtml" },
    { name: "Subpoena Form", description: "Compel witness attendance", url: "https://nycourts.gov/courts/nyc/smallclaims/forms.shtml" },
    { name: "Income Execution", description: "Wage garnishment after judgment", url: "https://nycourts.gov/courts/nyc/smallclaims/forms.shtml" },
  ],
  deadlines: [
    { name: "Contract Claims", timeframe: "6 years" },
    { name: "Personal Injury", timeframe: "3 years" },
    { name: "Property Damage", timeframe: "3 years" },
    { name: "Judgment Collection", timeframe: "20 years" },
  ],
  fees: [
    { name: "Claims up to $1,000", amount: "$15" },
    { name: "Claims $1,001-$5,000", amount: "$20" },
    { name: "Claims $5,001-$10,000", amount: "$25" },
    { name: "Commercial Claims", amount: "$35-$70" },
  ],
  laws: [
    { name: "NYC Civil Court Act § 1801", summary: "Small claims limit is $10,000" },
    { name: "CPLR Article 18", summary: "Small claims procedure" },
    { name: "Uniform City Court Act", summary: "Outside NYC small claims rules" },
  ],
};

const newYorkEmployment: StateGuidance = {
  forms: [
    { name: "DHR Complaint Form", description: "File discrimination complaint", url: "https://dhr.ny.gov/complaint" },
    { name: "DOL Wage Claim (LS 223)", description: "File unpaid wage claim", url: "https://dol.ny.gov/unpaidwithheld-wages-labor-standards-complaints" },
    { name: "EEOC Intake Questionnaire", description: "Federal discrimination complaint", url: "https://www.eeoc.gov/federal-sector/filing-formal-complaint" },
  ],
  deadlines: [
    { name: "DHR Complaint", timeframe: "3 years from discriminatory act" },
    { name: "Wage Claims", timeframe: "6 years for most claims" },
    { name: "EEOC Filing", timeframe: "300 days from violation" },
    { name: "Wrongful Termination", timeframe: "3 years" },
  ],
  fees: [
    { name: "DHR Filing", amount: "Free" },
    { name: "DOL Wage Claim", amount: "Free" },
    { name: "EEOC Filing", amount: "Free" },
  ],
  laws: [
    { name: "NY Human Rights Law", summary: "Broad discrimination protections" },
    { name: "Labor Law § 191", summary: "Wage payment requirements" },
    { name: "Labor Law § 740", summary: "Whistleblower protections" },
    { name: "NYC Human Rights Law", summary: "Strongest local protections in nation" },
  ],
};

const newYorkHousing: StateGuidance = {
  forms: [
    { name: "Notice of Petition & Petition", description: "Landlord's eviction filing", url: "https://nycourts.gov/courts/nyc/housing/forms.shtml" },
    { name: "Answer in Housing Court", description: "Tenant's response to eviction", url: "https://nycourts.gov/courts/nyc/housing/forms.shtml" },
    { name: "HP Action Forms", description: "Tenant complaint for repairs", url: "https://nycourts.gov/courts/nyc/housing/forms.shtml" },
    { name: "Order to Show Cause", description: "Emergency relief request", url: "https://nycourts.gov/courts/nyc/housing/forms.shtml" },
  ],
  deadlines: [
    { name: "Answer to Eviction", timeframe: "Within 10 days" },
    { name: "Security Deposit Return", timeframe: "14 days after move-out" },
    { name: "Rent Stabilized Renewal", timeframe: "90-150 days before expiration" },
  ],
  fees: [
    { name: "Nonpayment Petition", amount: "$45" },
    { name: "Holdover Petition", amount: "$45" },
    { name: "HP Action (Tenant)", amount: "Free" },
  ],
  laws: [
    { name: "Real Property Law § 226-b", summary: "Subletting rights" },
    { name: "HSTPA 2019", summary: "Rent stabilization reforms" },
    { name: "RPL § 227-a", summary: "Constructive eviction remedies" },
    { name: "NYC Admin Code § 27-2005", summary: "Housing maintenance code" },
  ],
};

const newYorkCriminal: StateGuidance = {
  forms: [
    { name: "CPL 160.59 Motion", description: "Petition for record sealing", url: "https://nycourts.gov/forms/cpl_160_59.shtml" },
    { name: "Certificate of Relief", description: "Removes employment barriers", url: "https://doccs.ny.gov/certificate-relief-disabilities" },
    { name: "Bail Application", description: "Request for bail modification", url: "https://nycourts.gov/forms/criminal.shtml" },
  ],
  deadlines: [
    { name: "Arraignment", timeframe: "24 hours if in custody" },
    { name: "Speedy Trial (Felony)", timeframe: "6 months" },
    { name: "Speedy Trial (Misdemeanor)", timeframe: "90 days" },
    { name: "Sealing Eligibility", timeframe: "10 years after sentence completion" },
  ],
  fees: [
    { name: "Record Sealing", amount: "Free" },
    { name: "Certificate of Relief", amount: "Free" },
    { name: "Public Defender", amount: "Free if income qualifies" },
  ],
  laws: [
    { name: "CPL 160.59", summary: "Criminal record sealing law" },
    { name: "Bail Reform Law 2020", summary: "Eliminated cash bail for most misdemeanors" },
    { name: "Marijuana Regulation & Taxation Act", summary: "Legalization and expungement" },
    { name: "Correction Law Article 23-A", summary: "Fair Chance Act for employment" },
  ],
};

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

const californiaPersonalInjury: StateGuidance = {
  forms: [
    { name: "Judicial Council Form CM-010", description: "Civil Case Cover Sheet (required for all PI cases)", url: "https://www.courts.ca.gov/documents/cm010.pdf" },
    { name: "Judicial Council Form PLD-PI-001", description: "Complaint—Personal Injury, Property Damage, Wrongful Death", url: "https://www.courts.ca.gov/documents/pldpi001.pdf" },
    { name: "Judicial Council Form SUM-100", description: "Summons", url: "https://www.courts.ca.gov/documents/sum100.pdf" },
    { name: "Judicial Council Form POS-010", description: "Proof of Service of Summons", url: "https://www.courts.ca.gov/documents/pos010.pdf" },
    { name: "Judicial Council Form MC-030", description: "Declaration (for witness statements)", url: "https://www.courts.ca.gov/documents/mc030.pdf" },
    { name: "Form FW-001", description: "Fee Waiver Request", url: "https://www.courts.ca.gov/documents/fw001.pdf" },
  ],
  deadlines: [
    { name: "Personal Injury (General)", timeframe: "2 years from date of injury (CCP § 335.1)" },
    { name: "Medical Malpractice", timeframe: "3 years from injury OR 1 year from discovery, whichever is earlier (CCP § 340.5)" },
    { name: "Government Claims (vs. city/county/state)", timeframe: "6 months to file administrative claim, then 6 months to sue if rejected (Gov Code § 911.2)" },
    { name: "Wrongful Death", timeframe: "2 years from date of death (CCP § 335.1)" },
    { name: "Product Liability", timeframe: "2 years from injury (CCP § 335.1)" },
    { name: "Minor's Claims", timeframe: "Tolled until age 18, then 2 years" },
  ],
  fees: [
    { name: "Unlimited Civil Filing (over $25K)", amount: "$435" },
    { name: "Limited Civil Filing (under $25K)", amount: "$225" },
    { name: "Service of Process", amount: "$40-$150" },
    { name: "Jury Fees (deposit)", amount: "$150" },
    { name: "Fee Waiver", amount: "Available for low income (Form FW-001)" },
  ],
  laws: [
    { name: "CCP § 335.1", summary: "2-year statute of limitations for personal injury" },
    { name: "Civil Code § 1714", summary: "General negligence liability standard" },
    { name: "CCP § 340.5", summary: "Special medical malpractice limitations" },
    { name: "Pure Comparative Fault", summary: "Recovery reduced by your percentage of fault (Li v. Yellow Cab)" },
    { name: "MICRA (Medical Injury Compensation Reform Act)", summary: "Caps non-economic damages in med mal at $350K (increasing to $750K by 2033)" },
  ],
};

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

const newYorkPersonalInjury: StateGuidance = {
  forms: [
    { name: "Summons with Notice", description: "Initiates lawsuit without complaint", url: "https://nycourts.gov/courts/nycivil/forms.shtml" },
    { name: "Verified Complaint", description: "Detailed allegations of negligence", url: "https://nycourts.gov/courts/nycivil/forms.shtml" },
    { name: "Request for Judicial Intervention (RJI)", description: "Assigns judge to case", url: "https://nycourts.gov/courts/nycivil/forms.shtml" },
    { name: "Statement of Readiness", description: "Certificate case is ready for trial", url: "https://nycourts.gov/courts/nycivil/forms.shtml" },
    { name: "Poor Person Application", description: "Fee waiver for indigent litigants", url: "https://nycourts.gov/forms/filingfees.shtml" },
    { name: "Bill of Particulars", description: "Detailed breakdown of damages claimed", url: "https://nycourts.gov/courts/nycivil/forms.shtml" },
  ],
  deadlines: [
    { name: "Personal Injury (General)", timeframe: "3 years from date of injury (CPLR § 214)" },
    { name: "Medical Malpractice", timeframe: "2.5 years from act OR last treatment in continuous course (CPLR § 214-a)" },
    { name: "Wrongful Death", timeframe: "2 years from date of death (EPTL § 5-4.1)" },
    { name: "Government Claims (Notice of Claim)", timeframe: "90 days to file Notice of Claim, then 1 year + 90 days to sue" },
    { name: "Product Liability", timeframe: "3 years from injury" },
    { name: "Motor Vehicle Accidents", timeframe: "3 years (serious injury threshold applies for pain/suffering)" },
  ],
  fees: [
    { name: "Supreme Court Filing (Index Number)", amount: "$210" },
    { name: "Request for Judicial Intervention", amount: "$95" },
    { name: "Civil Court Filing (under $25K)", amount: "$45" },
    { name: "Service of Process", amount: "$75-$150" },
    { name: "Poor Person Status", amount: "Fee waiver available" },
  ],
  laws: [
    { name: "CPLR § 214", summary: "3-year statute of limitations for negligence" },
    { name: "Pure Comparative Fault", summary: "Recovery reduced by your percentage of fault (even if 99%)" },
    { name: "No-Fault Insurance Law (VTL § 5102)", summary: "Serious injury threshold for non-economic damages in auto cases" },
    { name: "CPLR § 1602", summary: "Joint and several liability rules" },
    { name: "Labor Law §§ 240, 241", summary: "Strict liability for construction accidents (Scaffold Law)" },
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
      "CA": californiaFamilyLaw,
      "TX": texasFamilyLaw,
      "NY": newYorkFamilyLaw,
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
      "CA": californiaSmallClaims,
      "TX": texasSmallClaims,
      "NY": newYorkSmallClaims,
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
      "CA": californiaEmployment,
      "NY": newYorkEmployment,
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
      "CA": californiaCriminal,
      "NY": newYorkCriminal,
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
      "CA": californiaHousing,
      "NY": newYorkHousing,
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
      ["CA", "TX", "NY", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("civil-rights")])
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
      ["CA", "TX", "NY", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("consumer")])
    ),
  },
  "personal-injury": {
    title: "Personal Injury",
    description: "Get help with accident claims, medical bills, and injury compensation. Navigate insurance claims and understand your rights.",
    icon: Heart,
    keywords: ["Car Accident", "Medical Malpractice", "Slip and Fall", "Wrongful Death", "Insurance Claims", "Settlement"],
    badge: { text: "High Value", variant: "default" },
    commonTopics: [
      "Car Accidents", "Truck Accidents", "Motorcycle Accidents",
      "Slip and Fall", "Medical Malpractice", "Product Liability",
      "Dog Bites", "Wrongful Death", "Workers Compensation",
      "Insurance Claims", "Settlement Negotiation", "Pain and Suffering",
    ],
    stateGuidance: {
      "CA": californiaPersonalInjury,
      "TX": texasPersonalInjury,
      "FL": floridaPersonalInjury,
      "NY": newYorkPersonalInjury,
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
      ["CA", "TX", "NY", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("immigration")])
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
      ["CA", "TX", "NY", "FL", "IL", ...remainingStates].map(s => [s, createDefaultGuidance("federal")])
    ),
  },
};
