"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Coffee,
  Brain,
  BookOpen,
  Flame,
  Trophy,
  CheckCircle2,
  Zap,
  GraduationCap,
  PenTool,
  Users,
  Monitor,
  History,
  Search,
  Globe,
  BarChart3,
  Languages,
  MessageSquare,
  Presentation,
  School,
  BookMarked,
  Target,
  Heart,
  Layout,
  Clock,
  Sparkles,
  Lightbulb,
  Eye,
  Footprints,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------
   Icon Mapping — maps subject.icon string → lucide-react component
   ------------------------------------------------------------------ */
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Brain,
  GraduationCap,
  PenTool,
  Users,
  Monitor,
  History,
  Search,
  Globe,
  BarChart3,
  Languages,
  MessageSquare,
  Presentation,
  School,
  BookMarked,
  Target,
  Heart,
  Layout,
  Clock,
};

function SubjectIcon({
  iconName,
  className,
  style,
}: {
  iconName?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = iconMap[iconName || ""] || BookOpen;
  return <Icon className={className} style={style} />;
}

/* ------------------------------------------------------------------
   Timer modes
   ------------------------------------------------------------------ */
type TimerMode = "focus" | "shortBreak" | "longBreak";

const modeConfig: Record<
  TimerMode,
  {
    label: string;
    duration: number; // seconds
    icon: LucideIcon;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    bgClass: string;
    description: string;
    motivationalMsg: string;
  }
> = {
  focus: {
    label: "تركيز",
    duration: 25 * 60,
    icon: Brain,
    color: "#B91C1C",
    gradientFrom: "#B91C1C",
    gradientTo: "#D4A843",
    bgClass: "glass-red",
    description: "٢٥ دقيقة من التركيز الكامل",
    motivationalMsg: "ركز الآن، ستشكر نفسك لاحقًا! 💪",
  },
  shortBreak: {
    label: "استراحة قصيرة",
    duration: 5 * 60,
    icon: Coffee,
    color: "#D4A843",
    gradientFrom: "#D4A843",
    gradientTo: "#E5C168",
    bgClass: "glass-gold",
    description: "٥ دقائق من الاستراحة",
    motivationalMsg: "استرح قليلًا، أنت تستحق ذلك! ☕",
  },
  longBreak: {
    label: "استراحة طويلة",
    duration: 15 * 60,
    icon: Coffee,
    color: "#059669",
    gradientFrom: "#059669",
    gradientTo: "#34D399",
    bgClass: "glass",
    description: "١٥ دقيقة من الاستراحة الطويلة",
    motivationalMsg: "استراحة طويلة لاستعادة طاقتك! 🌿",
  },
};

/* ------------------------------------------------------------------
   Helper: format seconds to MM:SS
   ------------------------------------------------------------------ */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ------------------------------------------------------------------
   Tips data with icons
   ------------------------------------------------------------------ */
interface Tip {
  text: string;
  icon: LucideIcon;
}

const TIPS: Tip[] = [
  { text: "اضبط المؤقت على ٢٥ دقيقة للتركيز", icon: Clock },
  { text: "خذ استراحة ٥ دقائق بعد كل جلسة", icon: Coffee },
  { text: "بعد ٤ جلسات، خذ استراحة ١٥ دقيقة", icon: Brain },
  { text: "اختر المادة قبل البدء لتتبع تقدمك", icon: Target },
  { text: "أبعد هاتفك عن متناول يدك أثناء التركيز", icon: Eye },
  { text: "حاول المشي قليلًا خلال الاستراحة", icon: Footprints },
  { text: "اكتب أهدافك قبل بدء الجلسة", icon: PenTool },
  { text: "استخدم تقنية التنفس العميق للتركيز", icon: Sparkles },
];

/* ------------------------------------------------------------------
   Stagger animation variants
   ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------
   PomodoroTimer Component
   ------------------------------------------------------------------ */
export function PomodoroTimer() {
  const { studySessions, addStudySession } = useAppStore();
  const { toast } = useToast();

  // Timer state
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(modeConfig.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Tip rotation
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Session tracking for auto-logging
  const sessionStartRef = useRef<Date | null>(null);

  // Refs for accessing latest state in interval callback
  const modeRef = useRef(mode);
  const pomodorosRef = useRef(pomodorosCompleted);
  const selectedSubjectRef = useRef(selectedSubjectId);

  // Keep refs in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { pomodorosRef.current = pomodorosCompleted; }, [pomodorosCompleted]);
  useEffect(() => { selectedSubjectRef.current = selectedSubjectId; }, [selectedSubjectId]);

  // Get current mode config
  const config = modeConfig[mode];
  const totalDuration = config.duration;
  const progress = (totalDuration - timeLeft) / totalDuration;

  // Switch mode — defined before useEffect that references it
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeConfig[newMode].duration);
  };

  // Timer complete handler — defined before useEffect that references it
  const handleTimerComplete = useCallback(() => {
    const currentMode = modeRef.current;
    const currentPomodoros = pomodorosRef.current;
    const currentSubjectId = selectedSubjectRef.current;

    if (currentMode === "focus") {
      const newCount = currentPomodoros + 1;
      setPomodorosCompleted(newCount);

      // Auto-log study session if subject is selected
      if (currentSubjectId && sessionStartRef.current) {
        const subject = subjectsData.find((s) => s.id === currentSubjectId);
        if (subject) {
          addStudySession({
            id: crypto.randomUUID(),
            subjectId: currentSubjectId,
            date: new Date().toISOString().split("T")[0],
            duration: Math.round(modeConfig.focus.duration / 60),
            completed: true,
          });
        }
      }

      // Show completion toast
      toast({
        title: "🎉 أحسنت! انتهت جلسة التركيز",
        description: `أكملت البومودورو رقم ${newCount}. ${
          newCount % 4 === 0
            ? "حان وقت استراحة طويلة!"
            : "خذ استراحة قصيرة ثم تابع."
        }`,
        duration: 5000,
      });

      // Auto-switch to break
      if (newCount % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      // Break complete
      toast({
        title: "☕ انتهت الاستراحة!",
        description: "حان وقت العودة للتركيز. استعد!",
        duration: 4000,
      });
      switchMode("focus");
    }
  }, [addStudySession, toast]);

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setTimeout(() => handleTimerComplete(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleTimerComplete]);

  // Tip rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Start/Pause
  const toggleTimer = () => {
    if (!isRunning && mode === "focus" && !sessionStartRef.current) {
      sessionStartRef.current = new Date();
    }
    setIsRunning(!isRunning);
  };

  // Reset
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(config.duration);
    sessionStartRef.current = null;
  };

  // Get subject info
  const selectedSubject = subjectsData.find((s) => s.id === selectedSubjectId);

  // SVG circle calculations
  const timerSize = 280;
  const strokeWidth = 10;
  const radius = (timerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  const center = timerSize / 2;

  // Tick marks
  const tickCount = 60;
  const tickRadius = radius + 14;

  // Motivational message based on pomodoro count
  const getMotivationalMessage = () => {
    if (pomodorosCompleted === 0) return "ابدأ أول جلسة تركيز! 🚀";
    if (pomodorosCompleted < 4) return "أنت في الطريق الصحيح! ⭐";
    if (pomodorosCompleted < 8) return "أداء رائع، واصل! 🔥";
    return "أنت نجم اليوم! 🏆";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl glass-red flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-xl blur-md opacity-40"
              style={{
                background: `radial-gradient(circle, ${config.color}30 0%, transparent 70%)`,
              }}
            />
            <Timer className="h-6 w-6 text-omni-red relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              مؤقت البومودورو
            </h1>
            <p className="text-muted-foreground text-sm">
              ركّز، استرح، وحقق أهدافك الدراسية
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glass p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, ${config.color} 1px, transparent 1px),
                  radial-gradient(circle at 80% 20%, #D4A843 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Mode Tabs with progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
                  const cfg = modeConfig[m];
                  const ModeIcon = cfg.icon;
                  const isActive = mode === m;
                  return (
                    <motion.button
                      key={m}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => switchMode(m)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                        isActive
                          ? m === "focus"
                            ? "bg-omni-red text-white shadow-lg glow-red-sm"
                            : m === "shortBreak"
                            ? "bg-omni-gold text-white shadow-lg glow-gold-sm"
                            : "bg-green-600 text-white shadow-lg"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ModeIcon className="h-4 w-4" />
                      {cfg.label}
                      {/* Progress bar under active mode */}
                      {isActive && isRunning && (
                        <motion.div
                          className="absolute bottom-0 inset-x-0 h-[3px]"
                          style={{
                            background: `linear-gradient(90deg, ${cfg.gradientFrom}, ${cfg.gradientTo})`,
                            transformOrigin: "right",
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Mode Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {config.motivationalMsg}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Circular Timer */}
            <div className="flex justify-center py-4">
              <div className="relative" style={{ width: timerSize, height: timerSize }}>
                {/* Outer animated glow ring */}
                {isRunning && (
                  <motion.div
                    className="absolute inset-[-16px] rounded-full"
                    style={{
                      border: `2px solid ${config.color}20`,
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Inner animated glow ring */}
                {isRunning && (
                  <motion.div
                    className="absolute inset-[-8px] rounded-full"
                    style={{
                      border: `1.5px solid ${config.color}15`,
                    }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                )}

                {/* Background glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl"
                  animate={
                    isRunning
                      ? {
                          opacity: [0.1, 0.25, 0.1],
                        }
                      : { opacity: 0.08 }
                  }
                  transition={
                    isRunning
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.5 }
                  }
                  style={{
                    background: `radial-gradient(circle, ${config.color}30 0%, transparent 70%)`,
                  }}
                />

                <svg
                  width={timerSize}
                  height={timerSize}
                  viewBox={`0 0 ${timerSize} ${timerSize}`}
                  className="transform -rotate-90"
                >
                  {/* Tick marks around circle */}
                  {Array.from({ length: tickCount }).map((_, i) => {
                    const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
                    const isMajor = i % 5 === 0;
                    const innerR = tickRadius - (isMajor ? 8 : 5);
                    const outerR = tickRadius;
                    const x1 = center + innerR * Math.cos(angle);
                    const y1 = center + innerR * Math.sin(angle);
                    const x2 = center + outerR * Math.cos(angle);
                    const y2 = center + outerR * Math.sin(angle);

                    // Calculate if this tick is "filled" based on progress
                    const tickProgress = i / tickCount;
                    const isFilled = tickProgress <= progress;

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={
                          isFilled ? config.color : "currentColor"
                        }
                        strokeWidth={isMajor ? 2 : 1}
                        strokeLinecap="round"
                        opacity={
                          isFilled ? (isMajor ? 0.7 : 0.4) : isMajor ? 0.15 : 0.06
                        }
                        style={{ transition: "opacity 0.3s, stroke 0.3s" }}
                      />
                    );
                  })}

                  {/* Track */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="text-muted/30"
                  />

                  {/* Progress arc with gradient */}
                  <defs>
                    <linearGradient
                      id="timerGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={config.gradientFrom} />
                      <stop offset="100%" stopColor={config.gradientTo} />
                    </linearGradient>
                    {/* Glow filter */}
                    <filter id="progressGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    filter={isRunning ? "url(#progressGlow)" : undefined}
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Mode icon */}
                  <motion.div
                    key={`icon-${mode}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      {mode === "focus" ? (
                        <Brain className="h-6 w-6" style={{ color: config.color }} />
                      ) : (
                        <Coffee className="h-6 w-6" style={{ color: config.color }} />
                      )}
                    </div>
                  </motion.div>

                  {/* Time display */}
                  <motion.span
                    key={timeLeft}
                    className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tight"
                    style={{ color: config.color }}
                    initial={{ scale: 0.98 }}
                    animate={{
                      scale: 1,
                      ...(isRunning && timeLeft % 60 === 0
                        ? { textShadow: `0 0 20px ${config.color}40` }
                        : {}),
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {formatTime(timeLeft)}
                  </motion.span>

                  {/* Mode label */}
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    {config.label}
                  </span>

                  {/* Selected subject indicator */}
                  {selectedSubject && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <SubjectIcon
                        iconName={selectedSubject.icon}
                        className="h-3.5 w-3.5"
                        style={{ color: selectedSubject.color }}
                      />
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {selectedSubject.nameAr}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  disabled={isRunning && timeLeft === totalDuration}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={toggleTimer}
                  className="btn-omni-primary h-14 w-14 rounded-2xl shadow-lg"
                  size="icon"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isRunning ? "pause" : "play"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isRunning ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ms-0.5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    if (mode === "focus") switchMode("shortBreak");
                    else switchMode("focus");
                  }}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                >
                  <Zap className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground text-center">
                ماذا تدرس؟
              </p>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="w-full max-w-xs mx-auto h-11 rounded-xl border-omni-gold/20 focus:border-omni-gold/40">
                  <SelectValue placeholder="اختر المادة" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {subjectsData.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: subject.color || "#B91C1C" }}
                        />
                        <SubjectIcon
                          iconName={subject.icon}
                          className="h-4 w-4"
                          style={{ color: subject.color }}
                        />
                        <span>{subject.nameAr}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Session Counter Card — enhanced with gradient */}
          <Card className="glass-red p-5 space-y-4 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background: `linear-gradient(145deg, rgba(185, 28, 28, 0.08) 0%, rgba(212, 168, 67, 0.04) 50%, transparent 100%)`,
              }}
            />

            <div className="flex items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-omni-red/10 flex items-center justify-center">
                <Flame className="h-4 w-4 text-omni-red" />
              </div>
              <h3 className="text-base font-bold text-foreground">تقدم اليوم</h3>
            </div>

            {/* Pomodoro count with glow */}
            <div className="text-center space-y-2 relative z-10">
              <motion.div
                key={pomodorosCompleted}
                initial={{ scale: 1.4, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-6xl font-bold relative inline-block"
                style={{
                  color: config.color,
                  textShadow: `0 0 30px ${config.color}30, 0 0 60px ${config.color}15`,
                }}
              >
                {pomodorosCompleted}
              </motion.div>
              <p className="text-sm text-muted-foreground">بومودورو مكتمل</p>
            </div>

            {/* Pomodoro indicators with animation */}
            <div className="flex items-center justify-center gap-2 relative z-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    i < pomodorosCompleted % 4
                      ? "bg-omni-red text-white shadow-md glow-red-sm"
                      : "bg-omni-red/8 text-omni-red/30 dark:bg-red-900/15 dark:text-red-400/30"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </motion.div>
              ))}
            </div>

            {/* Cycle indicator */}
            {pomodorosCompleted > 0 && (
              <div className="text-center relative z-10">
                <Badge className="badge-omni-gold">
                  الدورة {Math.floor(pomodorosCompleted / 4) + 1}
                </Badge>
              </div>
            )}

            {/* Motivational message */}
            <motion.p
              key={pomodorosCompleted}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-xs text-muted-foreground relative z-10"
            >
              {getMotivationalMessage()}
            </motion.p>
          </Card>

          {/* Today's Logged Sessions */}
          <Card className="glass p-5 space-y-3 relative overflow-hidden">
            {/* Decorative top bar */}
            <div
              className="absolute top-0 inset-x-0 h-1"
              style={{
                background: "linear-gradient(90deg, #D4A843, #E5C168, #D4A843)",
              }}
            />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-omni-gold/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-omni-gold" />
              </div>
              <h3 className="text-base font-bold text-foreground">جلسات اليوم</h3>
            </div>

            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const todaySessions = studySessions.filter(
                (s) => s.date === todayStr && s.completed
              );

              if (todaySessions.length === 0) {
                return (
                  <div className="text-center py-6 space-y-2">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">
                      لم تسجّل أي جلسات بعد
                    </p>
                  </div>
                );
              }

              return (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2 max-h-64 overflow-y-auto"
                >
                  {todaySessions.map((session) => {
                    const subject = subjectsData.find(
                      (s) => s.id === session.subjectId
                    );
                    if (!subject) return null;

                    return (
                      <motion.div
                        key={session.id}
                        variants={itemVariants}
                        className="flex items-center gap-2 p-2.5 rounded-xl glass hover:bg-muted/30 transition-colors"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${subject.color}12` }}
                        >
                          <SubjectIcon
                            iconName={subject.icon}
                            className="h-4 w-4"
                            style={{ color: subject.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {subject.nameAr}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {session.duration} دقيقة
                          </p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            })()}
          </Card>

          {/* Tips Card — enhanced with icons and rotation */}
          <Card className="glass-gold p-5 space-y-3 relative overflow-hidden">
            {/* Decorative top bar */}
            <div
              className="absolute top-0 inset-x-0 h-1"
              style={{
                background: "linear-gradient(90deg, #D4A843, #B91C1C, #D4A843)",
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-omni-gold/10 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-omni-gold" />
                </div>
                <h3 className="text-base font-bold text-foreground">نصائح</h3>
              </div>
              <button
                onClick={() =>
                  setCurrentTipIndex((prev) => (prev + 1) % TIPS.length)
                }
                className="text-xs text-omni-gold hover:text-omni-gold-light transition-colors"
              >
                التالي ←
              </button>
            </div>

            {/* Rotating tip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-omni-gold/5 dark:bg-omni-gold/5"
              >
                {(() => {
                  const tip = TIPS[currentTipIndex];
                  const TipIcon = tip.icon;
                  return (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-omni-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <TipIcon className="h-4 w-4 text-omni-gold" />
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {tip.text}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Tip dots indicator */}
            <div className="flex items-center justify-center gap-1">
              {TIPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTipIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentTipIndex
                      ? "bg-omni-gold w-4"
                      : "bg-omni-gold/20 hover:bg-omni-gold/40"
                  }`}
                />
              ))}
            </div>

            {/* Static tips list */}
            <div className="text-xs text-muted-foreground space-y-1.5 mt-2">
              {TIPS.slice(0, 3).map((tip, i) => {
                const TipIcon = tip.icon;
                return (
                  <div key={i} className="flex items-start gap-1.5">
                    <TipIcon className="h-3 w-3 mt-0.5 text-omni-gold/50 shrink-0" />
                    <span>{tip.text}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
