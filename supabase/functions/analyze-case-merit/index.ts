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

    // Construct comprehensive AI prompt
    const aiPrompt = `You are an expert legal analyst. Analyze this case thoroughly and provide detailed, actionable guidance.

CASE INFORMATION:
Title: ${caseData.title}
Description: ${caseData.description}
State: ${caseData.state}
County: ${caseData.county || 'Not specified'}
Legal Area: ${caseData.legalArea}

UPLOADED DOCUMENTS:
${documentContents || 'No documents uploaded yet'}

REQUIRED ANALYSIS:
1. Case Merit Score (0-100) with detailed justification
2. Legal Category/Path - Identify the specific type of legal case and jurisdiction
3. Relevant Laws - List specific statutes, codes, and regulations for ${caseData.state}
4. Strength Factors - Identify 3-5 key strengths with weight (0-1) and explanation
5. Weakness Factors - Identify 3-5 key weaknesses with weight (0-1) and explanation
6. Legal Pathway - Step-by-step guide on how to proceed (file complaint, negotiate, etc.)
7. Required Forms - List specific forms needed to file in ${caseData.state} ${caseData.county ? `${caseData.county} County` : ''}
8. Evidence to Gather - Specific types of evidence needed to strengthen the case
9. Filing Options - Explain pro se vs attorney representation options
10. Settlement Range - Estimated settlement or damages range
11. Time to Resolution - Estimated timeline in months
12. Next Steps - Immediate actionable steps to take

Return your analysis in valid JSON format with this exact structure:
{
  "meritScore": number (0-100),
  "legalCategory": "specific category",
  "strengthFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation"}],
  "weaknessFactors": [{"factor": "name", "weight": 0.0-1.0, "description": "detailed explanation"}],
  "relevantLaws": [{"title": "law name", "citation": "statute cite", "relevance": 0.0-1.0, "summary": "what it means"}],
  "legalPathway": ["step 1", "step 2", "step 3"],
  "requiredForms": [{"formName": "name", "formNumber": "number", "purpose": "why needed", "where": "how to get it"}],
  "evidenceToGather": [{"type": "evidence type", "importance": "high/medium/low", "howToObtain": "instructions"}],
  "filingOptions": {"proSe": "explanation", "withAttorney": "explanation", "recommendation": "which is better and why"},
  "estimatedSuccessRate": number (0-100),
  "settlementRange": {"min": number, "max": number},
  "timeToResolutionMonths": number,
  "complexityScore": number (1-10),
  "nextSteps": ["immediate action 1", "immediate action 2", "immediate action 3"]
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
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert legal analyst specializing in case merit analysis and legal guidance. Always respond with valid, complete JSON.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
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

    // Create case merit score record with comprehensive AI analysis
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
        settlement_range_min: analysis.settlementRange.min,
        settlement_range_max: analysis.settlementRange.max,
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
        legalCategory: analysis.legalCategory,
        analysis: {
          strengthFactors: analysis.strengthFactors,
          weaknessFactors: analysis.weaknessFactors,
          relevantLaws: analysis.relevantLaws,
          legalPathway: analysis.legalPathway,
          requiredForms: analysis.requiredForms,
          evidenceToGather: analysis.evidenceToGather,
          filingOptions: analysis.filingOptions,
          estimatedSuccessRate: analysis.estimatedSuccessRate.toFixed(2),
          settlementRange: {
            min: analysis.settlementRange.min.toFixed(2),
            max: analysis.settlementRange.max.toFixed(2)
          },
          timeToResolutionMonths: analysis.timeToResolutionMonths,
          complexityScore: analysis.complexityScore,
          nextSteps: analysis.nextSteps,
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