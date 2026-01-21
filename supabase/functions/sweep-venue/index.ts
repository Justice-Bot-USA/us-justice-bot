import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { SWEEP_SYSTEM_PROMPT, getVenuePrompt } from "../_shared/sweepPrompts.ts";

// Sweep 3: Venue Resolution
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { intake, classification, state, county } = await req.json();
    
    console.log("Running Sweep 3: Venue Resolution", { state, county });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = getVenuePrompt(
      JSON.stringify(intake, null, 2),
      JSON.stringify(classification, null, 2),
      state || intake?.locationHints?.state || 'Unknown',
      county || intake?.locationHints?.county
    );

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
    
    const venue = JSON.parse(content.trim());
    venue.resolvedAt = new Date().toISOString();
    
    console.log("Sweep 3 complete:", { 
      courtName: venue.courtName, 
      status: venue.status 
    });

    return successResponse({
      sweep: 'venue',
      data: venue
    });
  } catch (error) {
    console.error("Sweep 3 error:", error);
    return handleError(error);
  }
});
