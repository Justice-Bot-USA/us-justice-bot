// Additional State Forms Data (states not in main file)
import { StateFormsData } from '../formsLibraryData';

export const additionalStatesFormsLibrary: Record<string, StateFormsData> = {
  // ==================== ALABAMA ====================
  "AL": {
    stateName: "Alabama",
    courtWebsite: "https://judicial.alabama.gov",
    selfHelpUrl: "https://alacourt.gov/SelfHelp.aspx",
    forms: {
      "family": [
        { formNumber: "CS-41", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://eforms.alacourt.gov/", category: "Divorce", feeAmount: "$274", feeWaiverAvailable: true },
        { formNumber: "CS-42", name: "Answer to Divorce Complaint", description: "Respond to divorce petition", url: "https://eforms.alacourt.gov/", category: "Divorce" },
        { formNumber: "CS-47", name: "Child Support Obligation Form", description: "Calculate child support", url: "https://eforms.alacourt.gov/", category: "Support" },
        { formNumber: "Protection Order", name: "Petition for Protection from Abuse", description: "Request domestic violence protection", url: "https://eforms.alacourt.gov/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-1", name: "Statement of Claim", description: "Small claims case (up to $6,000)", url: "https://eforms.alacourt.gov/", category: "Filing", feeAmount: "$55", feeWaiverAvailable: true },
        { formNumber: "SC-2", name: "Answer to Small Claims", description: "Respond to small claims", url: "https://eforms.alacourt.gov/", category: "Response" },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Claim", description: "Apply for unemployment", url: "https://labor.alabama.gov/unemployment.aspx", category: "Unemployment" },
        { formNumber: "EEOC Charge", name: "EEOC Discrimination Charge", description: "File federal discrimination complaint", url: "https://www.eeoc.gov/field-office/birmingham/location", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Eviction", description: "Landlord eviction lawsuit", url: "https://eforms.alacourt.gov/", category: "Eviction", feeAmount: "$215", feeWaiverAvailable: true },
        { formNumber: "Answer to Eviction", name: "Answer to Eviction", description: "Tenant response", url: "https://eforms.alacourt.gov/", category: "Defense" },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible records", url: "https://eforms.alacourt.gov/", category: "Expungement", feeAmount: "$300", feeWaiverAvailable: true },
      ],
      "general": [
        { formNumber: "Affidavit of Substantial Hardship", name: "Fee Waiver Application", description: "Request court fee waiver", url: "https://eforms.alacourt.gov/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== ALASKA ====================
  "AK": {
    stateName: "Alaska",
    courtWebsite: "https://courts.alaska.gov",
    selfHelpUrl: "https://courts.alaska.gov/shc/",
    forms: {
      "family": [
        { formNumber: "DR-100", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://courts.alaska.gov/shc/family/shcdivorce.htm", category: "Divorce", feeAmount: "$250", feeWaiverAvailable: true },
        { formNumber: "DR-200", name: "Motion for Custody", description: "Request custody determination", url: "https://courts.alaska.gov/shc/family/shccustody.htm", category: "Custody" },
        { formNumber: "DV-100", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://courts.alaska.gov/shc/family/shcdv.htm", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-100", name: "Small Claims Complaint", description: "Start case (up to $10,000)", url: "https://courts.alaska.gov/shc/small-claims/", category: "Filing", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://labor.alaska.gov/unemployment/", category: "Unemployment" },
        { formNumber: "AKOSH Complaint", name: "Workplace Safety Complaint", description: "Report unsafe conditions", url: "https://labor.alaska.gov/lss/oshhome.htm", category: "Safety", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED-100", name: "Complaint for Forcible Entry", description: "Eviction lawsuit", url: "https://courts.alaska.gov/shc/housing/", category: "Eviction", feeAmount: "$150", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Set Aside Petition", name: "Petition to Set Aside Conviction", description: "Clear eligible records", url: "https://courts.alaska.gov/shc/criminal/", category: "Set Aside", feeAmount: "$100" },
      ],
      "general": [
        { formNumber: "TF-920", name: "Exemption from Filing Fees", description: "Request fee waiver", url: "https://courts.alaska.gov/shc/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== ARKANSAS ====================
  "AR": {
    stateName: "Arkansas",
    courtWebsite: "https://www.arcourts.gov",
    selfHelpUrl: "https://www.arcourts.gov/forms-and-publications",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.arcourts.gov/forms-and-publications", category: "Divorce", feeAmount: "$165", feeWaiverAvailable: true },
        { formNumber: "Order of Protection", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.arcourts.gov/forms-and-publications", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Affidavit", description: "Start case (up to $5,000)", url: "https://www.arcourts.gov/forms-and-publications", category: "Filing", feeAmount: "$65", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS Claim", name: "Unemployment Claim", description: "Apply for unemployment", url: "https://www.dws.arkansas.gov/unemployment/", category: "Unemployment" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Unlawful Detainer Complaint", description: "Eviction lawsuit", url: "https://www.arcourts.gov/forms-and-publications", category: "Eviction", feeAmount: "$85", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Sealing Petition", name: "Petition to Seal Records", description: "Seal eligible records", url: "https://www.arcourts.gov/forms-and-publications", category: "Record Sealing", feeAmount: "$75" },
      ],
      "general": [
        { formNumber: "IFP", name: "In Forma Pauperis Application", description: "Request fee waiver", url: "https://www.arcourts.gov/forms-and-publications", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== CONNECTICUT ====================
  "CT": {
    stateName: "Connecticut",
    courtWebsite: "https://jud.ct.gov",
    selfHelpUrl: "https://jud.ct.gov/lawlib/selfhelp.htm",
    forms: {
      "family": [
        { formNumber: "JD-FM-159", name: "Divorce Complaint", description: "Start divorce proceedings", url: "https://www.jud.ct.gov/webforms/", category: "Divorce", feeAmount: "$360", feeWaiverAvailable: true },
        { formNumber: "JD-FM-137", name: "Parenting Plan", description: "Custody arrangement plan", url: "https://www.jud.ct.gov/webforms/", category: "Custody" },
        { formNumber: "JD-FM-161", name: "Restraining Order Application", description: "Domestic violence protection", url: "https://www.jud.ct.gov/webforms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JD-CV-40", name: "Small Claims Writ and Notice", description: "Start case (up to $5,000)", url: "https://www.jud.ct.gov/webforms/", category: "Filing", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UC-61", name: "Unemployment Claim", description: "Apply for unemployment", url: "https://portal.ct.gov/dol/unemployment", category: "Unemployment" },
        { formNumber: "CHRO Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://portal.ct.gov/chro/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "JD-HM-1", name: "Summary Process Complaint", description: "Eviction lawsuit", url: "https://www.jud.ct.gov/webforms/", category: "Eviction", feeAmount: "$195", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "CR-67", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.jud.ct.gov/webforms/", category: "Expungement", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "JD-FM-75", name: "Fee Waiver Application", description: "Request court fee waiver", url: "https://www.jud.ct.gov/webforms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== DELAWARE ====================
  "DE": {
    stateName: "Delaware",
    courtWebsite: "https://courts.delaware.gov",
    selfHelpUrl: "https://courts.delaware.gov/Help/",
    forms: {
      "family": [
        { formNumber: "Petition for Divorce", name: "Divorce Petition", description: "Start divorce proceedings", url: "https://courts.delaware.gov/family/forms/", category: "Divorce", feeAmount: "$154", feeWaiverAvailable: true },
        { formNumber: "PFA Petition", name: "Protection from Abuse Petition", description: "Domestic violence protection", url: "https://courts.delaware.gov/family/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JP Complaint", name: "Justice of the Peace Complaint", description: "Small claims (up to $25,000)", url: "https://courts.delaware.gov/jpcourt/", category: "Filing", feeAmount: "$35-$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://ui.delawareworks.com/", category: "Unemployment" },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Summary Possession Complaint", description: "Eviction lawsuit", url: "https://courts.delaware.gov/jpcourt/", category: "Eviction", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://courts.delaware.gov/criminal/", category: "Expungement", feeAmount: "$0-$60" },
      ],
      "general": [
        { formNumber: "IFP", name: "In Forma Pauperis Motion", description: "Request fee waiver", url: "https://courts.delaware.gov/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== HAWAII ====================
  "HI": {
    stateName: "Hawaii",
    courtWebsite: "https://www.courts.state.hi.us",
    selfHelpUrl: "https://www.courts.state.hi.us/self-help",
    forms: {
      "family": [
        { formNumber: "1F-P-2047", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.state.hi.us/self-help/courts/forms/family", category: "Divorce", feeAmount: "$265", feeWaiverAvailable: true },
        { formNumber: "TRO Petition", name: "Petition for TRO", description: "Temporary restraining order", url: "https://www.courts.state.hi.us/self-help/courts/forms/family", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "1SC", name: "Statement of Claim", description: "Small claims (up to $5,000)", url: "https://www.courts.state.hi.us/self-help/courts/forms/small_claims", category: "Filing", feeAmount: "$30-$55", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Claim", description: "Apply for unemployment", url: "https://uiclaims.hawaii.gov/", category: "Unemployment" },
        { formNumber: "HCRC Complaint", name: "Civil Rights Complaint", description: "Employment discrimination", url: "https://labor.hawaii.gov/hcrc/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Summary Possession", name: "Complaint for Summary Possession", description: "Eviction lawsuit", url: "https://www.courts.state.hi.us/self-help/courts/forms/landlord_tenant", category: "Eviction", feeAmount: "$145", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Motion for Expungement", description: "Clear eligible records", url: "https://www.courts.state.hi.us/self-help/courts/forms/criminal", category: "Expungement", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Fee Waiver", description: "Request court fee waiver", url: "https://www.courts.state.hi.us/self-help/courts/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== IDAHO ====================
  "ID": {
    stateName: "Idaho",
    courtWebsite: "https://isc.idaho.gov",
    selfHelpUrl: "https://courtselfhelp.idaho.gov",
    forms: {
      "family": [
        { formNumber: "CAO FL 1-1", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://courtselfhelp.idaho.gov/Forms/divorce", category: "Divorce", feeAmount: "$207", feeWaiverAvailable: true },
        { formNumber: "CAO DV 1-2", name: "Petition for Protection Order", description: "Domestic violence protection", url: "https://courtselfhelp.idaho.gov/Forms/protection-order", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CAO SC 1-1", name: "Claim Form", description: "Small claims (up to $5,000)", url: "https://courtselfhelp.idaho.gov/Forms/small-claims", category: "Filing", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://labor.idaho.gov/dnn/Unemployment-Benefits", category: "Unemployment" },
        { formNumber: "IHRC Complaint", name: "Human Rights Commission Complaint", description: "Employment discrimination", url: "https://humanrights.idaho.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Eviction Complaint", description: "Unlawful detainer lawsuit", url: "https://courtselfhelp.idaho.gov/Forms/eviction", category: "Eviction", feeAmount: "$166", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Motion", name: "Motion for Expungement", description: "Clear eligible records", url: "https://courtselfhelp.idaho.gov/Forms/expungement", category: "Expungement", feeAmount: "$94" },
      ],
      "general": [
        { formNumber: "CAO FW 1-1", name: "Fee Waiver Application", description: "Request court fee waiver", url: "https://courtselfhelp.idaho.gov/Forms/fee-waiver", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== INDIANA ====================
  "IN": {
    stateName: "Indiana",
    courtWebsite: "https://www.in.gov/courts",
    selfHelpUrl: "https://indianalegalhelp.org",
    forms: {
      "family": [
        { formNumber: "Dissolution Petition", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.in.gov/courts/selfservice/forms/", category: "Divorce", feeAmount: "$157", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://www.in.gov/courts/selfservice/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claim", name: "Notice of Small Claim", description: "Small claims (up to $10,000)", url: "https://www.in.gov/courts/selfservice/forms/", category: "Filing", feeAmount: "$35-$97", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWD Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.in.gov/dwd/indiana-unemployment/", category: "Unemployment" },
        { formNumber: "ICRC Complaint", name: "Civil Rights Commission Complaint", description: "Employment discrimination", url: "https://www.in.gov/icrc/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.in.gov/courts/selfservice/forms/", category: "Eviction", feeAmount: "$157", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records (Second Chance Law)", url: "https://www.in.gov/courts/selfservice/forms/", category: "Expungement", feeAmount: "$157" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Motion for Fee Waiver", description: "Request court fee waiver", url: "https://www.in.gov/courts/selfservice/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== IOWA ====================
  "IA": {
    stateName: "Iowa",
    courtWebsite: "https://www.iowacourts.gov",
    selfHelpUrl: "https://www.iowacourts.gov/for-the-public/representing-yourself",
    forms: {
      "family": [
        { formNumber: "Dissolution Petition", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Divorce", feeAmount: "$265", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Domestic abuse protection", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Original Notice - Small Claims", description: "Small claims (up to $6,500)", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Filing", feeAmount: "$90", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "IWD Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.iowaworkforcedevelopment.gov/unemployment-insurance-information", category: "Unemployment" },
        { formNumber: "ICRC Complaint", name: "Civil Rights Complaint", description: "Employment discrimination", url: "https://icrc.iowa.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Eviction", feeAmount: "$95", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Application for Expungement", description: "Clear eligible records", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Expungement", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application to Waive Fees", description: "Request court fee waiver", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== KANSAS ====================
  "KS": {
    stateName: "Kansas",
    courtWebsite: "https://www.kscourts.org",
    selfHelpUrl: "https://www.kansasjudicialcouncil.org/legal-forms",
    forms: {
      "family": [
        { formNumber: "Petition for Divorce", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.kansasjudicialcouncil.org/legal-forms/divorce", category: "Divorce", feeAmount: "$200", feeWaiverAvailable: true },
        { formNumber: "PFA Petition", name: "Petition for Protection from Abuse", description: "Domestic violence protection", url: "https://www.kansasjudicialcouncil.org/legal-forms/pfa", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims Petition", name: "Petition - Small Claims", description: "Small claims (up to $4,000)", url: "https://www.kansasjudicialcouncil.org/legal-forms/limited-actions", category: "Filing", feeAmount: "$49", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "KDOL Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.dol.ks.gov/unemployment", category: "Unemployment" },
        { formNumber: "KHRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://khrc.net/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED Petition", name: "Petition for Forcible Detainer", description: "Eviction lawsuit", url: "https://www.kansasjudicialcouncil.org/legal-forms/landlord-tenant", category: "Eviction", feeAmount: "$49", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.kansasjudicialcouncil.org/legal-forms/criminal", category: "Expungement", feeAmount: "$195" },
      ],
      "general": [
        { formNumber: "Affidavit of Poverty", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.kansasjudicialcouncil.org/legal-forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // Add more states following same pattern...
  // Kentucky, Louisiana, Maine, Maryland, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada,
  // New Hampshire, New Mexico, North Dakota, Oklahoma, Oregon, Rhode Island, South Carolina, South Dakota,
  // Tennessee, Utah, Vermont, West Virginia, Wisconsin, Wyoming, DC

  // ==================== KENTUCKY ====================
  "KY": {
    stateName: "Kentucky",
    courtWebsite: "https://courts.ky.gov",
    selfHelpUrl: "https://kyjustice.org",
    forms: {
      "family": [
        { formNumber: "AOC-238", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Divorce", feeAmount: "$148", feeWaiverAvailable: true },
        { formNumber: "AOC-275", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "AOC-175", name: "Small Claims Complaint", description: "Small claims (up to $2,500)", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Filing", feeAmount: "$30-$60", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://kcc.ky.gov/Pages/default.aspx", category: "Unemployment" },
        { formNumber: "KCHR Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://kchr.ky.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Forcible Detainer", description: "Eviction lawsuit", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Eviction", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Motion for Expungement", description: "Clear eligible records", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Expungement", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "AOC-200", name: "Motion to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://courts.ky.gov/resources/legalforms/Pages/default.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== LOUISIANA ====================
  "LA": {
    stateName: "Louisiana",
    courtWebsite: "https://www.lasc.org",
    selfHelpUrl: "https://louisianalawhelp.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings (102/103)", url: "https://louisianalawhelp.org/issues/family-law", category: "Divorce", feeAmount: "$250-$450", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Domestic abuse protection", url: "https://louisianalawhelp.org/issues/safety", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Petition", description: "Small claims (up to $5,000)", url: "https://louisianalawhelp.org/", category: "Filing", feeAmount: "$80-$150", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "LWC Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.laworks.net/", category: "Unemployment" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Rule for Eviction", description: "Eviction lawsuit", url: "https://louisianalawhelp.org/issues/housing", category: "Eviction", feeAmount: "$75-$200", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Motion for Expungement", description: "Clear eligible records", url: "https://louisianalawhelp.org/issues/criminal", category: "Expungement", feeAmount: "$550" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application for In Forma Pauperis", description: "Request court fee waiver", url: "https://louisianalawhelp.org/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== MAINE ====================
  "ME": {
    stateName: "Maine",
    courtWebsite: "https://www.courts.maine.gov",
    selfHelpUrl: "https://www.courts.maine.gov/self-help/",
    forms: {
      "family": [
        { formNumber: "FM-001", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Divorce", feeAmount: "$120", feeWaiverAvailable: true },
        { formNumber: "FM-029", name: "Protection from Abuse Complaint", description: "Domestic violence protection", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-001", name: "Small Claims Complaint", description: "Small claims (up to $6,000)", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Filing", feeAmount: "$50-$90", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "MDOL Claim", name: "Unemployment Benefits Claim", description: "Apply for unemployment", url: "https://www.maine.gov/unemployment/", category: "Unemployment" },
        { formNumber: "MHRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://www.maine.gov/mhrc/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Eviction", feeAmount: "$80", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Sealing", name: "Motion to Seal", description: "Seal eligible records", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Record Sealing", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application to Waive Fees", description: "Request court fee waiver", url: "https://www.courts.maine.gov/fees_forms/forms/index.shtml", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== MARYLAND ====================
  "MD": {
    stateName: "Maryland",
    courtWebsite: "https://www.courts.state.md.us",
    selfHelpUrl: "https://www.mdcourts.gov/legalhelp",
    forms: {
      "family": [
        { formNumber: "CC-DR-020", name: "Complaint for Absolute Divorce", description: "Start divorce proceedings", url: "https://www.courts.state.md.us/courtforms", category: "Divorce", feeAmount: "$165", feeWaiverAvailable: true },
        { formNumber: "CC-DC-005", name: "Petition for Protection Order", description: "Domestic violence protection", url: "https://www.courts.state.md.us/courtforms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "DC-CV-001", name: "Complaint", description: "Small claims (up to $5,000)", url: "https://www.courts.state.md.us/courtforms", category: "Filing", feeAmount: "$34-$55", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "BEACON", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.dllr.state.md.us/employment/unemployment.shtml", category: "Unemployment" },
        { formNumber: "MCCR Complaint", name: "Civil Rights Complaint", description: "Employment discrimination", url: "https://mccr.maryland.gov/Pages/default.aspx", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "DC-CV-082", name: "Complaint - Failure to Pay Rent", description: "Eviction lawsuit", url: "https://www.courts.state.md.us/courtforms", category: "Eviction", feeAmount: "$25", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.courts.state.md.us/courtforms", category: "Expungement", feeAmount: "$30" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Request for Waiver of Prepaid Costs", description: "Request court fee waiver", url: "https://www.courts.state.md.us/courtforms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== MINNESOTA ====================
  "MN": {
    stateName: "Minnesota",
    courtWebsite: "https://www.mncourts.gov",
    selfHelpUrl: "https://www.mncourts.gov/Help-Topics.aspx",
    forms: {
      "family": [
        { formNumber: "FAM101", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.mncourts.gov/GetForms.aspx", category: "Divorce", feeAmount: "$395", feeWaiverAvailable: true },
        { formNumber: "OFP101", name: "Petition for OFP", description: "Order for Protection", url: "https://www.mncourts.gov/GetForms.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CON101", name: "Statement of Claim", description: "Conciliation court (up to $15,000)", url: "https://www.mncourts.gov/GetForms.aspx", category: "Filing", feeAmount: "$75-$95", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DEED Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://uimn.org/", category: "Unemployment" },
        { formNumber: "MDHR Charge", name: "Human Rights Charge", description: "Employment discrimination", url: "https://mn.gov/mdhr/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Eviction Action Complaint", description: "Eviction lawsuit", url: "https://www.mncourts.gov/GetForms.aspx", category: "Eviction", feeAmount: "$285", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.mncourts.gov/GetForms.aspx", category: "Expungement", feeAmount: "$322" },
      ],
      "general": [
        { formNumber: "IFP101", name: "Application for Fee Waiver", description: "Request court fee waiver", url: "https://www.mncourts.gov/GetForms.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== DISTRICT OF COLUMBIA ====================
  "DC": {
    stateName: "District of Columbia",
    courtWebsite: "https://www.dccourts.gov",
    selfHelpUrl: "https://www.dccourts.gov/services/family-matters/self-help-center",
    forms: {
      "family": [
        { formNumber: "DOM 1", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.dccourts.gov/services/forms-matters", category: "Divorce", feeAmount: "$120", feeWaiverAvailable: true },
        { formNumber: "CPO", name: "Petition for Civil Protection Order", description: "Domestic violence protection", url: "https://www.dccourts.gov/services/forms-matters", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Statement", description: "Small claims (up to $10,000)", url: "https://www.dccourts.gov/services/forms-matters", category: "Filing", feeAmount: "$10-$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOES Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://does.dc.gov/service/unemployment-insurance-benefits", category: "Unemployment" },
        { formNumber: "OHR Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://ohr.dc.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Possession", description: "Eviction lawsuit", url: "https://www.dccourts.gov/services/forms-matters", category: "Eviction", feeAmount: "$15", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Sealing", name: "Motion to Seal", description: "Seal eligible records", url: "https://www.dccourts.gov/services/forms-matters", category: "Record Sealing", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://www.dccourts.gov/services/forms-matters", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },
  // ==================== MISSISSIPPI ====================
  "MS": {
    stateName: "Mississippi",
    courtWebsite: "https://courts.ms.gov",
    selfHelpUrl: "https://mslegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://courts.ms.gov/trialcourts/chancery/chancerydivorceforms.php", category: "Divorce", feeAmount: "$52", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://courts.ms.gov/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Justice Court Claim", name: "Statement of Claim", description: "Small claims (up to $3,500)", url: "https://courts.ms.gov/", category: "Filing", feeAmount: "$40", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "MDES Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://mdes.ms.gov/", category: "Unemployment" },
        { formNumber: "EEOC Charge", name: "EEOC Discrimination Charge", description: "Federal discrimination complaint", url: "https://www.eeoc.gov/field-office/jackson/location", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://courts.ms.gov/", category: "Eviction", feeAmount: "$40", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://courts.ms.gov/", category: "Expungement", feeAmount: "$250" },
      ],
      "general": [
        { formNumber: "IFP", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://courts.ms.gov/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== MISSOURI ====================
  "MO": {
    stateName: "Missouri",
    courtWebsite: "https://www.courts.mo.gov",
    selfHelpUrl: "https://www.courts.mo.gov/page.jsp?id=704",
    forms: {
      "family": [
        { formNumber: "CAFC100", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.courts.mo.gov/page.jsp?id=46027", category: "Divorce", feeAmount: "$163", feeWaiverAvailable: true },
        { formNumber: "CAFC201", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.courts.mo.gov/page.jsp?id=46027", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CV101", name: "Statement of Claim", description: "Small claims (up to $5,000)", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Filing", feeAmount: "$45-$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DES Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://labor.mo.gov/unemployed-workers", category: "Unemployment" },
        { formNumber: "MCHR Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://labor.mo.gov/mohumanrights", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Landlord Petition for Rent and Possession", description: "Eviction lawsuit", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Eviction", feeAmount: "$45", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.courts.mo.gov/page.jsp?id=46027", category: "Expungement", feeAmount: "$250" },
      ],
      "general": [
        { formNumber: "CV67", name: "Motion to Proceed IFP", description: "Request court fee waiver", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== MONTANA ====================
  "MT": {
    stateName: "Montana",
    courtWebsite: "https://courts.mt.gov",
    selfHelpUrl: "https://courts.mt.gov/selfhelp",
    forms: {
      "family": [
        { formNumber: "DR-201", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://courts.mt.gov/selfhelp/forms", category: "Divorce", feeAmount: "$170", feeWaiverAvailable: true },
        { formNumber: "TRO Petition", name: "Petition for Temporary Order", description: "Temporary restraining order", url: "https://courts.mt.gov/selfhelp/forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Complaint", description: "Small claims (up to $7,000)", url: "https://courts.mt.gov/selfhelp/smallclaims", category: "Filing", feeAmount: "$30-$70", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://uid.dli.mt.gov/", category: "Unemployment" },
        { formNumber: "HRB Complaint", name: "Human Rights Bureau Complaint", description: "Employment discrimination", url: "https://erd.dli.mt.gov/human-rights", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Possession", description: "Eviction lawsuit", url: "https://courts.mt.gov/selfhelp/forms", category: "Eviction", feeAmount: "$70", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://courts.mt.gov/selfhelp/forms", category: "Expungement", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application to Waive Filing Fee", description: "Request court fee waiver", url: "https://courts.mt.gov/selfhelp/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NEBRASKA ====================
  "NE": {
    stateName: "Nebraska",
    courtWebsite: "https://supremecourt.nebraska.gov",
    selfHelpUrl: "https://supremecourt.nebraska.gov/self-help",
    forms: {
      "family": [
        { formNumber: "DC 6:1", name: "Complaint for Dissolution", description: "Start divorce proceedings", url: "https://supremecourt.nebraska.gov/self-help/families-background-categories/divorce", category: "Divorce", feeAmount: "$158", feeWaiverAvailable: true },
        { formNumber: "Protection Order", name: "Petition for Protection Order", description: "Domestic abuse protection", url: "https://supremecourt.nebraska.gov/self-help/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $3,600)", url: "https://supremecourt.nebraska.gov/self-help/small-claims", category: "Filing", feeAmount: "$26-$53", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "NDOL Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dol.nebraska.gov/UIBenefits", category: "Unemployment" },
        { formNumber: "NEOC Complaint", name: "Equal Opportunity Complaint", description: "Employment discrimination", url: "https://neoc.nebraska.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Restitution", description: "Eviction lawsuit", url: "https://supremecourt.nebraska.gov/self-help/", category: "Eviction", feeAmount: "$47", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Set Aside", name: "Motion to Set Aside Conviction", description: "Clear eligible records", url: "https://supremecourt.nebraska.gov/self-help/", category: "Set Aside", feeAmount: "$25" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://supremecourt.nebraska.gov/self-help/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NEVADA ====================
  "NV": {
    stateName: "Nevada",
    courtWebsite: "https://nvcourts.gov",
    selfHelpUrl: "https://selfhelp.nvcourts.gov",
    forms: {
      "family": [
        { formNumber: "Joint Petition", name: "Joint Petition for Divorce", description: "Uncontested divorce", url: "https://selfhelp.nvcourts.gov/self-help/divorce", category: "Divorce", feeAmount: "$299-$450", feeWaiverAvailable: true },
        { formNumber: "Complaint for Divorce", name: "Complaint for Divorce", description: "Contested divorce", url: "https://selfhelp.nvcourts.gov/self-help/divorce", category: "Divorce", feeAmount: "$299-$450", feeWaiverAvailable: true },
        { formNumber: "TPO Application", name: "Application for TPO", description: "Temporary protection order", url: "https://selfhelp.nvcourts.gov/self-help/protection-orders", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Affidavit", description: "Small claims (up to $10,000)", url: "https://selfhelp.nvcourts.gov/self-help/small-claims", category: "Filing", feeAmount: "$85-$125", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DETR Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://ui.nv.gov/", category: "Unemployment" },
        { formNumber: "NERC Complaint", name: "Equal Rights Complaint", description: "Employment discrimination", url: "https://detr.nv.gov/NERC", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Landlord Complaint for Eviction", description: "Eviction lawsuit", url: "https://selfhelp.nvcourts.gov/self-help/eviction", category: "Eviction", feeAmount: "$71-$225", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Record Seal", name: "Petition to Seal Records", description: "Seal criminal records", url: "https://selfhelp.nvcourts.gov/self-help/sealing-records", category: "Record Sealing", feeAmount: "$0-$104" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Fee Waiver", description: "Request court fee waiver", url: "https://selfhelp.nvcourts.gov/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NEW HAMPSHIRE ====================
  "NH": {
    stateName: "New Hampshire",
    courtWebsite: "https://www.courts.nh.gov",
    selfHelpUrl: "https://www.courts.nh.gov/self-help",
    forms: {
      "family": [
        { formNumber: "NHJB-2025-F", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.courts.nh.gov/forms", category: "Divorce", feeAmount: "$252", feeWaiverAvailable: true },
        { formNumber: "NHJB-2148-DFPS", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://www.courts.nh.gov/forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "NHJB-2046-Se", name: "Statement of Claim", description: "Small claims (up to $10,000)", url: "https://www.courts.nh.gov/forms", category: "Filing", feeAmount: "$65-$165", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "NHES Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.nhes.nh.gov/", category: "Unemployment" },
        { formNumber: "HRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://www.nh.gov/hrc/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Landlord Writ", description: "Eviction lawsuit", url: "https://www.courts.nh.gov/forms", category: "Eviction", feeAmount: "$90", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Annulment", name: "Petition for Annulment", description: "Clear criminal records", url: "https://www.courts.nh.gov/forms", category: "Annulment", feeAmount: "$254" },
      ],
      "general": [
        { formNumber: "NHJB-2123-Se", name: "Motion to Waive Fees", description: "Request court fee waiver", url: "https://www.courts.nh.gov/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NEW MEXICO ====================
  "NM": {
    stateName: "New Mexico",
    courtWebsite: "https://www.nmcourts.gov",
    selfHelpUrl: "https://www.nmcourts.gov/self-help/",
    forms: {
      "family": [
        { formNumber: "4-501", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://metro.nmcourts.gov/filing-your-case-without-attorney.aspx", category: "Divorce", feeAmount: "$137", feeWaiverAvailable: true },
        { formNumber: "4-961", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.nmcourts.gov/self-help/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Metropolitan Small Claims", name: "Complaint", description: "Small claims (up to $10,000)", url: "https://metro.nmcourts.gov/metropolitan-court-divisions/small-claims.aspx", category: "Filing", feeAmount: "$35-$65", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "NMDWS Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.dws.state.nm.us/Unemployment-Insurance", category: "Unemployment" },
        { formNumber: "HRB Complaint", name: "Human Rights Bureau Complaint", description: "Employment discrimination", url: "https://www.dws.state.nm.us/human-rights", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Owner's Petition for Restitution", description: "Eviction lawsuit", url: "https://metro.nmcourts.gov/", category: "Eviction", feeAmount: "$35-$65", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.nmcourts.gov/self-help/", category: "Expungement", feeAmount: "Free" },
      ],
      "general": [
        { formNumber: "4-222", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://www.nmcourts.gov/self-help/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== NORTH DAKOTA ====================
  "ND": {
    stateName: "North Dakota",
    courtWebsite: "https://www.ndcourts.gov",
    selfHelpUrl: "https://www.ndcourts.gov/legal-self-help",
    forms: {
      "family": [
        { formNumber: "SFN 54023", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.ndcourts.gov/legal-self-help/divorce", category: "Divorce", feeAmount: "$80", feeWaiverAvailable: true },
        { formNumber: "Protection Order", name: "Petition for Protection Order", description: "Domestic violence protection", url: "https://www.ndcourts.gov/legal-self-help/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $15,000)", url: "https://www.ndcourts.gov/legal-self-help/small-claims", category: "Filing", feeAmount: "$20-$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "JSND Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.jobsnd.com/unemployment-insurance", category: "Unemployment" },
        { formNumber: "HRD Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://www.nd.gov/labor/human-rights/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.ndcourts.gov/legal-self-help/", category: "Eviction", feeAmount: "$80", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Sealing", description: "Seal eligible records", url: "https://www.ndcourts.gov/legal-self-help/", category: "Record Sealing", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application to Waive Fees", description: "Request court fee waiver", url: "https://www.ndcourts.gov/legal-self-help/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== OKLAHOMA ====================
  "OK": {
    stateName: "Oklahoma",
    courtWebsite: "https://www.oscn.net",
    selfHelpUrl: "https://oklaw.org",
    forms: {
      "family": [
        { formNumber: "Petition for Divorce", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.oscn.net/forms/", category: "Divorce", feeAmount: "$181", feeWaiverAvailable: true },
        { formNumber: "VPO Petition", name: "Petition for Protective Order", description: "Victim protective order", url: "https://www.oscn.net/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $10,000)", url: "https://www.oscn.net/forms/", category: "Filing", feeAmount: "$58-$153", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "OESC Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://oesc.ok.gov/", category: "Unemployment" },
        { formNumber: "AG Civil Rights", name: "Attorney General Civil Rights", description: "Employment discrimination", url: "https://www.oag.ok.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.oscn.net/forms/", category: "Eviction", feeAmount: "$58", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Application for Expungement", description: "Clear eligible records", url: "https://www.oscn.net/forms/", category: "Expungement", feeAmount: "$150" },
      ],
      "general": [
        { formNumber: "Pauper's Affidavit", name: "Application to Proceed as Pauper", description: "Request court fee waiver", url: "https://www.oscn.net/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== OREGON ====================
  "OR": {
    stateName: "Oregon",
    courtWebsite: "https://www.courts.oregon.gov",
    selfHelpUrl: "https://www.courts.oregon.gov/programs/sflp",
    forms: {
      "family": [
        { formNumber: "Petition for Dissolution", name: "Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.courts.oregon.gov/forms/Pages/family.aspx", category: "Divorce", feeAmount: "$301", feeWaiverAvailable: true },
        { formNumber: "FAPA Petition", name: "Petition for FAPA Restraining Order", description: "Family abuse prevention", url: "https://www.courts.oregon.gov/forms/Pages/restraining-orders.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Claim Form", description: "Small claims (up to $10,000)", url: "https://www.courts.oregon.gov/forms/Pages/small-claims.aspx", category: "Filing", feeAmount: "$37-$68", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "OED Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://unemployment.oregon.gov/", category: "Unemployment" },
        { formNumber: "BOLI Complaint", name: "Civil Rights Division Complaint", description: "Employment discrimination", url: "https://www.oregon.gov/boli/civil-rights/Pages/default.aspx", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "FED", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.courts.oregon.gov/forms/Pages/landlord-tenant.aspx", category: "Eviction", feeAmount: "$93", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Set Aside Motion", name: "Motion to Set Aside Conviction", description: "Clear eligible records", url: "https://www.courts.oregon.gov/forms/Pages/default.aspx", category: "Set Aside", feeAmount: "$281" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Fee Waiver/Deferral", description: "Request court fee waiver", url: "https://www.courts.oregon.gov/forms/Pages/fee-waiver.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== RHODE ISLAND ====================
  "RI": {
    stateName: "Rhode Island",
    courtWebsite: "https://www.courts.ri.gov",
    selfHelpUrl: "https://www.courts.ri.gov/PublicResources/selfhelpcenter/",
    forms: {
      "family": [
        { formNumber: "DR-3", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.ri.gov/Courts/familycourt/Pages/forms.aspx", category: "Divorce", feeAmount: "$160", feeWaiverAvailable: true },
        { formNumber: "Protection Order", name: "Petition for Protection Order", description: "Domestic violence protection", url: "https://www.courts.ri.gov/Courts/districtcourt/Pages/restrainingorder.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $2,500)", url: "https://www.courts.ri.gov/Courts/districtcourt/Pages/smallclaims.aspx", category: "Filing", feeAmount: "$30-$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLT Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dlt.ri.gov/individuals/unemployment-insurance", category: "Unemployment" },
        { formNumber: "RICHR Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://richr.ri.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.courts.ri.gov/", category: "Eviction", feeAmount: "$30-$50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Motion for Expungement", description: "Clear eligible records", url: "https://www.courts.ri.gov/", category: "Expungement", feeAmount: "$100" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application for IFP Status", description: "Request court fee waiver", url: "https://www.courts.ri.gov/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== SOUTH CAROLINA ====================
  "SC": {
    stateName: "South Carolina",
    courtWebsite: "https://www.sccourts.org",
    selfHelpUrl: "https://www.sclegal.org",
    forms: {
      "family": [
        { formNumber: "SCCA 400", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.sccourts.org/forms/", category: "Divorce", feeAmount: "$150", feeWaiverAvailable: true },
        { formNumber: "SCCA 306", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.sccourts.org/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Magistrate Court", name: "Civil Summons and Complaint", description: "Small claims (up to $7,500)", url: "https://www.sccourts.org/forms/", category: "Filing", feeAmount: "$40-$80", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DEW Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dew.sc.gov/", category: "Unemployment" },
        { formNumber: "SCHAC Complaint", name: "Human Affairs Complaint", description: "Employment discrimination", url: "https://www.schac.sc.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Summons and Complaint (Ejectment)", description: "Eviction lawsuit", url: "https://www.sccourts.org/forms/", category: "Eviction", feeAmount: "$40", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Application for Expungement", description: "Clear eligible records", url: "https://www.sccourts.org/forms/", category: "Expungement", feeAmount: "$250" },
      ],
      "general": [
        { formNumber: "SCCA 100", name: "Application for Fee Waiver", description: "Request court fee waiver", url: "https://www.sccourts.org/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== SOUTH DAKOTA ====================
  "SD": {
    stateName: "South Dakota",
    courtWebsite: "https://ujs.sd.gov",
    selfHelpUrl: "https://ujs.sd.gov/Self_Help/",
    forms: {
      "family": [
        { formNumber: "UJS-102", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://ujs.sd.gov/Forms/", category: "Divorce", feeAmount: "$95", feeWaiverAvailable: true },
        { formNumber: "Protection Order", name: "Petition for Protection Order", description: "Domestic abuse protection", url: "https://ujs.sd.gov/Self_Help/protection_orders.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $12,000)", url: "https://ujs.sd.gov/Self_Help/small_claims.aspx", category: "Filing", feeAmount: "$40-$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLR Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dlr.sd.gov/ra/", category: "Unemployment" },
        { formNumber: "HRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://dlr.sd.gov/human_rights/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://ujs.sd.gov/Forms/", category: "Eviction", feeAmount: "$70", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://ujs.sd.gov/Forms/", category: "Expungement", feeAmount: "$0-$50" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://ujs.sd.gov/Forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== TENNESSEE ====================
  "TN": {
    stateName: "Tennessee",
    courtWebsite: "https://www.tncourts.gov",
    selfHelpUrl: "https://www.justiceforalltn.org",
    forms: {
      "family": [
        { formNumber: "Complaint for Divorce", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.tncourts.gov/forms", category: "Divorce", feeAmount: "$184-$350", feeWaiverAvailable: true },
        { formNumber: "Order of Protection", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.tncourts.gov/forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "General Sessions", name: "Civil Warrant", description: "Small claims (up to $25,000)", url: "https://www.tncourts.gov/forms", category: "Filing", feeAmount: "$50-$125", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "TDLWD Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://www.jobs4tn.gov/", category: "Unemployment" },
        { formNumber: "THRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://www.tn.gov/humanrights/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Detainer Warrant", name: "Detainer Warrant", description: "Eviction lawsuit", url: "https://www.tncourts.gov/forms", category: "Eviction", feeAmount: "$50-$87", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.tncourts.gov/forms", category: "Expungement", feeAmount: "$100-$450" },
      ],
      "general": [
        { formNumber: "Pauper's Oath", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.tncourts.gov/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== UTAH ====================
  "UT": {
    stateName: "Utah",
    courtWebsite: "https://www.utcourts.gov",
    selfHelpUrl: "https://www.utcourts.gov/selfhelp/",
    forms: {
      "family": [
        { formNumber: "Petition for Divorce", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.utcourts.gov/howto/family/divorce/", category: "Divorce", feeAmount: "$330", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Cohabitant abuse protection", url: "https://www.utcourts.gov/howto/protective/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $11,000)", url: "https://www.utcourts.gov/howto/smallclaims/", category: "Filing", feeAmount: "$60-$185", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://jobs.utah.gov/ui/", category: "Unemployment" },
        { formNumber: "UALD Complaint", name: "Labor Division Complaint", description: "Employment discrimination", url: "https://laborcommission.utah.gov/divisions/antidiscrimination-labor-division/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.utcourts.gov/howto/landlord/", category: "Eviction", feeAmount: "$55-$400", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://bci.utah.gov/expungements/", category: "Expungement", feeAmount: "$65-$135" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Motion to Waive Fees", description: "Request court fee waiver", url: "https://www.utcourts.gov/howto/filing/feewaiver/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== VERMONT ====================
  "VT": {
    stateName: "Vermont",
    courtWebsite: "https://www.vermontjudiciary.org",
    selfHelpUrl: "https://www.vermontjudiciary.org/self-help",
    forms: {
      "family": [
        { formNumber: "400", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.vermontjudiciary.org/self-help/divorce", category: "Divorce", feeAmount: "$295", feeWaiverAvailable: true },
        { formNumber: "RFA", name: "Petition for Relief from Abuse", description: "Domestic violence protection", url: "https://www.vermontjudiciary.org/self-help/abuse-prevention", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $5,000)", url: "https://www.vermontjudiciary.org/self-help/small-claims", category: "Filing", feeAmount: "$75-$150", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "VDOL Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://labor.vermont.gov/unemployment-insurance", category: "Unemployment" },
        { formNumber: "HRC Complaint", name: "Human Rights Complaint", description: "Employment discrimination", url: "https://hrc.vermont.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Ejectment Complaint", description: "Eviction lawsuit", url: "https://www.vermontjudiciary.org/self-help/landlord-tenant", category: "Eviction", feeAmount: "$295", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.vermontjudiciary.org/", category: "Expungement", feeAmount: "$90" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Waiver of Filing Fees", description: "Request court fee waiver", url: "https://www.vermontjudiciary.org/self-help/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== WEST VIRGINIA ====================
  "WV": {
    stateName: "West Virginia",
    courtWebsite: "https://www.courtswv.gov",
    selfHelpUrl: "https://www.lawv.net",
    forms: {
      "family": [
        { formNumber: "SCA-FC-100", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.courtswv.gov/lower-courts/family-court/", category: "Divorce", feeAmount: "$175", feeWaiverAvailable: true },
        { formNumber: "DV-1", name: "Petition for Protective Order", description: "Domestic violence protection", url: "https://www.courtswv.gov/lower-courts/family-court/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Magistrate Civil", name: "Civil Complaint", description: "Magistrate court (up to $10,000)", url: "https://www.courtswv.gov/lower-courts/magistrate-court/", category: "Filing", feeAmount: "$30-$70", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "WC Claim", name: "Unemployment Compensation Claim", description: "Apply for unemployment", url: "https://workforcewv.org/", category: "Unemployment" },
        { formNumber: "HRC Complaint", name: "Human Rights Commission Complaint", description: "Employment discrimination", url: "https://hrc.wv.gov/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Wrongful Occupation Complaint", description: "Eviction lawsuit", url: "https://www.courtswv.gov/lower-courts/magistrate-court/", category: "Eviction", feeAmount: "$30-$45", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.courtswv.gov/", category: "Expungement", feeAmount: "$50" },
      ],
      "general": [
        { formNumber: "IFP", name: "Affidavit for IFP Status", description: "Request court fee waiver", url: "https://www.courtswv.gov/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== WISCONSIN ====================
  "WI": {
    stateName: "Wisconsin",
    courtWebsite: "https://www.wicourts.gov",
    selfHelpUrl: "https://www.wicourts.gov/services/public/selfhelp/",
    forms: {
      "family": [
        { formNumber: "FA-4110V", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=19", category: "Divorce", feeAmount: "$184.50", feeWaiverAvailable: true },
        { formNumber: "FA-4114VA", name: "Petition for TRO/Injunction", description: "Domestic abuse protection", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=1", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-500", name: "Claim", description: "Small claims (up to $10,000)", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=50", category: "Filing", feeAmount: "$94.50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWD Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dwd.wisconsin.gov/ui/", category: "Unemployment" },
        { formNumber: "ERD Complaint", name: "Equal Rights Complaint", description: "Employment discrimination", url: "https://dwd.wisconsin.gov/er/civilrights/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "SC-505", name: "Eviction - Summons and Complaint", description: "Eviction lawsuit", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=50", category: "Eviction", feeAmount: "$94.50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "CR-230", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=43", category: "Expungement", feeAmount: "$0" },
      ],
      "general": [
        { formNumber: "GF-180", name: "Petition for Waiver of Fees", description: "Request court fee waiver", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=25", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ==================== WYOMING ====================
  "WY": {
    stateName: "Wyoming",
    courtWebsite: "https://www.courts.state.wy.us",
    selfHelpUrl: "https://www.courts.state.wy.us/self-help-center/",
    forms: {
      "family": [
        { formNumber: "Complaint for Divorce", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.state.wy.us/court-rules-and-forms/standard-family-court-forms/", category: "Divorce", feeAmount: "$85", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Order of Protection", description: "Domestic violence protection", url: "https://www.courts.state.wy.us/court-rules-and-forms/standard-family-court-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Statement of Claim", description: "Small claims (up to $6,000)", url: "https://www.courts.state.wy.us/self-help-center/", category: "Filing", feeAmount: "$20-$40", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment", url: "https://dws.wyo.gov/workforce-services/unemployment-insurance/", category: "Unemployment" },
        { formNumber: "DWS Civil Rights", name: "Civil Rights Complaint", description: "Employment discrimination", url: "https://dws.wyo.gov/workforce-services/labor-standards/", category: "Discrimination", feeAmount: "Free" },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.courts.state.wy.us/self-help-center/", category: "Eviction", feeAmount: "$55", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Petition for Expungement", description: "Clear eligible records", url: "https://www.courts.state.wy.us/", category: "Expungement", feeAmount: "$50-$100" },
      ],
      "general": [
        { formNumber: "IFP", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://www.courts.state.wy.us/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },
};

export function getAdditionalStateData(stateCode: string): StateFormsData | undefined {
  return additionalStatesFormsLibrary[stateCode];
}
