"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserStats } from "@/types"; // We will add Rank to types
import toast from "react-hot-toast";

type RankType = 'Beginner' | 'Speaker' | 'Communicator' | 'Fluent' | 'English Warrior' | 'English Master';

interface GamificationState {
  totalXP: number;
  rank: RankType;
  currentStreak: number;
  maxStreak: number;
  unopenedLootBoxes: number;
  isLoading: boolean;
  awardXP: (amount: number, reason?: string) => void;
  openLootBox: () => void;
  xpPopups: { id: number; amount: number; message?: string }[];
}

const GamificationContext = createContext<GamificationState | undefined>(undefined);

const RANKS = [
  { name: 'Beginner', minXP: 0 },
  { name: 'Speaker', minXP: 1000 },
  { name: 'Communicator', minXP: 3000 },
  { name: 'Fluent', minXP: 7000 },
  { name: 'English Warrior', minXP: 15000 },
  { name: 'English Master', minXP: 30000 },
];

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [totalXP, setTotalXP] = useState(0);
  const [rank, setRank] = useState<RankType>('Beginner');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [unopenedLootBoxes, setUnopenedLootBoxes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [xpPopups, setXpPopups] = useState<{ id: number; amount: number; message?: string }[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setTotalXP(data.total_xp || 0);
      setRank((data.rank as RankType) || 'Beginner');
      setCurrentStreak(data.current_streak || 0);
      setMaxStreak(data.max_streak || 0);
    }

    const { count } = await supabase
      .from('loot_boxes')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_opened', false);

    if (count !== null) setUnopenedLootBoxes(count);

    setIsLoading(false);
  };

  const getRankForXP = (xp: number): RankType => {
    let currentRank = RANKS[0].name;
    for (const r of RANKS) {
      if (xp >= r.minXP) {
        currentRank = r.name;
      }
    }
    return currentRank as RankType;
  };

  const awardXP = async (amount: number, reason?: string) => {
    // 1. Trigger Animation immediately
    const popupId = Date.now();
    setXpPopups(prev => [...prev, { id: popupId, amount, message: reason }]);
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== popupId));
    }, 3000);

    // 2. Optimistic State Update
    const newXP = totalXP + amount;
    const newRank = getRankForXP(newXP);
    
    // Check for Rank Up
    if (newRank !== rank) {
      toast(`🎉 Rank Up! You are now a ${newRank}`, {
        icon: '🏆',
        duration: 4000,
      });
    }

    // Check for Loot Boxes (every 1000 XP)
    const oldMilestone = Math.floor(totalXP / 1000);
    const newMilestone = Math.floor(newXP / 1000);
    let newLootBoxesToAward = newMilestone - oldMilestone;

    setTotalXP(newXP);
    setRank(newRank);
    if (newLootBoxesToAward > 0) {
       setUnopenedLootBoxes(prev => prev + newLootBoxesToAward);
       toast.success("You earned a new Reward Chest!");
    }

    // 3. Persist to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update BOTH tables to prevent synchronization issues
    await Promise.all([
      supabase
        .from('user_stats')
        .update({ total_xp: newXP, rank: newRank })
        .eq('user_id', user.id),
      supabase
        .from('users')
        .update({ xp_points: newXP })
        .eq('id', user.id)
    ]);

    if (newLootBoxesToAward > 0) {
       // Insert new loot boxes
       for (let i = 0; i < newLootBoxesToAward; i++) {
         await supabase.from('loot_boxes').insert({ user_id: user.id });
       }
    }
  };

  const openLootBox = async () => {
    if (unopenedLootBoxes <= 0) return;
    
    // Optimistic UI
    setUnopenedLootBoxes(prev => prev - 1);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get an unopened box
    const { data } = await supabase
      .from('loot_boxes')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_opened', false)
      .limit(1)
      .single();

    if (data) {
      await supabase
        .from('loot_boxes')
        .update({ is_opened: true, opened_at: new Date().toISOString() })
        .eq('id', data.id);
    }
  };

  return (
    <GamificationContext.Provider value={{
      totalXP, rank, currentStreak, maxStreak, unopenedLootBoxes, isLoading, awardXP, openLootBox, xpPopups
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
