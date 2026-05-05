"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { TrendingUp, CalendarDays } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Custom Tooltip for the chart                                       */
/* ------------------------------------------------------------------ */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div
        className="glass-strong rounded-lg px-3 py-2 shadow-lg border border-border text-sm"
        dir="rtl"
      >
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

/* ------------------------------------------------------------------ */
/*  Helper: generate date labels in Arabic                             */
/* ------------------------------------------------------------------ */
function formatDateAr(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
}

/* ------------------------------------------------------------------ */
/*  Helper: generate simulated progress data when no sessions exist    */
/* ------------------------------------------------------------------ */
function generateSimulatedData(
  days: number,
  progress: { subjectId: string; status: string; progress: number }[]
) {
  const sem1Subjects = subjectsData.filter((s) => s.semester === 1);
  const sem2Subjects = subjectsData.filter((s) => s.semester === 2);

  const currentSem1Avg =
    sem1Subjects.length > 0
      ? Math.round(
          sem1Subjects.reduce((acc, s) => {
            const p = progress.find((pr) => pr.subjectId === s.id);
            return acc + (p?.progress || 0);
          }, 0) / sem1Subjects.length
        )
      : 0;

  const currentSem2Avg =
    sem2Subjects.length > 0
      ? Math.round(
          sem2Subjects.reduce((acc, s) => {
            const p = progress.find((pr) => pr.subjectId === s.id);
            return acc + (p?.progress || 0);
          }, 0) / sem2Subjects.length
        )
      : 0;

  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate gradual progress from a lower point to the current value
    const ratio = (days - i) / days;
    const jitter1 = Math.random() * 5 - 2.5;
    const jitter2 = Math.random() * 5 - 2.5;

    data.push({
      date: formatDateAr(date),
      "السداسي ١": Math.max(
        0,
        Math.min(100, Math.round(currentSem1Avg * ratio * 0.7 + jitter1))
      ),
      "السداسي ٢": Math.max(
        0,
        Math.min(100, Math.round(currentSem2Avg * ratio * 0.7 + jitter2))
      ),
    });
  }

  // Ensure last data point matches current averages
  if (data.length > 0) {
    data[data.length - 1]["السداسي ١"] = currentSem1Avg;
    data[data.length - 1]["السداسي ٢"] = currentSem2Avg;
  }

  return data;
}

/* ------------------------------------------------------------------ */
/*  Helper: derive chart data from study sessions                      */
/* ------------------------------------------------------------------ */
function deriveDataFromSessions(
  days: number,
  progress: { subjectId: string; status: string; progress: number }[],
  studySessions: { id: string; subjectId: string; date: string; duration: number; completed: boolean }[]
) {
  const sem1Subjects = subjectsData.filter((s) => s.semester === 1);
  const sem2Subjects = subjectsData.filter((s) => s.semester === 2);

  const today = new Date();
  const data = [];

  // Build cumulative progress per day
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Count completed sessions up to this date for each semester
    const sessionsUpToDate = studySessions.filter(
      (s) => s.date.split("T")[0] <= dateStr && s.completed
    );

    // Calculate progress contribution from sessions
    const sem1SessionProgress = sem1Subjects.length > 0
      ? Math.min(
          100,
          Math.round(
            (sessionsUpToDate.filter((s) =>
              sem1Subjects.some((sub) => sub.id === s.subjectId)
            ).length /
              Math.max(sem1Subjects.length, 1)) *
              15
          )
        )
      : 0;

    const sem2SessionProgress = sem2Subjects.length > 0
      ? Math.min(
          100,
          Math.round(
            (sessionsUpToDate.filter((s) =>
              sem2Subjects.some((sub) => sub.id === s.subjectId)
            ).length /
              Math.max(sem2Subjects.length, 1)) *
              15
          )
        )
      : 0;

    // Also factor in current progress from the store
    const currentSem1Avg =
      sem1Subjects.length > 0
        ? Math.round(
            sem1Subjects.reduce((acc, s) => {
              const p = progress.find((pr) => pr.subjectId === s.id);
              return acc + (p?.progress || 0);
            }, 0) / sem1Subjects.length
          )
        : 0;

    const currentSem2Avg =
      sem2Subjects.length > 0
        ? Math.round(
            sem2Subjects.reduce((acc, s) => {
              const p = progress.find((pr) => pr.subjectId === s.id);
              return acc + (p?.progress || 0);
            }, 0) / sem2Subjects.length
          )
        : 0;

    // Use the maximum of session-derived and store progress
    data.push({
      date: formatDateAr(date),
      "السداسي ١": Math.max(sem1SessionProgress, currentSem1Avg),
      "السداسي ٢": Math.max(sem2SessionProgress, currentSem2Avg),
    });
  }

  return data;
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function ProgressHistoryChart() {
  const { progress, studySessions } = useAppStore();
  const [viewDays, setViewDays] = useState<7 | 30>(7);

  const chartData = useMemo(() => {
    if (studySessions.length > 0) {
      return deriveDataFromSessions(viewDays, progress, studySessions);
    }
    return generateSimulatedData(viewDays, progress);
  }, [progress, studySessions, viewDays]);

  const hasRealData = studySessions.length > 0;

  return (
    <Card className="glass card-ornament overflow-hidden border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="size-5 text-omni-red" />
            تطور التقدم
          </CardTitle>
          {/* Toggle between 7-day and 30-day views */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewDays === 7 ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewDays(7)}
              className={`h-7 px-3 text-xs font-semibold ${
                viewDays === 7
                  ? "bg-omni-red hover:bg-omni-red-dark text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ٧ أيام
            </Button>
            <Button
              variant={viewDays === 30 ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewDays(30)}
              className={`h-7 px-3 text-xs font-semibold ${
                viewDays === 30
                  ? "bg-omni-red hover:bg-omni-red-dark text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ٣٠ يوم
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulated data notice */}
        {!hasRealData && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>البيانات تقريبية - سجّل جلسات دراسة لعرض تقدمك الفعلي</span>
          </div>
        )}

        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-56 sm:h-64"
          dir="ltr"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="sem1Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sem2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, direction: "rtl" }}
                formatter={(value: string) => value}
              />
              <Area
                type="monotone"
                dataKey="السداسي ١"
                stroke="#B91C1C"
                strokeWidth={2.5}
                fill="url(#sem1Gradient)"
                dot={viewDays === 7 ? { r: 3, fill: "#B91C1C", strokeWidth: 0 } : false}
                activeDot={{ r: 5, fill: "#B91C1C", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="السداسي ٢"
                stroke="#D4A843"
                strokeWidth={2.5}
                fill="url(#sem2Gradient)"
                dot={viewDays === 7 ? { r: 3, fill: "#D4A843", strokeWidth: 0 } : false}
                activeDot={{ r: 5, fill: "#D4A843", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary stats */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-2.5 rounded-xl border border-omni-red/20 bg-omni-red/5"
            >
              <p className="text-xs text-muted-foreground mb-0.5">السداسي الأول</p>
              <p className="text-xl font-black text-omni-red ltr-content" dir="ltr">
                {chartData[chartData.length - 1]["السداسي ١"]}%
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-2.5 rounded-xl border border-omni-gold/20 bg-omni-gold/5"
            >
              <p className="text-xs text-muted-foreground mb-0.5">السداسي الثاني</p>
              <p className="text-xl font-black text-omni-gold ltr-content" dir="ltr">
                {chartData[chartData.length - 1]["السداسي ٢"]}%
              </p>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
