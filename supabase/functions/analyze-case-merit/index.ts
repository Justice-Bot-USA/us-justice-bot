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

    // Construct comprehensive AI prompt with emphasis on jurisdiction-specific forms
    const aiPrompt = `You are an expert legal analyst with deep knowledge of US state and county court systems, filing procedures, legal forms, and case law precedents.

CASE INFORMATION:
Title: ${caseData.title}
Description: ${caseData.description}
State: ${caseData.state}
County: ${caseData.county || 'Not specified'}
Legal Area: ${caseData.legalArea}

UPLOADED DOCUMENTS:
${documentContents || 'No documents uploaded yet'}

CRITICAL REQUIREMENTS:

1. **CASE LAW & PRECEDENT ANALYSIS** - Foundation for merit scoring:
   - Reference relevant ${caseData.state} case law and legal precedents in ${caseData.legalArea}
   - Cite specific court decisions from ${caseData.state}${caseData.county ? ` and ${caseData.county} County courts` : ''} that are similar to this case
   - Compare this case to successful/unsuccessful precedents in the jurisdiction
   - Explain how precedents support or undermine the merit score
   - Include both appellate and trial court decisions when relevant
   - Note any recent rulings that changed the legal landscape in ${caseData.state}

2. **MERIT SCORE CALCULATION** (0-100):
   - Base score on strength of case law support in ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}
   - Weight factors: Precedent alignment (40%), Evidence strength (30%), Legal basis (20%), Procedural compliance (10%)
   - Provide detailed justification referencing specific cases and statutes
   - Explain how similar cases have fared in ${caseData.state} courts
   - Account for local court tendencies and judicial patterns${caseData.county ? ` in ${caseData.county} County` : ''}

3. **JURISDICTION-SPECIFIC FORMS**:
   - Provide ACTUAL legal forms required for filing in ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}
   - Include exact form numbers/codes (e.g., "FL-100" for California Divorce Petition)
   - Specify the correct court level (Small Claims, Superior Court, District Court, etc.)
   - Include where to obtain each form (court website URL, clerk's office, online portal)
   - Note any county-specific variations or local rules
   - List forms in the order they should be filed

4. **STATE-SPECIFIC LEGAL PATHWAY**:
   - Cite specific ${caseData.state} statutes, codes, and regulations
   - Reference ${caseData.state} court rules and procedures
   - Include ${caseData.state}-specific filing deadlines and statute of limitations
   - Note any recent ${caseData.state} legislative changes affecting this case type
   - Map out the complete legal journey from filing to resolution

5. **COUNTY/MUNICIPALITY PROCEDURES**${caseData.county ? ` (${caseData.county} County)` : ''}:
   - Local court filing procedures, hours, and administrative requirements
   - County-specific filing fees and payment methods
   - Local rules that differ from state rules
   - Electronic filing requirements and portals
   - Courthouse locations and department assignments
   - Local mediation or alternative dispute resolution requirements

6. **LEGAL JOURNEY PATHWAY**:
   - Define clear next steps from initial filing through resolution
   - Specify tribunal/court appearances required (dates estimated based on court backlogs)
   - Identify mandatory hearings, conferences, and deadlines
   - Outline settlement conference opportunities
   - Map trial preparation requirements if case proceeds
   - Note appeal options if applicable

7. **COMPREHENSIVE ANALYSIS**:
   - Evidence to Gather specific to ${caseData.state} evidentiary requirements
   - Filing Options (pro se vs attorney) with cost-benefit analysis for this jurisdiction
   - Settlement Range based on ${caseData.state} case law and jury verdict data
   - Time to Resolution considering current ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''} court backlogs

Return your analysis in valid JSON format with this exact structure:
{
  "meritScore": number (0-100),
  "meritScoreJustification": "Detailed explanation of how merit score was calculated, referencing specific case law, precedents, and the 40/30/20/10 weighting formula",
  "legalCategory": "specific category in ${caseData.state}",
  "caseLawPrecedents": [
    {
      "caseName": "Case name v. Case name",
      "citation": "Full legal citation",
      "court": "${caseData.state} court name",
      "year": year,
      "relevance": "How this case relates to the current matter",
      "outcome": "How the case was decided",
      "impact": "How this precedent affects merit score"
    }
  ],
  "strengthFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation with case law support"}],
  "weaknessFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation with precedent concerns"}],
  "relevantLaws": [{"title": "law name", "citation": "${caseData.state} statute cite", "relevance": 0.0-1.0, "summary": "what it means for this case", "casesThatAppliedThis": ["Case citations"]}],
  "legalPathway": [
    {
      "step": number,
      "action": "Specific action to take",
      "timeline": "When this should occur",
      "location": "Court/tribunal/office",
      "requirements": ["What's needed for this step"],
      "formsCited": ["Form numbers needed at this step"],
      "estimatedCost": "Dollar amount or range"
    }
  ],
  "requiredForms": [
    {
      "formName": "Exact official form name", 
      "formNumber": "Official form number/code",
      "purpose": "Why this form is required",
      "where": "Exact URL or location to obtain",
      "filingOrder": number,
      "fees": "Filing fee amount if applicable",
      "courtLevel": "Which court",
      "deadline": "When this must be filed",
      "helpResources": "Where to get help completing this form"
    }
  ],
  "tribunalAppearances": [
    {
      "appearanceType": "Hearing type (Initial, Pre-trial, Trial, etc.)",
      "estimatedTimeframe": "Months from filing",
      "location": "Courthouse/tribunal name and address",
      "preparation": ["What to prepare"],
      "canAppearRemotely": boolean,
      "typicalDuration": "How long it takes"
    }
  ],
  "evidenceToGather": [{"type": "evidence type", "importance": "high/medium/low", "howToObtain": "specific instructions", "legalBasis": "${caseData.state} evidentiary requirement", "precedentSupport": "Cases where this evidence was pivotal"}],
  "filingOptions": {
    "proSe": "Detailed explanation of representing yourself in ${caseData.state}",
    "withAttorney": "Benefits of attorney representation",
    "recommendation": "Which is better for this case type and why",
    "courtSelfHelpResources": "Available resources in ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}",
    "expectedAttorneyCost": "Range of costs for legal representation in ${caseData.state}"
  },
  "estimatedSuccessRate": number (0-100),
  "settlementRange": {"min": number, "max": number, "basis": "How determined based on ${caseData.state} case law and jury verdicts"},
  "timeToResolutionMonths": number,
  "complexityScore": number (1-10),
  "nextSteps": [
    "Immediate action 1 specific to ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''}",
    "Immediate action 2",
    "Immediate action 3"
  ],
  "jurisdictionNotes": "Important ${caseData.state}${caseData.county ? ` ${caseData.county} County` : ''} specific information, local rules, recent changes, or judicial tendencies"
}`;

    console.log('Calling Lovable AI for case analysis...');
    
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
            content: `You are an expert legal analyst with comprehensive knowledge of all US state and county court systems, case law databases, and legal precedents. You have access to current legal forms, filing procedures, jurisdiction-specific requirements, and historical case outcomes. You specialize in:
- Analyzing case merit based on relevant precedents and statutory law
- Providing accurate case law citations and legal research
- Mapping complete legal journeys from initial filing through all court appearances to final resolution
- Identifying tribunal and court appearance requirements
- Calculating merit scores using precedent analysis, evidence strength, legal basis, and procedural factors
- Providing exact form numbers, filing procedures, and jurisdiction-specific guidance
Always ground your merit score in specific case law and provide verifiable form numbers and court information.`
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