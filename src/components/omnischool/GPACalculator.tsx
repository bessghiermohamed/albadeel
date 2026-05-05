"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/*  Grade definitions                                                  */
/* ------------------------------------------------------------------ */
const grades = [
  { label: "A+", value: "A+", points: 4 },
  { label: "A", value: "A", points: 3.75 },
  { label: "B+", value: "B+", points: 3.5 },
  { label: "B", value: "B", points: 3 },
  { label: "C+", value: "C+", points: 2.5 },
  { label: "C", value: "C", points: 2 },
  { label: "D", value: "D", points: 1 },
  { label: "F", value: "F", points: 0 },
] as const;

type GradeValue = (typeof grades)[number]["value"];

function progressToGrade(progress: number): GradeValue {
  if (progress >= 92) return "A+";
  if (progress >= 85) return "A";
  if (progress >= 75) return "B+";
  if (progress >= 65) return "B";
  if (progress >= 55) return "C+";
  if (progress >= 40) return "C";
  if (progress >= 20) return "D";
  return "F";
}

function gradePoints(grade: GradeValue): number {
  return grades.find((g) => g.value === grade)?.points ?? 0;
}

function getGPAColor(gpa: number): string {
  if (gpa >= 3) return "text-green-500";
  if (gpa >= 2) return "text-omni-gold";
  return "text-red-500";
}

function getGPABgColor(gpa: number): string {
  if (gpa >= 3) return "bg-green-500/10 border-green-500/30";
  if (gpa >= 2) return "bg-omni-gold/10 border-omni-gold/30";
  return "bg-red-500/10 border-red-500/30";
}

function getGPAGlow(gpa: number): string {
  if (gpa >= 3) return "shadow-[0_0_20px_rgba(34,197,94,0.3)]";
  if (gpa >= 2) return "shadow-[0_0_20px_rgba(212,168,67,0.3)]";
  return "shadow-[0_0_20px_rgba(239,68,68,0.3)]";
}

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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function GPACalculator() {
  const { progress } = useAppStore();
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2">("1");
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [subjectGrades, setSubjectGrades] = useState<Record<string, GradeValue>>({});

  const semesterSubjects = useMemo(() => {
    return subjectsData
      .filter((s) => s.semester === Number(selectedSemester))
      .sort((a, b) => a.order - b.order);
  }, [selectedSemester]);

  // Auto-derive grades from progress when autoCalculate is on
  useEffect(() => {
    if (!autoCalculate) return;
    const newGrades: Record<string, GradeValue> = {};
    semesterSubjects.forEach((subject) => {
      const p = progress.find((pr) => pr.subjectId === subject.id);
      const pct = p?.progress ?? 0;
      newGrades[subject.id] = progressToGrade(pct);
    });
    setSubjectGrades(newGrades);
  }, [autoCalculate, semesterSubjects, progress]);

  // Initialize grades for semester 1 on first load
  useEffect(() => {
    const initialGrades: Record<string, GradeValue> = {};
    subjectsData
      .filter((s) => s.semester === 1)
      .forEach((subject) => {
        const p = progress.find((pr) => pr.subjectId === subject.id);
        const pct = p?.progress ?? 0;
        initialGrades[subject.id] = progressToGrade(pct);
      });
    setSubjectGrades((prev) => ({ ...initialGrades, ...prev }));
  }, []);

  const handleGradeChange = (subjectId: string, grade: string) => {
    setSubjectGrades((prev) => ({ ...prev, [subjectId]: grade as GradeValue }));
  };

  // Calculate GPA
  const gpaData = useMemo(() => {
    let totalPoints = 0;
    let count = 0;
    semesterSubjects.forEach((subject) => {
      const grade = subjectGrades[subject.id];
      if (grade) {
        totalPoints += gradePoints(grade);
        count++;
      }
    });
    const gpa = count > 0 ? totalPoints / count : 0;
    return { gpa: Math.round(gpa * 100) / 100, totalSubjects: semesterSubjects.length, gradedSubjects: count };
  }, [semesterSubjects, subjectGrades]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass card-ornament overflow-hidden border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GraduationCap className="size-5 text-omni-red" />
              حاسبة المعدل الفصلي
            </CardTitle>
            {/* Auto-calculate toggle */}
            <button
              onClick={() => setAutoCalculate(!autoCalculate)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>حساب تلقائي</span>
              {autoCalculate ? (
                <ToggleRight className="size-5 text-omni-red" />
              ) : (
                <ToggleLeft className="size-5" />
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GPA Display Badge */}
          <motion.div
            variants={itemVariants}
            className={`relative mx-auto w-fit rounded-2xl px-8 py-5 border-2 ${getGPABgColor(gpaData.gpa)} ${getGPAGlow(gpaData.gpa)} transition-all duration-500`}
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">المعدل الفصلي</p>
              <motion.p
                key={gpaData.gpa}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`text-4xl font-black ltr-content ${getGPAColor(gpaData.gpa)}`}
                dir="ltr"
              >
                {gpaData.gpa.toFixed(2)}
              </motion.p>
              <p className="text-[10px] text-muted-foreground mt-1">
                من 4.00
              </p>
            </div>
            {/* Sparkle decoration */}
            <Sparkles className="absolute -top-2 -right-2 size-4 text-omni-gold animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 size-3 text-omni-gold/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </motion.div>

          {/* Semester Tabs */}
          <Tabs
            value={selectedSemester}
            onValueChange={(v) => setSelectedSemester(v as "1" | "2")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="1" className="flex-1">السداسي الأول</TabsTrigger>
              <TabsTrigger value="2" className="flex-1">السداسي الثاني</TabsTrigger>
            </TabsList>

            {(["1", "2"] as const).map((sem) => (
              <TabsContent key={sem} value={sem}>
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {semesterSubjects.map((subject, idx) => {
                    const currentGrade = subjectGrades[subject.id] || "F";
                    const p = progress.find((pr) => pr.subjectId === subject.id);
                    const pct = p?.progress ?? 0;

                    return (
                      <motion.div
                        key={subject.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        {/* Subject name */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {subject.nameAr}
                          </p>
                          {autoCalculate && (
                            <p className="text-[10px] text-muted-foreground">
                              التقدم: {pct}%
                            </p>
                          )}
                        </div>

                        {/* Grade selector */}
                        <Select
                          value={currentGrade}
                          onValueChange={(val) => handleGradeChange(subject.id, val)}
                          disabled={autoCalculate}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((g) => (
                              <SelectItem key={g.value} value={g.value}>
                                <span className="flex items-center gap-1.5">
                                  <span className="font-bold">{g.label}</span>
                                  <span className="text-muted-foreground text-[10px]">
                                    ({g.points})
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Grade badge */}
                        <Badge
                          variant="outline"
                          className={`text-[10px] min-w-[2.5rem] justify-center ${
                            gradePoints(currentGrade) >= 3
                              ? "bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400"
                              : gradePoints(currentGrade) >= 2
                              ? "bg-omni-gold/10 text-omni-gold-dark border-omni-gold/30 dark:text-omni-gold"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                          }`}
                        >
                          {gradePoints(currentGrade).toFixed(2)}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Summary */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border"
          >
            <span>
              {gpaData.gradedSubjects} من {gpaData.totalSubjects} مادة
            </span>
            <span className={getGPAColor(gpaData.gpa)}>
              {gpaData.gpa >= 3
                ? "ممتاز 🌟"
                : gpaData.gpa >= 2
                ? "جيد جداً 💪"
                : gpaData.gpa >= 1
                ? "يحتاج تحسين 📈"
                : "ابدأ المذاكرة! 📚"}
            </span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
