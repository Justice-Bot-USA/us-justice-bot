import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { caseData, uploadedFiles } = await req.json();
    
    console.log('Analyzing case merit with AI:', { caseData, uploadedFiles });

    // Fetch and analyze uploaded documents
    let documentContents = '';
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log('Fetching uploaded documents for analysis...');
      for (const file of uploadedFiles) {
        try {
          const { data, error } = await supabaseClient
            .from('case_files')
            .select('file_name, file_type, description')
            .eq('id', file.id)
            .single();
          
          if (!error && data) {
            documentContents += `\n\nDocument: ${data.file_name} (${data.file_type})`;
            if (data.description) {
              documentContents += `\nDescription: ${data.description}`;
            }
          }
        } catch (err) {
          console.error('Error fetching document:', err);
        }
      }
    }

    // Determine if this is a criminal case
    const isCriminalCase = caseData.legalArea?.toLowerCase().includes('criminal') || 
                           caseData.legalArea?.toLowerCase().includes('defense') ||
                           caseData.legalArea?.toLowerCase().includes('dui') ||
                           caseData.legalArea?.toLowerCase().includes('felony') ||
                           caseData.legalArea?.toLowerCase().includes('misdemeanor');

    // Construct comprehensive AI prompt with USA case law search and criminal law coverage
    const aiPrompt = `You are an expert US legal analyst with comprehensive knowledge of:
- All 50 US state court systems, county courts, and federal district courts
- State-specific criminal codes, penal codes, and sentencing guidelines
- Civil procedure and criminal procedure for each state
- Case law databases including Westlaw, LexisNexis, and state court records
- Official court forms, filing procedures, and local rules for all jurisdictions

CASE INFORMATION:
Title: ${caseData.title}
Description: ${caseData.description}
State: ${caseData.state}
County: ${caseData.county || 'Not specified'}
Legal Area: ${caseData.legalArea}
Case Type: ${isCriminalCase ? 'CRIMINAL' : 'CIVIL'}

UPLOADED DOCUMENTS:
${documentContents || 'No documents uploaded yet'}

CRITICAL REQUIREMENTS - USA CASE LAW SEARCH:

1. **USA CASE LAW & PRECEDENT SEARCH** - Foundation for merit scoring:
   - Search and cite REAL ${caseData.state} case law from ${caseData.state} Supreme Court, Court of Appeals, and trial courts
   - Include specific case citations in proper Bluebook format (e.g., Smith v. Jones, 123 ${caseData.state === 'California' ? 'Cal.App.4th' : caseData.state === 'New York' ? 'N.Y.2d' : caseData.state === 'Texas' ? 'S.W.3d' : caseData.state === 'Florida' ? 'So.3d' : 'State Reporter'} 456 (2023))
   - Reference landmark US Supreme Court cases if applicable to this legal area
   - Cite ${caseData.state} appellate decisions that establish precedent for this type of case
   - Include both favorable and unfavorable precedents to give realistic assessment
   - Note any circuit splits or conflicting precedents within ${caseData.state}
   ${caseData.county ? `- Search ${caseData.county} County court records for similar local cases` : ''}

${isCriminalCase ? `
2. **CRIMINAL LAW ANALYSIS FOR ${caseData.state.toUpperCase()}**:
   - Cite the specific ${caseData.state} Penal Code / Criminal Code sections applicable
   - Reference ${caseData.state} sentencing guidelines and ranges for the charges
   - Include mandatory minimums, enhancements, and aggravating/mitigating factors under ${caseData.state} law
   - Note ${caseData.state}-specific plea bargaining practices and prosecutorial discretion patterns
   - Reference ${caseData.state} rules of criminal procedure
   - Include bail/bond guidelines for ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}
   - Cite relevant 4th, 5th, 6th Amendment case law as applied in ${caseData.state} courts
   - Reference ${caseData.state} expungement/record sealing laws if applicable
   - Include diversion programs, drug courts, or alternative sentencing options available in ${caseData.state}
   - Note ${caseData.state}-specific rights of the accused and procedural protections

3. **CRIMINAL DEFENSE STRATEGY FOR ${caseData.state.toUpperCase()}**:
   - Identify potential defenses recognized under ${caseData.state} law
   - Reference ${caseData.state} case law supporting each defense theory
   - Note evidentiary challenges specific to ${caseData.state} rules of evidence
   - Include ${caseData.state} speedy trial rights and deadlines
   - Reference motion practice common in ${caseData.state} criminal courts (motions to suppress, dismiss, etc.)
   - Note ${caseData.state}-specific discovery rules in criminal cases
` : `
2. **CIVIL LAW ANALYSIS FOR ${caseData.state.toUpperCase()}**:
   - Cite specific ${caseData.state} statutes, codes, and regulations applicable to this ${caseData.legalArea} case
   - Reference ${caseData.state} civil procedure rules and court rules
   - Include ${caseData.state}-specific filing deadlines and statute of limitations
   - Note any recent ${caseData.state} legislative changes affecting this case type
`}

3. **MERIT SCORE CALCULATION** (0-100) - Based on ${caseData.state} Law:
   - Base score on strength of ${caseData.state} case law precedent support
   - Weight factors: ${isCriminalCase ? 'Constitutional issues (30%), Evidence suppressibility (25%), Precedent alignment (25%), Prosecutorial practices (20%)' : 'Precedent alignment (40%), Evidence strength (30%), Legal basis (20%), Procedural compliance (10%)'}
   - Provide detailed justification referencing SPECIFIC ${caseData.state} cases and statutes
   - Explain how similar cases have been decided in ${caseData.state} courts
   - Account for ${caseData.county ? `${caseData.county} County` : caseData.state} court tendencies and judicial patterns

4. **${caseData.state.toUpperCase()} JURISDICTION-SPECIFIC FORMS**:
   - Provide ACTUAL legal forms required for filing in ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}
   - Include exact form numbers/codes used by ${caseData.state} courts
   - Specify the correct court level (${isCriminalCase ? 'Municipal Court, County Court, District Court, Superior Court' : 'Small Claims, Superior Court, District Court, etc.'})
   - Include official URLs to obtain each form from ${caseData.state} court websites
   - Note any county-specific forms or local rule requirements
   - List forms in the order they should be filed

5. **${caseData.state.toUpperCase()} STATE-SPECIFIC LEGAL PATHWAY**:
   - Map complete legal journey specific to ${caseData.state} ${isCriminalCase ? 'criminal' : 'civil'} procedure
   - Include ${isCriminalCase ? 'arraignment, preliminary hearing, grand jury, trial, sentencing' : 'initial filing through discovery, motions, trial, and judgment'} timelines for ${caseData.state}
   - Reference ${caseData.state} court rules and procedures at each step
   - Include ${caseData.state}-specific filing deadlines and limitations periods
   - Note any recent ${caseData.state} procedural changes

6. **${caseData.county ? caseData.county.toUpperCase() + ' COUNTY' : caseData.state.toUpperCase()} LOCAL PROCEDURES**:
   - Local court filing procedures, hours, and administrative requirements
   - County-specific filing fees and payment methods for ${caseData.state}
   - Local rules that differ from ${caseData.state} state rules
   - Electronic filing requirements and portals (${caseData.state} e-filing systems)
   - Courthouse locations and department/division assignments
   ${isCriminalCase ? '- Local bail schedules and booking procedures' : '- Local mediation or ADR requirements'}

7. **COMPREHENSIVE ${caseData.state.toUpperCase()} ANALYSIS**:
   - Evidence requirements under ${caseData.state} Rules of Evidence
   - ${isCriminalCase ? `Public defender availability and private attorney costs in ${caseData.state}` : `Pro se vs attorney options with cost-benefit for ${caseData.state}`}
   - ${isCriminalCase ? `Sentencing ranges based on ${caseData.state} guidelines and similar cases` : `Settlement ranges based on ${caseData.state} jury verdicts and case outcomes`}
   - Time to resolution considering current ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''} court backlogs

Return your analysis in valid JSON format with this exact structure:
{
  "meritScore": number (0-100),
  "meritScoreJustification": "Detailed explanation of how merit score was calculated, referencing specific ${caseData.state} case law, precedents, and the weighting formula used",
  "legalCategory": "specific ${isCriminalCase ? 'criminal offense category' : 'legal category'} under ${caseData.state} law",
  "caseType": "${isCriminalCase ? 'CRIMINAL' : 'CIVIL'}",
  "caseLawPrecedents": [
    {
      "caseName": "Plaintiff v. Defendant (use real ${caseData.state} case names)",
      "citation": "Full Bluebook citation (e.g., 123 ${caseData.state === 'California' ? 'Cal.App.4th' : caseData.state === 'New York' ? 'N.Y.2d' : caseData.state === 'Texas' ? 'S.W.3d' : caseData.state === 'Florida' ? 'So.3d' : 'State Reporter'} 456 (Year))",
      "court": "${caseData.state} court name (Supreme Court, Court of Appeals, etc.)",
      "year": year,
      "relevance": "How this case directly relates to the current matter",
      "outcome": "How the case was decided and key holdings",
      "impact": "How this precedent affects the merit score - positive or negative"
    }
  ],
  ${isCriminalCase ? `"criminalCharges": {
    "offenseType": "Felony/Misdemeanor/Infraction classification under ${caseData.state} law",
    "statutoryReference": "${caseData.state} Penal/Criminal Code section",
    "elements": ["List of elements prosecution must prove under ${caseData.state} law"],
    "sentencingRange": {"min": "minimum sentence", "max": "maximum sentence", "guidelines": "${caseData.state} sentencing guidelines reference"},
    "enhancements": ["Applicable sentence enhancements under ${caseData.state} law"],
    "mitigatingFactors": ["Factors that could reduce sentence under ${caseData.state} law"],
    "defenses": ["Recognized defenses under ${caseData.state} law with case law support"],
    "bailInformation": {"typicalBail": "Amount based on ${caseData.state} bail schedules", "factors": ["Factors affecting bail determination"]},
    "diversionOptions": ["Available diversion programs in ${caseData.state}"],
    "expungementEligibility": "Whether and when record can be sealed/expunged under ${caseData.state} law"
  },` : ''}
  "strengthFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation with ${caseData.state} case law support", "supportingCases": ["Case citations"]}],
  "weaknessFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation with ${caseData.state} precedent concerns", "adverseCases": ["Case citations"]}],
  "relevantLaws": [{"title": "${caseData.state} statute/code name", "citation": "Full citation (e.g., ${caseData.state === 'California' ? 'Cal. Penal Code § 123' : caseData.state === 'New York' ? 'N.Y. Penal Law § 123' : caseData.state === 'Texas' ? 'Tex. Penal Code § 123' : caseData.state === 'Florida' ? 'Fla. Stat. § 123' : 'State Code § 123'})", "relevance": 0.0-1.0, "summary": "what it means for this case", "casesThatAppliedThis": ["Case citations from ${caseData.state} courts"]}],
  "legalPathway": [
    {
      "step": number,
      "action": "Specific action required under ${caseData.state} ${isCriminalCase ? 'criminal' : 'civil'} procedure",
      "timeline": "When this should occur based on ${caseData.state} rules",
      "location": "Court/tribunal/office in ${caseData.state}",
      "requirements": ["What's needed for this step under ${caseData.state} law"],
      "formsCited": ["${caseData.state} form numbers needed at this step"],
      "estimatedCost": "Dollar amount based on ${caseData.state} fee schedules"
    }
  ],
  "requiredForms": [
    {
      "formName": "Official ${caseData.state} form name", 
      "formNumber": "${caseData.state} form number/code",
      "purpose": "Why this form is required under ${caseData.state} procedure",
      "where": "Official ${caseData.state} courts URL to obtain",
      "filingOrder": number,
      "fees": "Filing fee per ${caseData.state} fee schedule",
      "courtLevel": "${isCriminalCase ? 'Municipal/County/District/Superior' : 'Small Claims/Superior/District'} Court",
      "deadline": "Filing deadline under ${caseData.state} rules",
      "helpResources": "${caseData.state} self-help resources"
    }
  ],
  "tribunalAppearances": [
    {
      "appearanceType": "${isCriminalCase ? 'Arraignment/Preliminary Hearing/Pre-Trial/Trial/Sentencing' : 'Initial Hearing/Status Conference/Pre-Trial/Trial'}",
      "estimatedTimeframe": "Weeks/months from filing based on ${caseData.state} court schedules",
      "location": "Courthouse name and address in ${caseData.state}",
      "preparation": ["What to prepare for this ${caseData.state} court appearance"],
      "canAppearRemotely": boolean,
      "typicalDuration": "How long based on ${caseData.state} court practices"
    }
  ],
  "evidenceToGather": [{"type": "evidence type", "importance": "high/medium/low", "howToObtain": "specific instructions", "legalBasis": "${caseData.state} Rules of Evidence reference", "precedentSupport": "${caseData.state} cases where this evidence was pivotal"}],
  "filingOptions": {
    "${isCriminalCase ? 'publicDefender' : 'proSe'}": "${isCriminalCase ? `Public defender availability and qualifications in ${caseData.state}` : `Detailed explanation of representing yourself in ${caseData.state}`}",
    "withAttorney": "Benefits of ${isCriminalCase ? 'private criminal defense' : 'attorney'} representation in ${caseData.state}",
    "recommendation": "Which is better for this case type and why based on ${caseData.state} practices",
    "courtSelfHelpResources": "Available resources in ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}",
    "expectedAttorneyCost": "Range of ${isCriminalCase ? 'criminal defense attorney' : 'legal representation'} costs in ${caseData.state}"
  },
  "estimatedSuccessRate": number (0-100),
  "${isCriminalCase ? 'sentencingOutcomes' : 'settlementRange'}": ${isCriminalCase ? '{"bestCase": "Most favorable outcome", "likelyCase": "Most probable outcome based on ${caseData.state} data", "worstCase": "Maximum exposure", "basis": "Based on ${caseData.state} sentencing data and similar cases"}' : '{"min": number, "max": number, "basis": "Based on ${caseData.state} jury verdict data and case outcomes"}'},
  "timeToResolutionMonths": number,
  "complexityScore": number (1-10),
  "nextSteps": [
    "Immediate action 1 specific to ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''} ${isCriminalCase ? 'criminal' : 'civil'} procedure",
    "Immediate action 2",
    "Immediate action 3"
  ],
  "jurisdictionNotes": "Critical ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''} specific information including local rules, recent legal changes, judicial tendencies, and ${isCriminalCase ? 'prosecutorial practices' : 'court practices'}"
}`;

    console.log('Calling Lovable AI for USA case law analysis...');
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are an expert US legal analyst with comprehensive knowledge of:

**ALL 50 US STATE LEGAL SYSTEMS:**
- State court hierarchies (Supreme Courts, Courts of Appeal, Trial Courts) for all 50 states
- State-specific civil codes, penal codes, family codes, and administrative codes
- County court systems, local rules, and municipal ordinances
- Federal district courts and their interaction with state law

**CRIMINAL LAW EXPERTISE (All 50 States):**
- State penal codes and criminal statutes for every US state
- Sentencing guidelines, mandatory minimums, and enhancement provisions
- Constitutional criminal procedure (4th, 5th, 6th Amendment applications)
- State-specific criminal defense strategies and motions practice
- Bail and pretrial detention rules by state
- Expungement, sealing, and record clearing laws by state
- Plea bargaining practices and prosecutorial discretion patterns
- Diversion programs, drug courts, and alternative sentencing by state

**CIVIL LAW EXPERTISE (All 50 States):**
- Civil procedure rules for each state court system
- Statute of limitations for all claim types by state
- Discovery rules and motion practice by state
- Settlement negotiations and jury verdict data
- Pro se representation resources by state

**CASE LAW DATABASES:**
- State Supreme Court decisions for all 50 states
- State appellate court decisions with proper Bluebook citations
- US Supreme Court constitutional precedents
- Federal circuit court decisions affecting state law
- Trial court decisions and unpublished opinions when relevant

**PRACTICAL KNOWLEDGE:**
- Accurate court forms with official form numbers for each state
- Filing fees and fee schedules by state and county
- Court websites and e-filing systems by state
- Self-help resources and legal aid organizations by state
- Attorney fee ranges by state and practice area

You MUST provide:
1. REAL case citations in proper Bluebook format - no fabricated cases
2. Actual state statute citations (e.g., Cal. Penal Code § 187, N.Y. Penal Law § 125.25, Tex. Penal Code § 19.02)
3. Official court form numbers used by each state's judicial council
4. Accurate filing fees based on current state fee schedules
5. Realistic timeline estimates based on actual court backlogs

For CRIMINAL cases, always include:
- Specific criminal statute violated with elements
- Sentencing range under state law
- Available defenses with supporting case law
- Constitutional issues and suppression motion potential
- Plea bargaining considerations for the jurisdiction`
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Content:', aiContent);
      throw new Error('Failed to parse AI analysis response');
    }

    // Generate improvement suggestions based on merit score and weaknesses
    const improvementSuggestions = [];
    
    if (analysis.meritScore < 70) {
      improvementSuggestions.push({
        category: 'Evidence',
        suggestion: 'Your case would benefit from stronger documentation. Focus on gathering the evidence items listed in the Evidence tab.',
        priority: 'high'
      });
    }
    
    if (analysis.weaknessFactors && analysis.weaknessFactors.length > analysis.strengthFactors.length) {
      improvementSuggestions.push({
        category: 'Case Strength',
        suggestion: 'Address the weaknesses identified in your case. Consider consulting with an attorney to strengthen your position.',
        priority: 'high'
      });
    }
    
    if (!uploadedFiles || uploadedFiles.length < 3) {
      improvementSuggestions.push({
        category: 'Documentation',
        suggestion: 'Upload more supporting documents and evidence. Photos, contracts, emails, and witness statements can significantly improve your merit score.',
        priority: 'medium'
      });
    }

    // Create case merit score record with comprehensive AI analysis including case law
    const { data: caseRecord, error: insertError } = await supabaseClient
      .from('case_merit_scores')
      .insert({
        user_id: caseData.userId,
        session_id: caseData.sessionId,
        case_title: caseData.title,
        case_description: caseData.description,
        state: caseData.state,
        county: caseData.county,
        legal_area: analysis.legalCategory || caseData.legalArea,
        merit_score: analysis.meritScore,
        strength_factors: analysis.strengthFactors,
        weakness_factors: analysis.weaknessFactors,
        relevant_laws: analysis.relevantLaws,
        supporting_evidence: uploadedFiles || [],
        estimated_success_rate: analysis.estimatedSuccessRate,
        settlement_range_min: analysis.settlementRange?.min || 0,
        settlement_range_max: analysis.settlementRange?.max || 0,
        time_to_resolution_months: analysis.timeToResolutionMonths,
        complexity_score: analysis.complexityScore,
        legal_pathway: analysis.legalPathway || [],
        required_forms: analysis.requiredForms || [],
        evidence_to_gather: analysis.evidenceToGather || [],
        filing_options: analysis.filingOptions || {},
        next_steps: analysis.nextSteps || [],
        improvement_suggestions: improvementSuggestions,
        status: 'analyzed'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting case merit score:', insertError);
      throw insertError;
    }

    console.log('Case analysis completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        meritScore: analysis.meritScore.toFixed(2),
        meritScoreJustification: analysis.meritScoreJustification,
        legalCategory: analysis.legalCategory,
        analysis: {
          caseLawPrecedents: analysis.caseLawPrecedents || [],
          strengthFactors: analysis.strengthFactors,
          weaknessFactors: analysis.weaknessFactors,
          relevantLaws: analysis.relevantLaws,
          legalPathway: analysis.legalPathway,
          requiredForms: analysis.requiredForms,
          tribunalAppearances: analysis.tribunalAppearances || [],
          evidenceToGather: analysis.evidenceToGather,
          filingOptions: analysis.filingOptions,
          estimatedSuccessRate: analysis.estimatedSuccessRate?.toFixed(2) || '0.00',
          settlementRange: {
            min: analysis.settlementRange?.min?.toFixed(2) || '0.00',
            max: analysis.settlementRange?.max?.toFixed(2) || '0.00',
            basis: analysis.settlementRange?.basis || ''
          },
          timeToResolutionMonths: analysis.timeToResolutionMonths,
          complexityScore: analysis.complexityScore,
          nextSteps: analysis.nextSteps,
          jurisdictionNotes: analysis.jurisdictionNotes,
          improvementSuggestions
        },
        caseId: caseRecord.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing case merit:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});