"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-3 py-2 shadow-lg border border-border text-sm" dir="rtl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs">
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function SemesterComparisonChart() {
  const { progress } = useAppStore();

  const comparisonData = useMemo(() => {
    const sem1Subjects = subjectsData.filter((s) => s.semester === 1);
    const sem2Subjects = subjectsData.filter((s) => s.semester === 2);

    const getStats = (subjects: typeof subjectsData) => {
      const total = subjects.length;
      const completed = subjects.filter((s) => {
        const p = progress.find((pr) => pr.subjectId === s.id);
        return p?.status === "completed";
      }).length;
      const inProgress = subjects.filter((s) => {
        const p = progress.find((pr) => pr.subjectId === s.id);
        return p?.status === "in_progress";
      }).length;
      const notStarted = total - completed - inProgress;
      const avgProgress =
        total > 0
          ? Math.round(
              subjects.reduce((acc, s) => {
                const p = progress.find((pr) => pr.subjectId === s.id);
                return acc + (p?.progress || 0);
              }, 0) / total
            )
          : 0;

      return { total, completed, inProgress, notStarted, avgProgress };
    };

    const sem1 = getStats(sem1Subjects);
    const sem2 = getStats(sem2Subjects);

    return { sem1, sem2 };
  }, [progress]);

  const categoryData = useMemo(() => {
    return categories
      .map((cat) => {
        const sem1Subjects = subjectsData.filter(
          (s) => s.category === cat.id && s.semester === 1
        );
        const sem2Subjects = subjectsData.filter(
          (s) => s.category === cat.id && s.semester === 2
        );

        const avg = (subjects: typeof subjectsData) =>
          subjects.length > 0
            ? Math.round(
                subjects.reduce((acc, s) => {
                  const p = progress.find((pr) => pr.subjectId === s.id);
                  return acc + (p?.progress || 0);
                }, 0) / subjects.length
              )
            : 0;

        return {
          name: cat.label,
          sem1: avg(sem1Subjects),
          sem2: avg(sem2Subjects),
          color: cat.color,
        };
      })
      .filter((d) => d.sem1 > 0 || d.sem2 > 0);
  }, [progress]);

  const statusData = [
    {
      name: "مكتملة",
      sem1: comparisonData.sem1.completed,
      sem2: comparisonData.sem2.completed,
      fill1: "#16A34A",
      fill2: "#22C55E",
    },
    {
      name: "قيد التقدم",
      sem1: comparisonData.sem1.inProgress,
      sem2: comparisonData.sem2.inProgress,
      fill1: "#D4A843",
      fill2: "#E5C168",
    },
    {
      name: "لم تبدأ",
      sem1: comparisonData.sem1.notStarted,
      sem2: comparisonData.sem2.notStarted,
      fill1: "#8B7E6A",
      fill2: "#A89880",
    },
  ];

  return (
    <Card className="glass card-ornament overflow-hidden border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="size-5 text-omni-red" />
          مقارنة السداسيين
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-3 rounded-xl border border-omni-red/20 bg-omni-red/5"
          >
            <p className="text-xs text-muted-foreground mb-1">السداسي الأول</p>
            <p className="text-2xl font-black text-omni-red ltr-content" dir="ltr">
              {comparisonData.sem1.avgProgress}%
            </p>
            <p className="text-[10px] text-muted-foreground">
              {comparisonData.sem1.completed}/{comparisonData.sem1.total} مكتملة
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-3 rounded-xl border border-omni-gold/20 bg-omni-gold/5"
          >
            <p className="text-xs text-muted-foreground mb-1">السداسي الثاني</p>
            <p className="text-2xl font-black text-omni-gold ltr-content" dir="ltr">
              {comparisonData.sem2.avgProgress}%
            </p>
            <p className="text-[10px] text-muted-foreground">
              {comparisonData.sem2.completed}/{comparisonData.sem2.total} مكتملة
            </p>
          </motion.div>
        </div>

        {/* Category comparison chart */}
        {categoryData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" />
              <span>تقدم التصنيفات</span>
            </div>
            <div className="h-48 sm:h-56" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10 }}
                    formatter={(value: string) =>
                      value === "sem1" ? "السداسي ١" : "السداسي ٢"
                    }
                  />
                  <Bar dataKey="sem1" fill="#B91C1C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sem2" fill="#D4A843" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Status comparison */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">حالة المواد</p>
          {statusData.map((item, idx) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium ltr-content" dir="ltr">
                  <span style={{ color: item.fill1 }}>{item.sem1}</span>
                  {" / "}
                  <span style={{ color: item.fill2 }}>{item.sem2}</span>
                </span>
              </div>
              <div className="flex gap-1 h-2.5">
                <div className="flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.fill1 }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.sem1 / Math.max(comparisonData.sem1.total, 1)) * 100}%`,
                    }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                  />
                </div>
                <div className="flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.fill2 }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.sem2 / Math.max(comparisonData.sem2.total, 1)) * 100}%`,
                    }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
