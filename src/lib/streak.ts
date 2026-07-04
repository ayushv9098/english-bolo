import { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserStreakAndXP(supabase: SupabaseClient, userId: string, xpGained: number) {
  // Fetch current user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('current_streak, last_login, total_xp')
    .eq('user_id', userId)
    .maybeSingle();

  let current_streak = stats?.current_streak;
  let last_login = stats?.last_login;
  let total_xp = stats?.total_xp;

  if (!stats) {
    const { data: userStats } = await supabase
      .from('users')
      .select('streak, last_active, xp_points')
      .eq('id', userId)
      .maybeSingle();
    
    if (userStats) {
      current_streak = userStats.streak;
      last_login = userStats.last_active;
      total_xp = userStats.xp_points;
    }
  }

  const now = new Date();
  const lastActive = last_login ? new Date(last_login) : null;
  
  let newStreak = current_streak || 0;
  let hasDoneLessonToday = false;
  
  if (lastActive) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    } else if (diffDays === 0) {
      hasDoneLessonToday = true;
    }
  } else {
    newStreak = 1;
  }

  const newXp = (total_xp || 0) + xpGained;

  // Update BOTH tables to prevent synchronization issues
  await Promise.all([
    supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        current_streak: newStreak,
        last_login: now.toISOString(),
        total_xp: newXp
      }, { onConflict: 'user_id' }),
    supabase
      .from('users')
      .update({
        streak: newStreak,
        last_active: now.toISOString(),
        xp_points: newXp
      })
      .eq('id', userId)
  ]);

  return { newStreak, newXp, hasDoneLessonToday };
}
