import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { SWEEP_SYSTEM_PROMPT, getTimelinePrompt } from "../_shared/sweepPrompts.ts";
import { startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";

const SWEEP_NAME = 'timeline';

// Sweep 4: Timeline Builder
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { userId } = await requireUser(req);

    const { intake, evidenceIndex, caseId } = await req.json();
    
    console.log("Running Sweep 4: Timeline Builder");

    // Mark sweep as running
    if (caseId && userId) {
      await startSweep(caseId, SWEEP_NAME, userId);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = getTimelinePrompt(
      JSON.stringify(intake, null, 2),
      JSON.stringify(evidenceIndex, null, 2)
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
        temperature: 0.2,
        max_tokens: 5000,
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
    
    const timeline = JSON.parse(content.trim());
    timeline.builtAt = new Date().toISOString();
    
    console.log("Sweep 4 complete:", { 
      eventCount: timeline.events?.length || 0 
    });

    // Mark sweep as done
    if (caseId && userId) {
      await completeSweep(caseId, SWEEP_NAME, userId, timeline);
    }

    return successResponse({
      sweep: 'timeline',
      data: timeline
    });
  } catch (error) {
    console.error("Sweep 4 error:", error);
    return handleError(error);
  }
});
