// Child Protective Services (CPS) Forms by State
import { CourtForm } from '../formsLibraryData';

export const cpsFormsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "JV-100", name: "Petition to Commence Dependency Proceedings", description: "Challenge CPS removal of child", url: "https://www.courts.ca.gov/documents/jv100.pdf", category: "CPS Defense", feeAmount: "Free" },
    { formNumber: "JV-180", name: "Request to Change Court Order (Dependency)", description: "Modify CPS case orders", url: "https://www.courts.ca.gov/documents/jv180.pdf", category: "CPS Modification" },
    { formNumber: "JV-505", name: "Statement Regarding Parentage", description: "Establish parentage in CPS case", url: "https://www.courts.ca.gov/documents/jv505.pdf", category: "Parentage" },
    { formNumber: "JV-535", name: "Waiver of Rights - Juvenile Dependency", description: "Understand rights in CPS proceeding", url: "https://www.courts.ca.gov/documents/jv535.pdf", category: "Rights" },
    { formNumber: "JV-290", name: "Caregiver Information Form", description: "Relative caregiver documentation", url: "https://www.courts.ca.gov/documents/jv290.pdf", category: "Placement" },
    { formNumber: "JV-321", name: "Request for Prospective Adoptive Parent Designation", description: "Adoption in dependency case", url: "https://www.courts.ca.gov/documents/jv321.pdf", category: "Adoption" },
  ],
  "TX": [
    { formNumber: "CPS Answer", name: "Answer to CPS Petition", description: "Respond to DFPS removal case", url: "https://texaslawhelp.org/article/child-protective-services", category: "CPS Defense", feeAmount: "Free" },
    { formNumber: "Motion to Dismiss", name: "Motion to Dismiss CPS Case", description: "Request dismissal of CPS case", url: "https://texaslawhelp.org/form/cps", category: "CPS Defense" },
    { formNumber: "Visitation Motion", name: "Motion for Increased Visitation", description: "Request more time with children", url: "https://texaslawhelp.org/form/cps", category: "Visitation" },
    { formNumber: "Service Plan Contest", name: "Objection to Family Service Plan", description: "Challenge required services", url: "https://texaslawhelp.org/article/child-protective-services", category: "Service Plan" },
    { formNumber: "Permanency Objection", name: "Objection to Permanency Plan", description: "Challenge placement decisions", url: "https://texaslawhelp.org/form/cps", category: "Placement" },
  ],
  "NY": [
    { formNumber: "Family Court 1034", name: "Answer to Neglect/Abuse Petition", description: "Respond to ACS/CPS allegations", url: "https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings", category: "CPS Defense", feeAmount: "Free" },
    { formNumber: "Family Court Motion", name: "Motion to Dismiss Neglect Petition", description: "Request case dismissal", url: "https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings", category: "CPS Defense" },
    { formNumber: "Visitation Petition", name: "Petition for Visitation", description: "Request visitation with children in care", url: "https://www.nycourts.gov/help/family-issues-divorce/visitation", category: "Visitation" },
    { formNumber: "Relative Placement", name: "Application for Relative Placement", description: "Request kinship placement", url: "https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings", category: "Placement" },
  ],
  "FL": [
    { formNumber: "12.980(k)", name: "Answer to Dependency Petition", description: "Respond to DCF case", url: "https://www.flcourts.gov/content/download/403317", category: "CPS Defense", feeAmount: "Free" },
    { formNumber: "12.942(a)", name: "Motion for Reunification", description: "Request return of children", url: "https://www.flcourts.gov", category: "Reunification" },
    { formNumber: "Shelter Hearing Response", name: "Response to Shelter Petition", description: "Contest emergency removal", url: "https://www.flcourts.gov", category: "CPS Defense" },
    { formNumber: "Case Plan Objection", name: "Objection to Case Plan", description: "Challenge DCF case plan", url: "https://www.flcourts.gov", category: "Service Plan" },
  ],
  "IL": [
    { formNumber: "DCFS Response", name: "Response to DCFS Petition", description: "Answer abuse/neglect allegations", url: "https://www.illinoiscourts.gov/Forms/approved-forms/", category: "CPS Defense", feeAmount: "Free" },
    { formNumber: "Return Motion", name: "Motion for Return of Child", description: "Request child's return home", url: "https://www.illinoislegalaid.org/legal-information/dcfs-cases", category: "Reunification" },
    { formNumber: "Service Plan Challenge", name: "Motion to Modify Service Plan", description: "Challenge DCFS requirements", url: "https://www.illinoislegalaid.org", category: "Service Plan" },
  ],
};

// Default CPS forms for states without specific data
export const defaultCPSForms: CourtForm[] = [
  { formNumber: "CPS Answer", name: "Answer to CPS/DCS Petition", description: "Respond to child welfare agency allegations", url: "", category: "CPS Defense", feeAmount: "Free" },
  { formNumber: "Motion to Dismiss", name: "Motion to Dismiss CPS Case", description: "Request dismissal of unfounded allegations", url: "", category: "CPS Defense" },
  { formNumber: "Visitation Motion", name: "Motion for Visitation", description: "Request or increase visitation with children", url: "", category: "Visitation" },
  { formNumber: "Reunification Motion", name: "Motion for Reunification", description: "Request return of children to home", url: "", category: "Reunification" },
  { formNumber: "Service Plan Objection", name: "Objection to Case Plan", description: "Challenge agency service requirements", url: "", category: "Service Plan" },
  { formNumber: "Relative Placement", name: "Application for Kinship Placement", description: "Request placement with family member", url: "", category: "Placement" },
];

export function getCPSForms(stateCode: string): CourtForm[] {
  return cpsFormsByState[stateCode] || defaultCPSForms;
}
