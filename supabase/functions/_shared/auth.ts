import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// CORS Utilities
// ============================================================

/**
 * Standard CORS headers for edge functions
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Handle CORS preflight requests
 * @returns Response for OPTIONS requests, null otherwise
 */
export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// ============================================================
// Authentication Types
// ============================================================

export interface AuthResult {
  userId: string;
  email?: string;
  userClient: SupabaseClient;
}

export interface AdminAuthResult extends AuthResult {
  role: "admin";
}

// ============================================================
// Authentication Functions
// ============================================================

/**
 * Creates a Supabase client with the user's JWT token.
 * Used for authenticated requests where RLS applies.
 */
export function createUserClient(token: string): SupabaseClient {
  return createClient(
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
}

/**
 * Validates JWT token and returns authenticated user info.
 * Use this in edge functions that require authentication.
 * 
 * @throws Error if authorization header is missing or token is invalid
 */
export async function requireUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const userClient = createUserClient(token);
  
  const { data: { user }, error } = await userClient.auth.getUser(token);

  if (error || !user) {
    console.error("Auth error:", error?.message);
    throw new Error("Invalid or expired token");
  }

  return {
    userId: user.id,
    email: user.email,
    userClient,
  };
}

/**
 * Validates JWT token and verifies the user has admin role.
 * Use this in edge functions that require admin access.
 * 
 * @throws Error if user is not authenticated or not an admin
 */
export async function requireAdmin(req: Request): Promise<AdminAuthResult> {
  const authResult = await requireUser(req);
  
  // Use service role to check admin status (bypasses RLS)
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: roleData, error: roleError } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", authResult.userId)
    .eq("role", "admin")
    .single();

  if (roleError || !roleData) {
    console.error("Admin check failed for user:", authResult.userId, roleError?.message);
    throw new Error("Unauthorized: Admin access required");
  }

  return {
    ...authResult,
    role: "admin",
  };
}

/**
 * Check if user has a specific role without throwing.
 * Returns boolean instead of throwing on failure.
 */
export async function hasRole(userId: string, role: "admin" | "moderator" | "user"): Promise<boolean> {
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data, error } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  return !error && !!data;
}
