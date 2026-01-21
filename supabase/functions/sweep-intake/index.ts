import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { SWEEP_SYSTEM_PROMPT, getIntakePrompt } from "../_shared/sweepPrompts.ts";

// Sweep 0: Intake & Normalization
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { userStory, documentTexts } = await req.json();
    
    console.log("Running Sweep 0: Intake & Normalization");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = getIntakePrompt(userStory, documentTexts || []);

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
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || '';
    
    // Clean up JSON if wrapped in markdown
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (content.includes('```')) {
      content = content.replace(/```\n?/g, '');
    }
    
    const intake = JSON.parse(content.trim());
    intake.normalizedAt = new Date().toISOString();
    
    console.log("Sweep 0 complete:", { confidence: intake.confidence });

    return successResponse({
      sweep: 'intake',
      data: intake
    });
  } catch (error) {
    console.error("Sweep 0 error:", error);
    return handleError(error);
  }
});
