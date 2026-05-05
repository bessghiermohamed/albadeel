"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Trophy, X, Sparkles } from "lucide-react";
import type { Achievement } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Toast item animation variants                                      */
/* ------------------------------------------------------------------ */
const toastVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
};

const sparkleVariants = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Achievement Toast Item                                             */
/* ------------------------------------------------------------------ */
interface ToastItemProps {
  achievement: Achievement;
  onDismiss: () => void;
}

function AchievementToastItem({ achievement, onDismiss }: ToastItemProps) {
  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative w-full max-w-sm"
    >
      {/* Glow background effect */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-omni-gold/30 via-omni-gold/10 to-omni-gold/30 blur-md pointer-events-none" />

      <div className="relative glass-gold rounded-2xl p-4 border border-omni-gold/30 shadow-xl overflow-hidden">
        {/* Decorative shimmer line */}
        <motion.div
          className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-l from-transparent via-omni-gold to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <div className="flex items-start gap-3">
          {/* Trophy icon */}
          <motion.div
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-omni-gold to-omni-gold-dark flex items-center justify-center shadow-lg"
            initial={{ rotate: -20, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
          >
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <motion.h3
                className="text-sm font-bold text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                إنجاز جديد!
              </motion.h3>
              <motion.div variants={sparkleVariants} initial="initial" animate="animate">
                <Sparkles className="w-4 h-4 text-omni-gold" />
              </motion.div>
            </div>

            <motion.p
              className="text-base font-bold text-omni-gold-dark dark:text-omni-gold-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {achievement.title}
            </motion.p>

            {achievement.description && (
              <motion.p
                className="text-xs text-muted-foreground mt-0.5 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.description}
              </motion.p>
            )}
          </div>

          {/* Dismiss button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Progress bar (auto-dismiss timer) */}
        <motion.div
          className="absolute bottom-0 right-0 h-1 rounded-full bg-omni-gold/50"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component — Achievement Toast Manager                         */
/* ================================================================== */
export function AchievementToast() {
  const achievements = useAppStore((s) => s.achievements);
  const [activeToasts, setActiveToasts] = useState<Achievement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const prevCountRef = useRef(0);
  const queueRef = useRef<Achievement[]>([]);
  const isProcessingRef = useRef(false);

  /* Keep refs in sync via effect (avoids accessing refs during render) */
  const dismissedIdsRef = useRef(dismissedIds);
  const activeToastsRef = useRef(activeToasts);

  useEffect(() => {
    dismissedIdsRef.current = dismissedIds;
  }, [dismissedIds]);

  useEffect(() => {
    activeToastsRef.current = activeToasts;
  }, [activeToasts]);

  /* Process the next item in the achievement queue */
  const processQueueRef = useRef<() => void>(() => {});

  useEffect(() => {
    processQueueRef.current = () => {
      if (queueRef.current.length === 0) {
        isProcessingRef.current = false;
        return;
      }

      isProcessingRef.current = true;
      const next = queueRef.current.shift()!;

      // Only show if not already dismissed and not already showing
      if (!dismissedIdsRef.current.has(next.id) && !activeToastsRef.current.find((t) => t.id === next.id)) {
        setActiveToasts((prev) => [...prev, next]);
      } else {
        // Skip and process next after a tick
        setTimeout(() => processQueueRef.current(), 0);
      }
    };
  }, []);

  /* Dismiss a toast and process the next in queue */
  const dismissToast = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));

    // After a brief delay, process next in queue
    setTimeout(() => {
      processQueueRef.current();
    }, 300);
  };

  /* Watch for new achievements */
  useEffect(() => {
    if (achievements.length <= prevCountRef.current) {
      prevCountRef.current = achievements.length;
      return;
    }

    // Find newly added achievements
    const newAchievements = achievements.slice(prevCountRef.current);
    prevCountRef.current = achievements.length;

    // Filter out already dismissed ones and add to queue
    const toEnqueue = newAchievements.filter((a) => !dismissedIdsRef.current.has(a.id));
    queueRef.current.push(...toEnqueue);

    // Start processing queue if not already
    if (!isProcessingRef.current) {
      processQueueRef.current();
    }
  }, [achievements]);

  /* Auto-dismiss after 5 seconds */
  useEffect(() => {
    if (activeToasts.length === 0) return;

    const timers = activeToasts.map((toast) =>
      setTimeout(() => {
        dismissToast(toast.id);
      }, 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [activeToasts]);

  return (
    <div className="fixed bottom-6 left-6 z-[90] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {activeToasts.map((achievement) => (
          <div key={achievement.id} className="pointer-events-auto">
            <AchievementToastItem
              achievement={achievement}
              onDismiss={() => dismissToast(achievement.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
