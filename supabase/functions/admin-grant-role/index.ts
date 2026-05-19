import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create admin client (service role for user lookup)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Create user client to verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get calling user
    const { data: { user: caller }, error: authError } = await userClient.auth.getUser();
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if caller is admin
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!callerRole) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { email, role } = await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: "Email and role are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["admin", "moderator", "user"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be: admin, moderator, or user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find user by email using admin client
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers({
      perPage: 1,
      page: 1,
    });

    // Search for the user with matching email
    const { data: allUsers } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const targetUser = allUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      return new Response(
        JSON.stringify({ 
          error: "User not found",
          message: `No user found with email ${email}. They may need to sign up first.`
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if role already exists
    const { data: existingRole } = await adminClient
      .from("user_roles")
      .select("id, role")
      .eq("user_id", targetUser.id)
      .eq("role", role)
      .single();

    if (existingRole) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: `User ${email} already has ${role} role`,
          user_id: targetUser.id
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new role
    const { error: insertError } = await adminClient
      .from("user_roles")
      .insert({
        user_id: targetUser.id,
        role: role,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to grant role", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log this action
    await adminClient.from("user_activity_logs").insert({
      user_id: caller.id,
      action: "admin_grant_role",
      resource_type: "user_roles",
      resource_id: targetUser.id,
      details: {
        target_email: email,
        role_granted: role,
        granted_by: caller.email,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully granted ${role} role to ${email}`,
        user_id: targetUser.id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
