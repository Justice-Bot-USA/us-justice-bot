// Immigration & ICE Defense Forms - Fight ICE, Protect Your Rights
import { CourtForm } from '../formsLibraryData';

export const immigrationFormsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "Know Your Rights Card", name: "CA Know Your Rights - ICE Encounters", description: "Wallet card with rights during ICE encounters in California", url: "https://www.ilrc.org/know-your-rights", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "CA Rapid Response", name: "CA ICE Rapid Response Hotline", description: "Report ICE activity in your community - CA Immigration Coalition", url: "https://www.caimmigrant.org/what-we-do/rapid-response/", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "SB 54 Rights", name: "California Sanctuary State Rights", description: "Your rights under CA Values Act (SB 54) - limits local cooperation with ICE", url: "https://oag.ca.gov/immigrant/rights", category: "Sanctuary Protections", feeAmount: "Free" },
    { formNumber: "EOIR-28", name: "Notice of Entry of Appearance (Immigration Court)", description: "Attorney appearance form for immigration proceedings", url: "https://www.justice.gov/eoir/form-eoir-28", category: "Court Forms" },
    { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum and withholding of removal", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
    { formNumber: "I-862 Response", name: "Response to Notice to Appear", description: "Respond to deportation/removal proceedings", url: "https://www.justice.gov/eoir", category: "Deportation Defense" },
  ],
  "TX": [
    { formNumber: "Know Your Rights Card", name: "TX Know Your Rights - ICE Encounters", description: "Wallet card with rights during ICE raids and checkpoints in Texas", url: "https://www.aclu.org/know-your-rights/immigrants-rights", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "TX Rapid Response", name: "TX ICE Rapid Response Network", description: "Report ICE raids and get community support in Texas", url: "https://www.raicestexas.org/", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "Bond Request", name: "Immigration Bond Request", description: "Request bond to be released from ICE detention", url: "https://www.justice.gov/eoir", category: "Detention", feeAmount: "Varies" },
    { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum at the border or from within the US", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
    { formNumber: "Complaint CRCL", name: "DHS Civil Rights Complaint", description: "Report ICE misconduct or civil rights violations", url: "https://www.dhs.gov/file-civil-rights-complaint", category: "ICE Accountability", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "NYC MOIA", name: "NYC Mayor's Office Immigrant Affairs", description: "Free legal services and ICE defense resources in NYC", url: "https://www.nyc.gov/site/immigrants/index.page", category: "Legal Aid", feeAmount: "Free" },
    { formNumber: "ActionNYC", name: "ActionNYC Free Legal Help", description: "Free immigration legal help at community locations", url: "https://www.nyc.gov/site/immigrants/help/legal-services/actionnyc.page", category: "Legal Aid", feeAmount: "Free" },
    { formNumber: "ICE Hotline NY", name: "NY ICE Raid Hotline", description: "Report ICE activity and get rapid legal response", url: "https://www.nyic.org/", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "NY Executive Order", name: "NY Sanctuary Protections", description: "Know your rights under NY state and NYC sanctuary policies", url: "https://www.nyc.gov/site/immigrants/help/city-services/know-your-rights.page", category: "Sanctuary Protections", feeAmount: "Free" },
    { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum and withholding of removal", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
  ],
  "FL": [
    { formNumber: "Know Your Rights FL", name: "FL Know Your Rights - ICE Encounters", description: "Your rights during ICE encounters in Florida", url: "https://www.aclu.org/know-your-rights/immigrants-rights", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "FL Legal Aid", name: "FL Immigration Legal Services", description: "Find free immigration legal help in Florida", url: "https://www.flaimmigration.org/", category: "Legal Aid", feeAmount: "Free" },
    { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum and withholding of removal", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
    { formNumber: "Complaint CRCL", name: "DHS Civil Rights Complaint", description: "Report ICE misconduct or detention conditions", url: "https://www.dhs.gov/file-civil-rights-complaint", category: "ICE Accountability", feeAmount: "Free" },
  ],
  "IL": [
    { formNumber: "IL TRUST Act", name: "Illinois TRUST Act Rights", description: "IL limits local law enforcement cooperation with ICE", url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3876", category: "Sanctuary Protections", feeAmount: "Free" },
    { formNumber: "ICIRR Hotline", name: "IL ICE Rapid Response", description: "Report ICE raids - Illinois Coalition for Immigrant Rights", url: "https://www.icirr.org/", category: "ICE Defense", feeAmount: "Free" },
    { formNumber: "Chicago Legal Aid", name: "Chicago Immigration Legal Aid", description: "Free legal defense for immigrants in Chicago", url: "https://www.chicagobar.org/", category: "Legal Aid", feeAmount: "Free" },
    { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum and withholding of removal", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
  ],
};

// Federal Immigration & ICE Defense Forms (apply to all states)
export const federalImmigrationForms: CourtForm[] = [
  // ICE Defense & Know Your Rights
  { formNumber: "ACLU KYR", name: "Know Your Rights - ICE Encounters", description: "What to do if ICE comes to your door, workplace, or stops you", url: "https://www.aclu.org/know-your-rights/immigrants-rights", category: "ICE Defense", feeAmount: "Free" },
  { formNumber: "Family Safety Plan", name: "ICE Raid Family Safety Plan", description: "Prepare your family in case of ICE detention - emergency contacts, power of attorney, childcare", url: "https://www.nilc.org/get-involved/community-education-resources/know-your-rights/", category: "ICE Defense", feeAmount: "Free" },
  { formNumber: "DHS CRCL Complaint", name: "DHS Civil Rights & Civil Liberties Complaint", description: "Report ICE misconduct, excessive force, or civil rights violations", url: "https://www.dhs.gov/file-civil-rights-complaint", category: "ICE Accountability", feeAmount: "Free" },
  { formNumber: "OIG Complaint", name: "DHS Office of Inspector General Complaint", description: "Report ICE fraud, waste, abuse, or misconduct", url: "https://www.oig.dhs.gov/hotline", category: "ICE Accountability", feeAmount: "Free" },
  
  // Asylum & Deportation Defense
  { formNumber: "I-589", name: "Application for Asylum and Withholding of Removal", description: "Apply for protection from persecution - file within 1 year of arrival", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
  { formNumber: "EOIR-26", name: "Notice of Appeal to Board of Immigration Appeals", description: "Appeal immigration judge decision to BIA", url: "https://www.justice.gov/eoir/form-eoir-26", category: "Appeals", feeAmount: "$110" },
  { formNumber: "EOIR-28", name: "Notice of Entry of Appearance", description: "Attorney or accredited rep appearance in immigration court", url: "https://www.justice.gov/eoir/form-eoir-28", category: "Court Forms" },
  { formNumber: "EOIR-33", name: "Change of Address Form", description: "Update your address with immigration court - CRITICAL to avoid deportation in absentia", url: "https://www.justice.gov/eoir/form-eoir-33", category: "Court Forms", feeAmount: "Free" },
  { formNumber: "I-246", name: "Application for Stay of Deportation", description: "Request to delay removal while pursuing legal options", url: "https://www.ice.gov/doclib/detention-reform/pdf/1246.pdf", category: "Deportation Defense" },
  
  // Visa & Status Forms
  { formNumber: "I-130", name: "Petition for Alien Relative", description: "Family-based immigration petition", url: "https://www.uscis.gov/i-130", category: "Family Immigration", feeAmount: "$535" },
  { formNumber: "I-485", name: "Application for Adjustment of Status", description: "Apply for green card from within the US", url: "https://www.uscis.gov/i-485", category: "Green Card", feeAmount: "$1,140" },
  { formNumber: "I-765", name: "Application for Employment Authorization", description: "Apply for work permit (EAD)", url: "https://www.uscis.gov/i-765", category: "Work Permit", feeAmount: "$410" },
  { formNumber: "I-131", name: "Application for Travel Document", description: "Advance parole to travel outside US while case pending", url: "https://www.uscis.gov/i-131", category: "Travel", feeAmount: "$575" },
  { formNumber: "I-751", name: "Petition to Remove Conditions on Residence", description: "Remove conditions on conditional green card (2-year)", url: "https://www.uscis.gov/i-751", category: "Green Card", feeAmount: "$595" },
  
  // DACA & TPS
  { formNumber: "I-821D", name: "DACA Application", description: "Deferred Action for Childhood Arrivals application or renewal", url: "https://www.uscis.gov/i-821d", category: "DACA", feeAmount: "$410" },
  { formNumber: "I-821", name: "TPS Application", description: "Temporary Protected Status application", url: "https://www.uscis.gov/i-821", category: "TPS", feeAmount: "$50" },
  
  // U-Visa & VAWA (Crime Victims)
  { formNumber: "I-918", name: "U-Visa Petition (Crime Victims)", description: "Protection for crime victims who cooperate with law enforcement", url: "https://www.uscis.gov/i-918", category: "Crime Victims", feeAmount: "Free" },
  { formNumber: "I-360", name: "VAWA Self-Petition", description: "Protection for victims of domestic violence by US citizen/LPR spouse", url: "https://www.uscis.gov/i-360", category: "Domestic Violence", feeAmount: "Free" },
  
  // Naturalization
  { formNumber: "N-400", name: "Application for Naturalization", description: "Apply for US citizenship", url: "https://www.uscis.gov/n-400", category: "Citizenship", feeAmount: "$710" },
  { formNumber: "N-648", name: "Medical Certification for Disability Exceptions", description: "Request disability waiver for citizenship requirements", url: "https://www.uscis.gov/n-648", category: "Citizenship", feeAmount: "Free" },
];

// Default state immigration forms
export const defaultImmigrationForms: CourtForm[] = [
  { formNumber: "Know Your Rights", name: "Know Your Rights - ICE Encounters", description: "Your constitutional rights during any ICE encounter", url: "https://www.aclu.org/know-your-rights/immigrants-rights", category: "ICE Defense", feeAmount: "Free" },
  { formNumber: "ICE Complaint", name: "Report ICE Misconduct", description: "File complaint about ICE misconduct or civil rights violations", url: "https://www.dhs.gov/file-civil-rights-complaint", category: "ICE Accountability", feeAmount: "Free" },
  { formNumber: "Family Plan", name: "ICE Raid Family Safety Plan", description: "Prepare emergency plan for your family", url: "https://www.nilc.org/get-involved/community-education-resources/know-your-rights/", category: "ICE Defense", feeAmount: "Free" },
  { formNumber: "I-589", name: "Application for Asylum", description: "Apply for asylum and withholding of removal", url: "https://www.uscis.gov/i-589", category: "Asylum", feeAmount: "Free" },
];

export function getImmigrationForms(stateCode: string): CourtForm[] {
  const stateForms = immigrationFormsByState[stateCode] || defaultImmigrationForms;
  return [...stateForms, ...federalImmigrationForms];
}
