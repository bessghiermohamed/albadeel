"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Circle,
  TrendingUp,
  GraduationCap,
  Brain,
  PenTool,
  Users,
  Monitor,
  Search,
  School,
  Sparkles,
  Target,
  Rocket,
  Star,
  Flame,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject, SubjectStatus } from "@/lib/types";
import { ProgressCircle } from "./ProgressCircle";
import { StudyStreak } from "./StudyStreak";
import { DataExportImport } from "./DataExportImport";
import { ActivityTimeline } from "./ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

/* ------------------------------------------------------------------ */
/*  Loading Skeleton for lazy-loaded components                       */
/* ------------------------------------------------------------------ */
const LoadingSkeleton = () => (
  <div className="glass-dashboard rounded-xl p-6 animate-pulse">
    <div className="h-6 w-48 bg-muted rounded mb-4" />
    <div className="h-40 bg-muted rounded" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Lazy-loaded heavy components                                      */
/* ------------------------------------------------------------------ */
const SemesterComparisonChart = dynamic(
  () => import("./SemesterComparisonChart").then((m) => m.SemesterComparisonChart),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const GPACalculator = dynamic(
  () => import("./GPACalculator").then((m) => m.GPACalculator),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const SubjectComparison = dynamic(
  () => import("./SubjectComparison").then((m) => m.SubjectComparison),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const ProgressReport = dynamic(
  () => import("./ProgressReport").then((m) => m.ProgressReport),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const SubjectRadarChart = dynamic(
  () => import("./SubjectRadarChart").then((m) => m.SubjectRadarChart),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const ProgressHistoryChart = dynamic(
  () => import("./ProgressHistoryChart").then((m) => m.ProgressHistoryChart),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Icon mapping — maps string icon names from subjects-data to JSX   */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Brain,
  GraduationCap,
  PenTool,
  Users,
  Monitor,
  History: Clock,
  Search,
  Globe: TrendingUp,
  BarChart3: TrendingUp,
  Languages: PenTool,
  MessageSquare: PenTool,
  Presentation: GraduationCap,
  School,
  BookMarked: BookOpen,
  Target: Search,
  Heart: GraduationCap,
  Layout: Monitor,
  Clock,
};

function getSubjectIcon(iconName?: string): React.ElementType {
  if (!iconName) return BookOpen;
  return iconMap[iconName] || BookOpen;
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */
const statusLabels: Record<SubjectStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "قيد التقدم",
  completed: "مكتملة",
};

const statusBadgeClass: Record<SubjectStatus, string> = {
  not_started:
    "bg-gray-200/80 text-gray-700 border-gray-300 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600",
  in_progress: "badge-omni-gold",
  completed:
    "bg-green-100/80 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
};

function getStatusForSubject(
  subjectId: string,
  progress: { subjectId: string; status: SubjectStatus; progress: number }[]
): { status: SubjectStatus; progress: number } {
  const entry = progress.find((p) => p.subjectId === subjectId);
  return entry ? { status: entry.status, progress: entry.progress } : { status: "not_started", progress: 0 };
}

/* ------------------------------------------------------------------ */
/*  Motivational messages with icons                                   */
/* ------------------------------------------------------------------ */
function getMotivationalMessage(pct: number): { text: string; icon: React.ElementType; color: string } {
  if (pct === 0) return { text: "ابدأ رحلتك التعليمية اليوم!", icon: Rocket, color: "#B91C1C" };
  if (pct < 25) return { text: "بداية موفقة! واصل التقدم", icon: TrendingUp, color: "#D4A843" };
  if (pct < 50) return { text: "أنت في الطريق الصحيح، استمر!", icon: Target, color: "#D4A843" };
  if (pct < 75) return { text: "إنجاز رائع! أنت تقترب من الهدف", icon: Star, color: "#16A34A" };
  if (pct < 100) return { text: "مرحلة المتابعة الأخيرة، يمكنك فعلها!", icon: Flame, color: "#16A34A" };
  return { text: "تهانينا! أكملت جميع المواد", icon: Sparkles, color: "#D4A843" };
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Mini Sparkline SVG Component — 7-bar micro chart                  */
/* ------------------------------------------------------------------ */
interface MiniSparklineProps {
  color: string;
  values?: number[];
  height?: number;
  barWidth?: number;
  gap?: number;
}

function MiniSparkline({
  color,
  values = [30, 50, 40, 70, 55, 80, 65],
  height = 28,
  barWidth = 4,
  gap = 3,
}: MiniSparklineProps) {
  const maxVal = Math.max(...values, 1);
  const totalWidth = values.length * barWidth + (values.length - 1) * gap;

  return (
    <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`} className="opacity-60">
      {values.map((val, i) => {
        const barHeight = Math.max(3, (val / maxVal) * (height - 2));
        const x = i * (barWidth + gap);
        const y = height - barHeight;
        const isLast = i === values.length - 1;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={isLast ? color : color}
            opacity={isLast ? 1 : 0.35}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Progress Arc — small circular progress for summary cards     */
/* ------------------------------------------------------------------ */
interface MiniProgressArcProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}

function MiniProgressArc({ percentage, size = 48, strokeWidth = 4, color }: MiniProgressArcProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border/30"
      />
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Milestone Progress Bar — Horizontal bar with milestone markers    */
/* ------------------------------------------------------------------ */
interface MilestoneBarProps {
  percentage: number;
  color?: string;
}

function MilestoneBar({ percentage, color = "#B91C1C" }: MilestoneBarProps) {
  const milestones = [
    { pct: 25, label: "٢٥٪", emoji: "📘" },
    { pct: 50, label: "٥٠٪", emoji: "📗" },
    { pct: 75, label: "٧٥٪", emoji: "📙" },
  ];

  return (
    <div className="w-full space-y-2">
      {/* The bar */}
      <div className="relative h-4 w-full rounded-full bg-muted/60 dark:bg-muted/40 border border-border/50 overflow-visible">
        {/* Milestone markers — animated pulse when reached */}
        {milestones.map((m) => {
          const reached = percentage >= m.pct;
          return (
            <motion.div
              key={m.pct}
              className="absolute top-1/2 -translate-y-1/2 z-10"
              style={{ left: `${m.pct}%` }}
              initial={false}
              animate={reached ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={reached ? { duration: 0.5, delay: 1.2 } : {}}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-colors duration-500 ${
                  reached
                    ? "bg-omni-gold border-omni-gold shadow-md"
                    : "bg-background border-border/70"
                }`}
              />
            </motion.div>
          );
        })}
        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 start-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, #D4A843)`,
            maxWidth: "100%",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-full" />
        </motion.div>
        {/* Tip marker */}
        {percentage > 0 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-omni-gold border-2 border-background shadow-lg z-20"
            style={{ left: `${Math.min(percentage, 100)}%`, marginLeft: -8 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
          />
        )}
      </div>
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground/70 px-0.5">
        <span>٠٪</span>
        {milestones.map((m) => (
          <span
            key={m.pct}
            className={`hidden sm:inline transition-colors duration-300 ${
              percentage >= m.pct ? "text-omni-gold font-bold" : ""
            }`}
          >
            {m.label}
          </span>
        ))}
        <span>١٠٠٪</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function StudentDashboard() {
  const { progress, selectSubject, selectedSemester, setSelectedSemester } = useAppStore();

  /* ---------- Computed stats ---------- */
  const stats = useMemo(() => {
    const total = subjectsData.length;
    const completed = progress.filter((p) => p.status === "completed").length;
    const inProgress = progress.filter((p) => p.status === "in_progress").length;
    const notStarted = total - completed - inProgress;
    const overallProgress =
      total > 0
        ? progress.reduce((acc, p) => acc + p.progress, 0) / total
        : 0;
    return { total, completed, inProgress, notStarted, overallProgress };
  }, [progress]);

  /* ---------- Category breakdown ---------- */
  const categoryBreakdown = useMemo(() => {
    return categories.map((cat) => {
      const catSubjects = subjectsData.filter((s) => s.category === cat.id);
      const total = catSubjects.length;
      const avgProgress =
        total > 0
          ? catSubjects.reduce((acc, s) => {
              const p = getStatusForSubject(s.id, progress);
              return acc + p.progress;
            }, 0) / total
          : 0;
      return {
        ...cat,
        total,
        avgProgress: Math.round(avgProgress),
      };
    });
  }, [progress]);

  /* ---------- Subjects by semester ---------- */
  const semesterSubjects = useMemo(() => {
    return {
      1: subjectsData.filter((s) => s.semester === 1).sort((a, b) => a.order - b.order),
      2: subjectsData.filter((s) => s.semester === 2).sort((a, b) => a.order - b.order),
    };
  }, []);

  /* ---------- Motivational data ---------- */
  const motivation = getMotivationalMessage(stats.overallProgress);
  const MotivationIcon = motivation.icon;

  /* ================================================================ */
  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 section-gradient-bg rounded-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ========== Page Header ========== */}
      <motion.div variants={itemVariants} className="text-center sm:text-start">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-omni-red to-omni-gold flex items-center justify-center shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black gradient-text-red-gold">
              لوحة المتعلم
            </h1>
            <p className="text-foreground/60 mt-0.5 text-xs sm:text-sm font-medium">
              نظرة شاملة على تقدّمك الدراسي —{" "}
              <span className="text-omni-red font-bold">{stats.completed}</span> مادة مكتملة من أصل{" "}
              <span className="text-omni-gold font-bold">{stats.total}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ========== 1. Summary Cards ========== */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Total */}
        <SummaryCard
          label="إجمالي المواد"
          value={stats.total}
          icon={<BookOpen className="h-7 w-7" />}
          accentColor="#B91C1C"
          gradientClass="stat-card-gradient-red"
          sparklineColor="#B91C1C"
          sparklineValues={[12, 18, 15, 20, 22, 24, stats.total]}
          progressPct={Math.round((stats.completed / stats.total) * 100)}
          delay={0}
        />
        {/* Completed */}
        <SummaryCard
          label="مكتملة"
          value={stats.completed}
          icon={<CheckCircle className="h-7 w-7" />}
          accentColor="#16A34A"
          gradientClass="stat-card-gradient-green"
          sparklineColor="#16A34A"
          sparklineValues={[2, 4, 5, 7, 8, 10, stats.completed]}
          progressPct={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
          delay={0.1}
        />
        {/* In Progress */}
        <SummaryCard
          label="قيد التقدم"
          value={stats.inProgress}
          icon={<Clock className="h-7 w-7" />}
          accentColor="#D4A843"
          gradientClass="stat-card-gradient-gold"
          sparklineColor="#D4A843"
          sparklineValues={[1, 3, 5, 4, 6, 7, stats.inProgress]}
          progressPct={stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}
          delay={0.2}
        />
        {/* Not Started */}
        <SummaryCard
          label="لم تبدأ"
          value={stats.notStarted}
          icon={<Circle className="h-7 w-7" />}
          accentColor="#8B7E6A"
          gradientClass="stat-card-gradient-neutral"
          sparklineColor="#8B7E6A"
          sparklineValues={[20, 18, 16, 14, 12, 10, stats.notStarted]}
          progressPct={stats.total > 0 ? Math.round(((stats.total - stats.notStarted) / stats.total) * 100) : 0}
          delay={0.3}
        />
      </motion.div>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ========== 2. Overall Progress ========== */}
      <motion.div variants={itemVariants}>
        <Card className="dashboard-summary-card card-glow-hover shadow-dramatic overflow-hidden border-border/60 islamic-pattern-bg relative">
          <CardContent className="p-6 sm:p-8 dashboard-section-bg relative">
            {/* Decorative gradient orbs behind progress circle */}
            <div className="decorative-orb top-4 right-4 w-56 h-56 opacity-40" style={{ background: "#B91C1C" }} />
            <div className="decorative-orb bottom-4 left-4 w-44 h-44 opacity-30" style={{ background: "#D4A843" }} />

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 relative z-10">
              {/* Circle with enhanced glow */}
              <div className="flex-shrink-0 progress-ring-glow relative">
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-[-8px] rounded-full border-2 border-omni-red/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <ProgressCircle
                  percentage={stats.overallProgress}
                  size={200}
                  strokeWidth={16}
                  color="#B91C1C"
                  trackColor="rgba(185,28,28,0.08)"
                  textSize={36}
                  delay={0.3}
                />
              </div>

              {/* Text & stats */}
              <div className="text-center sm:text-start flex-1 space-y-3 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground section-header-line">
                  التقدم العام
                </h2>
                <p
                  className="text-7xl sm:text-8xl font-black text-omni-red dark:text-omni-red-light ltr-content stat-value-glow leading-none"
                  dir="ltr"
                  style={{ textShadow: "0 0 40px rgba(185,28,28,0.35), 0 0 80px rgba(185,28,28,0.15)" }}
                >
                  {Math.round(stats.overallProgress)}%
                </p>
                <p className="text-foreground/70 text-sm sm:text-base font-medium">
                  {stats.completed} من {stats.total} مادة مكتملة
                </p>

                {/* Mini stats row */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                  <Badge variant="outline" className="badge-omni-red text-xs font-semibold px-3 py-1">
                    ✓ {stats.completed} مكتملة
                  </Badge>
                  <Badge variant="outline" className="badge-omni-gold text-xs font-semibold px-3 py-1">
                    ◐ {stats.inProgress} قيد التقدم
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-200/70 text-gray-700 border-gray-300 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600 text-xs font-semibold px-3 py-1"
                  >
                    ○ {stats.notStarted} لم تبدأ
                  </Badge>
                </div>

                {/* Milestone progress bar */}
                <div className="pt-2">
                  <MilestoneBar percentage={stats.overallProgress} />
                </div>

                {/* Motivational message with icon */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mt-1"
                  style={{
                    backgroundColor: `${motivation.color}12`,
                    border: `1px solid ${motivation.color}25`,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <MotivationIcon className="h-5 w-5 shrink-0" style={{ color: motivation.color }} />
                  <p className="text-sm font-bold" style={{ color: motivation.color }}>
                    {motivation.text}
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ========== 3. Subjects Progress Grid ========== */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={String(selectedSemester)}
          onValueChange={(v) => setSelectedSemester(Number(v) as 1 | 2)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="1">السداسي الأول</TabsTrigger>
            <TabsTrigger value="2">السداسي الثاني</TabsTrigger>
          </TabsList>

          {([1, 2] as const).map((sem) => (
            <TabsContent key={sem} value={String(sem)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {semesterSubjects[sem].map((subject, idx) => {
                  const { status, progress: pct } = getStatusForSubject(subject.id, progress);
                  const IconComp = getSubjectIcon(subject.icon);
                  const catColor =
                    categories.find((c) => c.id === subject.category)?.color || "#B91C1C";

                  return (
                    <motion.div
                      key={subject.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.05 }}
                    >
                      <motion.div
                        variants={cardHover}
                        initial="rest"
                        whileHover="hover"
                        className="cursor-pointer"
                        onClick={() => selectSubject(subject.id)}
                      >
                        <Card className="dashboard-summary-card card-glow-hover card-depth overflow-hidden h-full border-border/50 transition-shadow duration-300">
                          {/* Top accent bar with category color gradient */}
                          <div
                            className="h-2 w-full"
                            style={{
                              background: `linear-gradient(90deg, ${catColor}, ${catColor}88, #D4A843)`,
                            }}
                          />
                          <CardContent className="p-4 sm:p-5 flex flex-col items-center gap-3 text-center relative">
                            {/* Decorative corner accent */}
                            <div
                              className="absolute top-0 left-0 w-16 h-16 opacity-[0.04] rounded-bl-full"
                              style={{ backgroundColor: catColor }}
                            />

                            {/* Subject icon — larger and more prominent */}
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-white/20 dark:border-border/30 transition-transform duration-300 hover:scale-110"
                              style={{
                                backgroundColor: `${catColor}18`,
                                color: catColor,
                                boxShadow: `0 4px 14px ${catColor}20`,
                              }}
                            >
                              <IconComp className="h-7 w-7" />
                            </div>

                            {/* Subject name */}
                            <h3 className="text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem] text-foreground">
                              {subject.nameAr}
                            </h3>

                            {/* Category dot indicator */}
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: catColor }}
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {subject.category}
                              </span>
                            </div>

                            {/* Larger mini progress circle with glow */}
                            <div className="progress-ring-glow-sm my-1">
                              <ProgressCircle
                                percentage={pct}
                                size={84}
                                strokeWidth={8}
                                color={catColor}
                                trackColor={`${catColor}10`}
                                textSize={17}
                                delay={idx * 0.04 + 0.3}
                              />
                            </div>

                            {/* Status badge — more prominent */}
                            <Badge
                              variant="outline"
                              className={`text-[11px] px-4 py-1 font-semibold ${statusBadgeClass[status]}`}
                            >
                              {statusLabels[status]}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ========== 4. Category Breakdown ========== */}
      <motion.div variants={itemVariants}>
        <Card className="dashboard-summary-card card-glow-hover overflow-hidden border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold section-header-line">تقدم المواد حسب التصنيف</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 dashboard-section-bg">
            <div className="space-y-7">
              {categoryBreakdown.map((cat, idx) => {
                const catIcon = getSubjectIcon(cat.icon);
                return (
                  <div key={cat.id} className="space-y-2.5">
                    {/* Label row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-white/20 dark:border-border/30"
                          style={{
                            backgroundColor: `${cat.color}18`,
                            color: cat.color,
                          }}
                        >
                          <catIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-foreground">{cat.label}</span>
                          <span className="text-muted-foreground text-xs font-medium block">
                            {cat.total} مادة
                          </span>
                        </div>
                      </div>
                      <span
                        className="stat-value-xl font-black text-lg ltr-content"
                        dir="ltr"
                        style={{ color: cat.color }}
                      >
                        {cat.avgProgress}%
                      </span>
                    </div>
                    {/* Progress bar — thicker with percentage label inside */}
                    <div className="h-7 w-full rounded-full category-bar-track border border-border/30 overflow-hidden relative">
                      {/* Milestone markers inside the bar */}
                      {[25, 50, 75].map((m) => (
                        <div
                          key={m}
                          className="absolute top-0 bottom-0 w-px z-10"
                          style={{
                            left: `${m}%`,
                            backgroundColor: cat.avgProgress >= m ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.08)",
                          }}
                        />
                      ))}
                      <motion.div
                        className="h-full rounded-full relative flex items-center justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc, #D4A84388)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.avgProgress}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.1 * idx + 0.3,
                        }}
                      >
                        {/* Percentage label inside the bar */}
                        {cat.avgProgress > 12 && (
                          <motion.span
                            className="text-[11px] font-bold text-white/90 absolute inset-0 flex items-center justify-center drop-shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 * idx + 1 }}
                          >
                            {cat.avgProgress}%
                          </motion.span>
                        )}
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                      </motion.div>
                      {/* Percentage label outside bar (for small values) */}
                      {cat.avgProgress <= 12 && cat.avgProgress > 0 && (
                        <motion.span
                          className="absolute top-1/2 -translate-y-1/2 text-[11px] font-bold start-2"
                          style={{ color: cat.color }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * idx + 1 }}
                        >
                          {cat.avgProgress}%
                        </motion.span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ========== 5. Activity Timeline ========== */}
      <div className="section-divider" />
      <motion.div variants={itemVariants}>
        <ActivityTimeline />
      </motion.div>

      {/* ========== 6. Subject Comparison ========== */}
      <motion.div variants={itemVariants}>
        <SubjectComparison />
      </motion.div>

      {/* ========== 6. Streak & Semester Comparison ========== */}
      <div className="section-divider" />
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyStreak />
          <SemesterComparisonChart />
        </div>
      </motion.div>

      {/* ========== 6c. Progress History Chart ========== */}
      <motion.div variants={itemVariants}>
        <ProgressHistoryChart />
      </motion.div>

      {/* ========== 7. GPA Calculator ========== */}
      <motion.div variants={itemVariants}>
        <GPACalculator />
      </motion.div>

      {/* ========== 7b. Subject Radar Chart ========== */}
      <motion.div variants={itemVariants}>
        <SubjectRadarChart />
      </motion.div>

      {/* ========== 8. Data Management ========== */}
      <motion.div variants={itemVariants}>
        <DataExportImport />
      </motion.div>

      {/* ========== 9. Progress Report (PDF) ========== */}
      <motion.div variants={itemVariants}>
        <ProgressReport />
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  SummaryCard — Enhanced with gradient bg, glow numbers, arc        */
/* ================================================================== */
interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  gradientClass: string;
  sparklineColor: string;
  sparklineValues: number[];
  progressPct: number;
  delay: number;
}

function SummaryCard({
  label,
  value,
  icon,
  accentColor,
  gradientClass,
  sparklineColor,
  sparklineValues,
  progressPct,
  delay,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="dashboard-summary-card card-glow-hover shadow-dramatic rounded-2xl overflow-hidden border border-border/50"
    >
      {/* Thick gradient accent bar at top */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, #B91C1C, ${accentColor}, #D4A843)` }}
      />

      <div className={`p-5 sm:p-6 relative ${gradientClass}`}>
        {/* Decorative background circles — more prominent */}
        <div
          className="decorative-orb -top-12 -left-12 w-48 h-48"
          style={{ background: accentColor }}
        />
        <div
          className="decorative-orb -bottom-10 -right-10 w-36 h-36"
          style={{ background: "#D4A843" }}
        />

        {/* Top row: larger icon + sparkline */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-white/20 dark:border-border/30 transition-transform duration-300 hover:scale-110"
            style={{
              backgroundColor: `${accentColor}18`,
              color: accentColor,
              boxShadow: `0 4px 16px ${accentColor}20`,
            }}
          >
            {icon}
          </div>
          <MiniSparkline color={sparklineColor} values={sparklineValues} />
        </div>

        {/* Large number — even more prominent with enhanced glow */}
        <motion.p
          className="text-6xl sm:text-8xl font-black ltr-content stat-value-glow leading-none"
          dir="ltr"
          style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}50, 0 0 80px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.1)` }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.2, type: "spring", stiffness: 120 }}
        >
          {value}
        </motion.p>

        {/* Label — improved contrast */}
        <p className="text-xs uppercase tracking-wider text-foreground/80 font-bold mt-2 relative z-10">
          {label}
        </p>

        {/* Mini progress arc indicator below the number */}
        <div className="flex items-center gap-2 mt-3 relative z-10">
          <MiniProgressArc percentage={progressPct} color={accentColor} />
          <span className="text-[11px] font-semibold text-foreground/60 ltr-content" dir="ltr">
            {progressPct}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
