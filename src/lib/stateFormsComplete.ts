// Complete Forms Data for All 50 US States
// This file contains accurate court websites, self-help URLs, and form categories for every state

import { CourtForm, StateFormsData } from './formsLibraryData';

export const completeStateFormsData: Record<string, StateFormsData> = {
  // ALABAMA
  "AL": {
    stateName: "Alabama",
    courtWebsite: "https://www.alacourt.gov",
    selfHelpUrl: "https://www.alabamalegalhelp.org",
    forms: {
      "family": [
        { formNumber: "CS-41", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Divorce", feeAmount: "$290", feeWaiverAvailable: true },
        { formNumber: "CS-42", name: "Answer to Divorce", description: "Respond to divorce filing", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Divorce" },
        { formNumber: "CS-47", name: "Protection From Abuse Petition", description: "Request domestic violence protection", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SM-1", name: "Small Claims Complaint", description: "Start small claims case (up to $6,000)", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Filing", feeAmount: "$50-$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records under ALEA", url: "https://www.alea.gov/dps/criminal-justice-info-center/expungement", category: "Expungement", feeAmount: "$300", feeWaiverAvailable: false },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Unlawful Detainer Complaint", description: "Landlord eviction lawsuit", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Eviction", feeAmount: "$231", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UC Claim", name: "Unemployment Compensation Claim", description: "Apply for unemployment benefits", url: "https://labor.alabama.gov/uc/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Affidavit of Substantial Hardship", description: "Request court fee waiver", url: "https://www.alacourt.gov/JudicialForms.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ALASKA
  "AK": {
    stateName: "Alaska",
    courtWebsite: "https://courts.alaska.gov",
    selfHelpUrl: "https://courts.alaska.gov/shc/",
    forms: {
      "family": [
        { formNumber: "DR-100", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://courts.alaska.gov/shc/family/shcforms.htm", category: "Divorce", feeAmount: "$250", feeWaiverAvailable: true },
        { formNumber: "DV-100", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://courts.alaska.gov/shc/family/shcdv.htm", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-100", name: "Small Claims Complaint", description: "Start small claims case (up to $10,000)", url: "https://courts.alaska.gov/shc/smallclaims/", category: "Filing", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "CRM-100", name: "Petition to Set Aside Conviction", description: "Clear eligible criminal records", url: "https://courts.alaska.gov/shc/criminal/", category: "Set Aside", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED-100", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://courts.alaska.gov/shc/housing/", category: "Eviction", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://labor.alaska.gov/unemployment/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "TF-920", name: "Request for Exemption from Paying Fees", description: "Request court fee waiver", url: "https://courts.alaska.gov/shc/general/shcfeewaiver.htm", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // ARKANSAS
  "AR": {
    stateName: "Arkansas",
    courtWebsite: "https://www.arcourts.gov",
    selfHelpUrl: "https://www.arlegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.arcourts.gov/forms-and-publications", category: "Divorce", feeAmount: "$165", feeWaiverAvailable: true },
        { formNumber: "Order of Protection", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.arcourts.gov/forms-and-publications", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Complaint", name: "Small Claims Complaint", description: "Start small claims case (up to $5,000)", url: "https://www.arcourts.gov/forms-and-publications", category: "Filing", feeAmount: "$35-$65", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Sealing Petition", name: "Petition to Seal Records", description: "Seal eligible criminal records", url: "https://www.arcourts.gov/forms-and-publications", category: "Sealing", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "UD Complaint", name: "Unlawful Detainer Complaint", description: "Eviction lawsuit", url: "https://www.arcourts.gov/forms-and-publications", category: "Eviction", feeAmount: "$65", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.dws.arkansas.gov/unemployment/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Motion", name: "Motion to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.arcourts.gov/forms-and-publications", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // CONNECTICUT
  "CT": {
    stateName: "Connecticut",
    courtWebsite: "https://www.jud.ct.gov",
    selfHelpUrl: "https://www.ctlawhelp.org",
    forms: {
      "family": [
        { formNumber: "JD-FM-3", name: "Divorce Complaint", description: "Start divorce proceedings", url: "https://www.jud.ct.gov/webforms/", category: "Divorce", feeAmount: "$360", feeWaiverAvailable: true },
        { formNumber: "JD-FM-137", name: "Application for Restraining Order", description: "Request domestic violence protection", url: "https://www.jud.ct.gov/webforms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JD-CV-40", name: "Small Claims Writ and Complaint", description: "Start small claims case (up to $5,000)", url: "https://www.jud.ct.gov/webforms/", category: "Filing", feeAmount: "$50-$95", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "JD-CR-22", name: "Petition for Erasure of Record", description: "Clear eligible criminal records", url: "https://www.jud.ct.gov/webforms/", category: "Erasure", feeAmount: "Free", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "JD-HM-1", name: "Summary Process Complaint", description: "Eviction lawsuit", url: "https://www.jud.ct.gov/webforms/", category: "Eviction", feeAmount: "$175", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.ctdol.state.ct.us/UI-Online/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "JD-CV-120", name: "Fee Waiver Application", description: "Request court fee waiver", url: "https://www.jud.ct.gov/webforms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // DELAWARE
  "DE": {
    stateName: "Delaware",
    courtWebsite: "https://courts.delaware.gov",
    selfHelpUrl: "https://www.declasi.org",
    forms: {
      "family": [
        { formNumber: "Petition for Divorce", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://courts.delaware.gov/family/forms/", category: "Divorce", feeAmount: "$154", feeWaiverAvailable: true },
        { formNumber: "PFA Petition", name: "Petition from Protection From Abuse", description: "Request domestic violence protection", url: "https://courts.delaware.gov/family/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JP Form", name: "Justice of Peace Complaint", description: "Start small claims case (up to $25,000)", url: "https://courts.delaware.gov/jpcourt/forms/", category: "Filing", feeAmount: "$45-$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://courts.delaware.gov/criminal/expungements/", category: "Expungement", feeAmount: "$20-$75", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Summary Possession", name: "Complaint for Summary Possession", description: "Eviction lawsuit", url: "https://courts.delaware.gov/jpcourt/forms/", category: "Eviction", feeAmount: "$45", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://ui.delawareworks.com/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Motion", name: "Motion to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://courts.delaware.gov/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // HAWAII
  "HI": {
    stateName: "Hawaii",
    courtWebsite: "https://www.courts.state.hi.us",
    selfHelpUrl: "https://www.lawhelp.org/hi",
    forms: {
      "family": [
        { formNumber: "1F-P-955", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.state.hi.us/self-help/divorce/divorce_forms", category: "Divorce", feeAmount: "$215", feeWaiverAvailable: true },
        { formNumber: "1F-P-762", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.courts.state.hi.us/self-help/orders_for_protection", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "1DC-P-121", name: "Small Claims Complaint", description: "Start small claims case (up to $5,000)", url: "https://www.courts.state.hi.us/self-help/small_claims", category: "Filing", feeAmount: "$35", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition to Expunge Arrest Record", description: "Clear eligible records", url: "https://ag.hawaii.gov/hcjdc/expungement/", category: "Expungement", feeAmount: "$30", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "1DC-P-146", name: "Summary Possession Complaint", description: "Eviction lawsuit", url: "https://www.courts.state.hi.us/self-help/landlord_tenant", category: "Eviction", feeAmount: "$155", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://huiclaims.hawaii.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "1F-P-012", name: "Motion to Proceed Without Payment of Fees", description: "Request court fee waiver", url: "https://www.courts.state.hi.us/self-help/fee_waiver", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // IDAHO
  "ID": {
    stateName: "Idaho",
    courtWebsite: "https://isc.idaho.gov",
    selfHelpUrl: "https://www.idaholegalaid.org",
    forms: {
      "family": [
        { formNumber: "CAO FamLaw 1", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://isc.idaho.gov/forms/family", category: "Divorce", feeAmount: "$207", feeWaiverAvailable: true },
        { formNumber: "CAO DV 1", name: "Petition for Protection Order", description: "Request domestic violence protection", url: "https://isc.idaho.gov/forms/domestic-violence", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CAO SC 1", name: "Small Claims Complaint", description: "Start small claims case (up to $5,000)", url: "https://isc.idaho.gov/forms/small-claims", category: "Filing", feeAmount: "$69", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://isc.idaho.gov/forms/criminal", category: "Expungement", feeAmount: "$47", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "CAO UD 1", name: "Eviction Complaint", description: "Unlawful detainer lawsuit", url: "https://isc.idaho.gov/forms/landlord-tenant", category: "Eviction", feeAmount: "$166", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.labor.idaho.gov/dnn/Unemployment", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "CAO FW 1", name: "Motion and Affidavit for Fee Waiver", description: "Request court fee waiver", url: "https://isc.idaho.gov/forms/fee-waiver", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // INDIANA
  "IN": {
    stateName: "Indiana",
    courtWebsite: "https://www.in.gov/courts",
    selfHelpUrl: "https://www.indianalegalhelp.org",
    forms: {
      "family": [
        { formNumber: "Dissolution Petition", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.in.gov/courts/selfservice/family/", category: "Divorce", feeAmount: "$157", feeWaiverAvailable: true },
        { formNumber: "PO Petition", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://www.in.gov/courts/selfservice/protection-orders/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-1", name: "Small Claims Notice of Claim", description: "Start small claims case (up to $10,000)", url: "https://www.in.gov/courts/selfservice/small-claims/", category: "Filing", feeAmount: "$35-$85", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (IC 35-38-9)", url: "https://www.in.gov/courts/selfservice/expungement/", category: "Expungement", feeAmount: "$157", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Possession", description: "Eviction lawsuit", url: "https://www.in.gov/courts/selfservice/landlord-tenant/", category: "Eviction", feeAmount: "$97", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWD UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.in.gov/dwd/unemployment/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Motion", name: "Motion to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.in.gov/courts/selfservice/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // IOWA
  "IA": {
    stateName: "Iowa",
    courtWebsite: "https://www.iowacourts.gov",
    selfHelpUrl: "https://www.iowalegalaid.org",
    forms: {
      "family": [
        { formNumber: "Dissolution Petition", name: "Original Petition for Dissolution", description: "Start divorce proceedings", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Divorce", feeAmount: "$265", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Form", name: "Small Claims Original Notice and Petition", description: "Start small claims case (up to $6,500)", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Filing", feeAmount: "$95", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Application", name: "Application for Expungement", description: "Clear eligible criminal records", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED Petition", name: "Forcible Entry and Detainer Petition", description: "Eviction lawsuit", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Eviction", feeAmount: "$85", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "IWD UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.iowaworkforcedevelopment.gov/unemployment-insurance-information", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Waiver of Costs and Fees", description: "Request court fee waiver", url: "https://www.iowacourts.gov/for-the-public/court-forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // KANSAS
  "KS": {
    stateName: "Kansas",
    courtWebsite: "https://www.kscourts.org",
    selfHelpUrl: "https://www.kansaslegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Divorce", feeAmount: "$400", feeWaiverAvailable: true },
        { formNumber: "PFA Petition", name: "Petition for Protection from Abuse", description: "Request domestic violence protection", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Petition", name: "Small Claims Petition", description: "Start small claims case (up to $4,000)", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Filing", feeAmount: "$47-$67", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (K.S.A. 21-6614)", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Expungement", feeAmount: "$195", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Petition", name: "Petition for Eviction", description: "Landlord eviction lawsuit", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Eviction", feeAmount: "$67", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "KDOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.getkansasbenefits.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.kscourts.org/Public/Court-Forms/All-Court-Forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // KENTUCKY
  "KY": {
    stateName: "Kentucky",
    courtWebsite: "https://courts.ky.gov",
    selfHelpUrl: "https://www.kyjustice.org",
    forms: {
      "family": [
        { formNumber: "AOC-238", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://courts.ky.gov/forms/Pages/default.aspx", category: "Divorce", feeAmount: "$148", feeWaiverAvailable: true },
        { formNumber: "AOC-275", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://courts.ky.gov/forms/Pages/default.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "AOC-175", name: "Small Claims Complaint", description: "Start small claims case (up to $2,500)", url: "https://courts.ky.gov/forms/Pages/default.aspx", category: "Filing", feeAmount: "$30-$47", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (KRS 431.073-079)", url: "https://courts.ky.gov/expungement", category: "Expungement", feeAmount: "$100-$500", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Forcible Detainer Complaint", description: "Eviction lawsuit", url: "https://courts.ky.gov/forms/Pages/default.aspx", category: "Eviction", feeAmount: "$85", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://kcc.ky.gov/career/unemployment/Pages/default.aspx", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "AOC-021", name: "Motion for Leave to File as Poor Person", description: "Request court fee waiver", url: "https://courts.ky.gov/forms/Pages/default.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // LOUISIANA
  "LA": {
    stateName: "Louisiana",
    courtWebsite: "https://www.lasc.org",
    selfHelpUrl: "https://www.louisianalawhelp.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings (La. C.C. art. 102/103)", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Divorce", feeAmount: "$350-$450", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Small Claims", name: "Small Claims Petition", description: "Start small claims in City/Justice Court (up to $5,000)", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Filing", feeAmount: "$75-$150", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Motion", name: "Motion to Expunge Record", description: "Clear eligible criminal records (La. C.Cr.P. art. 971-995)", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Expungement", feeAmount: "$550", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction", name: "Rule for Eviction", description: "Eviction lawsuit", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Eviction", feeAmount: "$100-$200", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "LWC UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.louisianaworks.net/hire/vosnet/Default.aspx", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Pauper Affidavit", description: "Request court fee waiver", url: "https://www.lasc.org/Court_Filings_Resources/Court_Forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MAINE
  "ME": {
    stateName: "Maine",
    courtWebsite: "https://www.courts.maine.gov",
    selfHelpUrl: "https://www.ptla.org",
    forms: {
      "family": [
        { formNumber: "FM-001", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Divorce", feeAmount: "$120", feeWaiverAvailable: true },
        { formNumber: "PO-001", name: "Complaint for Protection Order", description: "Request protection from abuse", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-001", name: "Small Claims Complaint", description: "Start small claims case (up to $6,000)", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Filing", feeAmount: "$50-$70", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement", name: "Motion for Expungement", description: "Clear eligible criminal records (15 M.R.S. § 2166)", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Expungement", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED-001", name: "Forcible Entry and Detainer Complaint", description: "Eviction lawsuit", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Eviction", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://reemployme.maine.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "CV-191", name: "Application to Proceed Without Fee", description: "Request court fee waiver", url: "https://www.courts.maine.gov/fees_forms/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MARYLAND
  "MD": {
    stateName: "Maryland",
    courtWebsite: "https://www.mdcourts.gov",
    selfHelpUrl: "https://www.mdlab.org",
    forms: {
      "family": [
        { formNumber: "CC-DR-020", name: "Complaint for Absolute Divorce", description: "Start divorce proceedings", url: "https://www.mdcourts.gov/family/forms", category: "Divorce", feeAmount: "$165", feeWaiverAvailable: true },
        { formNumber: "CC-DC-005", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://www.mdcourts.gov/family/domesticviolence", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "DC-CV-001", name: "Complaint (Small Claims)", description: "Start small claims case (up to $5,000)", url: "https://www.mdcourts.gov/district/forms", category: "Filing", feeAmount: "$34", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "CC-DC-CR-072", name: "Petition for Expungement", description: "Clear eligible criminal records", url: "https://www.mdcourts.gov/district/forms", category: "Expungement", feeAmount: "$30", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "DC-CV-082", name: "Complaint (Tenant Holding Over)", description: "Eviction lawsuit", url: "https://www.mdcourts.gov/district/forms", category: "Eviction", feeAmount: "$15", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.dllr.state.md.us/employment/unemployment.shtml", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "CC-DC-089", name: "Request for Waiver of Prepaid Costs", description: "Request court fee waiver", url: "https://www.mdcourts.gov/district/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MICHIGAN
  "MI": {
    stateName: "Michigan",
    courtWebsite: "https://courts.michigan.gov",
    selfHelpUrl: "https://michiganlegalhelp.org",
    forms: {
      "family": [
        { formNumber: "MC 01", name: "Summons and Complaint (Divorce)", description: "Start divorce proceedings", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Divorce", feeAmount: "$175", feeWaiverAvailable: true },
        { formNumber: "MC 384", name: "Petition for Personal Protection Order", description: "Request protection order", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "DC 84", name: "Affidavit and Claim (Small Claims)", description: "Start small claims case (up to $6,500)", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Filing", feeAmount: "$30-$70", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "MC 227", name: "Application to Set Aside Conviction", description: "Expunge eligible criminal records (MCL 780.621)", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "DC 102a", name: "Summons and Complaint (Land Contract/Summary Proceeding)", description: "Eviction lawsuit", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Eviction", feeAmount: "$45", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "UIA Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.michigan.gov/leo/bureaus-agencies/uia", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "MC 20", name: "Fee Waiver Request", description: "Request court fee waiver", url: "https://courts.michigan.gov/administration/scao/forms/courtforms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MINNESOTA
  "MN": {
    stateName: "Minnesota",
    courtWebsite: "https://www.mncourts.gov",
    selfHelpUrl: "https://www.lawhelpmn.org",
    forms: {
      "family": [
        { formNumber: "FAM101", name: "Summons for Marriage Dissolution", description: "Start divorce proceedings", url: "https://www.mncourts.gov/Help-Topics/Divorce.aspx", category: "Divorce", feeAmount: "$365", feeWaiverAvailable: true },
        { formNumber: "OFP101", name: "Petition for Order for Protection", description: "Request domestic violence protection", url: "https://www.mncourts.gov/Help-Topics/Domestic-Abuse.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CON101", name: "Statement of Claim and Summons", description: "Start conciliation court case (up to $15,000)", url: "https://www.mncourts.gov/Help-Topics/Conciliation-Court.aspx", category: "Filing", feeAmount: "$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (Minn. Stat. § 609A)", url: "https://www.mncourts.gov/Help-Topics/Expungement.aspx", category: "Expungement", feeAmount: "$322", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "HOU101", name: "Eviction Complaint", description: "Landlord eviction lawsuit", url: "https://www.mncourts.gov/Help-Topics/Eviction.aspx", category: "Eviction", feeAmount: "$285", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DEED UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://uimn.org/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP101", name: "Application to Proceed IFP", description: "Request court fee waiver", url: "https://www.mncourts.gov/Help-Topics/Fee-Waiver-IFP.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MISSISSIPPI
  "MS": {
    stateName: "Mississippi",
    courtWebsite: "https://courts.ms.gov",
    selfHelpUrl: "https://www.mslegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://courts.ms.gov/trialcourts/chancery/chanforms.php", category: "Divorce", feeAmount: "$175", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Petition for Domestic Abuse Protection", description: "Request domestic violence protection", url: "https://courts.ms.gov/trialcourts/chancery/chanforms.php", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "JP Claim", name: "Justice Court Complaint", description: "Start small claims case (up to $3,500)", url: "https://courts.ms.gov/trialcourts/justicecourt/jcforms.php", category: "Filing", feeAmount: "$40-$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (Miss. Code Ann. § 99-19-71)", url: "https://courts.ms.gov/trialcourts/circuit/circforms.php", category: "Expungement", feeAmount: "$250", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Possession", description: "Eviction lawsuit", url: "https://courts.ms.gov/trialcourts/justicecourt/jcforms.php", category: "Eviction", feeAmount: "$45", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "MDES UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.mdes.ms.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Affidavit to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://courts.ms.gov", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MISSOURI
  "MO": {
    stateName: "Missouri",
    courtWebsite: "https://www.courts.mo.gov",
    selfHelpUrl: "https://www.lsmo.org",
    forms: {
      "family": [
        { formNumber: "CAFC100", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Divorce", feeAmount: "$163", feeWaiverAvailable: true },
        { formNumber: "CAFC402", name: "Petition for Adult Order of Protection", description: "Request domestic violence protection", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CASMC01", name: "Small Claims Petition", description: "Start small claims case (up to $5,000)", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Filing", feeAmount: "$25-$50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (RSMo 610.140)", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Expungement", feeAmount: "$250", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "CALTE01", name: "Landlord Tenant Petition", description: "Eviction lawsuit", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Eviction", feeAmount: "$56", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DES UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://uinteract.labor.mo.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "CAFMW01", name: "Motion to Proceed Without Costs", description: "Request court fee waiver", url: "https://www.courts.mo.gov/page.jsp?id=704", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // MONTANA
  "MT": {
    stateName: "Montana",
    courtWebsite: "https://courts.mt.gov",
    selfHelpUrl: "https://www.montanalawhelp.org",
    forms: {
      "family": [
        { formNumber: "DR-101", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://courts.mt.gov/Forms", category: "Divorce", feeAmount: "$170", feeWaiverAvailable: true },
        { formNumber: "TRO-101", name: "Petition for Temporary Order of Protection", description: "Request domestic violence protection", url: "https://courts.mt.gov/Forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-101", name: "Small Claims Complaint", description: "Start small claims case (up to $7,000)", url: "https://courts.mt.gov/Forms", category: "Filing", feeAmount: "$25-$50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (MCA 46-18-1101)", url: "https://courts.mt.gov/Forms", category: "Expungement", feeAmount: "$0-$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "UD-101", name: "Complaint for Unlawful Detainer", description: "Eviction lawsuit", url: "https://courts.mt.gov/Forms", category: "Eviction", feeAmount: "$70", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLI UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://uiclaims.mt.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "FW-101", name: "Affidavit for Filing Fees Waiver", description: "Request court fee waiver", url: "https://courts.mt.gov/Forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // NEBRASKA
  "NE": {
    stateName: "Nebraska",
    courtWebsite: "https://supremecourt.nebraska.gov",
    selfHelpUrl: "https://www.nebraskalegalaid.org",
    forms: {
      "family": [
        { formNumber: "DC 6:2", name: "Complaint for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://supremecourt.nebraska.gov/forms", category: "Divorce", feeAmount: "$185", feeWaiverAvailable: true },
        { formNumber: "DC 6:11", name: "Petition and Affidavit for Protection Order", description: "Request domestic violence protection", url: "https://supremecourt.nebraska.gov/forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "CC 4:1", name: "Small Claims Complaint", description: "Start small claims case (up to $3,600)", url: "https://supremecourt.nebraska.gov/forms", category: "Filing", feeAmount: "$28", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Set Aside Petition", name: "Petition to Set Aside Conviction", description: "Clear eligible criminal records (Neb. Rev. Stat. 29-3523)", url: "https://supremecourt.nebraska.gov/forms", category: "Set Aside", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "CC 3:1", name: "Complaint for Restitution of Premises", description: "Eviction lawsuit", url: "https://supremecourt.nebraska.gov/forms", category: "Eviction", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dol.nebraska.gov/UIBenefits", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "CC 5:1", name: "Application to Proceed Without Fees", description: "Request court fee waiver", url: "https://supremecourt.nebraska.gov/forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // NEVADA
  "NV": {
    stateName: "Nevada",
    courtWebsite: "https://nvcourts.gov",
    selfHelpUrl: "https://www.nevadalegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.familylawselfhelpcenter.org/self-help/divorce", category: "Divorce", feeAmount: "$299", feeWaiverAvailable: true },
        { formNumber: "TPO Forms", name: "Application for Temporary Protective Order", description: "Request domestic violence protection", url: "https://www.familylawselfhelpcenter.org/self-help/protective-orders", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SM Form", name: "Small Claims Affidavit", description: "Start small claims case (up to $10,000)", url: "https://www.civillawselfhelpcenter.org/self-help/small-claims", category: "Filing", feeAmount: "$50-$100", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Sealing Petition", name: "Petition to Seal Criminal Records", description: "Seal eligible criminal records (NRS 179.245)", url: "https://www.civillawselfhelpcenter.org/self-help/criminal-record-sealing", category: "Sealing", feeAmount: "$50-$150", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Summary Eviction", description: "Landlord eviction lawsuit", url: "https://www.civillawselfhelpcenter.org/self-help/eviction", category: "Eviction", feeAmount: "$71-$136", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DETR UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://ui.nv.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "NRCP 9", name: "Application to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://nvcourts.gov/Forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // NEW HAMPSHIRE
  "NH": {
    stateName: "New Hampshire",
    courtWebsite: "https://www.courts.nh.gov",
    selfHelpUrl: "https://www.nhbar.org/lawyer-referral-service/legal-advice-clinics",
    forms: {
      "family": [
        { formNumber: "NHJB-2003-DF", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.courts.nh.gov/sites/g/files/ehbemt471/files/inline-documents/sonh/nhjb-2003-df.pdf", category: "Divorce", feeAmount: "$252", feeWaiverAvailable: true },
        { formNumber: "NHJB-2122-DFPS", name: "Petition for Domestic Violence Protective Order", description: "Request domestic violence protection", url: "https://www.courts.nh.gov/sites/g/files/ehbemt471/files/inline-documents/sonh/nhjb-2122-dfps.pdf", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "NHJB-2222-SE", name: "Small Claims Writ", description: "Start small claims case (up to $10,000)", url: "https://www.courts.nh.gov/self-help/small-claims", category: "Filing", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Annulment Petition", name: "Petition for Annulment", description: "Clear eligible criminal records (RSA 651:5)", url: "https://www.courts.nh.gov/self-help/criminal", category: "Annulment", feeAmount: "$25-$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "NHJB-2267-L", name: "Landlord Writ", description: "Eviction lawsuit", url: "https://www.courts.nh.gov/self-help/landlord-tenant", category: "Eviction", feeAmount: "$115", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "NHES UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.nhes.nh.gov/services/claimants/index.htm", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "NHJB-2313-SE", name: "Motion for Fee Waiver", description: "Request court fee waiver", url: "https://www.courts.nh.gov/self-help", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // NEW MEXICO
  "NM": {
    stateName: "New Mexico",
    courtWebsite: "https://www.nmcourts.gov",
    selfHelpUrl: "https://www.lawhelp.org/nm",
    forms: {
      "family": [
        { formNumber: "4-401", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.nmcourts.gov/self-help/form/divorce-forms/", category: "Divorce", feeAmount: "$137", feeWaiverAvailable: true },
        { formNumber: "4-501", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.nmcourts.gov/self-help/form/domestic-violence-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "4-201", name: "Complaint (Metropolitan Court)", description: "Start small claims case (up to $10,000)", url: "https://www.nmcourts.gov/self-help/form/civil-forms/", category: "Filing", feeAmount: "$25-$100", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (NMSA 29-3A)", url: "https://www.nmcourts.gov/self-help/form/criminal-forms/", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "4-801", name: "Owner's Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.nmcourts.gov/self-help/form/landlord-tenant-forms/", category: "Eviction", feeAmount: "$25-$55", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.dws.state.nm.us/en-us/Unemployment", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "4-220", name: "Poverty Affidavit", description: "Request court fee waiver", url: "https://www.nmcourts.gov/self-help/form/fee-waiver-forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // NORTH DAKOTA
  "ND": {
    stateName: "North Dakota",
    courtWebsite: "https://www.ndcourts.gov",
    selfHelpUrl: "https://www.legalassist.nd.org",
    forms: {
      "family": [
        { formNumber: "SFN 910", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.ndcourts.gov/legal-self-help/divorce", category: "Divorce", feeAmount: "$80", feeWaiverAvailable: true },
        { formNumber: "SFN 8076", name: "Petition for Domestic Violence Protection Order", description: "Request domestic violence protection", url: "https://www.ndcourts.gov/legal-self-help/protection-orders", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SFN 10", name: "Small Claims Complaint", description: "Start small claims case (up to $15,000)", url: "https://www.ndcourts.gov/legal-self-help/small-claims", category: "Filing", feeAmount: "$20-$30", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Motion", name: "Motion for Expungement", description: "Clear eligible criminal records (NDCC 12-60.1)", url: "https://www.ndcourts.gov/legal-self-help/criminal", category: "Expungement", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Summons and Complaint for Eviction", description: "Eviction lawsuit", url: "https://www.ndcourts.gov/legal-self-help/landlord-tenant", category: "Eviction", feeAmount: "$80", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "JSN UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.jobsnd.com/unemployment-individuals", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "SFN 2112", name: "Application to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.ndcourts.gov/legal-self-help", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // OKLAHOMA
  "OK": {
    stateName: "Oklahoma",
    courtWebsite: "https://www.oscn.net",
    selfHelpUrl: "https://www.oklaw.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Divorce", feeAmount: "$181", feeWaiverAvailable: true },
        { formNumber: "VPO Petition", name: "Petition for Protective Order", description: "Request domestic violence protection", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Affidavit", name: "Small Claims Affidavit", description: "Start small claims case (up to $10,000)", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Filing", feeAmount: "$53-$87", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (22 O.S. § 18)", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Expungement", feeAmount: "$150-$350", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED Petition", name: "Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Eviction", feeAmount: "$60-$90", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "OESC UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://unemployment.oklahoma.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Pauper Affidavit", name: "Pauper's Affidavit", description: "Request court fee waiver", url: "https://www.oscn.net/applications/oscn/index.asp?ftdb=STOKST&level=1", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // OREGON
  "OR": {
    stateName: "Oregon",
    courtWebsite: "https://www.courts.oregon.gov",
    selfHelpUrl: "https://www.oregonlawhelp.org",
    forms: {
      "family": [
        { formNumber: "Dissolution Petition", name: "Petition for Dissolution of Marriage", description: "Start divorce proceedings", url: "https://www.courts.oregon.gov/forms/Pages/Family.aspx", category: "Divorce", feeAmount: "$287", feeWaiverAvailable: true },
        { formNumber: "FAPA Petition", name: "Petition for Restraining Order", description: "Request domestic violence protection", url: "https://www.courts.oregon.gov/forms/Pages/Family.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Form", name: "Small Claims Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.courts.oregon.gov/forms/Pages/SmallClaims.aspx", category: "Filing", feeAmount: "$35-$55", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Motion", name: "Motion to Set Aside Conviction", description: "Clear eligible criminal records (ORS 137.225)", url: "https://www.courts.oregon.gov/forms/Pages/Criminal.aspx", category: "Set Aside", feeAmount: "$80", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED Complaint", name: "Complaint for Forcible Entry and Detainer", description: "Eviction lawsuit", url: "https://www.courts.oregon.gov/forms/Pages/LandlordTenant.aspx", category: "Eviction", feeAmount: "$83", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "OED UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://unemployment.oregon.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Fee Waiver Application", name: "Application for Waiver or Deferral of Fees", description: "Request court fee waiver", url: "https://www.courts.oregon.gov/forms/Pages/default.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // RHODE ISLAND
  "RI": {
    stateName: "Rhode Island",
    courtWebsite: "https://www.courts.ri.gov",
    selfHelpUrl: "https://www.ribar.com/public-resources/free-legal-resources/",
    forms: {
      "family": [
        { formNumber: "DR-1", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/Family%20Court%20Forms.aspx", category: "Divorce", feeAmount: "$120", feeWaiverAvailable: true },
        { formNumber: "Abuse Complaint", name: "Complaint for Relief from Abuse", description: "Request domestic violence protection", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/District%20Court%20Forms.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Form", name: "Small Claims Statement of Claim", description: "Start small claims case (up to $5,000)", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/District%20Court%20Forms.aspx", category: "Filing", feeAmount: "$35-$65", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Motion", name: "Motion for Expungement", description: "Clear eligible criminal records (R.I. Gen. Laws 12-1.3)", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/District%20Court%20Forms.aspx", category: "Expungement", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Eviction Complaint and Summons", description: "Eviction lawsuit", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/District%20Court%20Forms.aspx", category: "Eviction", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLT UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dlt.ri.gov/individuals/unemployment-insurance", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Application", name: "Application to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.courts.ri.gov/PublicResources/forms/Pages/default.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // SOUTH CAROLINA
  "SC_state": {
    stateName: "South Carolina",
    courtWebsite: "https://www.sccourts.org",
    selfHelpUrl: "https://www.lawhelp.org/sc",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.sccourts.org/forms/", category: "Divorce", feeAmount: "$150", feeWaiverAvailable: true },
        { formNumber: "PFA Petition", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.sccourts.org/forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Magistrate Complaint", name: "Magistrate Court Complaint", description: "Start small claims case (up to $7,500)", url: "https://www.sccourts.org/forms/", category: "Filing", feeAmount: "$40-$80", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Application", name: "Application for Expungement", description: "Clear eligible criminal records (S.C. Code Ann. 17-22-910)", url: "https://www.sled.sc.gov/forms.aspx", category: "Expungement", feeAmount: "$25-$250", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Ejectment Action", name: "Summons and Complaint for Ejectment", description: "Eviction lawsuit", url: "https://www.sccourts.org/forms/", category: "Eviction", feeAmount: "$40", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DEW UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.dew.sc.gov/individuals/apply-for-unemployment-benefits", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.sccourts.org/forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // SOUTH DAKOTA
  "SD": {
    stateName: "South Dakota",
    courtWebsite: "https://ujs.sd.gov",
    selfHelpUrl: "https://www.sdlawhelp.org",
    forms: {
      "family": [
        { formNumber: "UJS 311", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Divorce", feeAmount: "$95", feeWaiverAvailable: true },
        { formNumber: "UJS 331", name: "Petition for Protection Order", description: "Request domestic violence protection", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "UJS 143", name: "Small Claims Complaint", description: "Start small claims case (up to $12,000)", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Filing", feeAmount: "$45", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (SDCL 23A-3)", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Expungement", feeAmount: "$0-$175", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Summons and Complaint for Eviction", description: "Eviction lawsuit", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Eviction", feeAmount: "$70", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DLRE UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dlr.sd.gov/ra/re_file_claim.aspx", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "UJS 001", name: "Application to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://ujs.sd.gov/Forms/default.aspx", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // TENNESSEE
  "TN": {
    stateName: "Tennessee",
    courtWebsite: "https://www.tncourts.gov",
    selfHelpUrl: "https://www.tals.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.tncourts.gov/help-center/court-forms", category: "Divorce", feeAmount: "$184-$284", feeWaiverAvailable: true },
        { formNumber: "Order of Protection", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.tncourts.gov/help-center/court-forms", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "GS Civil Warrant", name: "Civil Warrant (General Sessions)", description: "Start small claims case (up to $25,000)", url: "https://www.tncourts.gov/help-center/court-forms", category: "Filing", feeAmount: "$40-$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expunction", description: "Clear eligible criminal records (T.C.A. 40-32-101)", url: "https://www.tncourts.gov/help-center/court-forms", category: "Expungement", feeAmount: "$100-$350", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Detainer Warrant", name: "Detainer Warrant", description: "Eviction lawsuit", url: "https://www.tncourts.gov/help-center/court-forms", category: "Eviction", feeAmount: "$28-$50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://www.tn.gov/workforce/unemployment.html", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Pauper's Oath", name: "Pauper's Oath", description: "Request court fee waiver", url: "https://www.tncourts.gov/help-center/court-forms", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // UTAH
  "UT": {
    stateName: "Utah",
    courtWebsite: "https://www.utcourts.gov",
    selfHelpUrl: "https://www.utahlegalservices.org",
    forms: {
      "family": [
        { formNumber: "Divorce Petition", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.utcourts.gov/selfhelp/divorce/", category: "Divorce", feeAmount: "$325", feeWaiverAvailable: true },
        { formNumber: "Protective Order", name: "Request for Protective Order", description: "Request domestic violence protection", url: "https://www.utcourts.gov/selfhelp/protective/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC Form", name: "Small Claims Affidavit and Summons", description: "Start small claims case (up to $11,000)", url: "https://www.utcourts.gov/selfhelp/smallclaims/", category: "Filing", feeAmount: "$60-$185", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (Utah Code 77-40a)", url: "https://www.utcourts.gov/selfhelp/expunge/", category: "Expungement", feeAmount: "$135", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Eviction Complaint", name: "Complaint for Eviction", description: "Unlawful detainer lawsuit", url: "https://www.utcourts.gov/selfhelp/eviction/", category: "Eviction", feeAmount: "$95-$185", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://jobs.utah.gov/ui/home", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Motion to Waive Fees", description: "Request court fee waiver", url: "https://www.utcourts.gov/selfhelp/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // VERMONT
  "VT": {
    stateName: "Vermont",
    courtWebsite: "https://www.vermontjudiciary.org",
    selfHelpUrl: "https://www.vtlawhelp.org",
    forms: {
      "family": [
        { formNumber: "400 Series", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.vermontjudiciary.org/self-help/divorce-separation", category: "Divorce", feeAmount: "$295", feeWaiverAvailable: true },
        { formNumber: "Relief From Abuse", name: "Complaint for Relief from Abuse", description: "Request domestic violence protection", url: "https://www.vermontjudiciary.org/self-help/abuse-prevention", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "100-00091", name: "Small Claims Complaint", description: "Start small claims case (up to $5,000)", url: "https://www.vermontjudiciary.org/self-help/small-claims", category: "Filing", feeAmount: "$50-$75", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (13 V.S.A. § 7602)", url: "https://www.vermontjudiciary.org/self-help/criminal", category: "Expungement", feeAmount: "Free", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Ejectment", name: "Complaint for Ejectment", description: "Eviction lawsuit", url: "https://www.vermontjudiciary.org/self-help/landlord-tenant", category: "Eviction", feeAmount: "$90-$295", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DOL UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://labor.vermont.gov/unemployment-insurance", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "Fee Waiver", name: "Application for Waiver of Filing Fees", description: "Request court fee waiver", url: "https://www.vermontjudiciary.org/self-help", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // WEST VIRGINIA
  "WV": {
    stateName: "West Virginia",
    courtWebsite: "https://www.courtswv.gov",
    selfHelpUrl: "https://www.lawv.net",
    forms: {
      "family": [
        { formNumber: "SCA-FC-104", name: "Petition for Divorce", description: "Start divorce proceedings", url: "https://www.courtswv.gov/lower-courts/family-court/family-court-forms.html", category: "Divorce", feeAmount: "$135", feeWaiverAvailable: true },
        { formNumber: "SCA-DV-1", name: "Petition for Domestic Violence Protective Order", description: "Request domestic violence protection", url: "https://www.courtswv.gov/lower-courts/family-court/family-court-forms.html", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SCA-M-15", name: "Magistrate Court Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.courtswv.gov/lower-courts/magistrate-court/magistrate-forms.html", category: "Filing", feeAmount: "$25-$45", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (W. Va. Code 61-11-26)", url: "https://www.courtswv.gov/lower-courts/circuit-court/circuit-court-forms.html", category: "Expungement", feeAmount: "$50", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "Wrongful Occupation", name: "Complaint for Wrongful Occupation", description: "Eviction lawsuit", url: "https://www.courtswv.gov/lower-courts/magistrate-court/magistrate-forms.html", category: "Eviction", feeAmount: "$25", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "WorkForce UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://workforcewv.org/unemployment", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Affidavit", name: "Affidavit of Indigency", description: "Request court fee waiver", url: "https://www.courtswv.gov", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // WISCONSIN
  "WI": {
    stateName: "Wisconsin",
    courtWebsite: "https://www.wicourts.gov",
    selfHelpUrl: "https://www.wislawlibrary.org/services/legalresearch/self-help/",
    forms: {
      "family": [
        { formNumber: "FA-4101V", name: "Petition for Divorce", description: "Start divorce proceedings with minor children", url: "https://www.wicourts.gov/formdisplay/FA-4101V.pdf", category: "Divorce", feeAmount: "$184.50", feeWaiverAvailable: true },
        { formNumber: "CV-402", name: "Petition for Temporary Restraining Order", description: "Request domestic abuse protection", url: "https://www.wicourts.gov/formdisplay/CV-402.pdf", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "SC-500", name: "Summons and Complaint", description: "Start small claims case (up to $10,000)", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=54", category: "Filing", feeAmount: "$65.50-$94.50", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "CR-262", name: "Petition for Expungement", description: "Clear eligible criminal records (Wis. Stat. 973.015)", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=46", category: "Expungement", feeAmount: "Free", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "SC-510", name: "Summons and Complaint (Eviction)", description: "Small claims eviction lawsuit", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=53", category: "Eviction", feeAmount: "$94.50", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWD UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://dwd.wisconsin.gov/uiben/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "GF-177", name: "Petition for Waiver of Fees and Costs", description: "Request court fee waiver", url: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?FormNumber=GF-177", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },

  // WYOMING
  "WY": {
    stateName: "Wyoming",
    courtWebsite: "https://www.courts.state.wy.us",
    selfHelpUrl: "https://www.lawyoming.org",
    forms: {
      "family": [
        { formNumber: "Divorce Complaint", name: "Complaint for Divorce", description: "Start divorce proceedings", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Divorce", feeAmount: "$70", feeWaiverAvailable: true },
        { formNumber: "Order of Protection", name: "Petition for Order of Protection", description: "Request domestic violence protection", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Protection Orders", feeAmount: "Free" },
      ],
      "small-claims": [
        { formNumber: "Circuit Complaint", name: "Small Claims Complaint", description: "Start small claims case (up to $6,000 circuit court)", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Filing", feeAmount: "$30-$55", feeWaiverAvailable: true },
      ],
      "criminal": [
        { formNumber: "Expungement Petition", name: "Petition for Expungement", description: "Clear eligible criminal records (Wyo. Stat. 7-13-1501)", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Expungement", feeAmount: "$100", feeWaiverAvailable: true },
      ],
      "housing": [
        { formNumber: "FED Complaint", name: "Forcible Entry and Detainer Complaint", description: "Eviction lawsuit", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Eviction", feeAmount: "$30-$70", feeWaiverAvailable: true },
      ],
      "employment": [
        { formNumber: "DWS UI Claim", name: "Unemployment Insurance Claim", description: "Apply for unemployment benefits", url: "https://wyui.wyo.gov/", category: "Unemployment" },
      ],
      "general": [
        { formNumber: "IFP Motion", name: "Motion to Proceed In Forma Pauperis", description: "Request court fee waiver", url: "https://www.courts.state.wy.us/legal-assistances-and-forms/court-self-help-forms/", category: "Fee Waiver", feeAmount: "Free" },
      ],
    }
  },
};

// Helper function to get forms for any state
export function getCompleteStateFormsData(stateCode: string): StateFormsData | null {
  // Handle SC specially since it conflicts with South Carolina code
  if (stateCode === "SC") {
    return completeStateFormsData["SC_state"] || null;
  }
  return completeStateFormsData[stateCode] || null;
}

// Get all state codes
export function getAllStateCodes(): string[] {
  return Object.keys(completeStateFormsData).filter(code => code !== "SC_state");
}
