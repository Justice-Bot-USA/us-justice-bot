import { z } from 'zod';

// Common validators
export const uuidSchema = z.string().uuid();

export function isValidUUID(id: string | null | undefined): id is string {
  return uuidSchema.safeParse(id).success;
}

// Chat message validation schema
export const chatMessageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be less than 2000 characters")
    .refine(
      (val) => !/(<script|<iframe|javascript:|data:)/i.test(val),
      "Invalid characters detected"
    ),
});

// User preferences validation schema
export const userPreferencesSchema = z.object({
  preferred_state: z.string().optional().nullable(),
  preferred_language: z.enum(['en', 'es']),
});

// Chat session validation schema
export const chatSessionSchema = z.object({
  state: z.string().min(1, "State is required").max(50),
  legal_section: z.string().min(1, "Legal section is required").max(100),
  language: z.enum(['en', 'es']),
});

// Sanitize text content
export function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Validate and sanitize user input
export function validateAndSanitizeMessage(input: string): string {
  const validation = chatMessageSchema.safeParse({ content: input });
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }
  return sanitizeText(validation.data.content);
}