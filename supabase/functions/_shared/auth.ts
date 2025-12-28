import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthResult {
  userId: string;
  email?: string;
}

/**
 * Validates JWT token and returns authenticated user info.
 * Use this in edge functions that require authentication.
 */
export async function requireUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  const { data: { user }, error } = await supabaseClient.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired token");
  }

  return {
    userId: user.id,
    email: user.email,
  };
}

/**
 * Standard CORS headers for edge functions
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Handle CORS preflight requests
 */
export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}
