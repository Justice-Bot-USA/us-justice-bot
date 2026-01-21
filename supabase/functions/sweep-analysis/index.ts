import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";
import { SWEEP_SYSTEM_PROMPT, getAnalysisPrompt } from "../_shared/sweepPrompts.ts";

// Sweep 6: Final Analysis Report
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Optional auth - save to DB only if authenticated
    let userId: string | null = null;
    try {
      const auth = await requireUser(req);
      userId = auth.userId;
    } catch {
      console.log("Running analysis as guest - won't save to DB");
    }

    const { caseProfile, saveToDb } = await req.json();
    
    console.log("Running Sweep 6: Final Analysis Report");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = getAnalysisPrompt(JSON.stringify(caseProfile, null, 2));

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SWEEP_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 10000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || '';
    
    // Clean up JSON
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (content.includes('```')) {
      content = content.replace(/```\n?/g, '');
    }
    
    const analysisReport = JSON.parse(content.trim());
    analysisReport.analyzedAt = new Date().toISOString();
    
    console.log("Sweep 6 complete:", { 
      meritScore: analysisReport.meritScore,
      successRate: analysisReport.estimatedSuccessRate
    });

    // Optionally save to database
    let savedCaseId: string | null = null;
    if (saveToDb && userId) {
      const supabase = createAdminClient();
      
      const { data: savedCase, error: saveError } = await supabase
        .from('case_merit_scores')
        .insert({
          user_id: userId,
          case_title: caseProfile.intake?.issueSummary?.slice(0, 100) || 'Case Analysis',
          case_description: caseProfile.userStory,
          state: caseProfile.venue?.jurisdiction?.state || 'Unknown',
          county: caseProfile.venue?.jurisdiction?.county,
          legal_area: caseProfile.classification?.primaryCategory || 'other',
          merit_score: analysisReport.meritScore || 50,
          estimated_success_rate: analysisReport.estimatedSuccessRate,
          strength_factors: analysisReport.strongestClaims,
          weakness_factors: analysisReport.weakestPoints,
          legal_pathway: analysisReport.nextSteps,
          required_forms: analysisReport.requiredForms,
          evidence_to_gather: caseProfile.evidenceIndex?.gapsIdentified,
          filing_options: caseProfile.venue?.filingFees,
          settlement_range_min: analysisReport.settlementRange?.min,
          settlement_range_max: analysisReport.settlementRange?.max,
          time_to_resolution_months: analysisReport.timeToResolution?.maxMonths,
          next_steps: analysisReport.nextSteps,
          relevant_laws: caseProfile.authoritySweep?.statutes,
          status: 'pending'
        })
        .select('id')
        .single();

      if (saveError) {
        console.error('Error saving case:', saveError);
      } else {
        savedCaseId = savedCase?.id;
        console.log('Case saved:', savedCaseId);
      }
    }

    return successResponse({
      sweep: 'analysis',
      data: analysisReport,
      caseId: savedCaseId
    });
  } catch (error) {
    console.error("Sweep 6 error:", error);
    return handleError(error);
  }
});
