import { supabase } from "@/integrations/supabase/client";

type InvokeOptions = {
  body?: unknown;
  headers?: Record<string, string>;
};

/**
 * Some environments (notably certain mobile browsers / in-app webviews)
 * occasionally fail to attach the Authorization header automatically.
 * This helper explicitly injects the current session JWT when available.
 */
export async function invokeAuthed<T = any>(
  functionName: string,
  options: InvokeOptions = {}
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated. Please sign in and try again.");
  }

  const authHeader = { Authorization: `Bearer ${session.access_token}` };

  return supabase.functions.invoke<T>(functionName, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeader,
    },
  });
}
