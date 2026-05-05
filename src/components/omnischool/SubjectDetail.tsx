"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject, SubjectStatus } from "@/lib/types";
import { ProgressCircle } from "./ProgressCircle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
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
  ExternalLink,
  ChevronLeft,
  Edit3,
  CheckCircle2,
  PlayCircle,
  Save,
  Star,
  FileText,
  Download,
  Share2,
  Home,
  ChevronLeft as ChevronSep,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  Zap,
  Link2,
  Award,
  Milestone,
  FileSpreadsheet,
  ClipboardList,
  Hash,
  CheckCheck,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import { SubjectFavoriteToggle } from "./SubjectFavoriteToggle";

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Status config — Enhanced with better icons and descriptions       */
/* ------------------------------------------------------------------ */
const statusConfig: Record<
  SubjectStatus,
  { label: string; color: string; bgColor: string; icon: LucideIcon; description: string }
> = {
  completed: {
    label: "مكتملة",
    color: "#16A34A",
    bgColor: "rgba(22,163,74,0.1)",
    icon: CheckCircle2,
    description: "أنهيت دراسة هذه المادة بالكامل",
  },
  in_progress: {
    label: "قيد التقدم",
    color: "#D4A843",
    bgColor: "rgba(212,168,67,0.1)",
    icon: Clock,
    description: "تدرس هذه المادة حالياً",
  },
  not_started: {
    label: "لم تبدأ",
    color: "#8B7E6A",
    bgColor: "rgba(139,126,106,0.1)",
    icon: PlayCircle,
    description: "لم تبدأ دراسة هذه المادة بعد",
  },
};

/* ------------------------------------------------------------------ */
/*  Category color mapping — theming based on category                 */
/* ------------------------------------------------------------------ */
const categoryTheme: Record<string, { primary: string; light: string; gradient: string }> = {
  "تربوية": { primary: "#DC2626", light: "#FEF2F2", gradient: "from-red-500 to-red-700" },
  "نفسية": { primary: "#7C3AED", light: "#F5F3FF", gradient: "from-purple-500 to-purple-700" },
  "لغوية": { primary: "#059669", light: "#ECFDF5", gradient: "from-emerald-500 to-emerald-700" },
  "اجتماعية": { primary: "#2563EB", light: "#EFF6FF", gradient: "from-blue-500 to-blue-700" },
  "تكنولوجية": { primary: "#0891B2", light: "#ECFEFF", gradient: "from-cyan-500 to-cyan-700" },
  "منهجية": { primary: "#4F46E5", light: "#EEF2FF", gradient: "from-indigo-500 to-indigo-700" },
  "تطبيقية": { primary: "#D97706", light: "#FFFBEB", gradient: "from-amber-500 to-amber-700" },
};

/* ------------------------------------------------------------------ */
/*  Progress Timeline Milestones — Enhanced with descriptions         */
/* ------------------------------------------------------------------ */
const progressMilestones = [
  { percent: 0, label: "البداية", description: "بداية الرحلة", icon: PlayCircle },
  { percent: 25, label: "الربع الأول", description: "أساسيات المادة", icon: BookOpen },
  { percent: 50, label: "نصف الطريق", description: "منتصف الإنجاز", icon: Target },
  { percent: 75, label: "الربع الأخير", description: "اقتراب الهدف", icon: TrendingUp },
  { percent: 100, label: "الإتمام", description: "اكتمال المادة", icon: Award },
];

/* ------------------------------------------------------------------ */
/*  Resource type config with specific icons                           */
/* ------------------------------------------------------------------ */
const resourceTypeConfig: Record<string, { icon: LucideIcon; color: string }> = {
  pdf: { icon: FileText, color: "#DC2626" },
  exercises: { icon: ClipboardList, color: "#D97706" },
  exams: { icon: FileSpreadsheet, color: "#059669" },
};

/* ================================================================== */
/*  SubjectDetail Component                                            */
/* ================================================================== */
export function SubjectDetail() {
  const { selectedSubjectId, progress, setView, updateProgress, subjectNotes, setSubjectNotes } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);
  const [statusChanging, setStatusChanging] = useState<SubjectStatus | null>(null);
  const [lastSavedLength, setLastSavedLength] = useState(0);

  const notes = subjectNotes[selectedSubjectId ?? ""] ?? "";
  const maxNoteLength = 2000;

  const subject = useMemo(
    () => subjectsData.find((s) => s.id === selectedSubjectId),
    [selectedSubjectId]
  );

  const subjectProgress = useMemo(
    () => progress.find((p) => p.subjectId === selectedSubjectId),
    [progress, selectedSubjectId]
  );

  // Auto-save indicator — derived from notes change, no setState in effect
  const autoSaveActive = notes.length > 0 && notes.length !== lastSavedLength;

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="size-16 text-muted-foreground/30 mb-4" />
        <p className="text-lg text-muted-foreground">لم يتم اختيار مادة</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setView("subjects")}
        >
          تصفح المواد
        </Button>
      </div>
    );
  }

  const status: SubjectStatus = subjectProgress?.status ?? "not_started";
  const progressValue = subjectProgress?.progress ?? 0;
  const statusInfo = statusConfig[status];
  const subjectColor = subject.color || "#B91C1C";
  const Icon = iconMap[subject.icon || ""] || BookOpen;

  // Get category theme for theming
  const theme = categoryTheme[subject.category] || { primary: subjectColor, light: `${subjectColor}10`, gradient: "from-red-500 to-red-700" };

  const handleStatusChange = (newStatus: SubjectStatus) => {
    setStatusChanging(newStatus);
    let newProgress = progressValue;
    if (newStatus === "completed") newProgress = 100;
    else if (newStatus === "not_started") newProgress = 0;
    else if (newStatus === "in_progress" && progressValue === 0) newProgress = 10;
    updateProgress(subject.id, newStatus, newProgress);
    setTimeout(() => setStatusChanging(null), 600);
  };

  const handleProgressChange = (value: number) => {
    const newStatus: SubjectStatus =
      value >= 100 ? "completed" : value > 0 ? "in_progress" : "not_started";
    updateProgress(subject.id, newStatus, Math.min(100, Math.max(0, value)));
  };

  const relatedSubjects = subjectsData
    .filter(
      (s) =>
        s.category === subject.category &&
        s.id !== subject.id &&
        s.semester === subject.semester
    )
    .slice(0, 3);

  // If not enough in same semester, add from other semester
  const relatedSubjectsFinal = relatedSubjects.length >= 3
    ? relatedSubjects
    : [
        ...relatedSubjects,
        ...subjectsData
          .filter(
            (s) =>
              s.category === subject.category &&
              s.id !== subject.id &&
              s.semester !== subject.semester &&
              !relatedSubjects.some((rs) => rs.id === s.id)
          )
          .slice(0, 3 - relatedSubjects.length),
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Find current milestone
  const currentMilestoneIndex = progressMilestones.reduce((acc, m, i) => {
    return progressValue >= m.percent ? i : acc;
  }, 0);

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb Navigation */}
      <motion.div variants={itemVariants}>
        <nav className="breadcrumb-nav" aria-label="التنقل">
          <span
            className="breadcrumb-item hover:underline"
            onClick={() => setView("home")}
          >
            <Home className="size-3.5 inline-block ml-1" />
            الرئيسية
          </span>
          <span className="breadcrumb-divider">‹</span>
          <span
            className="breadcrumb-item hover:underline"
            onClick={() => setView("subjects")}
          >
            المواد
          </span>
          <span className="breadcrumb-divider">‹</span>
          <span className="breadcrumb-item active">
            {subject.nameAr}
          </span>
        </nav>
      </motion.div>

      {/* Back button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setView("subjects")}
        >
          <ChevronLeft className="size-4" />
          العودة إلى المواد
        </Button>
      </motion.div>

      {/* ============================================================ */}
      {/* ENHANCED Header Card — Thicker animated gradient, bigger    */}
      {/* icon with glow, better badges, "كود المادة" label          */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <Card className="card-depth bg-card border border-border overflow-hidden relative">
          {/* ENHANCED: Thicker gradient top bar with animated gradient */}
          <div
            className="h-3 relative overflow-hidden"
            style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}CC, #D4A843, ${theme.primary}CC, ${theme.primary})` }}
          >
            {/* Animated shimmer on the top bar */}
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
                backgroundSize: "200% 100%",
              }}
            />
          </div>
          {/* Subtle category background overlay */}
          <div
            className="absolute inset-0 top-3 opacity-[0.03]"
            style={{ background: `radial-gradient(ellipse at top right, ${theme.primary}, transparent 60%)` }}
          />

          <CardContent className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* ENHANCED: Icon with more prominent glow effect */}
              <div className="relative">
                <div
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Icon className="h-14 w-14" style={{ color: theme.primary }} />
                </div>
                {/* ENHANCED: Stronger glow behind icon — multi-layer */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30 blur-2xl"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="absolute inset-[-8px] rounded-3xl opacity-15 blur-3xl"
                  style={{ backgroundColor: theme.primary }}
                />
                {/* Decorative ring */}
                <div
                  className="absolute inset-[-4px] rounded-2xl border-2 opacity-20"
                  style={{ borderColor: theme.primary }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {subject.nameAr}
                  </h1>
                  <SubjectFavoriteToggle subjectId={subject.id} size={20} />
                </div>
                {subject.nameEn && (
                  <p className="text-sm text-muted-foreground ltr-content" dir="ltr">
                    {subject.nameEn}
                  </p>
                )}

                {/* ENHANCED: Badges with better styling and colored backgrounds */}
                <div className="flex flex-wrap gap-2">
                  {/* Code badge with "كود المادة" label */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground/70 font-medium">كود المادة</span>
                    <Badge
                      className="ltr-content font-mono text-xs font-bold px-3 py-1"
                      style={{
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary,
                        border: `1.5px solid ${theme.primary}30`,
                      }}
                    >
                      {subject.code}
                    </Badge>
                  </div>
                  <Badge
                    className="font-semibold px-3 py-1"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                      border: `1.5px solid ${theme.primary}30`,
                    }}
                  >
                    {subject.category}
                  </Badge>
                  <Badge
                    className="gap-1 px-3 py-1 font-semibold"
                    style={{
                      backgroundColor: "var(--muted)",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    <BookOpen className="size-3" />
                    السداسي {subject.semester}
                  </Badge>
                  {subject.isShared && (
                    <Badge className="badge-omni-gold gap-1 px-3 py-1 font-semibold">
                      <Share2 className="size-3" />
                      مشترك
                    </Badge>
                  )}
                  <Badge
                    className="gap-1 px-3 py-1 font-semibold"
                    style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      border: `1.5px solid ${statusInfo.color}30`,
                    }}
                  >
                    <statusInfo.icon className="size-3" />
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Description */}
                {subject.description && (
                  <p className="text-muted-foreground leading-relaxed mt-1">
                    {subject.description}
                  </p>
                )}
              </div>

              {/* Progress Circle with Glow Effect */}
              <div className="shrink-0 self-center">
                <div className="progress-ring-glow">
                  <ProgressCircle
                    percentage={progressValue}
                    size={150}
                    strokeWidth={12}
                    color={theme.primary}
                    textSize={28}
                  />
                </div>
              </div>
            </div>

            {/* Visual Progress Bar with Milestones */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground">مستوى الإنجاز</span>
                <span className="text-sm font-bold ltr-content" style={{ color: theme.primary }} dir="ltr">
                  {progressValue}%
                </span>
              </div>
              <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}BB, #D4A84388)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
                {/* Milestone markers */}
                {[25, 50, 75].map((milestone) => (
                  <div
                    key={milestone}
                    className="absolute top-0 bottom-0 w-px"
                    style={{
                      left: `${milestone}%`,
                      backgroundColor: progressValue >= milestone ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground/60">0%</span>
                <span className="text-[10px] text-muted-foreground/60">50%</span>
                <span className="text-[10px] text-muted-foreground/60">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ */}
      {/* ENHANCED Progress Timeline — Animated connecting lines,      */}
      {/* larger dots, pulsing current milestone, better labels       */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <Card className="card-depth bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Milestone className="size-4" style={{ color: theme.primary }} />
              <span className="section-header-line">مسار التقدم</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative py-6">
              {/* Horizontal line — background */}
              <div className="absolute top-1/2 right-4 left-4 h-1.5 bg-muted rounded-full -translate-y-1/2" />
              {/* ENHANCED: Filled line with animated gradient */}
              <motion.div
                className="absolute top-1/2 right-4 h-1.5 rounded-full -translate-y-1/2 overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${theme.primary}, #D4A843)` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressValue, 100)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {/* Animated shimmer on the filled line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
              </motion.div>
              {/* ENHANCED: Milestone dots — larger, more colorful, pulsing current */}
              <div className="relative flex justify-between px-4">
                {progressMilestones.map((milestone, idx) => {
                  const isReached = progressValue >= milestone.percent;
                  const isCurrent = idx === currentMilestoneIndex;
                  const MilestoneIcon = milestone.icon;
                  return (
                    <div key={milestone.percent} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                          scale: isReached ? 1 : 0.8,
                          opacity: isReached ? 1 : 0.4,
                        }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative z-10"
                      >
                        {/* ENHANCED: Larger dots (w-12 h-12) with pulsing current */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            isReached ? "shadow-lg" : ""
                          } ${isCurrent && isReached ? "pulse-red" : ""}`}
                          style={{
                            borderColor: isReached ? theme.primary : "var(--muted-foreground)",
                            backgroundColor: isReached ? `${theme.primary}20` : "var(--muted)",
                            boxShadow: isReached ? `0 0 16px ${theme.primary}35` : "none",
                          }}
                        >
                          <MilestoneIcon
                            className="size-5"
                            style={{ color: isReached ? theme.primary : "var(--muted-foreground)" }}
                          />
                        </div>
                        {/* ENHANCED: Extra glow ring for current milestone */}
                        {isCurrent && isReached && (
                          <div
                            className="absolute inset-[-6px] rounded-full opacity-20 animate-pulse"
                            style={{ border: `2px solid ${theme.primary}` }}
                          />
                        )}
                      </motion.div>
                      {/* ENHANCED: Better labels with descriptions */}
                      <span
                        className="text-[11px] font-bold mt-2.5 text-center max-w-[70px] leading-tight"
                        style={{ color: isReached ? theme.primary : "var(--muted-foreground)" }}
                      >
                        {milestone.label}
                      </span>
                      <span
                        className="text-[9px] mt-0.5 text-center max-w-[70px] leading-tight"
                        style={{ color: isReached ? `${theme.primary}99` : "var(--muted-foreground)" }}
                      >
                        {milestone.description}
                      </span>
                      <span
                        className="text-[10px] font-bold ltr-content mt-1"
                        style={{ color: isReached ? theme.primary : "var(--muted-foreground)" }}
                        dir="ltr"
                      >
                        {milestone.percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* Actions Row                                                  */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ============================================================ */}
          {/* ENHANCED Status Update — Icons on buttons, better active   */}
          {/* state with glow, subtle animation when changing             */}
          {/* ============================================================ */}
          <Card className="card-depth bg-card border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Edit3 className="size-4" style={{ color: theme.primary }} />
                <span className="section-header-line">تحديث الحالة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(statusConfig) as SubjectStatus[]).map((s) => {
                  const info = statusConfig[s];
                  const StatusIcon = info.icon;
                  const isActive = status === s;
                  const isChanging = statusChanging === s;
                  return (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      className={`btn-ripple inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                        isActive
                          ? "text-white shadow-lg"
                          : "border-border bg-background hover:border-omni-red/20 hover:bg-muted/50 text-foreground"
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: info.color,
                              backgroundColor: info.color,
                              boxShadow: `0 4px 16px ${info.color}45, 0 0 8px ${info.color}25`,
                            }
                          : {}
                      }
                      onClick={() => handleStatusChange(s)}
                    >
                      {/* ENHANCED: Icon on each status button */}
                      <StatusIcon className={`size-4 ${isChanging ? "animate-scale-pop" : ""}`} />
                      {info.label}
                      {/* ENHANCED: Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="status-indicator"
                          className="w-1.5 h-1.5 rounded-full bg-white/80"
                          transition={{ type: "spring", bounce: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Current status description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: statusInfo.bgColor }}
                >
                  <AlertCircle className="size-4 shrink-0" style={{ color: statusInfo.color }} />
                  <p className="text-xs" style={{ color: statusInfo.color }}>
                    {statusInfo.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">نسبة التقدم</span>
                  <span className="font-bold ltr-content text-lg" style={{ color: theme.primary }}>
                    {progressValue}%
                  </span>
                </div>
                <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = Math.round((x / rect.width) * 100);
                    handleProgressChange(pct);
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}BB)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  {/* Thumb indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all"
                    style={{
                      left: `calc(${progressValue}% - 10px)`,
                      backgroundColor: theme.primary,
                    }}
                  />
                </div>
                {/* Quick progress buttons */}
                <div className="flex gap-2 flex-wrap">
                  {[0, 25, 50, 75, 100].map((val) => {
                    const isActive = progressValue === val;
                    return (
                      <motion.button
                        key={val}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className={`progress-indicator inline-flex items-center justify-center h-10 min-w-[3.5rem] px-4 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                          isActive
                            ? "active"
                            : "border-border bg-background hover:border-omni-red/20 hover:bg-muted/50"
                        }`}
                        style={
                          isActive
                            ? {
                                color: "white",
                                borderColor: theme.primary,
                              }
                            : {}
                        }
                        onClick={() => handleProgressChange(val)}
                      >
                        {val}%
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ============================================================ */}
          {/* ENHANCED Resources — Prominent Drive button with gradient,  */}
          {/* file type icons, better descriptions                        */}
          {/* ============================================================ */}
          <Card className="card-depth bg-card border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="size-4" style={{ color: theme.primary }} />
                <span className="section-header-line">المصادر والملفات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ENHANCED: Google Drive button — more prominent with gradient */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-ripple relative overflow-hidden rounded-xl py-5 px-6 text-base font-bold text-white flex items-center justify-center gap-3 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC, #D4A843CC)`,
                  boxShadow: `0 6px 20px ${theme.primary}30, 0 2px 8px ${theme.primary}15`,
                }}
                onClick={() => {
                  if (subject.driveLink) {
                    window.open(subject.driveLink, "_blank");
                  }
                }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                <ExternalLink className="size-5 relative z-10" />
                <span className="relative z-10">فتح ملفات Google Drive</span>
              </motion.button>

              {/* ENHANCED: Resource types with specific file type icons */}
              <div className="space-y-3">
                {[
                  {
                    icon: FileText,
                    text: "محاضرات PDF",
                    desc: "ملفات PDF للمحاضرات والملخصات",
                    typeKey: "pdf",
                    color: "#DC2626",
                  },
                  {
                    icon: ClipboardList,
                    text: "تمارين وأعمال تطبيقية",
                    desc: "تمارين وأسئلة للتطبيق العملي",
                    typeKey: "exercises",
                    color: "#D97706",
                  },
                  {
                    icon: FileSpreadsheet,
                    text: "نماذج اختبارات سابقة",
                    desc: "اختبارات السنوات الماضية مع الحلول",
                    typeKey: "exams",
                    color: "#059669",
                  },
                ].map((resource) => (
                  <motion.div
                    key={resource.text}
                    whileHover={{ x: -4, scale: 1.01 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${resource.color}12` }}
                    >
                      <resource.icon className="size-5" style={{ color: resource.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{resource.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{resource.desc}</p>
                    </div>
                    {/* Arrow indicator on hover */}
                    <ChevronLeft className="size-4 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all mt-1 mr-auto shrink-0" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Notes Section — Character counter, border glow     */}
      {/* when focused, auto-save indicator, better placeholder       */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <Card className="card-depth bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Edit3 className="size-4" style={{ color: theme.primary }} />
                <span className="section-header-line">ملاحظاتي</span>
              </CardTitle>
              {/* Auto-save indicator */}
              <AnimatePresence>
                {autoSaveActive && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 text-xs text-green-600"
                  >
                    <CheckCheck className="size-3.5" />
                    <span>تم الحفظ تلقائياً</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                noteFocused
                  ? "shadow-lg"
                  : "border-border/50"
              }`}
              style={
                noteFocused
                  ? {
                      borderColor: `${theme.primary}50`,
                      boxShadow: `0 0 0 3px ${theme.primary}15, 0 0 20px ${theme.primary}08`,
                    }
                  : {}
              }
            >
              <textarea
                className="w-full min-h-[180px] bg-muted/30 p-5 text-sm resize-none focus:outline-none transition-all placeholder:text-muted-foreground/50 leading-relaxed"
                placeholder={"أضف ملاحظاتك حول هذه المادة... 💡\n\nيمكنك كتابة:\n• أهم النقاط والملخصات\n• أسئلة تحتاج مراجعة\n• خطة الدراسة للمادة\n• أي شيء تريد تذكره لاحقاً"}
                value={notes}
                maxLength={maxNoteLength}
                onFocus={() => setNoteFocused(true)}
                onBlur={() => setNoteFocused(false)}
                onChange={(e) => {
                  if (selectedSubjectId) {
                    setSubjectNotes(selectedSubjectId, e.target.value);
                  }
                }}
                style={{
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* ENHANCED: Character counter with visual progress */}
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((notes.length / maxNoteLength) * 100, 100)}%`,
                        backgroundColor: notes.length > maxNoteLength * 0.9 ? "#DC2626" : theme.primary,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground ltr-content" dir="ltr">
                    {notes.length}/{maxNoteLength}
                  </span>
                </div>
                {notes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <PenTool className="size-3 ml-1" />
                    تحتوي على ملاحظات
                  </Badge>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-prominent btn-ripple"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`,
                }}
                onClick={() => {
                  setSaving(true);
                  setLastSavedLength(notes.length);
                  setTimeout(() => setSaving(false), 500);
                }}
              >
                <Save className="size-5" />
                {saving ? "تم الحفظ ✓" : "حفظ الملاحظات"}
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Related Subjects — Category color indicators,      */}
      {/* mini progress bars, better hover effects                    */}
      {/* ============================================================ */}
      {relatedSubjectsFinal.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="card-depth bg-card border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Link2 className="size-4" style={{ color: theme.primary }} />
                <span className="section-header-line">مواد ذات صلة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedSubjectsFinal.map((rs) => {
                  const RsIcon = iconMap[rs.icon || ""] || BookOpen;
                  const rsColor = rs.color || "#B91C1C";
                  const rsTheme = categoryTheme[rs.category] || { primary: rsColor };
                  const rsProgress = progress.find((p) => p.subjectId === rs.id);
                  const rsProgressValue = rsProgress?.progress ?? 0;
                  const rsStatus: SubjectStatus = rsProgress?.status ?? "not_started";
                  const rsStatusInfo = statusConfig[rsStatus];
                  return (
                    <motion.div
                      key={rs.id}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                      onClick={() => {
                        useAppStore.getState().selectSubject(rs.id);
                      }}
                    >
                      <div className="rounded-xl border border-border p-4 transition-all hover:border-omni-red/30 hover:shadow-lg card-depth bg-card relative overflow-hidden">
                        {/* ENHANCED: Category color indicator bar at top */}
                        <div
                          className="absolute top-0 right-0 left-0 h-1 rounded-t-xl"
                          style={{ backgroundColor: rsTheme.primary }}
                        />

                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${rsColor}15` }}
                          >
                            <RsIcon className="h-6 w-6" style={{ color: rsColor }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">
                              {rs.nameAr}
                            </p>
                            {/* ENHANCED: Category color indicator dot + name */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: rsTheme.primary }}
                              />
                              <p className="text-xs text-muted-foreground">
                                {rs.category}
                              </p>
                            </div>
                            {/* ENHANCED: Mini progress bar with gradient */}
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  width: `${rsProgressValue}%`,
                                  background: `linear-gradient(90deg, ${rsColor}, ${rsColor}BB)`,
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${rsProgressValue}%` }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-bold ltr-content" style={{ color: rsColor }} dir="ltr">
                              {rsProgressValue}%
                            </span>
                            {/* ENHANCED: Status dot */}
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: rsStatusInfo.color }}
                              title={rsStatusInfo.label}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
