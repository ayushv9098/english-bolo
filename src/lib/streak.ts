import { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserStreakAndXP(supabase: SupabaseClient, userId: string, xpGained: number) {
  // Fetch current user
  const { data: user } = await supabase
    .from('users')
    .select('streak, last_active, xp_points')
    .eq('id', userId)
    .single();

  if (!user) return null;

  const now = new Date();
  const lastActive = user.last_active ? new Date(user.last_active) : null;
  
  let newStreak = user.streak || 0;
  let hasDoneLessonToday = false;
  
  if (lastActive) {
    // Normalize to date level to compare safely
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      // Completed yesterday, streak continues
      newStreak += 1;
    } else if (diffDays > 1) {
      // Missed a day, reset streak
      newStreak = 1;
    } else {
      // diffDays === 0
      hasDoneLessonToday = true;
    }
  } else {
    // First lesson ever
    newStreak = 1;
  }

  const newXp = (user.xp_points || 0) + xpGained;

  await supabase
    .from('users')
    .update({
      streak: newStreak,
      last_active: now.toISOString(),
      xp_points: newXp
    })
    .eq('id', userId);

  return { newStreak, newXp, hasDoneLessonToday };
}
