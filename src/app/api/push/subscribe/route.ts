import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/push/subscribe
// Body: { subscription: PushSubscriptionJSON, reminderTime?: string, timezone?: string }
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
    reminderTime?: unknown;
    timezone?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sub = body?.subscription;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }

  // Store the push subscription (idempotent on endpoint).
  const { error: subError } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      { onConflict: "endpoint" }
    );

  if (subError) {
    return Response.json({ error: subError.message }, { status: 500 });
  }

  // Enable reminders + persist preferences on the user row.
  const updates: Record<string, unknown> = { reminder_enabled: true };
  if (typeof body.reminderTime === "string") updates.reminder_time = body.reminderTime;
  if (typeof body.timezone === "string") updates.reminder_tz = body.timezone;

  const { error: userError } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id);

  if (userError) {
    return Response.json({ error: userError.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
