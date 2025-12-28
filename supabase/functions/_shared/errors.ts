import { corsHeaders } from "./auth.ts";

/**
 * Standard error response types
 */
export type ErrorCode = 
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PAYMENT_REQUIRED"
  | "INTERNAL_ERROR";

const ERROR_STATUS: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  PAYMENT_REQUIRED: 402,
  INTERNAL_ERROR: 500,
};

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): Response {
  const status = ERROR_STATUS[code];
  
  console.error(`[${code}] ${message}`, details ?? "");
  
  return new Response(
    JSON.stringify({
      error: message,
      code,
      ...(details && { details }),
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Create a standardized success response
 */
export function successResponse(data: unknown, status = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Handle common error patterns and return appropriate responses
 */
export function handleError(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unknown error occurred";
  
  // Check for specific error types
  if (message.includes("Missing authorization") || message.includes("Invalid or expired token")) {
    return errorResponse("UNAUTHORIZED", message);
  }
  
  if (message.includes("Admin access required") || message.includes("Unauthorized")) {
    return errorResponse("FORBIDDEN", message);
  }
  
  if (message.includes("not found")) {
    return errorResponse("NOT_FOUND", message);
  }
  
  return errorResponse("INTERNAL_ERROR", message);
}
