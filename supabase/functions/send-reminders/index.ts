// supabase/functions/send-reminders/index.ts
//
// Scheduled Web Push sender. Run this HOURLY via pg_cron (see deploy notes below).
// For each user with reminders enabled whose local hour == their reminder hour,
// who hasn't practiced recently and hasn't already been nudged today, it sends a
// streak-aware push notification to all of their registered devices.
//
// ── Deploy ───────────────────────────────────────────────────────────────────
// 1. supabase functions deploy send-reminders --no-verify-jwt
// 2. supabase secrets set \
//      VAPID_PUBLIC_KEY=...  VAPID_PRIVATE_KEY=...  VAPID_SUBJECT=mailto:you@example.com
//    (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
// 3. Schedule it hourly with pg_cron in the SQL editor:
//      select cron.schedule(
//        'send-reminders-hourly', '0 * * * *',
//        $$ select net.http_post(
//             url := 'https://<PROJECT_REF>.functions.supabase.co/send-reminders',
//             headers := jsonb_build_object('Authorization','Bearer <SERVICE_ROLE_KEY>')
//           ) $$
//      );
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@angrezibolo.app";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const DEFAULT_TZ = "Asia/Kolkata";
const ACTIVITY_WINDOW_HOURS = 16; // practiced within this window → skip the nudge

// Local "HH:MM" for a given timezone.
function localHourMinute(tz: string): { hour: number; minute: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    hour: parseInt(get("hour"), 10),
    minute: parseInt(get("minute"), 10),
    date: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, reminder_time, reminder_tz, last_reminder_sent")
    .eq("reminder_enabled", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() - ACTIVITY_WINDOW_HOURS * 3600 * 1000).toISOString();
  let sent = 0;
  let skipped = 0;

  for (const u of users ?? []) {
    const tz = u.reminder_tz || DEFAULT_TZ;
    const local = localHourMinute(tz);
    const [rhStr] = (u.reminder_time || "20:30").split(":");
    const reminderHour = parseInt(rhStr, 10);

    // Fire only on the matching local hour (cron runs hourly).
    if (local.hour !== reminderHour) {
      skipped++;
      continue;
    }

    // Don't nudge twice on the same local day.
    if (u.last_reminder_sent) {
      const lastDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(u.last_reminder_sent));
      if (lastDate === local.date) {
        skipped++;
        continue;
      }
    }

    // Already practiced recently? Skip.
    const [p, g, s] = await Promise.all([
      supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", u.id).gte("completed_at", cutoff),
      supabase.from("game_sessions").select("id", { count: "exact", head: true }).eq("user_id", u.id).gte("created_at", cutoff),
      supabase.from("speaking_sessions").select("id", { count: "exact", head: true }).eq("user_id", u.id).gte("created_at", cutoff),
    ]);
    const activeRecently = (p.count || 0) + (g.count || 0) + (s.count || 0) > 0;
    if (activeRecently) {
      skipped++;
      continue;
    }

    // Streak-aware message.
    const { data: stats } = await supabase
      .from("user_stats")
      .select("current_streak")
      .eq("user_id", u.id)
      .maybeSingle();
    const streak = stats?.current_streak || 0;
    const firstName = (u.name || "there").split(" ")[0];

    const payload = JSON.stringify(
      streak > 0
        ? {
            title: `🔥 ${streak}-day streak, ${firstName}!`,
            body: "Aaj practice nahi ki — streak bachao, 2 min ka quick lesson karo!",
            url: "/home",
            tag: "daily-reminder",
          }
        : {
            title: `English practice time, ${firstName}! 🎯`,
            body: "Bas 5 min — aaj ka daily goal poora karo aur XP kamao.",
            url: "/home",
            tag: "daily-reminder",
          }
    );

    // Send to every device; prune dead subscriptions.
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", u.id);

    for (const sub of subs ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: any) {
        // 404/410 → subscription expired; remove it.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }

    await supabase.from("users").update({ last_reminder_sent: now.toISOString() }).eq("id", u.id);
  }

  return new Response(JSON.stringify({ sent, skipped }), {
    headers: { "Content-Type": "application/json" },
  });
});
