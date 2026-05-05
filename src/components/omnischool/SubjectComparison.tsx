"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Plus,
  X,
  ArrowLeftRight,
  FileText,
  GraduationCap,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject, SubjectStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                */
/* ------------------------------------------------------------------ */

const statusLabels: Record<SubjectStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "قيد التقدم",
  completed: "مكتملة",
};

const statusBadgeClass: Record<SubjectStatus, string> = {
  not_started:
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  in_progress: "badge-omni-gold",
  completed:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
};

const statusIcons: Record<SubjectStatus, string> = {
  not_started: "⭕",
  in_progress: "🔄",
  completed: "✅",
};

const comparisonColors = ["#B91C1C", "#D4A843", "#059669"];

function getStatusForSubject(
  subjectId: string,
  progress: { subjectId: string; status: SubjectStatus; progress: number }[]
): { status: SubjectStatus; progress: number } {
  const entry = progress.find((p) => p.subjectId === subjectId);
  return entry
    ? { status: entry.status, progress: entry.progress }
    : { status: "not_started", progress: 0 };
}

function getCategoryColor(categoryId: string): string {
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.color || "#B91C1C";
}

function truncateNotes(notes: string | undefined, maxLen: number = 100): string {
  if (!notes) return "لا توجد ملاحظات";
  if (notes.length <= maxLen) return notes;
  return notes.slice(0, maxLen) + "...";
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.25 } },
};

const barVariants = {
  hidden: { width: 0 },
  visible: (i: number) => ({
    width: "var(--bar-width)",
    transition: { duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" },
  }),
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function SubjectComparison() {
  const { progress, subjectNotes } = useAppStore();

  // Default: first 2 subjects
  const [selectedIds, setSelectedIds] = useState<string[]>([
    subjectsData[0].id,
    subjectsData[1].id,
  ]);

  const showThird = selectedIds.length === 3;

  // Available subjects (not already selected)
  const availableSubjects = useMemo(
    () => subjectsData.filter((s) => !selectedIds.includes(s.id)),
    [selectedIds]
  );

  // Selected subject data
  const selectedSubjects = useMemo(
    () =>
      selectedIds
        .map((id) => subjectsData.find((s) => s.id === id))
        .filter((s): s is Subject => !!s),
    [selectedIds]
  );

  // Comparison data
  const comparisonData = useMemo(
    () =>
      selectedSubjects.map((subject) => {
        const { status, progress: pct } = getStatusForSubject(
          subject.id,
          progress
        );
        const notes = subjectNotes[subject.id];
        return { subject, status, progress: pct, notes };
      }),
    [selectedSubjects, progress, subjectNotes]
  );

  /* ---------- Handlers ---------- */

  function handleSelectChange(index: number, value: string) {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleAddThird() {
    if (availableSubjects.length > 0 && selectedIds.length < 3) {
      setSelectedIds((prev) => [...prev, availableSubjects[0].id]);
    }
  }

  function handleRemoveThird() {
    setSelectedIds((prev) => prev.slice(0, 2));
  }

  /* ---------- Render ---------- */

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass overflow-hidden border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-omni-red/10 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-omni-red" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  مقارنة المواد
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  قارن تقدم مادتين أو ثلاث جنباً إلى جنب
                </p>
              </div>
            </div>
            {!showThird && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddThird}
                className="gap-1.5 text-xs border-omni-gold/30 text-omni-gold-dark dark:text-omni-gold hover:bg-omni-gold/10"
              >
                <Plus className="h-3.5 w-3.5" />
                إضافة مادة
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
          {/* ===== Subject Selectors ===== */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            {selectedIds.map((id, idx) => {
              const subject = subjectsData.find((s) => s.id === id);
              const accentColor = comparisonColors[idx];
              return (
                <div key={idx} className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: accentColor }}
                    />
                    {idx === 0
                      ? "المادة الأولى"
                      : idx === 1
                        ? "المادة الثانية"
                        : "المادة الثالثة"}
                    {idx === 2 && showThird && (
                      <button
                        onClick={handleRemoveThird}
                        className="mr-auto text-muted-foreground hover:text-omni-red transition-colors"
                        aria-label="إزالة المادة الثالثة"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </label>
                  <Select
                    value={id}
                    onValueChange={(val) => handleSelectChange(idx, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر مادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsData.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                          disabled={
                            selectedIds.includes(s.id) && s.id !== id
                          }
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{
                                backgroundColor: getCategoryColor(s.category),
                              }}
                            />
                            {s.nameAr}
                            <span className="text-muted-foreground text-xs">
                              ({s.code})
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {/* ===== Comparison Cards ===== */}
          <div
            className={`grid gap-4 ${showThird ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}
          >
            <AnimatePresence mode="popLayout">
              {comparisonData.map((data, idx) => {
                const { subject, status, progress: pct, notes } = data;
                const accentColor = comparisonColors[idx];
                const catColor = getCategoryColor(subject.category);
                const catLabel = subject.category;

                return (
                  <motion.div
                    key={subject.id}
                    custom={idx}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <div className="glass rounded-xl overflow-hidden border border-border h-full">
                      {/* Accent top bar */}
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Subject name & code */}
                        <div>
                          <h3 className="font-bold text-base text-foreground leading-snug">
                            {subject.nameAr}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 ltr-content" dir="ltr">
                            {subject.code}
                          </p>
                        </div>

                        {/* Category badge + Semester */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5"
                            style={{
                              borderColor: `${catColor}40`,
                              color: catColor,
                              backgroundColor: `${catColor}10`,
                            }}
                          >
                            {catLabel}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5 bg-muted/50"
                          >
                            <GraduationCap className="h-3 w-3 ml-1" />
                            السداسي {subject.semester}
                          </Badge>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {statusIcons[status]}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2.5 py-0.5 ${statusBadgeClass[status]}`}
                          >
                            {statusLabels[status]}
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">
                              التقدم
                            </span>
                            <span
                              className="font-bold ltr-content"
                              dir="ltr"
                              style={{ color: accentColor }}
                            >
                              {pct}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: accentColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: idx * 0.15 + 0.3,
                              }}
                            />
                          </div>
                        </div>

                        {/* Notes preview */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span className="font-medium">الملاحظات</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2rem]">
                            {truncateNotes(notes, 100)}
                          </p>
                        </div>

                        {/* Drive link */}
                        {subject.driveLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 text-xs btn-ripple"
                            asChild
                          >
                            <a
                              href={subject.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              رابط Drive
                              <ExternalLink className="h-3 w-3 mr-auto" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ===== Progress Comparison Bar Chart ===== */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-0.5 bg-omni-gold rounded-full inline-block" />
              مقارنة التقدم
            </h4>

            <div className="glass rounded-xl p-4 space-y-3 border border-border">
              {comparisonData.map((data, idx) => (
                <div key={data.subject.id} className="space-y-1.5">
                  {/* Label */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{
                          backgroundColor: comparisonColors[idx],
                        }}
                      />
                      <span className="font-medium truncate">
                        {data.subject.nameAr}
                      </span>
                    </div>
                    <span
                      className="font-bold ltr-content shrink-0 mr-2"
                      dir="ltr"
                      style={{ color: comparisonColors[idx] }}
                    >
                      {data.progress}%
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="h-5 w-full rounded-lg bg-muted overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-lg relative overflow-hidden"
                      style={{
                        backgroundColor: comparisonColors[idx],
                        "--bar-width": `${data.progress}%`,
                      } as React.CSSProperties}
                      custom={idx}
                      variants={barVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-l from-white/20 via-transparent to-white/5" />
                    </motion.div>

                    {/* Percentage inside bar */}
                    {data.progress > 15 && (
                      <span className="absolute inset-0 flex items-center justify-start pr-2 text-[10px] font-bold text-white/90">
                        {statusLabels[data.status]}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Side-by-side bar comparison (all in one row) */}
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-2 font-medium">
                  مقارنة مرئية جنباً إلى جنب
                </p>
                <div className="flex h-8 rounded-lg overflow-hidden bg-muted gap-0.5">
                  {comparisonData.map((data, idx) => {
                    const totalProgress = comparisonData.reduce(
                      (sum, d) => sum + d.progress,
                      0
                    );
                    const widthPercent =
                      totalProgress > 0
                        ? Math.max(
                            (data.progress / 100) *
                              (100 / comparisonData.length),
                            2
                          )
                        : 100 / comparisonData.length;

                    return (
                      <motion.div
                        key={data.subject.id}
                        className="h-full relative flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: comparisonColors[idx],
                          width: `${widthPercent}%`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5 + idx * 0.15,
                          ease: "easeOut",
                        }}
                      >
                        <span className="text-[10px] font-bold text-white/90 truncate px-1">
                          {data.progress}%
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {comparisonData.map((data, idx) => (
                    <div
                      key={data.subject.id}
                      className="flex items-center gap-1.5 text-[10px]"
                    >
                      <span
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: comparisonColors[idx] }}
                      />
                      <span className="text-muted-foreground truncate max-w-[80px]">
                        {data.subject.nameAr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
