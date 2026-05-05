"use client";

import { motion } from "framer-motion";
import {
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
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Subject, SubjectProgress } from "@/lib/types";
import { ProgressCircle } from "./ProgressCircle";
import { SubjectFavoriteToggle } from "./SubjectFavoriteToggle";

/* ------------------------------------------------------------------
   Icon Mapping — maps subject.icon string → lucide-react component
   ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   SubjectIcon — renders the correct lucide icon by name
   Defined outside render to satisfy react-hooks/static-components
   ------------------------------------------------------------------ */
function SubjectIcon({
  iconName,
  className,
  style,
}: {
  iconName?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = iconMap[iconName || ""] || BookOpen;
  return <Icon className={className} style={style} />;
}

/* ------------------------------------------------------------------
   Category color mapping
   ------------------------------------------------------------------ */
const categoryColors: Record<string, string> = {
  "لغة عربية": "#B91C1C",
  "لغة إنجليزية": "#D4A843",
  "لغة فرنسية": "#7C3AED",
  رياضيات: "#2563EB",
  علوم: "#059669",
  "علوم فيزيائية": "#0891B2",
  "علوم الحياة والأرض": "#16A34A",
  "تربية إسلامية": "#92400E",
  "تربية وطنية": "#DC2626",
  تاريخ: "#9333EA",
  جغرافيا: "#CA8A04",
  فلسفة: "#6366F1",
  تكنولوجيا: "#0D9488",
  إعلاميات: "#2563EB",
};

function getCategoryColor(category: string): string {
  return categoryColors[category] || "#B91C1C";
}

/* ------------------------------------------------------------------
   Status configuration
   ------------------------------------------------------------------ */
const statusConfig = {
  completed: {
    label: "مكتملة",
    color: "#16A34A",
    bgColor: "rgba(22, 163, 74, 0.1)",
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  in_progress: {
    label: "قيد التقدم",
    color: "#D4A843",
    bgColor: "rgba(212, 168, 67, 0.1)",
    borderColor: "rgba(212, 168, 67, 0.2)",
  },
  not_started: {
    label: "لم تبدأ",
    color: "#8B7E6A",
    bgColor: "rgba(139, 126, 106, 0.1)",
    borderColor: "rgba(139, 126, 106, 0.2)",
  },
} as const;

/* ------------------------------------------------------------------
   SubjectCard Component
   ------------------------------------------------------------------ */
interface SubjectCardProps {
  subject: Subject;
  progress?: SubjectProgress;
  onClick?: () => void;
}

export function SubjectCard({ subject, progress, onClick }: SubjectCardProps) {
  const subjectColor = subject.color || getCategoryColor(subject.category);
  const progressValue = progress?.progress ?? 0;
  const status = progress?.status ?? "not_started";
  const statusInfo = statusConfig[status];
  const catColor = getCategoryColor(subject.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="glass card-omni card-depth card-gradient-overlay glow-hover card-ornament subject-card-glow relative cursor-pointer overflow-hidden p-0"
        onClick={onClick}
      >
        {/* Color accent bar on the right side (RTL) */}
        <div
          className="absolute top-0 right-0 h-full w-1.5 rounded-r-xl"
          style={{ backgroundColor: subjectColor }}
        />

        <div className="flex items-start gap-4 p-4 sm:p-5 pe-6 relative z-10">
          {/* Icon with colored background — consistent sizing */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${subjectColor}15` }}
          >
            <SubjectIcon
              iconName={subject.icon}
              className="h-7 w-7"
              style={{ color: subjectColor }}
            />
          </div>

          {/* Content area */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Subject name + code badge + favorite */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <SubjectFavoriteToggle subjectId={subject.id} size={14} className="shrink-0" />
                <h3 className="text-base font-bold leading-tight text-foreground sm:text-lg truncate">
                  {subject.nameAr}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-medium ltr-content"
                style={{
                  borderColor: `${subjectColor}30`,
                  color: subjectColor,
                  backgroundColor: `${subjectColor}08`,
                }}
              >
                {subject.code}
              </Badge>
            </div>

            {/* Subject description — truncated subtitle */}
            {subject.description && (
              <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-1">
                {subject.description}
              </p>
            )}

            {/* Badges row: category, shared, semester, status */}
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {/* Category badge */}
              <Badge
                variant="secondary"
                className="text-[10px] font-medium"
                style={{
                  backgroundColor: `${catColor}12`,
                  color: catColor,
                  borderColor: `${catColor}25`,
                  border: "1px solid",
                }}
              >
                {subject.category}
              </Badge>

              {/* Shared badge in gold */}
              {subject.isShared && (
                <Badge
                  className="badge-omni-gold text-[10px] font-medium"
                  style={{ border: "1px solid" }}
                >
                  مشترك
                </Badge>
              )}

              {/* Semester indicator */}
              <Badge
                variant="outline"
                className="text-[10px] font-medium"
              >
                السداسي {subject.semester}
              </Badge>

              {/* Status indicator */}
              <Badge
                className="text-[10px] font-medium"
                style={{
                  backgroundColor: statusInfo.bgColor,
                  color: statusInfo.color,
                  border: `1px solid ${statusInfo.borderColor}`,
                }}
              >
                <span
                  className="me-1 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusInfo.color }}
                />
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Progress circle — larger and more prominent */}
          <div className="shrink-0 self-center">
            <ProgressCircle
              percentage={progressValue}
              size={68}
              strokeWidth={6}
              color={subjectColor}
              textSize={14}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
