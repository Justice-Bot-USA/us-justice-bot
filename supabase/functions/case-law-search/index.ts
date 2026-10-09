import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse } from "../_shared/errors.ts";
import { callAI, parseAIJson, RateLimitError, PaymentRequiredError } from "../_shared/ai.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Require authentication to prevent AI quota abuse
    await requireUser(req);

    const { state, legalArea, legalCategory, caseDescription } = await req.json();

    // Input validation
    if (!state || typeof state !== "string" || state.length > 50) {
      return errorResponse("BAD_REQUEST", "Invalid state");
    }
    if (!legalArea || typeof legalArea !== "string" || legalArea.length > 100) {
      return errorResponse("BAD_REQUEST", "Invalid legal area");
    }
    if (!caseDescription || typeof caseDescription !== "string" || caseDescription.length > 5000) {
      return errorResponse("BAD_REQUEST", "Invalid case description");
    }

    const sanitizedState = state.replace(/[^a-zA-Z\s]/g, "").trim();
    const sanitizedLegalArea = legalArea.replace(/[^a-zA-Z\s&-]/g, "").trim();
    const sanitizedDescription = caseDescription
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    const isCriminal = legalCategory === "criminal";

    const stateReporter = sanitizedState === "California" ? "Cal.App.4th" :
                          sanitizedState === "New York" ? "N.Y.2d" :
                          sanitizedState === "Texas" ? "S.W.3d" :
                          sanitizedState === "Florida" ? "So.3d" : "State Reporter";

    const prompt = `You are a legal research expert with comprehensive knowledge of US case law, legal precedents, and court decisions across all 50 states and federal courts.

JURISDICTION: ${sanitizedState}
LEGAL AREA: ${sanitizedLegalArea}
CASE TYPE: ${isCriminal ? "Criminal" : "Civil"}

USER'S CASE DESCRIPTION:
${sanitizedDescription}

YOUR TASK: List published case law in this general area of law, as background reading. This is general legal information: do not apply the cases to the user's facts, do not say how the user should use them, and do not say whether they help or hurt the user.

${isCriminal ? `
CRIMINAL LAW FOCUS:
- Search for precedents in this area of criminal law
- Include cases addressing constitutional rights (4th, 5th, 6th, 8th, 14th Amendments)
- Find cases on procedural issues (Miranda, search & seizure, right to counsel)
- Look for sentencing precedents and appeal decisions
- Include both ${sanitizedState} state court and relevant federal circuit decisions
- Reference ${sanitizedState}'s specific penal code sections when applicable
` : `
CIVIL LAW FOCUS:
- Search for precedents establishing relevant legal standards
- Include cases defining the elements of common claims in this area
- Find cases on burden of proof and evidentiary standards
- Include cases describing the remedies courts can order in this area
- Include both ${sanitizedState} state court and relevant federal decisions
- Reference ${sanitizedState}'s specific civil codes when applicable
`}

RESPONSE FORMAT (JSON):
{
  "precedents": [
    {
      "caseName": "Full case name (e.g., Smith v. Jones)",
      "citation": "Proper Bluebook citation (e.g., 123 ${stateReporter} 456 (2020))",
      "year": "Year decided",
      "court": "Court name (e.g., ${sanitizedState} Supreme Court, ${sanitizedState} Court of Appeals)",
      "relevance": "What general legal question this case addresses",
      "keyHolding": "The main legal holding or ruling from this case",
      "jurisdiction": "${sanitizedState}"
    }
  ],
  "legalPrinciples": ["Key legal principles these cases established, stated generally"],
  "relevantStatutes": ["Specific ${sanitizedState} statutes, codes, or rules referenced in these cases"],
  "searchSummary": "Brief, neutral summary of what was found in this area of law"
}

IMPORTANT GUIDELINES:
1. Provide 5-8 relevant case precedents, prioritizing ${sanitizedState}-specific cases
2. Use proper Bluebook citation format for all cases
3. Include a mix of landmark cases and recent decisions when relevant
4. Explain each holding in plain language, in general terms
5. If ${sanitizedState} lacks direct precedents, include persuasive authority from other jurisdictions
6. Always note which court decided each case (Supreme Court, Appeals, District, etc.)
7. Only include cases you are confident are real; leave a case out rather than guess
8. Do not give strategy, a likely outcome, or any opinion on the user's chances

Respond ONLY with the JSON object, no additional text.`;

    console.log("Searching case law for:", sanitizedState, sanitizedLegalArea);

    const aiResponse = await callAI({
      messages: [
        { role: "system", content: "You are a legal research expert. Respond only with valid JSON." },
        { role: "user", content: prompt }
      ],
    });

    // Parse response with fallback
    const parsedResponse = parseAIJson(aiResponse.content, {
      precedents: [],
      legalPrinciples: [],
      relevantStatutes: [],
      searchSummary: "Unable to parse search results. Please try again with a more specific description."
    });

    // Never pass on strategy or how-to-apply text, even if the model returns it.
    delete (parsedResponse as Record<string, unknown>).recommendedStrategy;
    if (Array.isArray((parsedResponse as { precedents?: unknown }).precedents)) {
      for (const p of (parsedResponse as { precedents: Record<string, unknown>[] }).precedents) {
        if (p && typeof p === "object") delete p.applicability;
      }
    }

    console.log("Case law search completed successfully");

    return successResponse(parsedResponse);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return errorResponse("RATE_LIMITED", error.message);
    }
    if (error instanceof PaymentRequiredError) {
      return errorResponse("PAYMENT_REQUIRED", error.message);
    }
    console.error("Error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to search case law");
  }
});
