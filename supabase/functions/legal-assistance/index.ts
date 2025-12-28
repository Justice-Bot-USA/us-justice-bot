import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { callAI, RateLimitError, PaymentRequiredError } from "../_shared/ai.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { message, state, legalSection, language, context } = await req.json();

    // Input validation
    if (!message || typeof message !== "string" || message.length > 2000) {
      return errorResponse("BAD_REQUEST", "Invalid message");
    }
    if (!state || typeof state !== "string" || state.length > 50) {
      return errorResponse("BAD_REQUEST", "Invalid state");
    }
    if (!legalSection || typeof legalSection !== "string" || legalSection.length > 100) {
      return errorResponse("BAD_REQUEST", "Invalid legal section");
    }
    if (!["en", "es"].includes(language)) {
      return errorResponse("BAD_REQUEST", "Invalid language");
    }

    // Sanitize inputs
    const sanitizedMessage = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();
    const sanitizedState = state.replace(/[^a-zA-Z\s]/g, "").trim();
    const sanitizedLegalSection = legalSection.replace(/[^a-zA-Z\s]/g, "").trim();

    const systemPrompt = `You are US Justice Bot, an expert AI legal assistant with comprehensive knowledge of US federal law and all 50 state legal systems.

STATE: ${sanitizedState}
LEGAL AREA: ${sanitizedLegalSection}
LANGUAGE: ${language === "es" ? "Spanish" : "English"}

YOUR EXPERTISE INCLUDES:
- Federal law (US Constitution, federal statutes, federal court procedures)
- State-specific statutes, codes, and regulations for ${sanitizedState}
- State court systems, filing procedures, and deadlines
- Criminal law: state penal codes, sentencing guidelines, bail schedules, expungement eligibility
- Civil law: family law, housing/eviction, employment, small claims, personal injury
- Correct court forms and filing fees for ${sanitizedState}
- Statute of limitations for ${sanitizedState}
- Local court rules and procedures

RESPONSE REQUIREMENTS:
1. Be specific to ${sanitizedState} law - cite actual statutes when relevant (e.g., "Under California Penal Code 1203.4..." or "Texas Family Code Section...")
2. Provide actionable steps with specific forms, courts, and procedures
3. Include relevant deadlines and filing fees when applicable
4. Mention if federal law applies vs state law
5. Always end with: "This is educational information, not legal advice. Consult a licensed ${sanitizedState} attorney for your specific situation."

Previous context: ${context?.map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`).join("\n") || "None"}`;

    console.log("Calling Lovable AI for legal assistance...");

    const aiResponse = await callAI({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: sanitizedMessage }
      ],
    });

    console.log("Legal assistance response generated successfully");

    return successResponse({ response: aiResponse.content });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return errorResponse("RATE_LIMITED", error.message);
    }
    if (error instanceof PaymentRequiredError) {
      return errorResponse("PAYMENT_REQUIRED", error.message);
    }
    console.error("Error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to generate response");
  }
});
