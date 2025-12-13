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
};

export function getAdditionalStateData(stateCode: string): StateFormsData | undefined {
  return additionalStatesFormsLibrary[stateCode];
}
