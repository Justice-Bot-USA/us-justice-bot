// Agency Complaints - Police, Social Workers, Judges, Doctors, Therapists, etc.
import { CourtForm } from '../formsLibraryData';

// Police Complaints by State
export const policeComplaintsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "POST Complaint", name: "POST Officer Complaint", description: "Complaint to Commission on Peace Officer Standards", url: "https://post.ca.gov/public-complaints", category: "State Licensing", feeAmount: "Free" },
    { formNumber: "DOJ Complaint", name: "CA DOJ Civil Rights Complaint", description: "Attorney General civil rights complaint", url: "https://oag.ca.gov/civil-rights", category: "State Investigation", feeAmount: "Free" },
    { formNumber: "SB-1421 Request", name: "Police Records Request", description: "Request officer misconduct records", url: "https://oag.ca.gov/ab-1421", category: "Transparency", feeAmount: "Free" },
    { formNumber: "Citizen Complaint", name: "Department Internal Affairs Complaint", description: "File with local police department", url: "", category: "Internal Affairs", feeAmount: "Free" },
  ],
  "TX": [
    { formNumber: "TCOLE Complaint", name: "TCOLE Officer Complaint", description: "Complaint to TX Commission on Law Enforcement", url: "https://www.tcole.texas.gov/content/file-complaint", category: "State Licensing", feeAmount: "Free" },
    { formNumber: "AG Civil Rights", name: "TX Attorney General Civil Rights", description: "Report civil rights violations", url: "https://www.texasattorneygeneral.gov/", category: "State Investigation", feeAmount: "Free" },
    { formNumber: "IA Complaint", name: "Internal Affairs Complaint", description: "File with police department", url: "", category: "Internal Affairs", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "CCRB Complaint", name: "NYPD Civilian Complaint Review Board", description: "Independent NYPD oversight complaint", url: "https://www.nyc.gov/site/ccrb/complaints/file-a-complaint.page", category: "Independent Oversight", feeAmount: "Free" },
    { formNumber: "DCJS Complaint", name: "Division of Criminal Justice Services", description: "State police standards complaint", url: "https://www.criminaljustice.ny.gov/", category: "State Licensing", feeAmount: "Free" },
    { formNumber: "AG Pattern", name: "Attorney General Pattern Investigation", description: "Report pattern of police misconduct", url: "https://ag.ny.gov/civil-rights", category: "State Investigation", feeAmount: "Free" },
  ],
  "FL": [
    { formNumber: "FDLE Complaint", name: "FDLE Officer Standards Complaint", description: "Complaint against certified officer", url: "https://www.fdle.state.fl.us/CJSTC/Professional-Compliance", category: "State Licensing", feeAmount: "Free" },
    { formNumber: "IA Complaint", name: "Internal Affairs Complaint", description: "File with local agency", url: "", category: "Internal Affairs", feeAmount: "Free" },
  ],
  "IL": [
    { formNumber: "COPA Complaint", name: "Civilian Office of Police Accountability (Chicago)", description: "Chicago police misconduct", url: "https://www.chicagocopa.org/", category: "Independent Oversight", feeAmount: "Free" },
    { formNumber: "ILCJB Complaint", name: "IL Criminal Justice Licensing Board", description: "State police certification complaint", url: "https://www.ilga.gov/", category: "State Licensing", feeAmount: "Free" },
  ],
};

// Social Worker Complaints by State
export const socialWorkerComplaintsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "BBS Complaint", name: "Board of Behavioral Sciences Complaint", description: "Complaint against licensed social worker", url: "https://www.bbs.ca.gov/consumers/file_complaint.html", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "CDSS Complaint", name: "CDSS CPS Complaint", description: "Complaint about CPS investigation", url: "https://www.cdss.ca.gov/inforesources/community-care-licensing", category: "Agency Oversight", feeAmount: "Free" },
    { formNumber: "Ombudsman", name: "Foster Care Ombudsman Complaint", description: "Foster care system complaints", url: "https://fostercarekids.ca.gov/", category: "Ombudsman", feeAmount: "Free" },
  ],
  "TX": [
    { formNumber: "TSBSWE Complaint", name: "TX Social Work Board Complaint", description: "Complaint against licensed social worker", url: "https://www.dshs.texas.gov/social-work/default.aspx", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "DFPS Complaint", name: "DFPS Investigation Complaint", description: "Complaint about CPS investigation", url: "https://www.dfps.texas.gov/About_DFPS/Contact_Us/", category: "Agency Oversight", feeAmount: "Free" },
    { formNumber: "Ombudsman", name: "Office of the Ombudsman", description: "Foster care and DFPS complaints", url: "https://www.dfps.texas.gov/", category: "Ombudsman", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "NYSED Complaint", name: "Office of Professions Complaint", description: "Licensed social worker complaint", url: "https://www.op.nysed.gov/opd/rasw.htm", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "OCFS Complaint", name: "Office of Children and Family Services", description: "CPS/foster care complaint", url: "https://ocfs.ny.gov/main/", category: "Agency Oversight", feeAmount: "Free" },
    { formNumber: "SCR Hotline", name: "Statewide Central Register Inquiry", description: "Challenge unfounded CPS report", url: "https://ocfs.ny.gov/main/cps/", category: "Record Challenge" },
  ],
  "FL": [
    { formNumber: "DOH SW Complaint", name: "DOH Clinical Social Work Complaint", description: "Licensed social worker complaint", url: "https://www.floridahealth.gov/licensing-and-regulation/social-work/", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "DCF Complaint", name: "DCF Investigation Complaint", description: "Challenge CPS investigation", url: "https://www.myflfamilies.com/", category: "Agency Oversight", feeAmount: "Free" },
    { formNumber: "IG Complaint", name: "Inspector General Complaint", description: "DCF staff misconduct", url: "https://www.myflfamilies.com/service-programs/inspector-general/", category: "Inspector General", feeAmount: "Free" },
  ],
  "IL": [
    { formNumber: "IDFPR Complaint", name: "IDFPR Social Work Complaint", description: "Licensed social worker complaint", url: "https://www.idfpr.com/admin/COMPLAINT.asp", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "DCFS OIG", name: "DCFS Inspector General", description: "DCFS staff misconduct", url: "https://www2.illinois.gov/dcfs/contactus/Pages/default.aspx", category: "Inspector General", feeAmount: "Free" },
  ],
};

// Judicial Complaints by State
export const judicialComplaintsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "CJP Complaint", name: "Commission on Judicial Performance", description: "Complaint against state judge", url: "https://cjp.ca.gov/file-a-complaint/", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Appellate Review", name: "Appeal of Judicial Decision", description: "Challenge judge's ruling on appeal", url: "https://www.courts.ca.gov/selfhelp-appeals.htm", category: "Appeals", feeAmount: "$775" },
    { formNumber: "Recusal Motion", name: "Motion to Recuse/Disqualify Judge", description: "Remove biased judge from case", url: "https://www.courts.ca.gov/documents/ccp170-1.pdf", category: "Recusal" },
  ],
  "TX": [
    { formNumber: "SCJC Complaint", name: "State Commission on Judicial Conduct", description: "Complaint against state judge", url: "https://www.scjc.texas.gov/", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Motion to Recuse", name: "Motion to Recuse Judge", description: "Request judge removal for bias", url: "https://texaslawhelp.org/", category: "Recusal" },
    { formNumber: "Mandamus Petition", name: "Petition for Writ of Mandamus", description: "Challenge judicial abuse of discretion", url: "https://texaslawhelp.org/", category: "Mandamus" },
  ],
  "NY": [
    { formNumber: "CJC Complaint", name: "Commission on Judicial Conduct", description: "Complaint against state judge", url: "https://cjc.ny.gov/Forms/forms.htm", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Article 78", name: "Article 78 Proceeding", description: "Challenge administrative decisions", url: "https://www.nycourts.gov/courthelp/", category: "Review", feeAmount: "$335" },
    { formNumber: "Recusal Motion", name: "Motion for Recusal", description: "Request biased judge removal", url: "https://www.nycourts.gov/courthelp/", category: "Recusal" },
  ],
  "FL": [
    { formNumber: "JQC Complaint", name: "Judicial Qualifications Commission", description: "Complaint against state judge", url: "https://www.floridajqc.com/", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Recusal Motion", name: "Motion to Disqualify Judge", description: "Remove judge for bias", url: "https://www.flcourts.gov/", category: "Recusal" },
  ],
  "IL": [
    { formNumber: "JIB Complaint", name: "Judicial Inquiry Board", description: "Complaint against state judge", url: "https://www.illinois.gov/jib/", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Substitution Motion", name: "Motion for Substitution of Judge", description: "Request different judge (as of right)", url: "https://www.illinoiscourts.gov/", category: "Substitution" },
  ],
};

// Medical Professional Complaints (Doctors, Therapists)
export const medicalComplaintsByState: Record<string, CourtForm[]> = {
  "CA": [
    { formNumber: "MBC Complaint", name: "Medical Board Complaint", description: "Complaint against physician/surgeon", url: "https://www.mbc.ca.gov/Consumers/Complaints/", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "BBS Complaint", name: "Board of Behavioral Sciences", description: "Complaint against therapist/counselor", url: "https://www.bbs.ca.gov/consumers/file_complaint.html", category: "Therapy Licensing", feeAmount: "Free" },
    { formNumber: "BOP Complaint", name: "Board of Psychology Complaint", description: "Complaint against psychologist", url: "https://www.psychology.ca.gov/consumers/filecomplaint.shtml", category: "Psychology Board", feeAmount: "Free" },
    { formNumber: "DCA Complaint", name: "Department of Consumer Affairs", description: "General healthcare professional complaint", url: "https://www.dca.ca.gov/consumers/complaints/index.shtml", category: "General Licensing", feeAmount: "Free" },
  ],
  "TX": [
    { formNumber: "TMB Complaint", name: "TX Medical Board Complaint", description: "Complaint against physician", url: "https://www.tmb.state.tx.us/page/file-a-complaint", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "BHEC Complaint", name: "Behavioral Health Executive Council", description: "Therapist/counselor complaint", url: "https://www.bhec.texas.gov/complaints/index.html", category: "Therapy Licensing", feeAmount: "Free" },
    { formNumber: "TSBEP Complaint", name: "State Board of Examiners of Psychologists", description: "Complaint against psychologist", url: "https://www.tsbep.texas.gov/", category: "Psychology Board", feeAmount: "Free" },
  ],
  "NY": [
    { formNumber: "OPMC Complaint", name: "Office of Professional Medical Conduct", description: "Physician misconduct complaint", url: "https://www.health.ny.gov/professionals/doctors/conduct/file_a_complaint.htm", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "NYSED MH", name: "Office of Professions Mental Health", description: "Therapist/counselor complaint", url: "https://www.op.nysed.gov/opd/", category: "Therapy Licensing", feeAmount: "Free" },
    { formNumber: "Psychology Complaint", name: "State Board of Psychology", description: "Psychologist complaint", url: "https://www.op.nysed.gov/prof/psych/", category: "Psychology Board", feeAmount: "Free" },
  ],
  "FL": [
    { formNumber: "DOH MQA Complaint", name: "DOH Medical Quality Assurance", description: "Physician complaint", url: "https://www.floridahealth.gov/licensing-and-regulation/enforcement/index.html", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "491 Board Complaint", name: "Board of Clinical Social Work", description: "Therapist/counselor complaint", url: "https://floridasmentalhealthprofessions.gov/", category: "Therapy Licensing", feeAmount: "Free" },
    { formNumber: "Psychology Complaint", name: "Board of Psychology Complaint", description: "Psychologist complaint", url: "https://floridasmentalhealthprofessions.gov/", category: "Psychology Board", feeAmount: "Free" },
  ],
  "IL": [
    { formNumber: "IDFPR Medical", name: "IDFPR Medical Complaint", description: "Physician misconduct complaint", url: "https://www.idfpr.com/admin/COMPLAINT.asp", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "IDFPR MH", name: "IDFPR Mental Health Complaint", description: "Therapist/counselor complaint", url: "https://www.idfpr.com/admin/COMPLAINT.asp", category: "Therapy Licensing", feeAmount: "Free" },
    { formNumber: "Psychology Complaint", name: "Clinical Psychology Complaint", description: "Psychologist complaint", url: "https://www.idfpr.com/profs/psych.asp", category: "Psychology Board", feeAmount: "Free" },
  ],
};

// Federal agency complaints (apply to all states)
export const federalAgencyComplaints: CourtForm[] = [
  { formNumber: "DOJ Civil Rights", name: "DOJ Civil Rights Division", description: "Federal civil rights violations", url: "https://civilrights.justice.gov/report/", category: "Federal Oversight", feeAmount: "Free" },
  { formNumber: "FBI Civil Rights", name: "FBI Civil Rights Report", description: "Color of law violations, hate crimes", url: "https://www.fbi.gov/investigate/civil-rights", category: "Federal Investigation", feeAmount: "Free" },
  { formNumber: "USDOJ Pattern", name: "DOJ Pattern & Practice Investigation", description: "Request systemic police investigation", url: "https://www.justice.gov/crt/addressing-police-misconduct-laws-enforced-department-justice", category: "Systemic Investigation", feeAmount: "Free" },
  { formNumber: "HHS OCR", name: "HHS Office for Civil Rights", description: "Healthcare discrimination complaint", url: "https://www.hhs.gov/civil-rights/filing-a-complaint/index.html", category: "Healthcare Rights", feeAmount: "Free" },
  { formNumber: "Federal Judicial", name: "Judicial Council Complaint", description: "Complaint against federal judge", url: "https://www.uscourts.gov/judges-judgeships/judicial-conduct-disability", category: "Federal Judiciary", feeAmount: "Free" },
];

// Combine all agency complaints
export function getAgencyComplaints(stateCode: string): {
  police: CourtForm[];
  socialWorkers: CourtForm[];
  judicial: CourtForm[];
  medical: CourtForm[];
  federal: CourtForm[];
} {
  const defaultPolice: CourtForm[] = [
    { formNumber: "IA Complaint", name: "Internal Affairs Complaint", description: "File with local police department", url: "", category: "Internal Affairs", feeAmount: "Free" },
    { formNumber: "State Licensing", name: "State Police Standards Complaint", description: "Complaint to state licensing agency", url: "", category: "State Licensing", feeAmount: "Free" },
  ];

  const defaultSocialWorker: CourtForm[] = [
    { formNumber: "Licensing Board", name: "Social Work Licensing Board", description: "Complaint against licensed social worker", url: "", category: "Licensing Board", feeAmount: "Free" },
    { formNumber: "CPS Oversight", name: "Child Welfare Agency Oversight", description: "Complaint about CPS investigation", url: "", category: "Agency Oversight", feeAmount: "Free" },
  ];

  const defaultJudicial: CourtForm[] = [
    { formNumber: "Judicial Conduct", name: "Judicial Conduct Commission", description: "Complaint against state judge", url: "", category: "Judicial Conduct", feeAmount: "Free" },
    { formNumber: "Recusal Motion", name: "Motion to Recuse Judge", description: "Request removal of biased judge", url: "", category: "Recusal" },
  ];

  const defaultMedical: CourtForm[] = [
    { formNumber: "Medical Board", name: "State Medical Board Complaint", description: "Complaint against physician", url: "", category: "Medical Board", feeAmount: "Free" },
    { formNumber: "Therapy Board", name: "Therapy Licensing Board", description: "Complaint against therapist/counselor", url: "", category: "Therapy Licensing", feeAmount: "Free" },
  ];

  return {
    police: policeComplaintsByState[stateCode] || defaultPolice,
    socialWorkers: socialWorkerComplaintsByState[stateCode] || defaultSocialWorker,
    judicial: judicialComplaintsByState[stateCode] || defaultJudicial,
    medical: medicalComplaintsByState[stateCode] || defaultMedical,
    federal: federalAgencyComplaints,
  };
}

// Get all agency complaint forms as flat array
export function getAllAgencyComplaintForms(stateCode: string): CourtForm[] {
  const complaints = getAgencyComplaints(stateCode);
  return [
    ...complaints.police,
    ...complaints.socialWorkers,
    ...complaints.judicial,
    ...complaints.medical,
    ...complaints.federal,
  ];
}
