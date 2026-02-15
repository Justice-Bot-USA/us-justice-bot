const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STATE_FOIA_STATUTES: Record<string, { name: string; cite: string }> = {
  Alabama: { name: "Alabama Open Records Act", cite: "Ala. Code §§ 36-12-40 to 36-12-41" },
  Alaska: { name: "Alaska Public Records Act", cite: "Alaska Stat. §§ 40.25.100–40.25.220" },
  Arizona: { name: "Arizona Public Records Law", cite: "Ariz. Rev. Stat. §§ 39-121–39-161" },
  Arkansas: { name: "Arkansas FOIA", cite: "Ark. Code Ann. §§ 25-19-101–25-19-110" },
  California: { name: "California Public Records Act", cite: "Cal. Gov. Code §§ 7920.000–7931.000" },
  Colorado: { name: "Colorado Open Records Act (CORA)", cite: "Colo. Rev. Stat. §§ 24-72-200.1–24-72-206" },
  Connecticut: { name: "Connecticut FOIA", cite: "Conn. Gen. Stat. §§ 1-200–1-242" },
  Delaware: { name: "Delaware FOIA", cite: "Del. Code Ann. tit. 29, §§ 10001–10007" },
  Florida: { name: "Florida Public Records Act", cite: "Fla. Stat. § 119" },
  Georgia: { name: "Georgia Open Records Act", cite: "O.C.G.A. §§ 50-18-70–50-18-77" },
  Hawaii: { name: "Hawaii Uniform Information Practices Act", cite: "Haw. Rev. Stat. §§ 92F-1–92F-42" },
  Idaho: { name: "Idaho Public Records Act", cite: "Idaho Code §§ 74-101–74-126" },
  Illinois: { name: "Illinois FOIA", cite: "5 ILCS 140/1–140/11.5" },
  Indiana: { name: "Indiana Access to Public Records Act", cite: "Ind. Code §§ 5-14-3-1–5-14-3-10" },
  Iowa: { name: "Iowa Open Records Act", cite: "Iowa Code §§ 22.1–22.14" },
  Kansas: { name: "Kansas Open Records Act", cite: "Kan. Stat. Ann. §§ 45-215–45-223" },
  Kentucky: { name: "Kentucky Open Records Act", cite: "Ky. Rev. Stat. §§ 61.870–61.884" },
  Louisiana: { name: "Louisiana Public Records Act", cite: "La. Rev. Stat. §§ 44:1–44:41" },
  Maine: { name: "Maine FOAA", cite: "Me. Rev. Stat. tit. 1, §§ 400–414" },
  Maryland: { name: "Maryland PIA", cite: "Md. Code, Gen. Prov. §§ 4-101–4-601" },
  Massachusetts: { name: "Massachusetts Public Records Law", cite: "Mass. Gen. Laws ch. 66 § 10" },
  Michigan: { name: "Michigan FOIA", cite: "Mich. Comp. Laws §§ 15.231–15.246" },
  Minnesota: { name: "Minnesota Government Data Practices Act", cite: "Minn. Stat. §§ 13.01–13.90" },
  Mississippi: { name: "Mississippi Public Records Act", cite: "Miss. Code Ann. §§ 25-61-1–25-61-17" },
  Missouri: { name: "Missouri Sunshine Law", cite: "Mo. Rev. Stat. §§ 610.010–610.035" },
  Montana: { name: "Montana Constitution Art. II, § 9", cite: "Mont. Code Ann. §§ 2-6-101–2-6-112" },
  Nebraska: { name: "Nebraska Public Records Act", cite: "Neb. Rev. Stat. §§ 84-712–84-712.09" },
  Nevada: { name: "Nevada Public Records Act", cite: "Nev. Rev. Stat. §§ 239.005–239.030" },
  "New Hampshire": { name: "New Hampshire Right-to-Know Law", cite: "N.H. Rev. Stat. Ann. §§ 91-A:1–91-A:10" },
  "New Jersey": { name: "New Jersey OPRA", cite: "N.J. Stat. Ann. §§ 47:1A-1–47:1A-13" },
  "New Mexico": { name: "New Mexico IPRA", cite: "N.M. Stat. Ann. §§ 14-2-1–14-2-12" },
  "New York": { name: "New York FOIL", cite: "N.Y. Pub. Off. Law §§ 84–90" },
  "North Carolina": { name: "North Carolina Public Records Act", cite: "N.C. Gen. Stat. §§ 132-1–132-10" },
  "North Dakota": { name: "North Dakota Open Records Law", cite: "N.D. Cent. Code §§ 44-04-18–44-04-18.27" },
  Ohio: { name: "Ohio Public Records Act", cite: "Ohio Rev. Code § 149.43" },
  Oklahoma: { name: "Oklahoma Open Records Act", cite: "Okla. Stat. tit. 51, §§ 24A.1–24A.30" },
  Oregon: { name: "Oregon Public Records Law", cite: "Or. Rev. Stat. §§ 192.311–192.478" },
  Pennsylvania: { name: "Pennsylvania Right-to-Know Law", cite: "65 Pa. Stat. §§ 67.101–67.3104" },
  "Rhode Island": { name: "Rhode Island APRA", cite: "R.I. Gen. Laws §§ 38-2-1–38-2-15" },
  "South Carolina": { name: "South Carolina FOIA", cite: "S.C. Code Ann. §§ 30-4-10–30-4-165" },
  "South Dakota": { name: "South Dakota Open Records Law", cite: "S.D. Codified Laws §§ 1-27-1–1-27-46" },
  Tennessee: { name: "Tennessee Public Records Act", cite: "Tenn. Code Ann. §§ 10-7-503–10-7-512" },
  Texas: { name: "Texas Public Information Act", cite: "Tex. Gov't Code §§ 552.001–552.353" },
  Utah: { name: "Utah GRAMA", cite: "Utah Code Ann. §§ 63G-2-101–63G-2-901" },
  Vermont: { name: "Vermont Public Records Act", cite: "Vt. Stat. Ann. tit. 1, §§ 315–320" },
  Virginia: { name: "Virginia FOIA", cite: "Va. Code Ann. §§ 2.2-3700–2.2-3714" },
  Washington: { name: "Washington Public Records Act", cite: "Wash. Rev. Code §§ 42.56.001–42.56.904" },
  "West Virginia": { name: "West Virginia FOIA", cite: "W. Va. Code §§ 29B-1-1–29B-1-7" },
  Wisconsin: { name: "Wisconsin Open Records Law", cite: "Wis. Stat. §§ 19.31–19.39" },
  Wyoming: { name: "Wyoming Public Records Act", cite: "Wyo. Stat. Ann. §§ 16-4-201–16-4-205" },
  "District of Columbia": { name: "DC FOIA", cite: "D.C. Code §§ 2-531–2-540" },
};

function generateRequestLetter(params: {
  state: string;
  recordType: string;
  agencyName: string;
  subjectName: string;
  caseNumber: string;
  approxDate: string;
  additionalDetails: string;
}): { letter: string; statute: { name: string; cite: string } | null } {
  const statute = STATE_FOIA_STATUTES[params.state] || null;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const agency = params.agencyName || `[Name of Agency — ${params.state}]`;
  const subject = params.subjectName || "[Subject Name]";
  const caseRef = params.caseNumber
    ? `Case/Docket Number: ${params.caseNumber}\n`
    : "";
  const dateRef = params.approxDate
    ? `Approximate Date of Incident/Arrest: ${params.approxDate}\n`
    : "";
  const details = params.additionalDetails
    ? `\nAdditional identifying information:\n${params.additionalDetails}\n`
    : "";

  const statuteRef = statute
    ? `This request is made pursuant to the ${statute.name} (${statute.cite}).`
    : `This request is made pursuant to the applicable state public records law.`;

  const letter = `PUBLIC RECORDS REQUEST

Date: ${today}

To: Records Custodian
${agency}
[Agency Address]
[City, State ZIP]

Re: Public Records Request — ${params.recordType}

Dear Records Custodian:

${statuteRef} I am requesting access to and copies of the following public records:

REQUESTED RECORD(S):
${params.recordType}

IDENTIFYING INFORMATION:
Subject Name: ${subject}
${caseRef}${dateRef}${details}
I request that these records be provided in electronic format if available. If any portion of the requested records is exempt from disclosure, I request that the non-exempt portions be provided along with a citation to the specific statutory exemption relied upon for any redaction or withholding.

${statute ? `Under ${statute.cite}, you are required to respond to this request within the timeframe prescribed by law.` : "Please respond within the timeframe prescribed by your state's public records law."}

If there are any fees associated with processing this request, please notify me before proceeding if the cost exceeds $25.00. I am willing to pay reasonable fees for copying and transmission.

If you are not the custodian of the records requested, please forward this request to the appropriate custodian and notify me of the transfer.

Thank you for your prompt attention to this matter.

Sincerely,
[Your Full Name]
[Your Address]
[City, State ZIP]
[Your Email Address]
[Your Phone Number]

---
STATUTORY REFERENCE: ${statute ? `${statute.name} — ${statute.cite}` : "Applicable state public records law"}

DISCLAIMER: This letter was generated by Veritas Path — A Justice-Bot Technologies Platform. This is legal information, not legal advice. The user is responsible for submitting this request and verifying its accuracy. Veritas Path does not access law enforcement databases and does not determine whether an active warrant exists.`;

  return { letter, statute };
}

function suggestAgencies(state: string): string[] {
  // Common agency types for warrant-related records by state
  return [
    `${state} State Police — Records Division`,
    `${state} Bureau of Investigation`,
    `${state} Department of Public Safety`,
    `County Sheriff's Office — Records Unit`,
    `County Clerk of Courts — Criminal Division`,
    `Municipal Police Department — Records`,
    `County Jail — Records/Intake`,
    `State Attorney General — Public Records`,
  ];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "suggest_agencies") {
      const { state } = body;
      if (!state) {
        return new Response(
          JSON.stringify({ success: false, error: "State is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const agencies = suggestAgencies(state);
      return new Response(
        JSON.stringify({ success: true, agencies }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "generate_letter") {
      const { state, recordType, agencyName, subjectName, caseNumber, approxDate, additionalDetails } = body;

      if (!state || !recordType) {
        return new Response(
          JSON.stringify({ success: false, error: "State and record type are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { letter, statute } = generateRequestLetter({
        state,
        recordType,
        agencyName: agencyName || "",
        subjectName: subjectName || "",
        caseNumber: caseNumber || "",
        approxDate: approxDate || "",
        additionalDetails: additionalDetails || "",
      });

      return new Response(
        JSON.stringify({
          success: true,
          letter,
          statute: statute
            ? { name: statute.name, citation: statute.cite }
            : null,
          disclaimer:
            "This is legal information, not legal advice. This tool does not access law enforcement databases. Users submit requests themselves.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("FOIA request generator error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
