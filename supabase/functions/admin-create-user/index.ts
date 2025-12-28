import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors, requireAdmin } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify the requesting user is authenticated and is an admin
    const { userId } = await requireAdmin(req);
    
    // Parse request body
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password) {
      return errorResponse("BAD_REQUEST", "Email and password are required");
    }

    // Create admin client to create user
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

    // Create the user with admin API
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName || "",
        last_name: lastName || "",
      },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return errorResponse("BAD_REQUEST", createError.message);
    }

    console.log("User created successfully by admin:", userId, "New user:", userData.user?.id);

    return successResponse({ 
      success: true, 
      message: "User created successfully",
      userId: userData.user?.id,
      email: userData.user?.email
    });
  } catch (error: unknown) {
    return handleError(error);
  }
});
