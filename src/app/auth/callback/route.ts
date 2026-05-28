import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Check if user has a profile/goal
      const { data: profile } = await supabase
        .from("users")
        .select("goal")
        .eq("id", user.id)
        .single();

      if (profile?.goal) {
        return NextResponse.redirect(`${origin}/home`);
      } else {
        // If no profile, they need onboarding
        return NextResponse.redirect(`${origin}/onboarding/goal`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
