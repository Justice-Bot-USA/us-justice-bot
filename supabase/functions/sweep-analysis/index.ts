import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";
import { SWEEP_SYSTEM_PROMPT, getAnalysisPrompt } from "../_shared/sweepPrompts.ts";
import { startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";

const SWEEP_NAME = 'analysis';

// Sweep 6: Final Analysis Report
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { caseProfile, saveToDb, caseId, userId } = await req.json();
    
    console.log("Running Sweep 6: Final Analysis Report");

    // Mark sweep as running
    if (caseId && userId) {
      await startSweep(caseId, SWEEP_NAME, userId);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // If we have a caseId, fetch the sweep outputs from DB to build caseProfile
    let profileToAnalyze = caseProfile;
    if (caseId && !caseProfile) {
      const supabase = createAdminClient();
      
      // Fetch all completed sweeps for this case
      const { data: sweeps, error: sweepsError } = await supabase
        .from('case_sweeps')
        .select('sweep_name, output')
        .eq('case_id', caseId)
        .eq('status', 'done');
      
      if (!sweepsError && sweeps) {
        profileToAnalyze = {
          caseId,
          intake: sweeps.find(s => s.sweep_name === 'intake')?.output,
          evidenceIndex: sweeps.find(s => s.sweep_name === 'evidenceIndex')?.output,
          classification: sweeps.find(s => s.sweep_name === 'classification')?.output,
          venue: sweeps.find(s => s.sweep_name === 'venue')?.output,
          timeline: sweeps.find(s => s.sweep_name === 'timeline')?.output,
          authoritySweep: sweeps.find(s => s.sweep_name === 'authority')?.output,
        };
      }
    }

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 20);
    }

    const prompt = getAnalysisPrompt(JSON.stringify(profileToAnalyze, null, 2));

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
      if (caseId && userId) {
        await failSweep(caseId, SWEEP_NAME, userId, `AI API error: ${aiResponse.status}`);
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 70);
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

    // Update the case_merit_scores record if we have a caseId
    if (caseId && userId) {
      const supabase = createAdminClient();
      
      await supabase
        .from('case_merit_scores')
        .update({
          merit_score: analysisReport.meritScore || 50,
          estimated_success_rate: analysisReport.estimatedSuccessRate,
          strength_factors: analysisReport.strongestClaims,
          weakness_factors: analysisReport.weakestPoints,
          legal_pathway: analysisReport.nextSteps,
          required_forms: analysisReport.requiredForms,
          next_steps: analysisReport.nextSteps,
          settlement_range_min: analysisReport.settlementRange?.min,
          settlement_range_max: analysisReport.settlementRange?.max,
          time_to_resolution_months: analysisReport.timeToResolution?.maxMonths,
          status: 'pending', // Ready for user action
          legal_area: profileToAnalyze?.classification?.primaryCategory || 'other',
        })
        .eq('id', caseId);
      
      // Mark sweep as done
      await completeSweep(caseId, SWEEP_NAME, userId, analysisReport);
    }

    return successResponse({
      sweep: 'analysis',
      data: analysisReport,
      caseId: caseId
    });
  } catch (error) {
    console.error("Sweep 6 error:", error);
    return handleError(error);
  }
});
