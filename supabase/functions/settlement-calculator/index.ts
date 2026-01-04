import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse } from "../_shared/errors.ts";
import { callAI, parseAIJson, RateLimitError, PaymentRequiredError } from "../_shared/ai.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Require authentication
    await requireUser(req);
    
    const { caseType, state, description, damages, factors } = await req.json();

    if (!caseType || !state || !description) {
      return errorResponse("BAD_REQUEST", "Case type, state, and description are required");
    }

    console.log("Calculating settlement estimate:", { caseType, state });

    const systemPrompt = `You are an expert legal settlement analyst with deep knowledge of US case law, jury verdicts, and settlement trends across all states. You analyze case details to provide realistic settlement range estimates based on:

1. Historical jury verdicts and settlements in similar cases
2. State-specific case law and damage caps
3. The strength of evidence and liability factors
4. Economic and non-economic damages
5. Comparative fault considerations
6. Insurance policy limits and defendant's ability to pay

IMPORTANT: Always emphasize that these are estimates for educational purposes only. Actual settlements vary greatly based on specific case facts, evidence quality, and negotiation skills.`;

    const userPrompt = `Analyze this case and provide a settlement estimate:

CASE TYPE: ${caseType}
STATE: ${state}
DESCRIPTION: ${description}
CLAIMED DAMAGES: ${damages || "Not specified"}
ADDITIONAL FACTORS: ${factors || "None provided"}

Provide your analysis in the following JSON format:
{
  "settlementRange": {
    "low": number,
    "mid": number,
    "high": number,
    "currency": "USD"
  },
  "confidenceLevel": "high/medium/low",
  "methodology": "Explanation of how the estimate was calculated",
  "comparableCases": [
    {
      "caseDescription": "Brief description",
      "outcome": "Settlement or verdict amount",
      "year": number,
      "state": "State",
      "relevance": "Why this case is comparable"
    }
  ],
  "damageBreakdown": {
    "economicDamages": {
      "amount": number,
      "components": ["List of economic damage types"]
    },
    "nonEconomicDamages": {
      "amount": number,
      "components": ["List of non-economic damage types"]
    },
    "punitiveDamages": {
      "likelihood": "high/medium/low/none",
      "potentialAmount": number,
      "basis": "Why punitive damages may apply"
    }
  },
  "strengthFactors": ["Factors that increase settlement value"],
  "weaknessFactors": ["Factors that decrease settlement value"],
  "negotiationTips": ["Tips for maximizing settlement"],
  "timelineEstimate": "Expected time to settlement",
  "stateSpecificNotes": "Important ${state}-specific laws, caps, or considerations",
  "disclaimer": "Standard disclaimer about estimates being for educational purposes only"
}`;

    const aiResponse = await callAI({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    // Parse AI response with fallback
    const analysis = parseAIJson(aiResponse.content, {
      settlementRange: { low: 0, mid: 0, high: 0, currency: "USD" },
      methodology: aiResponse.content,
      disclaimer: "This is an educational estimate only. Consult with a qualified attorney for case-specific advice."
    });

    console.log("Settlement calculation completed successfully");

    return successResponse({ success: true, analysis });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return errorResponse("RATE_LIMITED", error.message);
    }
    if (error instanceof PaymentRequiredError) {
      return errorResponse("PAYMENT_REQUIRED", error.message);
    }
    console.error("Error calculating settlement:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return errorResponse("INTERNAL_ERROR", errorMessage);
  }
});
