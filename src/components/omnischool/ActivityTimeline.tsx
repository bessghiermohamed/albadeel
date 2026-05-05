"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle,
  Award,
  StickyNote,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Activity types                                                     */
/* ------------------------------------------------------------------ */
type ActivityType = "progress" | "session" | "achievement" | "note";

interface TimelineActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  subjectId?: string;
}

const activityConfig: Record<
  ActivityType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  progress: {
    icon: TrendingUp,
    color: "#B91C1C",
    bgColor: "rgba(185, 28, 28, 0.1)",
    label: "تحديث تقدم",
  },
  session: {
    icon: CheckCircle,
    color: "#D4A843",
    bgColor: "rgba(212, 168, 67, 0.1)",
    label: "جلسة دراسية",
  },
  achievement: {
    icon: Award,
    color: "#16A34A",
    bgColor: "rgba(22, 163, 74, 0.1)",
    label: "إنجاز",
  },
  note: {
    icon: StickyNote,
    color: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.1)",
    label: "ملاحظة",
  },
};

/* ------------------------------------------------------------------ */
/*  Time formatting helpers                                            */
/* ------------------------------------------------------------------ */
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  if (diffDay < 7) return `منذ ${diffDay} يوم`;
  return date.toLocaleDateString("ar-DZ", {
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function ActivityTimeline() {
  const { progress, achievements, studySessions, subjectNotes } = useAppStore();

  /* ---------- Build computed timeline ---------- */
  const activities = useMemo(() => {
    const items: TimelineActivity[] = [];

    // Progress updates
    progress.forEach((p) => {
      const subject = subjectsData.find((s) => s.id === p.subjectId);
      if (!subject) return;
      items.push({
        id: `progress-${p.subjectId}`,
        type: "progress",
        title: `تم تحديث تقدم ${subject.nameAr} إلى ${p.progress}%`,
        description:
          p.status === "completed"
            ? "تم إكمال المادة بنجاح"
            : p.status === "in_progress"
            ? "المادة قيد الدراسة"
            : "لم تبدأ بعد",
        timestamp: new Date(
          Date.now() - Math.random() * 86400000 * 7
        ),
        subjectId: p.subjectId,
      });
    });

    // Achievements
    achievements.forEach((a) => {
      items.push({
        id: `achievement-${a.id}`,
        type: "achievement",
        title: `تم إحراز إنجاز: ${a.title}`,
        description: a.description || `إنجاز ${a.title}`,
        timestamp: a.unlockedAt ? new Date(a.unlockedAt) : new Date(),
      });
    });

    // Study sessions
    studySessions.forEach((s) => {
      const subject = subjectsData.find((sub) => sub.id === s.subjectId);
      items.push({
        id: `session-${s.id}`,
        type: "session",
        title: "تم إكمال جلسة دراسية",
        description: subject
          ? `${subject.nameAr} — ${s.duration} دقيقة`
          : `${s.duration} دقيقة`,
        timestamp: s.date ? new Date(s.date) : new Date(),
        subjectId: s.subjectId,
      });
    });

    // Notes added
    Object.entries(subjectNotes).forEach(([subjectId, note]) => {
      if (!note.trim()) return;
      const subject = subjectsData.find((s) => s.id === subjectId);
      items.push({
        id: `note-${subjectId}`,
        type: "note",
        title: subject
          ? `تمت إضافة ملاحظة في ${subject.nameAr}`
          : "تمت إضافة ملاحظة",
        description:
          note.length > 50 ? note.substring(0, 50) + "..." : note,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
        subjectId,
      });
    });

    // Sort by most recent
    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Return last 12
    return items.slice(0, 12);
  }, [progress, achievements, studySessions, subjectNotes]);

  /* ---------- Empty state ---------- */
  if (activities.length === 0) {
    return (
      <Card className="glass-dashboard overflow-hidden border-border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold gradient-text-red-gold">
            سجل النشاط
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-omni-red/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-omni-red" />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              لم تبدأ أي نشاط بعد. ابدأ بتصفح المواد وتتبع تقدمك ليظهر سجل نشاطك هنا!
            </p>
            <p className="text-omni-gold-dark dark:text-omni-gold text-xs font-medium">
              كل خطوة تقدم تُسجَّل في هذا الخط الزمني ✨
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ---------- Render ---------- */
  return (
    <Card className="glass-dashboard overflow-hidden border-border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold gradient-text-red-gold">
            سجل النشاط
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            آخر {activities.length} نشاط
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <motion.div
          className="relative"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Vertical timeline line */}
          <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-omni-red via-omni-gold to-omni-red/20 dark:from-red-500 dark:via-amber-500 dark:to-red-500/20" />

          <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin pr-1">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="relative flex items-start gap-4 py-3 group"
                >
                  {/* Timeline dot + icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-background transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {activity.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0 mt-0.5">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {activity.description}
                    </p>
                    {/* Type badge */}
                    <span
                      className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
