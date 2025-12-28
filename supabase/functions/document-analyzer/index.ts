import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors } from "../_shared/auth.ts";
import { successResponse, errorResponse } from "../_shared/errors.ts";
import { callAI, parseAIJson, RateLimitError, PaymentRequiredError } from "../_shared/ai.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { documentText, documentType, analysisType } = await req.json();

    if (!documentText || typeof documentText !== "string") {
      return errorResponse("BAD_REQUEST", "Document text is required");
    }

    console.log("Analyzing document with AI:", { documentType, analysisType, textLength: documentText.length });

    const systemPrompt = `You are an expert legal document analyzer. Your job is to analyze legal documents and provide clear, actionable insights.

For each document, you should:
1. Identify the type of document (contract, agreement, letter, etc.)
2. Extract key terms, dates, and obligations
3. Identify potential risks or red flags
4. Provide a plain English summary
5. List any action items or deadlines

IMPORTANT: Always emphasize that this is educational analysis only, not legal advice. Recommend consulting with a qualified attorney for specific legal matters.`;

    const userPrompt = `Please analyze the following ${documentType || "legal"} document:

---
${documentText.slice(0, 15000)}
---

Provide your analysis in the following JSON format:
{
  "documentType": "Identified document type",
  "summary": "Plain English summary of the document (2-3 paragraphs)",
  "keyTerms": [
    {"term": "Term name", "definition": "What it means", "importance": "high/medium/low"}
  ],
  "parties": ["List of parties involved"],
  "keyDates": [
    {"date": "Date or timeframe", "significance": "What happens on this date"}
  ],
  "obligations": [
    {"party": "Who", "obligation": "Must do what", "deadline": "By when"}
  ],
  "risks": [
    {"risk": "Description of risk", "severity": "high/medium/low", "mitigation": "How to address"}
  ],
  "actionItems": [
    {"action": "What needs to be done", "priority": "high/medium/low", "deadline": "When"}
  ],
  "recommendations": ["List of recommendations for the reader"],
  "legalDisclaimer": "Standard disclaimer about this being educational analysis only"
}`;

    const aiResponse = await callAI({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    // Parse AI response with fallback
    const analysis = parseAIJson(aiResponse.content, {
      summary: aiResponse.content,
      keyTerms: [],
      risks: [],
      actionItems: [],
      legalDisclaimer: "This is educational analysis only, not legal advice. Please consult with a qualified attorney."
    });

    console.log("Document analysis completed successfully");

    return successResponse({ success: true, analysis });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return errorResponse("RATE_LIMITED", error.message);
    }
    if (error instanceof PaymentRequiredError) {
      return errorResponse("PAYMENT_REQUIRED", error.message);
    }
    console.error("Error analyzing document:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return errorResponse("INTERNAL_ERROR", errorMessage);
  }
});
