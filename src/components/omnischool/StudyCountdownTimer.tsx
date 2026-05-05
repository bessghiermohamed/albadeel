"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, Timer, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface CountdownItem {
  id: string;
  title: string;
  targetDate: string;
  createdAt: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getTimeRemaining(targetDate: string): TimeRemaining {
  const total = new Date(targetDate).getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  }
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
    expired: false,
  };
}

function getUrgencyLevel(days: number): "green" | "gold" | "red" | "pulsing" {
  if (days > 7) return "green";
  if (days > 3) return "gold";
  if (days > 1) return "red";
  return "pulsing";
}

const urgencyColors = {
  green: { ring: "#16a34a", text: "text-green-600 dark:text-green-400", bg: "bg-green-500/10", glow: "" },
  gold: { ring: "#D4A843", text: "text-omni-gold dark:text-omni-gold", bg: "bg-omni-gold/10", glow: "" },
  red: { ring: "#B91C1C", text: "text-omni-red dark:text-red-400", bg: "bg-omni-red/10", glow: "glow-red-sm" },
  pulsing: { ring: "#B91C1C", text: "text-omni-red dark:text-red-400", bg: "bg-omni-red/10", glow: "glow-red-sm" },
};

/* ------------------------------------------------------------------ */
/*  Flip-style digit component                                         */
/* ------------------------------------------------------------------ */
function FlipDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative overflow-hidden rounded-lg bg-omni-red/10 dark:bg-omni-red/20 min-w-[3rem] sm:min-w-[3.5rem]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 20, opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center text-2xl sm:text-3xl font-black text-foreground h-12 sm:h-14"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        {/* Divider line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border/50" />
      </div>
      <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Ring component                                            */
/* ------------------------------------------------------------------ */
function ProgressRing({
  percentage,
  urgency,
  size = 60,
}: {
  percentage: number;
  urgency: "green" | "gold" | "red" | "pulsing";
  size?: number;
}) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, Math.min(100, percentage)) / 100) * circumference;
  const color = urgencyColors[urgency].ring;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        className="text-muted/30"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={urgency === "pulsing" ? "animate-pulse" : ""}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Single Countdown Card                                              */
/* ------------------------------------------------------------------ */
function CountdownCard({ countdown }: { countdown: CountdownItem }) {
  const { removeCountdown } = useAppStore();
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(getTimeRemaining(countdown.targetDate));
  const [flash, setFlash] = useState(false);
  const [prevExpired, setPrevExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = getTimeRemaining(countdown.targetDate);
      setTimeLeft(remaining);

      // Detect transition to expired
      if (remaining.expired && !prevExpired) {
        setFlash(true);
        setPrevExpired(true);
        setTimeout(() => setFlash(false), 3000);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [countdown.targetDate, prevExpired]);

  const urgency = getUrgencyLevel(timeLeft.days);
  const urgencyStyle = urgencyColors[urgency];

  // Calculate progress percentage (time elapsed vs total from creation to target)
  const totalSpan = new Date(countdown.targetDate).getTime() - new Date(countdown.createdAt).getTime();
  const elapsed = Date.now() - new Date(countdown.createdAt).getTime();
  const percentage = totalSpan > 0 ? Math.max(0, Math.min(100, (elapsed / totalSpan) * 100)) : 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`card-depth bg-card border border-border rounded-xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${
        urgency === "pulsing" ? "animate-pulse border-omni-red/40" : ""
      } ${flash ? "ring-2 ring-omni-gold shadow-lg shadow-omni-gold/20" : ""}`}
    >
      {/* Urgency accent bar */}
      <div
        className="absolute top-0 right-0 left-0 h-1"
        style={{ background: `linear-gradient(90deg, ${urgencyStyle.ring}, ${urgencyStyle.ring}80)` }}
      />

      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 bg-omni-gold/20 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Progress ring */}
        <div className="relative shrink-0 mt-1">
          <ProgressRing percentage={percentage} urgency={urgency} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-bold text-sm sm:text-base text-foreground truncate">{countdown.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                {new Date(countdown.targetDate).toLocaleDateString("ar-DZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeCountdown(countdown.id)}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-omni-red hover:bg-omni-red/10 transition-colors"
              aria-label="حذف العد التنازلي"
            >
              <Trash2 className="size-3.5" />
            </motion.button>
          </div>

          {/* Countdown digits */}
          {timeLeft.expired ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-2 text-omni-red dark:text-red-400"
            >
              <AlertTriangle className="size-4" />
              <span className="text-sm font-bold">انتهى الوقت!</span>
            </motion.div>
          ) : (
            <div className="mt-3 flex items-center gap-2 sm:gap-3" dir="ltr">
              <FlipDigit value={timeLeft.days} label="يوم" />
              <span className="text-lg font-bold text-muted-foreground/50 mt-[-1.2rem]">:</span>
              <FlipDigit value={timeLeft.hours} label="ساعة" />
              <span className="text-lg font-bold text-muted-foreground/50 mt-[-1.2rem]">:</span>
              <FlipDigit value={timeLeft.minutes} label="دقيقة" />
              <span className="text-lg font-bold text-muted-foreground/50 mt-[-1.2rem]">:</span>
              <FlipDigit value={timeLeft.seconds} label="ثانية" />
            </div>
          )}

          {/* Urgency badge */}
          {!timeLeft.expired && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text}`}
              >
                {urgency === "green" && "🕐 متسع من الوقت"}
                {urgency === "gold" && "⏳ اقتراب الموعد"}
                {urgency === "red" && "⚠️ وقت حرج"}
                {urgency === "pulsing" && "🚨 طارئ!"}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function StudyCountdownTimer() {
  const { countdowns, addCountdown } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("09:00");

  const canAdd = countdowns.length < 5;

  const handleAdd = useCallback(() => {
    if (!title.trim() || !targetDate) return;

    const fullTarget = `${targetDate}T${targetTime}:00`;
    addCountdown({
      id: `cd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      targetDate: fullTarget,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setTargetDate("");
    setTargetTime("09:00");
    setDialogOpen(false);
  }, [title, targetDate, targetTime, addCountdown]);

  // Get minimum date (today)
  const minDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  return (
    <Card className="glass-dashboard overflow-hidden border-border shadow-lg relative">
      {/* Red+Gold gradient accent at top */}
      <div className="h-1 w-full bg-gradient-to-l from-omni-red via-omni-gold to-omni-red" />

      {/* Decorative background */}
      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-omni-gold/5 pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-omni-red/5 pointer-events-none" />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Timer className="size-5 text-omni-red" />
            <span className="gradient-text-red-gold">العد التنازلي</span>
          </CardTitle>

          {canAdd && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-omni-red hover:text-omni-red hover:bg-omni-red/10"
                >
                  <Plus className="size-3.5" />
                  إضافة
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-border max-w-sm" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right gradient-text-red-gold">
                    إضافة عد تنازلي جديد
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">العنوان</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: امتحان الأدب العربي"
                      className="bg-background/50 border-border text-right"
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">التاريخ</label>
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      min={minDate}
                      className="bg-background/50 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">الوقت</label>
                    <Input
                      type="time"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      className="bg-background/50 border-border"
                    />
                  </div>

                  <Button
                    onClick={handleAdd}
                    disabled={!title.trim() || !targetDate}
                    className="w-full bg-omni-red hover:bg-omni-red-dark text-white font-semibold"
                  >
                    <Plus className="size-4 ml-1" />
                    إضافة العد التنازلي
                  </Button>

                  {!canAdd && countdowns.length >= 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      الحد الأقصى 5 عدادات تنازلية
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {countdowns.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center bg-omni-red/10 border border-omni-red/10">
              <Clock className="size-7 text-omni-red/50" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">لا توجد عدادات تنازلية</p>
            <p className="text-xs text-muted-foreground/70">أضف عداداً لتتبع مواعيد الامتحانات والمهام</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-omni">
            <AnimatePresence>
              {countdowns.map((cd) => (
                <CountdownCard key={cd.id} countdown={cd} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Counter indicator */}
        {countdowns.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {countdowns.length}/5 عدادات
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < countdowns.length ? "bg-omni-red" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
