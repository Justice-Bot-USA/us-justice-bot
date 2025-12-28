/**
 * Lovable AI Gateway utilities
 */

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequestOptions {
  model?: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  finishReason: string;
}

/**
 * Call the Lovable AI Gateway
 * 
 * @throws Error if API key is missing or request fails
 */
export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? "google/gemini-2.5-flash",
      messages: options.messages,
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
    }),
  });

  // Handle specific error codes
  if (!response.ok) {
    if (response.status === 429) {
      throw new RateLimitError("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 402) {
      throw new PaymentRequiredError("AI usage limit reached. Please try again later.");
    }
    
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error("AI gateway error");
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    finishReason: data.choices[0].finish_reason,
  };
}

/**
 * Parse JSON from AI response, handling markdown code blocks
 */
export function parseAIJson<T>(content: string, fallback: T): T {
  try {
    // Remove markdown code blocks if present
    let cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    // Try to extract JSON from content if it's wrapped in other text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error);
    return fallback;
  }
}

// Custom error types for specific AI errors
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class PaymentRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentRequiredError";
  }
}
