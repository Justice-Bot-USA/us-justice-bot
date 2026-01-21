import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { SWEEP_SYSTEM_PROMPT, getClassificationPrompt } from "../_shared/sweepPrompts.ts";
import { startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";

const SWEEP_NAME = 'classification';

// Sweep 2: Issue Classification
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { intake, evidenceIndex, caseId, userId } = await req.json();
    
    console.log("Running Sweep 2: Issue Classification");

    // Mark sweep as running
    if (caseId && userId) {
      await startSweep(caseId, SWEEP_NAME, userId);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const intakeText = JSON.stringify(intake, null, 2);
    const evidenceText = evidenceIndex?.items?.length > 0 
      ? evidenceIndex.items.map((e: any) => `${e.filename}: ${e.extractedText || e.docType}`).join('\n')
      : 'No documents uploaded';

    const prompt = getClassificationPrompt(intakeText, evidenceText);

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
        max_tokens: 3000,
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
    
    const classification = JSON.parse(content.trim());
    classification.classifiedAt = new Date().toISOString();
    
    console.log("Sweep 2 complete:", { 
      category: classification.primaryCategory, 
      confidence: classification.confidence 
    });

    // Mark sweep as done
    if (caseId && userId) {
      await completeSweep(caseId, SWEEP_NAME, userId, classification);
    }

    return successResponse({
      sweep: 'classification',
      data: classification
    });
  } catch (error) {
    console.error("Sweep 2 error:", error);
    return handleError(error);
  }
});
