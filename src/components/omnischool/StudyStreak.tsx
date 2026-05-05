"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Calendar, Award } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudyStreak() {
  const { studySessions } = useAppStore();

  const streakData = useMemo(() => {
    // Get unique dates where sessions were completed
    const completedDates = new Set(
      studySessions
        .filter((s) => s.completed)
        .map((s) => new Date(s.date).toDateString())
    );

    const today = new Date();
    const dates = Array.from(completedDates).map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    // Calculate current streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    // Check if today has activity
    const todayStr = checkDate.toDateString();
    if (completedDates.has(todayStr)) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check yesterday (streak might still be alive)
      checkDate.setDate(checkDate.getDate() - 1);
      if (completedDates.has(checkDate.toDateString())) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Continue counting backwards
    while (completedDates.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedDates = dates.map((d) => d.getTime()).sort((a, b) => a - b);
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    }
    bestStreak = Math.max(bestStreak, currentStreak);

    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toDateString(),
        dayName: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"][date.getDay()],
        active: completedDates.has(date.toDateString()),
      };
    });

    // Motivational message
    const getMessage = () => {
      if (currentStreak === 0) return "ابدأ سلسلة المذاكرة اليوم! 🔥";
      if (currentStreak < 3) return "بداية جيدة! واصل التقدم 💪";
      if (currentStreak < 7) return "رائع! أنت في مسار ممتاز 🌟";
      if (currentStreak < 14) return "أداء مذهل! أنت نجم 🏆";
      if (currentStreak < 30) return "سلسلة أسطورية! 🎖️";
      return "أنت بطل حقيقي! لا يمكن إيقافك 👑";
    };

    return { currentStreak, bestStreak, last7Days, message: getMessage() };
  }, [studySessions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Card className="glass card-ornament overflow-hidden border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Flame className={`size-5 text-omni-red ${streakData.currentStreak > 0 ? 'animate-flame' : ''}`} />
          سلسلة المذاكرة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak counters */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center p-3 rounded-xl bg-omni-red/5 dark:bg-omni-red/10"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Flame className="size-4 text-omni-red" />
              <span className="text-xs text-muted-foreground">الحالية</span>
            </div>
            <p className="text-2xl font-black text-omni-red ltr-content" dir="ltr">
              {streakData.currentStreak}
            </p>
            <span className="text-[10px] text-muted-foreground">يوم</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-3 rounded-xl bg-omni-gold/5 dark:bg-omni-gold/10"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Award className="size-4 text-omni-gold" />
              <span className="text-xs text-muted-foreground">الأفضل</span>
            </div>
            <p className="text-2xl font-black text-omni-gold ltr-content" dir="ltr">
              {streakData.bestStreak}
            </p>
            <span className="text-[10px] text-muted-foreground">يوم</span>
          </motion.div>
        </div>

        {/* Weekly activity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>آخر 7 أيام</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {streakData.last7Days.map((day, idx) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx + 0.3 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    day.active
                      ? "bg-omni-red text-white shadow-md glow-red-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.active ? (
                    <Flame className="size-3.5" />
                  ) : (
                    <span className="text-[10px]">—</span>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground">{day.dayName}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-medium text-center text-omni-gold-dark dark:text-omni-gold"
        >
          {streakData.message}
        </motion.p>
      </CardContent>
    </Card>
  );
}
