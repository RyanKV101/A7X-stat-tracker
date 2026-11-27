import { unstable_rethrow } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  /** Nickname, username or the part of the email before the @, whichever exists first. */
  name: string;
  username: string | null;
  avatarUrl: string | null;
};

/**
 * The logged-in user for this request, or null when logged out.
 * Cached per request, so the header and a page can both call it.
 * Never throws: when Supabase can't be reached the visitor is treated as logged out.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (!claims) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, nickname, avatar_url")
      .eq("id", claims.sub)
      .maybeSingle();

    const email = typeof claims.email === "string" ? claims.email : null;

    return {
      id: claims.sub,
      name: profile?.nickname || profile?.username || email?.split("@")[0] || "Fan",
      username: profile?.username ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    };
  } catch (error) {
    // Let Next.js handle its own control-flow errors (e.g. switching to dynamic rendering).
    unstable_rethrow(error);
    return null;
  }
});
