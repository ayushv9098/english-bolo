"use client";

import { useState, useEffect } from "react";

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Mock streak logic
    const savedStreak = localStorage.getItem("streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const incrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streak", newStreak.toString());
  };

  return { streak, incrementStreak };
}
