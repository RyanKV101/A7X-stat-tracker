import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Supabase client for Client Components.
 * `createBrowserClient` returns a singleton, so calling this repeatedly is cheap.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
