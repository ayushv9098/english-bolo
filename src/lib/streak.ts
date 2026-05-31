import { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserStreakAndXP(supabase: SupabaseClient, userId: string, xpGained: number) {
  // Fetch current user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('current_streak, last_login, total_xp')
    .eq('user_id', userId)
    .maybeSingle();

  const now = new Date();
  const lastActive = stats?.last_login ? new Date(stats.last_login) : null;
  
  let newStreak = stats?.current_streak || 0;
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

  const newXp = (stats?.total_xp || 0) + xpGained;

  await supabase
    .from('user_stats')
    .update({
      current_streak: newStreak,
      last_login: now.toISOString(),
      total_xp: newXp
    })
    .eq('user_id', userId);

  return { newStreak, newXp, hasDoneLessonToday };
}
