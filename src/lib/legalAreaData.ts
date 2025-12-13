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

// Default guidance template that can be customized per state
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

// California-specific guidance
const californiaFamilyLaw: StateGuidance = {
  forms: [
    { name: "FL-100 (Petition)", description: "Marriage/Domestic Partnership petition", url: "https://www.courts.ca.gov/documents/fl100.pdf" },
    { name: "FL-110 (Summons)", description: "Family Law Summons", url: "https://www.courts.ca.gov/documents/fl110.pdf" },
    { name: "FL-150 (Income & Expense)", description: "Declaration of Income and Expenses", url: "https://www.courts.ca.gov/documents/fl150.pdf" },
    { name: "FL-160 (Property Declaration)", description: "Property Declaration form" },
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
    { name: "SC-104 (Defendant's Claim)", description: "Counter-claim by defendant" },
    { name: "SC-500 (Subpoena)", description: "To compel witness attendance" },
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

const texasFamilyLaw: StateGuidance = {
  forms: [
    { name: "Original Petition for Divorce", description: "Initiates divorce proceedings in Texas" },
    { name: "Waiver of Citation", description: "If spouse agrees to skip formal service" },
    { name: "Final Decree of Divorce", description: "Court order finalizing divorce" },
  ],
  deadlines: [
    { name: "Waiting Period", timeframe: "60 days minimum from filing" },
    { name: "Answer Deadline", timeframe: "First Monday after 20 days from service" },
  ],
  fees: [
    { name: "Divorce Filing Fee", amount: "$250-$350 depending on county" },
    { name: "Citation/Service Fee", amount: "$50-$100" },
  ],
  laws: [
    { name: "Texas Family Code", summary: "Governs all family law matters" },
    { name: "Community Property State", summary: "Marital property divided equitably" },
    { name: "No-Fault Divorce", summary: "Can cite 'insupportability' (irreconcilable differences)" },
  ],
};

const texasSmallClaims: StateGuidance = {
  forms: [
    { name: "Small Claims Petition", description: "Initial filing for Justice Court" },
    { name: "Citation", description: "Served on defendant" },
    { name: "Proof of Service", description: "Documents proper service" },
  ],
  deadlines: [
    { name: "Contract Claims", timeframe: "4 years" },
    { name: "Personal Injury", timeframe: "2 years" },
    { name: "Property Damage", timeframe: "2 years" },
  ],
  fees: [
    { name: "Filing Fee", amount: "$50-$75" },
    { name: "Service Fee", amount: "$75-$125" },
  ],
  laws: [
    { name: "Texas Justice Court Rules", summary: "Governs small claims procedure" },
    { name: "Limit: $20,000", summary: "Maximum claim amount in Justice Court" },
    { name: "Appeals", summary: "Can appeal to County Court for new trial" },
  ],
};

const newYorkFamilyLaw: StateGuidance = {
  forms: [
    { name: "Summons with Notice", description: "Initiates matrimonial action" },
    { name: "Verified Complaint", description: "Details grounds for divorce" },
    { name: "Statement of Net Worth", description: "Financial disclosure form" },
  ],
  deadlines: [
    { name: "No Waiting Period", timeframe: "NY has no mandatory waiting period" },
    { name: "Response Deadline", timeframe: "20-30 days depending on service method" },
  ],
  fees: [
    { name: "Index Number Fee", amount: "$210" },
    { name: "Request for Judicial Intervention", amount: "$95" },
    { name: "Poor Person Application", amount: "Free filing if approved" },
  ],
  laws: [
    { name: "Domestic Relations Law", summary: "Governs marriage and divorce in NY" },
    { name: "Equitable Distribution", summary: "NY divides property fairly, not necessarily equally" },
    { name: "No-Fault Grounds", summary: "Irretrievable breakdown for 6+ months" },
  ],
};

const floridaFamilyLaw: StateGuidance = {
  forms: [
    { name: "Petition for Dissolution", description: "Form 12.901(a) or (b) to file for divorce" },
    { name: "Financial Affidavit", description: "Form 12.902(b) or (c) income/expense disclosure" },
    { name: "Parenting Plan", description: "Form 12.995(a) required for children" },
  ],
  deadlines: [
    { name: "Waiting Period", timeframe: "20 days from filing before final hearing" },
    { name: "Response Deadline", timeframe: "20 days from service" },
  ],
  fees: [
    { name: "Dissolution Filing Fee", amount: "$400-$420" },
    { name: "Service of Process", amount: "$40-$100" },
    { name: "Indigent Status", amount: "Fee waiver available" },
  ],
  laws: [
    { name: "Florida Statutes Chapter 61", summary: "Dissolution of Marriage laws" },
    { name: "Equitable Distribution", summary: "Marital assets divided fairly" },
    { name: "Time-Sharing", summary: "Florida uses 'time-sharing' instead of custody" },
  ],
};

export const legalAreaData: Record<string, LegalAreaData> = {
  "family": {
    title: "Family Law",
    description: "Navigate divorce, child custody, support matters, and domestic issues with state-specific guidance and forms.",
    icon: Heart,
    keywords: ["Divorce", "Child Custody", "Child Support", "Alimony", "Domestic Violence", "Adoption"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Filing for Divorce",
      "Child Custody Arrangements",
      "Child Support Calculations",
      "Spousal Support/Alimony",
      "Property Division",
      "Domestic Violence Orders",
      "Paternity Cases",
      "Adoption Process",
      "Guardianship",
      "Prenuptial Agreements",
      "Modification of Orders",
      "Enforcement of Orders",
    ],
    stateGuidance: {
      "CA": californiaFamilyLaw,
      "TX": texasFamilyLaw,
      "NY": newYorkFamilyLaw,
      "FL": floridaFamilyLaw,
      // Add more states with defaults
      ...Object.fromEntries(
        ["AL", "AK", "AZ", "AR", "CO", "CT", "DE", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
          .map(state => [state, createDefaultGuidance("family")])
      ),
    },
  },
  "small-claims": {
    title: "Small Claims Court",
    description: "Resolve disputes under state limits without a lawyer. Get forms, understand procedures, and prepare your case.",
    icon: DollarSign,
    keywords: ["Money Owed", "Property Damage", "Security Deposits", "Contract Disputes", "Unpaid Debts"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Collecting Money Owed",
      "Security Deposit Disputes",
      "Property Damage Claims",
      "Breach of Contract",
      "Consumer Complaints",
      "Service Disputes",
      "Auto Accident Claims",
      "Landlord Issues",
      "Defective Products",
      "Unpaid Wages",
      "Neighbor Disputes",
      "Pet-Related Damages",
    ],
    stateGuidance: {
      "CA": californiaSmallClaims,
      "TX": texasSmallClaims,
      ...Object.fromEntries(
        ["AL", "AK", "AZ", "AR", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
          .map(state => [state, createDefaultGuidance("small-claims")])
      ),
    },
  },
  "workplace": {
    title: "Employment & Workplace",
    description: "Address wrongful termination, discrimination, harassment, and wage issues with federal and state-specific resources.",
    icon: Briefcase,
    keywords: ["Wrongful Termination", "Discrimination", "Harassment", "Wage Theft", "Retaliation", "FMLA"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Wrongful Termination",
      "Workplace Discrimination",
      "Sexual Harassment",
      "Unpaid Wages/Overtime",
      "Hostile Work Environment",
      "Retaliation Claims",
      "FMLA Violations",
      "ADA Accommodations",
      "Non-Compete Agreements",
      "Severance Negotiations",
      "Unemployment Benefits",
      "EEOC Complaints",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("employment")])
    ),
  },
  "criminal": {
    title: "Criminal Defense",
    description: "Understand your rights, find resources for criminal charges, and navigate the criminal justice system.",
    icon: Shield,
    keywords: ["DUI/DWI", "Drug Charges", "Theft", "Assault", "Traffic Violations", "Expungement"],
    badge: { text: "Urgent", variant: "destructive" },
    commonTopics: [
      "DUI/DWI Defense",
      "Drug Possession",
      "Theft Charges",
      "Assault/Battery",
      "Traffic Violations",
      "Expungement/Sealing Records",
      "Probation Violations",
      "Bail & Bond",
      "Public Defender Requests",
      "Plea Bargaining",
      "Misdemeanor vs Felony",
      "Juvenile Offenses",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("criminal")])
    ),
  },
  "housing": {
    title: "Housing & Tenant Rights",
    description: "Protect your housing rights, fight unfair evictions, and resolve landlord-tenant disputes.",
    icon: Home,
    keywords: ["Eviction", "Security Deposits", "Lease Disputes", "Habitability", "Fair Housing", "Rent Control"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Eviction Defense",
      "Security Deposit Return",
      "Habitability Issues",
      "Lease Violations",
      "Rent Increases",
      "Fair Housing Complaints",
      "Landlord Retaliation",
      "Subletting Rights",
      "Early Lease Termination",
      "Mold/Pest Issues",
      "Utility Disputes",
      "Section 8 Issues",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("housing")])
    ),
  },
  "civil": {
    title: "Civil Rights",
    description: "Fight discrimination, police misconduct, and constitutional violations with proper legal channels.",
    icon: Users,
    keywords: ["Discrimination", "Police Misconduct", "Constitutional Rights", "Section 1983", "Voting Rights"],
    badge: { text: "Important", variant: "secondary" },
    commonTopics: [
      "Police Misconduct",
      "Racial Discrimination",
      "Disability Discrimination",
      "Voting Rights",
      "Free Speech Issues",
      "Religious Discrimination",
      "Prison Rights",
      "Section 1983 Claims",
      "Qualified Immunity",
      "ACLU Assistance",
      "DOJ Complaints",
      "Class Action Suits",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("civil-rights")])
    ),
  },
  "consumer": {
    title: "Consumer Protection",
    description: "Combat fraud, scams, unfair debt collection, and warranty violations with federal and state protections.",
    icon: Scale,
    keywords: ["Fraud", "Scams", "Debt Collection", "Warranty Issues", "Identity Theft", "Lemon Law"],
    badge: { text: "Popular", variant: "default" },
    commonTopics: [
      "Debt Collection Harassment",
      "Credit Report Errors",
      "Identity Theft",
      "Lemon Law Claims",
      "Warranty Disputes",
      "Fraudulent Charges",
      "Deceptive Advertising",
      "Unfair Business Practices",
      "FTC Complaints",
      "CFPB Complaints",
      "Class Action Eligibility",
      "Bankruptcy Options",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("consumer")])
    ),
  },
  "immigration": {
    title: "Immigration",
    description: "Navigate deportation defense, asylum applications, visas, and citizenship with comprehensive guidance.",
    icon: Gavel,
    keywords: ["Deportation", "Asylum", "Citizenship", "Green Card", "Work Permits", "DACA"],
    badge: { text: "Urgent", variant: "destructive" },
    commonTopics: [
      "Deportation Defense",
      "Asylum Applications",
      "Green Card Process",
      "Naturalization",
      "Work Permits (EAD)",
      "DACA Renewal",
      "Family Sponsorship",
      "Visa Overstay",
      "Immigration Court",
      "Detention Issues",
      "Travel Documents",
      "Removal Proceedings",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("immigration")])
    ),
  },
  "federal": {
    title: "Federal Court & Government",
    description: "Address federal agency issues, government accountability, and oversight of financial institutions.",
    icon: Scale,
    keywords: ["Federal Agencies", "Government Claims", "FOIA Requests", "Federal Court", "Regulatory Issues"],
    badge: { text: "Important", variant: "secondary" },
    commonTopics: [
      "FOIA Requests",
      "Federal Agency Appeals",
      "Social Security Appeals",
      "VA Benefits",
      "Federal Employment",
      "Government Contracts",
      "Federal Tax Issues",
      "Banking Complaints",
      "SEC Complaints",
      "Federal Tort Claims",
      "Administrative Hearings",
      "Whistleblower Protection",
    ],
    stateGuidance: Object.fromEntries(
      ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
        .map(state => [state, createDefaultGuidance("federal")])
    ),
  },
};
