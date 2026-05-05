"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  BookOpen,
  ExternalLink,
  Search,
  Library,
  Filter,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject, SubjectStatus } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */
const statusConfig: Record<
  SubjectStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  not_started: {
    label: "لم تبدأ",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    dot: "bg-gray-400",
  },
  in_progress: {
    label: "قيد التقدم",
    color: "text-omni-gold-dark dark:text-omni-gold",
    bg: "bg-omni-gold/10 dark:bg-omni-gold/20",
    dot: "bg-omni-gold",
  },
  completed: {
    label: "مكتملة",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ================================================================== */
export function SubjectResourceLibrary() {
  const { progress, updateProgress, selectSubject } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<1 | 2 | 0>(0);

  /* ---------- Filtered subjects ---------- */
  const filteredSubjects = useMemo(() => {
    let subjects = subjectsData;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      subjects = subjects.filter(
        (s) =>
          s.nameAr.includes(q) ||
          s.nameEn?.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.category.includes(q)
      );
    }

    if (filterCategory) {
      subjects = subjects.filter((s) => s.category === filterCategory);
    }

    if (filterSemester !== 0) {
      subjects = subjects.filter((s) => s.semester === filterSemester);
    }

    return subjects;
  }, [searchQuery, filterCategory, filterSemester]);

  /* ---------- Helpers ---------- */
  function getProgress(subjectId: string): { status: SubjectStatus; progress: number } {
    const entry = progress.find((p) => p.subjectId === subjectId);
    return entry
      ? { status: entry.status, progress: entry.progress }
      : { status: "not_started", progress: 0 };
  }

  function handleProgressChange(subjectId: string, value: number[]) {
    const newProgress = value[0];
    const status: SubjectStatus =
      newProgress === 0 ? "not_started" : newProgress >= 100 ? "completed" : "in_progress";
    updateProgress(subjectId, status, newProgress);
  }

  /* ---------- Stats ---------- */
  const totalSubjects = subjectsData.length;
  const completedCount = progress.filter((p) => p.status === "completed").length;
  const inProgressCount = progress.filter((p) => p.status === "in_progress").length;

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page title — with header gradient background */}
      <motion.div variants={itemVariants} className="resource-header-gradient">
        <h1 className="text-3xl sm:text-4xl font-black gradient-text-red-gold flex items-center gap-3">
          <Library className="size-9 text-omni-gold" />
          مكتبة الموارد
        </h1>
        <p className="text-foreground/70 mt-2 text-sm sm:text-base font-medium">
          جميع المواد الدراسية ومصادرها في مكان واحد
        </p>
      </motion.div>

      {/* Summary stats — with visual weight differentiation */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-4"
      >
        <div className="text-center p-4 rounded-xl border border-omni-red/20 bg-omni-red/5 glass shadow-dramatic card-glow-hover">
          <p className="text-3xl font-black text-omni-red stat-value-glow">{totalSubjects}</p>
          <p className="text-xs text-foreground/70 font-bold">إجمالي المواد</p>
        </div>
        <div className="text-center p-4 rounded-xl border border-green-500/20 bg-green-50/50 dark:bg-green-900/10 glass shadow-dramatic card-glow-hover">
          <p className="text-3xl font-black text-green-600 dark:text-green-400 stat-value-glow">{completedCount}</p>
          <p className="text-xs text-foreground/70 font-bold">مكتملة</p>
        </div>
        <div className="text-center p-4 rounded-xl border border-omni-gold/20 bg-omni-gold/5 glass shadow-dramatic card-glow-hover">
          <p className="text-3xl font-black text-omni-gold stat-value-glow">{inProgressCount}</p>
          <p className="text-xs text-foreground/70 font-bold">قيد التقدم</p>
        </div>
      </motion.div>

      {/* Search & Filters — search bar more prominent */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Search bar — larger, gradient-bordered */}
        <div className="relative search-bar-prominent">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-omni-red/60" />
          <Input
            placeholder="ابحث عن مادة باسمها أو رمزها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 pl-4 h-14 text-base glass border-border/50 focus:border-omni-red/50 rounded-xl"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>تصفية:</span>
          </div>

          {/* Semester filter — prominent toggle buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant={filterSemester === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSemester(0)}
              className={`h-8 px-4 text-xs font-bold ${
                filterSemester === 0
                  ? "filter-toggle-active"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              الكل
            </Button>
            <Button
              variant={filterSemester === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSemester(1)}
              className={`h-8 px-4 text-xs font-bold ${
                filterSemester === 1
                  ? "filter-toggle-active"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              السداسي ١
            </Button>
            <Button
              variant={filterSemester === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSemester(2)}
              className={`h-8 px-4 text-xs font-bold ${
                filterSemester === 2
                  ? "filter-toggle-active"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              السداسي ٢
            </Button>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-border/50" />

          {/* Category filter chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setFilterCategory(filterCategory === cat.id ? "" : cat.id)
                }
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                  filterCategory === cat.id
                    ? "border-omni-red/30 bg-omni-red/10 text-omni-red dark:text-red-400 shadow-sm"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div variants={itemVariants}>
        <p className="text-xs text-muted-foreground font-medium">
          عرض {filteredSubjects.length} من {subjectsData.length} مادة
        </p>
      </motion.div>

      {/* Subject Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSubjects.map((subject) => {
            const { status, progress: pct } = getProgress(subject.id);
            const sConfig = statusConfig[status];
            const catInfo = categories.find((c) => c.id === subject.category);

            return (
              <motion.div
                key={subject.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass card-ornament card-hover-lift overflow-hidden border-border/50 h-full flex flex-col group">
                  {/* Top accent bar with category color */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${catInfo?.color || "#B91C1C"}, ${catInfo?.color || "#B91C1C"}88, #D4A843)`,
                    }}
                  />

                  <CardContent className="p-4 flex flex-col flex-1 gap-3">
                    {/* Subject name & code */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="font-bold text-sm leading-tight line-clamp-2 text-foreground cursor-pointer hover:text-omni-red transition-colors"
                          onClick={() => selectSubject(subject.id)}
                        >
                          {subject.nameAr}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {subject.code}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          السداسي {subject.semester}
                        </span>
                      </div>
                    </div>

                    {/* Category badge & status indicator */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 font-semibold border-border/50"
                        style={{
                          borderColor: `${catInfo?.color}40`,
                          backgroundColor: `${catInfo?.color}10`,
                          color: catInfo?.color,
                        }}
                      >
                        {subject.category}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${sConfig.dot}`} />
                        <span className={`text-[10px] font-semibold ${sConfig.color}`}>
                          {sConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress slider — with visible progress percentage */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">
                          التقدم
                        </span>
                        <span
                          className="text-sm font-black ltr-content stat-value-glow"
                          dir="ltr"
                          style={{
                            color:
                              pct === 0
                                ? "var(--muted-foreground)"
                                : pct >= 100
                                  ? "#16A34A"
                                  : "#D4A843",
                            textShadow: pct > 0
                              ? pct >= 100
                                ? "0 0 12px rgba(22,163,74,0.3)"
                                : "0 0 12px rgba(212,168,67,0.3)"
                              : "none",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className={pct === 0 ? "progress-shimmer rounded-full" : ""}>
                        <Slider
                          value={[pct]}
                          max={100}
                          step={5}
                          onValueChange={(v) => handleProgressChange(subject.id, v)}
                          className="w-full progress-slider-visible [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-omni-red/30 [&_[role=slider]]:shadow-md"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Open Content button — prominent gradient */}
                    <div className="mt-auto pt-2">
                      <button
                        className="btn-omni-gradient w-full h-10 text-sm"
                        onClick={() => {
                          if (subject.driveLink && subject.driveLink !== "#") {
                            window.open(subject.driveLink, "_blank", "noopener,noreferrer");
                          }
                        }}
                        disabled={!subject.driveLink || subject.driveLink === "#"}
                        type="button"
                      >
                        <ExternalLink className="size-4" />
                        فتح المحتوى
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredSubjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 space-y-3"
        >
          <BookOpen className="size-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">
            لا توجد مواد مطابقة للبحث
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("");
              setFilterSemester(0);
            }}
            className="text-omni-red hover:text-omni-red-dark"
          >
            مسح الفلاتر
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
