import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { SWEEP_SYSTEM_PROMPT, getAuthorityPrompt } from "../_shared/sweepPrompts.ts";
import { startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";

const SWEEP_NAME = 'authority';

// Sweep 5: Authority/Precedent Search
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { userId } = await requireUser(req);

    const { classification, venue, timeline, state, caseId } = await req.json();
    
    console.log("Running Sweep 5: Authority Search", { state });

    // Mark sweep as running
    if (caseId && userId) {
      await startSweep(caseId, SWEEP_NAME, userId);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const timelineSummary = timeline?.events?.slice(0, 5).map((e: any) => 
      `${e.date}: ${e.description}`
    ).join('\n') || 'No timeline events';

    const prompt = getAuthorityPrompt(
      JSON.stringify(classification, null, 2),
      JSON.stringify(venue, null, 2),
      timelineSummary,
      state || venue?.jurisdiction?.state || 'Unknown'
    );

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 30);
    }

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
        max_tokens: 8000,
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
    
    const authority = JSON.parse(content.trim());
    authority.sweptAt = new Date().toISOString();
    
    console.log("Sweep 5 complete:", { 
      resultsCount: authority.results?.length || 0,
      favorable: authority.favorablePrecedentCount,
      unfavorable: authority.unfavorablePrecedentCount
    });

    // Mark sweep as done
    if (caseId && userId) {
      await completeSweep(caseId, SWEEP_NAME, userId, authority);
    }

    return successResponse({
      sweep: 'authority',
      data: authority
    });
  } catch (error) {
    console.error("Sweep 5 error:", error);
    return handleError(error);
  }
});
