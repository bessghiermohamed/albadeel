"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { BookOpen, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated Counter — Counts up from 0 to target value               */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const prevTarget = useRef(target);

  useEffect(() => {
    // Trigger number-pop animation on value change
    if (hasAnimated.current && prevTarget.current !== target) {
      prevTarget.current = target;
    }

    if (hasAnimated.current) {
      // Subsequent updates — animate smoothly
      const duration = 400;
      const startTime = performance.now();
      const startVal = count;

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(startVal + (target - startVal) * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
      return;
    }

    hasAnimated.current = true;

    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums animate-number-pop">
      {count}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Sparkline — Simple SVG bar chart trend indicator              */
/* ------------------------------------------------------------------ */
function MiniSparkline({ color, values }: { color: string; values: number[] }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);

  return (
    <div className="sparkline-mini" aria-hidden="true">
      {values.map((val, i) => (
        <div
          key={i}
          className="spark-bar"
          style={{
            height: `${Math.max((val / max) * 16, 2)}px`,
            backgroundColor: i === values.length - 1 ? color : `${color}40`,
            opacity: i === values.length - 1 ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card accent bar colors                                        */
/* ------------------------------------------------------------------ */
const cardConfigs = [
  {
    icon: BookOpen,
    label: "مادة دراسية",
    color: "#B91C1C",
    gradientClass: "stat-card-gradient-red",
    accentBg: "linear-gradient(90deg, #B91C1C, #DC2626)",
    iconBg: "rgba(185, 28, 28, 0.1)",
    darkIconBg: "rgba(239, 68, 68, 0.12)",
    trendColor: "#B91C1C",
  },
  {
    icon: CheckCircle2,
    label: "مكتملة",
    color: "#16A34A",
    gradientClass: "stat-card-gradient-green",
    accentBg: "linear-gradient(90deg, #16A34A, #22C55E)",
    iconBg: "rgba(22, 163, 74, 0.1)",
    darkIconBg: "rgba(34, 197, 94, 0.12)",
    trendColor: "#16A34A",
  },
  {
    icon: TrendingUp,
    label: "قيد التقدم",
    color: "#D4A843",
    gradientClass: "stat-card-gradient-gold",
    accentBg: "linear-gradient(90deg, #D4A843, #E5C168)",
    iconBg: "rgba(212, 168, 67, 0.1)",
    darkIconBg: "rgba(212, 168, 67, 0.12)",
    trendColor: "#D4A843",
  },
  {
    icon: BarChart3,
    label: "متوسط التقدم",
    color: "#0D9488",
    gradientClass: "stat-card-gradient-teal",
    accentBg: "linear-gradient(90deg, #0D9488, #14B8A6)",
    iconBg: "rgba(13, 148, 136, 0.1)",
    darkIconBg: "rgba(20, 184, 166, 0.12)",
    trendColor: "#0D9488",
  },
];

/* ------------------------------------------------------------------ */
/*  Quick Stats Widget                                                 */
/* ------------------------------------------------------------------ */
export function QuickStatsWidget() {
  const { progress } = useAppStore();

  const stats = useMemo(() => {
    const total = subjectsData.length;
    const completed = progress.filter((p) => p.status === "completed").length;
    const inProgress = progress.filter((p) => p.status === "in_progress").length;
    const avgProgress =
      total > 0
        ? Math.round(
            subjectsData.reduce((acc, s) => {
              const p = progress.find((pr) => pr.subjectId === s.id);
              return acc + (p?.progress || 0);
            }, 0) / total
          )
        : 0;
    return { total, completed, inProgress, avgProgress };
  }, [progress]);

  const values = [stats.total, stats.completed, stats.inProgress, stats.avgProgress];

  // Generate mini sparkline data from progress distribution
  const sparklineData = useMemo(() => {
    const notStarted = progress.filter((p) => p.status === "not_started").length;
    const inProg = progress.filter((p) => p.status === "in_progress").length;
    const complete = progress.filter((p) => p.status === "completed").length;
    const highProgress = progress.filter((p) => (p.progress || 0) >= 75).length;

    return [
      [3, 6, 9, 12, stats.total],                    // total subjects trend
      [0, 1, Math.ceil(complete * 0.6), Math.ceil(complete * 0.8), stats.completed],  // completed trend
      [0, 2, Math.ceil(inProg * 0.5), Math.ceil(inProg * 0.8), stats.inProgress],     // in progress trend
      [5, 12, 20, Math.ceil(stats.avgProgress * 0.7), stats.avgProgress],              // avg progress trend
    ];
  }, [progress, stats]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cardConfigs.map((cfg, idx) => {
        const Icon = cfg.icon;
        const isPercent = idx === 3;
        return (
          <motion.div
            key={cfg.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.04,
              y: -3,
              transition: { duration: 0.2 },
            }}
            className={`${cfg.gradientClass} glass-dashboard card-depth rounded-xl p-5 sm:p-6 text-center cursor-default card-shine relative overflow-hidden group`}
          >
            {/* Accent bar at top */}
            <div
              className="absolute top-0 right-0 left-0 h-1 rounded-t-xl"
              style={{ background: cfg.accentBg }}
            />

            {/* Decorative corner element */}
            <div
              className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none"
              style={{ background: cfg.color }}
            />

            {/* Icon — larger and more prominent */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ backgroundColor: cfg.iconBg }}
            >
              <Icon className="size-6 sm:size-7" style={{ color: cfg.color }} />
            </div>

            {/* Animated counter value — prominent */}
            <p
              className="text-3xl sm:text-4xl font-black ltr-content"
              dir="ltr"
              style={{ color: cfg.color }}
            >
              <AnimatedCounter
                target={values[idx]}
                suffix={isPercent ? "%" : ""}
              />
            </p>

            {/* Mini sparkline trend indicator */}
            <div className="flex justify-center mt-1.5 mb-1">
              <MiniSparkline color={cfg.trendColor} values={sparklineData[idx]} />
            </div>

            {/* Label — uppercase tracking */}
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">
              {cfg.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
