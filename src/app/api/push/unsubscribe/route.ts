import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/push/unsubscribe
// Body: { endpoint?: string }  — if endpoint given, removes just that device;
// otherwise removes all of the user's subscriptions. Always disables reminders.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { endpoint?: string } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  let query = supabase.from("push_subscriptions").delete().eq("user_id", user.id);
  if (typeof body?.endpoint === "string") {
    query = query.eq("endpoint", body.endpoint);
  }

  const { error: delError } = await query;
  if (delError) {
    return Response.json({ error: delError.message }, { status: 500 });
  }

  const { error: userError } = await supabase
    .from("users")
    .update({ reminder_enabled: false })
    .eq("id", user.id);

  if (userError) {
    return Response.json({ error: userError.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
