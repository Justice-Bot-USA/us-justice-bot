// Human Rights & Civil Rights Complaint Forms
import { CourtForm } from '../formsLibraryData';

export const humanRightsFormsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "CRD Complaint", name: "Civil Rights Department Complaint", description: "File discrimination complaint (housing, employment, public accommodation)", url: "https://calcivilrights.ca.gov/complaintprocess/", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "CRD-1", name: "Pre-Complaint Inquiry", description: "Initial discrimination inquiry form", url: "https://calcivilrights.ca.gov/wp-content/uploads/sites/32/2024/01/CRD-1-Pre-Complaint-Inquiry.pdf", category: "Discrimination" },
    { formNumber: "CACI", name: "Civil Rights Violation Claim", description: "Sue for civil rights violations (CA Gov Code 12940)", url: "https://calcivilrights.ca.gov/", category: "Civil Rights Lawsuit" },
    { formNumber: "ADA Complaint", name: "ADA Accessibility Complaint", description: "Report disability access violations", url: "https://www.ada.gov/file-a-complaint/", category: "Disability Rights", feeAmount: "Free" },
    { formNumber: "Police Complaint", name: "Police Misconduct Complaint", description: "File complaint against law enforcement", url: "https://oag.ca.gov/civil-rights", category: "Police Accountability" },
  ],
  "TX": [
    { formNumber: "TCHR Complaint", name: "TX Civil Rights Commission Complaint", description: "File discrimination complaint", url: "https://www.twc.texas.gov/programs/civil-rights-division", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "Housing Complaint", name: "Fair Housing Complaint", description: "Report housing discrimination", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
    { formNumber: "Police Complaint", name: "Police Misconduct Complaint", description: "File complaint with internal affairs", url: "https://www.tcole.texas.gov/content/file-complaint", category: "Police Accountability" },
    { formNumber: "ADA Complaint", name: "ADA Accessibility Complaint", description: "Report disability access barriers", url: "https://www.ada.gov/file-a-complaint/", category: "Disability Rights", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "DHR Complaint", name: "Division of Human Rights Complaint", description: "File discrimination complaint (broadest NY protection)", url: "https://dhr.ny.gov/complaint", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "CCHR Complaint", name: "NYC Human Rights Complaint", description: "NYC discrimination complaint (strongest in nation)", url: "https://www.nyc.gov/site/cchr/about/file-a-complaint.page", category: "NYC Discrimination", feeAmount: "Free" },
    { formNumber: "CCRB Complaint", name: "NYPD Civilian Complaint", description: "File NYPD misconduct complaint", url: "https://www.nyc.gov/site/ccrb/complaints/file-a-complaint.page", category: "Police Accountability", feeAmount: "Free" },
    { formNumber: "AG Civil Rights", name: "Attorney General Civil Rights Complaint", description: "Report civil rights violations to AG", url: "https://ag.ny.gov/civil-rights", category: "Civil Rights" },
    { formNumber: "Fair Housing", name: "Fair Housing Complaint", description: "Report housing discrimination", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
  ],
  "FL": [
    { formNumber: "FCHR Complaint", name: "FL Civil Rights Complaint", description: "File discrimination complaint", url: "https://fchr.myflorida.com/", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "Housing Complaint", name: "Fair Housing Complaint", description: "Report housing discrimination", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
    { formNumber: "FDLE Complaint", name: "Law Enforcement Complaint", description: "Complaint against certified officers", url: "https://www.fdle.state.fl.us/CJSTC/Professional-Compliance", category: "Police Accountability" },
    { formNumber: "AG Civil Rights", name: "Attorney General Civil Rights", description: "Report civil rights violations", url: "https://www.myfloridalegal.com/", category: "Civil Rights" },
  ],
  "IL": [
    { formNumber: "IDHR Charge", name: "IL Human Rights Act Charge", description: "File discrimination complaint", url: "https://dhr.illinois.gov/", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "Chicago CHR", name: "Chicago Human Relations Complaint", description: "Chicago discrimination complaint", url: "https://www.chicago.gov/city/en/depts/cchr/provdrs/fairhousingcomplaint.html", category: "Chicago Discrimination", feeAmount: "Free" },
    { formNumber: "COPA Complaint", name: "Civilian Office of Police Accountability", description: "Chicago police misconduct complaint", url: "https://www.chicagocopa.org/", category: "Police Accountability", feeAmount: "Free" },
    { formNumber: "Fair Housing", name: "Fair Housing Complaint", description: "Report housing discrimination", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
  ],
};

// Federal Human Rights Forms (apply to all states)
export const federalHumanRightsForms: CourtForm[] = [
  { formNumber: "DOJ Civil Rights", name: "DOJ Civil Rights Complaint", description: "Report federal civil rights violations", url: "https://civilrights.justice.gov/report/", category: "Federal Civil Rights", feeAmount: "Free" },
  { formNumber: "HUD Fair Housing", name: "HUD Fair Housing Complaint", description: "Report housing discrimination (federal)", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
  { formNumber: "ADA Complaint", name: "ADA Accessibility Complaint", description: "Report disability access violations", url: "https://www.ada.gov/file-a-complaint/", category: "Disability Rights", feeAmount: "Free" },
  { formNumber: "OCR Education", name: "Office for Civil Rights Education Complaint", description: "School/college discrimination complaint", url: "https://www2.ed.gov/about/offices/list/ocr/complaintintro.html", category: "Education Discrimination", feeAmount: "Free" },
  { formNumber: "FBI Civil Rights", name: "FBI Civil Rights Report", description: "Report hate crimes and civil rights violations", url: "https://www.fbi.gov/investigate/civil-rights", category: "Hate Crimes", feeAmount: "Free" },
  { formNumber: "EEOC Charge", name: "EEOC Discrimination Charge", description: "Employment discrimination complaint", url: "https://www.eeoc.gov/how-file-charge-employment-discrimination", category: "Employment Discrimination", feeAmount: "Free" },
  { formNumber: "Section 1983", name: "Civil Rights Act Section 1983 Claim", description: "Sue government officials for constitutional violations", url: "https://www.uscourts.gov/forms/pro-se-forms", category: "Constitutional Violations", feeAmount: "$405" },
];

// Default state human rights forms
export const defaultHumanRightsForms: CourtForm[] = [
  { formNumber: "State Civil Rights", name: "State Civil Rights Complaint", description: "File discrimination complaint with state agency", url: "", category: "Discrimination", feeAmount: "Free" },
  { formNumber: "Fair Housing", name: "Fair Housing Complaint", description: "Report housing discrimination", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint", category: "Housing Discrimination", feeAmount: "Free" },
  { formNumber: "Police Complaint", name: "Police Misconduct Complaint", description: "File complaint against law enforcement", url: "", category: "Police Accountability", feeAmount: "Free" },
  { formNumber: "ADA Complaint", name: "ADA Accessibility Complaint", description: "Report disability access barriers", url: "https://www.ada.gov/file-a-complaint/", category: "Disability Rights", feeAmount: "Free" },
];

export function getHumanRightsForms(stateCode: string): CourtForm[] {
  const stateForms = humanRightsFormsByState[stateCode] || defaultHumanRightsForms;
  return [...stateForms, ...federalHumanRightsForms];
}
