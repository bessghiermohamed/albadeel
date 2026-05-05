"use client";

import { useAppStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/omnischool/Header";
import HeroSection from "@/components/omnischool/HeroSection";
import { StudentDashboard } from "@/components/omnischool/StudentDashboard";
import { SubjectsGrid } from "@/components/omnischool/SubjectsGrid";
import { SubjectDetail } from "@/components/omnischool/SubjectDetail";
import { AdvancedSearch } from "@/components/omnischool/AdvancedSearch";
import { AboutPage } from "@/components/omnischool/AboutPage";
import { Footer } from "@/components/omnischool/Footer";
import { StudyPlanner } from "@/components/omnischool/StudyPlanner";
import { PomodoroTimer } from "@/components/omnischool/PomodoroTimer";
import { OnboardingModal } from "@/components/omnischool/OnboardingModal";
import { AchievementToast } from "@/components/omnischool/AchievementToast";
import { AIChatPanel } from "@/components/omnischool/AIChatPanel";
import { AnnouncementBanner } from "@/components/omnischool/AnnouncementBanner";
import { StudyStreak } from "@/components/omnischool/StudyStreak";
import { DataExportImport } from "@/components/omnischool/DataExportImport";
import { QuickStatsWidget } from "@/components/omnischool/QuickStatsWidget";
import { MotivationalQuoteWidget } from "@/components/omnischool/MotivationalQuoteWidget";
import { StudyCountdownTimer } from "@/components/omnischool/StudyCountdownTimer";
import { ActivityTimeline } from "@/components/omnischool/ActivityTimeline";
import { SubjectResourceLibrary } from "@/components/omnischool/SubjectResourceLibrary";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject } from "@/lib/types";
import { useEffect, useState } from "react";
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
  () => import("@/components/omnischool/SemesterComparisonChart").then((m) => m.SemesterComparisonChart),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const WeeklyGoalsTracker = dynamic(
  () => import("@/components/omnischool/WeeklyGoalsTracker").then((m) => m.WeeklyGoalsTracker),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const SubjectComparison = dynamic(
  () => import("@/components/omnischool/SubjectComparison").then((m) => m.SubjectComparison),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
const KeyboardShortcutsHelp = dynamic(
  () => import("@/components/omnischool/KeyboardShortcutsHelp").then((m) => m.KeyboardShortcutsHelp),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

function ViewRenderer() {
  const { currentView } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1"
      >
        {currentView === "home" && (
          <div>
            <HeroSection />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
              <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-border/30">
                <QuickStatsWidget />
              </div>
            </div>
            <QuickAccessSection />
          </div>
        )}
        {currentView === "dashboard" && <StudentDashboard />}
        {currentView === "subjects" && <SubjectsGrid />}
        {currentView === "subject-detail" && <SubjectDetail />}
        {currentView === "search" && <AdvancedSearch />}
        {currentView === "about" && <AboutPage />}
        {currentView === "planner" && <StudyPlanner />}
        {currentView === "timer" && <PomodoroTimer />}
        {currentView === "resources" && <SubjectResourceLibrary />}
      </motion.div>
    </AnimatePresence>
  );
}

/* Enhanced section divider: gradient line with animated diamond */
function OrnamentalDivider() {
  return (
    <div className="relative flex items-center justify-center h-10 my-6">
      <div className="absolute inset-x-0 h-px top-1/2" style={{ background: "linear-gradient(90deg, transparent 0%, var(--border) 15%, rgba(185,28,28,0.25) 40%, rgba(212,168,67,0.4) 50%, rgba(185,28,28,0.25) 60%, var(--border) 85%, transparent 100%)" }} />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 w-3 h-3 rotate-45 bg-gradient-to-br from-omni-red to-omni-gold shadow-sm"
      />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[15%] pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-omni-red/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-omni-gold/20" />
      </div>
    </div>
  );
}

function QuickAccessSection() {
  const { selectSubject, setView } = useAppStore();
  const quickSubjects = subjectsData.slice(0, 6);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Quick Access — Enhanced Subject Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground section-header-line">
              أحدث المواد
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              الوصول السريع لموادك الدراسية
            </p>
          </div>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setView("subjects")}
            className="text-sm text-omni-red hover:text-omni-red/80 font-medium transition-colors flex items-center gap-1"
          >
            عرض الكل
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickSubjects.map((subject: Subject, idx: number) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => selectSubject(subject.id)}
            >
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-center gap-4 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-omni-red/20">
                {/* Gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${subject.color}08 0%, transparent 60%)` }}
                />
                {/* Top accent bar — gradient */}
                <div
                  className="absolute top-0 right-0 left-0 h-1 rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, ${subject.color}, ${subject.color}80)` }}
                />
                {/* Bottom shadow line */}
                <div
                  className="absolute bottom-0 right-0 left-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${subject.color}40, transparent)` }}
                />
                {/* Larger, more colorful icon area */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md relative"
                  style={{ backgroundColor: `${subject.color}10` }}
                >
                  <span className="text-2xl sm:text-3xl font-black transition-transform duration-300 group-hover:scale-110" style={{ color: subject.color }}>
                    {subject.nameAr.charAt(0)}
                  </span>
                  {/* Subtle glow ring on hover */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 0 16px ${subject.color}25` }}
                  />
                </div>
                <div className="min-w-0 flex-1 relative z-10">
                  <h3 className="font-bold text-sm sm:text-base truncate text-foreground">
                    {subject.nameAr}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {subject.category} • السداسي {subject.semester}
                  </p>
                </div>
                {subject.isShared && (
                  <span className="badge-omni-gold text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    مشترك
                  </span>
                )}
                {/* Animated arrow indicator */}
                <svg className="w-4 h-4 text-muted-foreground/30 group-hover:text-omni-red/70 group-hover:-translate-x-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <OrnamentalDivider />

      {/* Study Tools — Enhanced with gradient backgrounds, animated icons, badges */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground section-header-line">
          أدوات الدراسة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Study Planner — Red themed */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.04, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer"
            onClick={() => setView("planner")}
            style={{ perspective: 1000 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center space-y-3 hover:shadow-xl hover:border-omni-red/20 transition-all relative overflow-hidden group">
              {/* Red gradient top accent */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-omni-red via-omni-red-dark to-omni-red/60 rounded-t-2xl" />
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-omni-red/5 via-transparent to-omni-red/3 pointer-events-none" />
              {/* Floating icon with pulse */}
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-omni-red/15 to-omni-red/5 border border-omni-red/10 shadow-sm">
                  <span className="text-4xl animate-float">📅</span>
                </div>
                {/* Hot badge */}
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-omni-red to-omni-red-light text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  HOT
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg relative z-10">مخطط الدراسة</h3>
              <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">نظّم جدولك الأسبوعي وخطط لحصصك بذكاء</p>
            </div>
          </motion.div>

          {/* Pomodoro Timer — Gold themed */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.04, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer"
            onClick={() => setView("timer")}
            style={{ perspective: 1000 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center space-y-3 hover:shadow-xl hover:border-omni-gold/20 transition-all relative overflow-hidden group">
              {/* Gold gradient top accent */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-omni-gold via-omni-gold-dark to-omni-gold/60 rounded-t-2xl" />
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-omni-gold/5 via-transparent to-omni-gold/3 pointer-events-none" />
              {/* Floating icon with staggered animation */}
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-omni-gold/15 to-omni-gold/5 border border-omni-gold/10 shadow-sm">
                  <span className="text-4xl animate-float" style={{ animationDelay: "0.5s" }}>⏱️</span>
                </div>
                {/* New badge */}
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-omni-gold to-omni-gold-light text-omni-gold-dark text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  NEW
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg relative z-10">مؤقت البومودورو</h3>
              <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">ركّز بتقنية البومودورو وزِد إنتاجيتك الدراسية</p>
            </div>
          </motion.div>

          {/* Learner Dashboard — Green themed */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.04, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer"
            onClick={() => setView("dashboard")}
            style={{ perspective: 1000 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center space-y-3 hover:shadow-xl hover:border-green-500/20 transition-all relative overflow-hidden group">
              {/* Green gradient top accent */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-green-600 via-green-500 to-green-500/60 rounded-t-2xl" />
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/3 pointer-events-none" />
              {/* Floating icon with staggered animation */}
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/10 shadow-sm">
                  <span className="text-4xl animate-float" style={{ animationDelay: "1s" }}>📊</span>
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg relative z-10">لوحة المتعلم</h3>
              <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">تتبع تقدّمك الدراسي وحقّق أهدافك خطوة بخطوة</p>
            </div>
          </motion.div>
        </div>
      </div>

      <OrnamentalDivider />

      {/* Study Streak, Semester Comparison & Weekly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StudyStreak />
        <SemesterComparisonChart />
        <WeeklyGoalsTracker />
      </div>

      <OrnamentalDivider />

      {/* Subject Comparison */}
      <SubjectComparison />

      <OrnamentalDivider />

      {/* Activity Timeline */}
      <ActivityTimeline />

      <OrnamentalDivider />

      {/* Motivational Quote Widget */}
      <MotivationalQuoteWidget />

      <OrnamentalDivider />

      {/* Study Countdown Timer */}
      <StudyCountdownTimer />

      <OrnamentalDivider />

      {/* Categories — Enhanced with larger cards, prominent hover color */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground section-header-line">
            التصنيفات
          </h2>
          <p className="text-xs text-muted-foreground">تصفح حسب التخصص</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const count = subjectsData.filter(
              (s) => s.category === cat.id
            ).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer"
                onClick={() => {
                  useAppStore.getState().setSearchCategory(cat.id);
                  useAppStore.getState().setView("search");
                }}
              >
                <div className="bg-card border border-border rounded-xl p-5 sm:p-6 text-center space-y-3 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-omni-red/10">
                  {/* Prominent color background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${cat.color}10 0%, transparent 70%)` }}
                  />
                  {/* Accent bar at top */}
                  <div
                    className="absolute top-0 right-0 left-0 h-1.5 rounded-t-xl transition-all duration-300 group-hover:h-2"
                    style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}80)` }}
                  />
                  {/* Larger icon area with subtle color glow on hover */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl mx-auto flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative"
                    style={{ backgroundColor: `${cat.color}10` }}
                  >
                    <span className="text-2xl sm:text-3xl font-black transition-colors duration-300" style={{ color: cat.color }}>
                      {count}
                    </span>
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: `0 0 20px ${cat.color}20` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground relative z-10">
                    {cat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium relative z-10">
                    {count === 1 ? 'مادة واحدة' : count === 2 ? 'مادتين' : `${count} مواد`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <OrnamentalDivider />

      {/* CTA Section — Enhanced with animated decorations, larger buttons, pattern overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="gradient-hero rounded-2xl p-8 sm:p-14 text-center text-white relative overflow-hidden islamic-pattern-bg"
      >
        {/* Animated floating decorative shapes */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -left-6 w-36 h-36 rounded-full bg-omni-gold/8 pointer-events-none"
        />
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-omni-red/8 pointer-events-none"
        />
        <motion.div
          animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 right-[15%] w-20 h-20 rounded-full bg-white/5 pointer-events-none"
        />
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/4 left-[20%] w-12 h-12 rounded-full bg-omni-gold/6 pointer-events-none"
        />
        {/* Gradient circle overlay */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)`,
          }}
        />

        <div className="relative z-10 space-y-5">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-shadow-omni text-2xl sm:text-4xl font-bold"
          >
            ابدأ رحلتك التعليمية اليوم
          </motion.h2>

          {/* Decorative line under CTA heading */}
          <div className="decorative-line mx-auto max-w-xs">
            <span className="diamond" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80 max-w-lg mx-auto text-sm sm:text-base leading-relaxed"
          >
            تتبع تقدمك في جميع المواد، نظّم ملاحظاتك، وكن على الطريق الصحيح
            نحو التفوق
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("dashboard")}
              className="btn-omni-gold rounded-xl px-8 py-3.5 text-base font-bold transition-all shadow-lg hover:shadow-xl"
            >
              🚀 لوحة المتعلم
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("subjects")}
              className="glass rounded-xl px-8 py-3.5 text-base font-semibold text-white border-white/20 hover:bg-white/10 transition-all"
            >
              📚 تصفح المواد
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[70] w-11 h-11 rounded-full bg-gradient-to-br from-omni-red to-omni-red-dark text-white shadow-lg glow-red-sm flex items-center justify-center"
          aria-label="العودة للأعلى"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const { theme, hasOnboarded } = useAppStore();

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1">
        <ViewRenderer />
      </main>
      <Footer />

      {/* Global Overlays */}
      <OnboardingModal />
      <AchievementToast />
      <AIChatPanel />
      <KeyboardShortcutsHelp />

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
