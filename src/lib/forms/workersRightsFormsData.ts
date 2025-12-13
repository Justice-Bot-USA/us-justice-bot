// Workers Rights & Labor Law Forms by State
import { CourtForm } from '../formsLibraryData';

export const workersRightsFormsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "DLSE-1", name: "Initial Report or Claim", description: "File wage claim with Labor Commissioner", url: "https://www.dir.ca.gov/dlse/howtofilewageclaim.htm", category: "Wage Claims", feeAmount: "Free" },
    { formNumber: "DLSE-55", name: "Report of Labor Law Violation", description: "Report workplace violations", url: "https://www.dir.ca.gov/dlse/HowToReportViolationtoBOFE.htm", category: "Violations" },
    { formNumber: "RCI-1", name: "Retaliation Complaint", description: "File whistleblower/retaliation claim", url: "https://www.dir.ca.gov/dlse/howtofileretaliation.htm", category: "Retaliation", feeAmount: "Free" },
    { formNumber: "OSHA Complaint", name: "Cal/OSHA Safety Complaint", description: "Report unsafe working conditions", url: "https://www.dir.ca.gov/dosh/complaint.htm", category: "Safety", feeAmount: "Free" },
    { formNumber: "DWC-1", name: "Workers' Compensation Claim", description: "Report workplace injury/illness", url: "https://www.dir.ca.gov/dwc/DWCForm1.pdf", category: "Workers Comp", feeAmount: "Free" },
    { formNumber: "PAGA Notice", name: "Private Attorney General Act Notice", description: "Notice for class labor violations", url: "https://www.dir.ca.gov/dlse/PAGA.html", category: "Class Action" },
    { formNumber: "Meal/Rest Claim", name: "Meal and Rest Break Violation Claim", description: "Claim for denied breaks", url: "https://www.dir.ca.gov/dlse/faq_mealperiods.htm", category: "Break Violations" },
  ],
  "TX": [
    { formNumber: "TWC Wage Claim", name: "Wage Claim Application", description: "Report unpaid wages to TWC", url: "https://www.twc.texas.gov/jobseekers/how-submit-wage-claim", category: "Wage Claims", feeAmount: "Free" },
    { formNumber: "TWC Payday Claim", name: "Payday Law Claim", description: "Claim for timely wage payment", url: "https://www.twc.texas.gov/businesses/texas-payday-law", category: "Wage Claims" },
    { formNumber: "OSHA Federal", name: "OSHA Safety Complaint", description: "Report unsafe conditions (federal)", url: "https://www.osha.gov/workers/file-complaint", category: "Safety", feeAmount: "Free" },
    { formNumber: "DWC-41", name: "Workers' Comp Claim", description: "Report workplace injury", url: "https://www.tdi.texas.gov/wc/employee/index.html", category: "Workers Comp" },
    { formNumber: "EEOC Charge", name: "EEOC Discrimination Charge", description: "Federal employment discrimination", url: "https://www.eeoc.gov/how-file-charge-employment-discrimination", category: "Discrimination", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "LS-223", name: "Claim for Unpaid Wages", description: "DOL wage claim form", url: "https://dol.ny.gov/unpaidwithheld-wages-and-wages-supplements", category: "Wage Claims", feeAmount: "Free" },
    { formNumber: "LS-300", name: "Overtime Violation Claim", description: "Report overtime violations", url: "https://dol.ny.gov/overtime", category: "Overtime" },
    { formNumber: "PESH Complaint", name: "PESH Safety Complaint", description: "NY workplace safety complaint", url: "https://dol.ny.gov/public-employee-safety-and-health-program", category: "Safety", feeAmount: "Free" },
    { formNumber: "Retaliation Claim", name: "Labor Law Retaliation Claim", description: "File whistleblower complaint", url: "https://dol.ny.gov/retaliation", category: "Retaliation" },
    { formNumber: "WCB C-3", name: "Workers' Comp Claim", description: "Report workplace injury", url: "https://www.wcb.ny.gov/content/main/forms/c-3_claimformE.pdf", category: "Workers Comp" },
    { formNumber: "DHR Complaint", name: "Division of Human Rights Complaint", description: "Employment discrimination claim", url: "https://dhr.ny.gov/complaint", category: "Discrimination", feeAmount: "Free" },
  ],
  "FL": [
    { formNumber: "Private Wage Suit", name: "Civil Wage Claim", description: "Sue employer for unpaid wages", url: "https://www.floridabar.org", category: "Wage Claims", feeAmount: "$55-$300" },
    { formNumber: "OSHA Federal", name: "OSHA Safety Complaint", description: "Report unsafe conditions", url: "https://www.osha.gov/workers/file-complaint", category: "Safety", feeAmount: "Free" },
    { formNumber: "DWC-1", name: "Workers' Comp First Report", description: "Report workplace injury", url: "https://www.myfloridacfo.com/division/wc", category: "Workers Comp" },
    { formNumber: "FCHR Employment", name: "Employment Discrimination Complaint", description: "File with Civil Rights Commission", url: "https://fchr.myflorida.com/", category: "Discrimination", feeAmount: "Free" },
    { formNumber: "Whistleblower Complaint", name: "FL Whistleblower Complaint", description: "Report public employer retaliation", url: "https://fchr.myflorida.com/", category: "Retaliation" },
  ],
  "IL": [
    { formNumber: "IDOL-WP", name: "Wage Payment Complaint", description: "Report unpaid wages to IDOL", url: "https://www2.illinois.gov/idol/Pages/Complaints.aspx", category: "Wage Claims", feeAmount: "Free" },
    { formNumber: "IDOL-MW", name: "Minimum Wage Complaint", description: "Report minimum wage violations", url: "https://www2.illinois.gov/idol/Laws-Rules/FLS/Pages/minimum-wage-law.aspx", category: "Wage Claims" },
    { formNumber: "OSHA-IL", name: "Illinois OSHA Complaint", description: "Report workplace safety hazards", url: "https://www2.illinois.gov/idol/Laws-Rules/safety/Pages/default.aspx", category: "Safety", feeAmount: "Free" },
    { formNumber: "IWCC Application", name: "Workers' Comp Application", description: "File workplace injury claim", url: "https://www2.illinois.gov/sites/iwcc/Pages/default.aspx", category: "Workers Comp" },
    { formNumber: "IDHR Charge", name: "Human Rights Act Charge", description: "Employment discrimination complaint", url: "https://dhr.illinois.gov/", category: "Discrimination", feeAmount: "Free" },
  ],
};

// Default workers rights forms
export const defaultWorkersRightsForms: CourtForm[] = [
  { formNumber: "Wage Claim", name: "Wage Claim Form", description: "Report unpaid wages to labor department", url: "", category: "Wage Claims", feeAmount: "Free" },
  { formNumber: "OSHA Complaint", name: "OSHA Safety Complaint", description: "Report unsafe working conditions", url: "https://www.osha.gov/workers/file-complaint", category: "Safety", feeAmount: "Free" },
  { formNumber: "Workers Comp", name: "Workers' Compensation Claim", description: "Report workplace injury or illness", url: "", category: "Workers Comp", feeAmount: "Free" },
  { formNumber: "Retaliation Claim", name: "Whistleblower/Retaliation Complaint", description: "Report employer retaliation", url: "", category: "Retaliation", feeAmount: "Free" },
  { formNumber: "Discrimination", name: "Employment Discrimination Charge", description: "File discrimination complaint", url: "", category: "Discrimination", feeAmount: "Free" },
  { formNumber: "EEOC Charge", name: "EEOC Charge of Discrimination", description: "Federal employment discrimination complaint", url: "https://www.eeoc.gov/how-file-charge-employment-discrimination", category: "Federal Discrimination", feeAmount: "Free" },
];

export function getWorkersRightsForms(stateCode: string): CourtForm[] {
  return workersRightsFormsByState[stateCode] || defaultWorkersRightsForms;
}
