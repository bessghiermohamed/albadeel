"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Skill dimension multipliers                                        */
/* ------------------------------------------------------------------ */
const skillDimensions = [
  { key: "understanding", label: "الفهم", multiplier: 1.0 },
  { key: "application", label: "التطبيق", multiplier: 0.8 },
  { key: "analysis", label: "التحليل", multiplier: 0.6 },
  { key: "creativity", label: "الإبداع", multiplier: 0.5 },
  { key: "communication", label: "التواصل", multiplier: 0.7 },
  { key: "research", label: "البحث", multiplier: 0.65 },
] as const;

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

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function SubjectRadarChart() {
  const { progress, selectedSubjectId, selectedSemester } = useAppStore();

  /* ---------- Find the selected subject, fallback to first of semester ---------- */
  const subject = useMemo(() => {
    if (selectedSubjectId) {
      return subjectsData.find((s) => s.id === selectedSubjectId) ?? null;
    }
    // Default: first subject of the selected semester that has progress
    const semSubjects = subjectsData.filter((s) => s.semester === selectedSemester);
    const withProgress = semSubjects.find((s) =>
      progress.find((p) => p.subjectId === s.id && p.progress > 0)
    );
    return withProgress ?? semSubjects[0] ?? null;
  }, [selectedSubjectId, selectedSemester, progress]);

  /* ---------- Calculate skill dimensions ---------- */
  const radarData = useMemo(() => {
    if (!subject) return [];
    const p = progress.find((pr) => pr.subjectId === subject.id);
    const pct = p?.progress ?? 0;

    return skillDimensions.map((dim) => ({
      dimension: dim.label,
      value: Math.round(pct * dim.multiplier),
      fullMark: 100,
    }));
  }, [subject, progress]);

  /* ---------- Calculate average score ---------- */
  const averageScore = useMemo(() => {
    if (radarData.length === 0) return 0;
    const sum = radarData.reduce((acc, d) => acc + d.value, 0);
    return Math.round(sum / radarData.length);
  }, [radarData]);

  /* ---------- Score color ---------- */
  function getScoreColor(score: number): string {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-omni-gold";
    if (score >= 25) return "text-omni-red";
    return "text-red-400";
  }

  /* ---------- Score label ---------- */
  function getScoreLabel(score: number): string {
    if (score >= 75) return "مستوى متقدم";
    if (score >= 50) return "مستوى جيد";
    if (score >= 25) return "مستوى متوسط";
    return "بداية الطريق";
  }

  if (!subject) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass-dashboard overflow-hidden border-border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="size-5 text-omni-red" />
            خريطة المهارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject name */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">
              {subject.nameAr}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              تحليل المهارات عبر الأبعاد المختلفة
            </p>
          </div>

          {/* Radar chart */}
          {radarData.length > 0 && (
            <div className="h-64 sm:h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                      fontWeight: 600,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fontSize: 9,
                      fill: "var(--muted-foreground)",
                    }}
                    tickCount={5}
                  />
                  <Radar
                    name="المهارات"
                    dataKey="value"
                    stroke="#D4A843"
                    fill="#B91C1C"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Score summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-center space-y-2 pt-2 border-t border-border"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">المعدل العام للمهارات</span>
            </div>
            <motion.p
              key={averageScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`text-3xl font-black ltr-content ${getScoreColor(averageScore)}`}
              dir="ltr"
            >
              {averageScore}%
            </motion.p>
            <p className={`text-xs font-medium ${getScoreColor(averageScore)}`}>
              {getScoreLabel(averageScore)}
            </p>

            {/* Dimension breakdown pills */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {radarData.map((d) => (
                <span
                  key={d.dimension}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground"
                >
                  {d.dimension}
                  <span className="font-bold text-foreground ltr-content" dir="ltr">
                    {d.value}%
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
