"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  BookOpen,
  CheckCircle,
  Clock,
  Circle,
  Flame,
  GraduationCap,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { SubjectStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Grade helpers (same as GPACalculator)                              */
/* ------------------------------------------------------------------ */
function progressToGrade(progress: number): string {
  if (progress >= 92) return "A+";
  if (progress >= 85) return "A";
  if (progress >= 75) return "B+";
  if (progress >= 65) return "B";
  if (progress >= 55) return "C+";
  if (progress >= 40) return "C";
  if (progress >= 20) return "D";
  return "F";
}

function gradePoints(grade: string): number {
  const map: Record<string, number> = {
    "A+": 4, A: 3.75, "B+": 3.5, B: 3, "C+": 2.5, C: 2, D: 1, F: 0,
  };
  return map[grade] ?? 0;
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */
function getStatusForSubject(
  subjectId: string,
  progress: { subjectId: string; status: SubjectStatus; progress: number }[]
): { status: SubjectStatus; progress: number } {
  const entry = progress.find((p) => p.subjectId === subjectId);
  return entry ? { status: entry.status, progress: entry.progress } : { status: "not_started", progress: 0 };
}

const statusLabels: Record<SubjectStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "قيد التقدم",
  completed: "مكتملة",
};

const statusLabelsEn: Record<SubjectStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

/* ------------------------------------------------------------------ */
/*  Streak calculation                                                 */
/* ------------------------------------------------------------------ */
function calculateStreak(sessions: { date: string; completed: boolean }[]): {
  currentStreak: number;
  bestStreak: number;
} {
  const completedDates = sessions
    .filter((s) => s.completed)
    .map((s) => new Date(s.date).toISOString().split("T")[0])
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort()
    .reverse();

  if (completedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let currentStreak = 0;
  if (completedDates[0] === today || completedDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = new Date(completedDates[i - 1]);
      const currDate = new Date(completedDates[i]);
      const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
      if (Math.abs(diff - 1) < 0.5) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  let bestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);
    const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
    if (Math.abs(diff - 1) < 0.5) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, bestStreak };
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
export function ProgressReport() {
  const { progress, subjectNotes, studySessions } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generated, setGenerated] = useState(false);

  /* ---------- Computed stats ---------- */
  const stats = useMemo(() => {
    const total = subjectsData.length;
    const completed = progress.filter((p) => p.status === "completed").length;
    const inProgress = progress.filter((p) => p.status === "in_progress").length;
    const notStarted = total - completed - inProgress;
    const overallProgress =
      total > 0 ? progress.reduce((acc, p) => acc + p.progress, 0) / total : 0;
    return { total, completed, inProgress, notStarted, overallProgress };
  }, [progress]);

  /* ---------- Category breakdown ---------- */
  const categoryBreakdown = useMemo(() => {
    return categories.map((cat) => {
      const catSubjects = subjectsData.filter((s) => s.category === cat.id);
      const total = catSubjects.length;
      const avgProgress =
        total > 0
          ? catSubjects.reduce((acc, s) => {
              const p = getStatusForSubject(s.id, progress);
              return acc + p.progress;
            }, 0) / total
          : 0;
      return { ...cat, total, avgProgress: Math.round(avgProgress) };
    });
  }, [progress]);

  /* ---------- Semester subjects ---------- */
  const semesterSubjects = useMemo(() => ({
    1: subjectsData.filter((s) => s.semester === 1).sort((a, b) => a.order - b.order),
    2: subjectsData.filter((s) => s.semester === 2).sort((a, b) => a.order - b.order),
  }), []);

  /* ---------- GPA calculation ---------- */
  const gpaData = useMemo(() => {
    const calcSemesterGPA = (subjects: typeof subjectsData) => {
      let totalPoints = 0;
      let count = 0;
      subjects.forEach((subject) => {
        const p = getStatusForSubject(subject.id, progress);
        const grade = progressToGrade(p.progress);
        totalPoints += gradePoints(grade);
        count++;
      });
      return count > 0 ? Math.round((totalPoints / count) * 100) / 100 : 0;
    };
    return {
      sem1: calcSemesterGPA(semesterSubjects[1]),
      sem2: calcSemesterGPA(semesterSubjects[2]),
    };
  }, [progress, semesterSubjects]);

  /* ---------- Streak data ---------- */
  const streakData = useMemo(() => calculateStreak(studySessions), [studySessions]);

  /* ---------- Generate HTML report ---------- */
  const generateReportHTML = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("ar-DZ", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const subjectRow = (subject: typeof subjectsData[0]) => {
      const s = getStatusForSubject(subject.id, progress);
      const grade = progressToGrade(s.progress);
      const notes = subjectNotes[subject.id] || "";
      const catColor = categories.find((c) => c.id === subject.category)?.color || "#B91C1C";
      const statusColor =
        s.status === "completed"
          ? "#16A34A"
          : s.status === "in_progress"
          ? "#D97706"
          : "#9CA3AF";

      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:500;">${subject.nameAr}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;color:${catColor};font-size:12px;">${subject.category}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">
            <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;color:white;background:${statusColor};">${statusLabels[s.status]}</span>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">
            <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
              <div style="flex:1;max-width:80px;height:6px;background:#eee;border-radius:3px;overflow:hidden;">
                <div style="width:${s.progress}%;height:100%;background:${catColor};border-radius:3px;"></div>
              </div>
              <span style="font-size:12px;font-weight:600;direction:ltr;">${s.progress}%</span>
            </div>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:600;direction:ltr;">${grade}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;direction:ltr;">${gradePoints(grade).toFixed(2)}</td>
        </tr>
        ${notes ? `<tr><td colspan="6" style="padding:4px 12px 8px 36px;border-bottom:1px solid #eee;text-align:right;color:#666;font-size:11px;font-style:italic;">ملاحظات: ${notes}</td></tr>` : ""}
      `;
    };

    const categoryRow = (cat: (typeof categoryBreakdown)[0]) => {
      return `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:500;color:${cat.color};">${cat.label}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${cat.total}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">
            <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
              <div style="flex:1;max-width:100px;height:6px;background:#eee;border-radius:3px;overflow:hidden;">
                <div style="width:${cat.avgProgress}%;height:100%;background:${cat.color};border-radius:3px;"></div>
              </div>
              <span style="font-size:12px;font-weight:600;direction:ltr;">${cat.avgProgress}%</span>
            </div>
          </td>
        </tr>
      `;
    };

    const overallGPA = (() => {
      const allSubjects = [...semesterSubjects[1], ...semesterSubjects[2]];
      let totalPoints = 0;
      let count = 0;
      allSubjects.forEach((subject) => {
        const p = getStatusForSubject(subject.id, progress);
        totalPoints += gradePoints(progressToGrade(p.progress));
        count++;
      });
      return count > 0 ? Math.round((totalPoints / count) * 100) / 100 : 0;
    })();

    const gpaColor = overallGPA >= 3 ? "#16A34A" : overallGPA >= 2 ? "#D97706" : "#B91C1C";

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تقرير التقدم الدراسي - البديل</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Cairo', sans-serif;
      color: #1C0A0A;
      background: white;
      direction: rtl;
      line-height: 1.6;
    }

    @media print {
      @page {
        size: A4;
        margin: 15mm;
      }
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page-break { page-break-before: always; }
      .no-page-break { page-break-inside: avoid; }
    }

    .report-header {
      background: linear-gradient(135deg, #B91C1C 0%, #991B1B 50%, #7F1D1D 100%);
      color: white;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .report-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 70% 20%, rgba(212, 168, 67, 0.15) 0%, transparent 60%);
      pointer-events: none;
    }

    .report-header h1 {
      font-size: 24px;
      font-weight: 800;
      position: relative;
    }

    .report-header .subtitle {
      font-size: 13px;
      opacity: 0.85;
      margin-top: 4px;
    }

    .report-header .logo {
      font-size: 28px;
      font-weight: 900;
      color: #D4A843;
      position: relative;
    }

    .student-info {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px 32px;
      background: #FFFBF5;
      border-bottom: 2px solid #E8DFD0;
    }

    .student-info .info-item {
      font-size: 13px;
    }

    .student-info .info-item .label {
      color: #8B7E6A;
      font-size: 11px;
    }

    .student-info .info-item .value {
      font-weight: 600;
      color: #1C0A0A;
    }

    .section {
      padding: 20px 32px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #B91C1C;
      border-bottom: 2px solid #B91C1C;
      padding-bottom: 6px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title .icon {
      width: 20px;
      height: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .stat-card {
      background: #FFFBF5;
      border: 1px solid #E8DFD0;
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }

    .stat-card .stat-value {
      font-size: 28px;
      font-weight: 900;
      line-height: 1.2;
    }

    .stat-card .stat-label {
      font-size: 11px;
      color: #8B7E6A;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    table thead th {
      background: #F5F0E8;
      padding: 8px 12px;
      text-align: center;
      font-weight: 600;
      font-size: 12px;
      color: #5C4A2A;
      border-bottom: 2px solid #E8DFD0;
    }

    table thead th:first-child {
      text-align: right;
    }

    .category-table thead th {
      background: #FEF3E2;
    }

    .gpa-section {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .gpa-card {
      flex: 1;
      min-width: 150px;
      background: #FFFBF5;
      border: 1px solid #E8DFD0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .gpa-card .gpa-value {
      font-size: 32px;
      font-weight: 900;
    }

    .gpa-card .gpa-label {
      font-size: 12px;
      color: #8B7E6A;
    }

    .streak-section {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .streak-card {
      flex: 1;
      min-width: 150px;
      background: #FFFBF5;
      border: 1px solid #E8DFD0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .streak-card .streak-value {
      font-size: 28px;
      font-weight: 900;
      color: #D97706;
    }

    .streak-card .streak-label {
      font-size: 12px;
      color: #8B7E6A;
    }

    .footer {
      padding: 16px 32px;
      text-align: center;
      font-size: 11px;
      color: #8B7E6A;
      border-top: 1px solid #E8DFD0;
      background: #FFFBF5;
    }

    .ornament {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 8px 0;
    }

    .ornament::before,
    .ornament::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(185,28,28,0.2), rgba(212,168,67,0.4), rgba(185,28,28,0.2), transparent);
    }

    .ornament .diamond {
      width: 6px;
      height: 6px;
      background: #D4A843;
      transform: rotate(45deg);
    }

    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .report-header { padding: 16px 20px; }
      .section { padding: 16px 20px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="report-header">
    <div>
      <h1>تقرير التقدم الدراسي</h1>
      <div class="subtitle">تقرير شامل عن المسار الأكاديمي</div>
    </div>
    <div class="logo">البديل</div>
  </div>

  <!-- Student Info -->
  <div class="student-info">
    <div class="info-item">
      <div class="label">الطالب</div>
      <div class="value">طالب - فرع PEP - تخصص الأدب العربي</div>
    </div>
    <div class="info-item">
      <div class="label">تاريخ التقرير</div>
      <div class="value" dir="ltr">${dateStr} - ${timeStr}</div>
    </div>
    <div class="info-item">
      <div class="label">السنة الدراسية</div>
      <div class="value">السنة الأولى جامعي</div>
    </div>
    <div class="info-item">
      <div class="label">المؤسسة</div>
      <div class="value">المدرسة العليا للأساتذة - ENS</div>
    </div>
  </div>

  <!-- Overall Progress Summary -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
      ملخص التقدم العام
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color:#B91C1C;">${stats.total}</div>
        <div class="stat-label">إجمالي المواد</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#16A34A;">${stats.completed}</div>
        <div class="stat-label">مكتملة</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#D97706;">${stats.inProgress}</div>
        <div class="stat-label">قيد التقدم</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#9CA3AF;">${stats.notStarted}</div>
        <div class="stat-label">لم تبدأ</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:16px;">
      <div style="font-size:48px;font-weight:900;color:#B91C1C;" dir="ltr">${Math.round(stats.overallProgress)}%</div>
      <div style="font-size:13px;color:#8B7E6A;">نسبة التقدم الإجمالية</div>
    </div>
  </div>

  <div class="ornament"><div class="diamond"></div></div>

  <!-- Semester 1 Breakdown -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
      السداسي الأول - تفاصيل المواد
    </div>
    <table>
      <thead>
        <tr>
          <th>المادة</th>
          <th>التصنيف</th>
          <th>الحالة</th>
          <th>التقدم</th>
          <th>التقدير</th>
          <th>النقاط</th>
        </tr>
      </thead>
      <tbody>
        ${semesterSubjects[1].map(subjectRow).join("")}
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- Semester 2 Breakdown -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
      السداسي الثاني - تفاصيل المواد
    </div>
    <table>
      <thead>
        <tr>
          <th>المادة</th>
          <th>التصنيف</th>
          <th>الحالة</th>
          <th>التقدم</th>
          <th>التقدير</th>
          <th>النقاط</th>
        </tr>
      </thead>
      <tbody>
        ${semesterSubjects[2].map(subjectRow).join("")}
      </tbody>
    </table>
  </div>

  <div class="ornament"><div class="diamond"></div></div>

  <!-- Category Breakdown -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
      تقدم المواد حسب التصنيف
    </div>
    <table class="category-table">
      <thead>
        <tr>
          <th style="text-align:right;">التصنيف</th>
          <th>عدد المواد</th>
          <th>متوسط التقدم</th>
        </tr>
      </thead>
      <tbody>
        ${categoryBreakdown.map(categoryRow).join("")}
      </tbody>
    </table>
  </div>

  <div class="ornament"><div class="diamond"></div></div>

  <!-- GPA Summary -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      ملخص المعدل الفصلي (GPA)
    </div>
    <div class="gpa-section">
      <div class="gpa-card">
        <div class="gpa-label">السداسي الأول</div>
        <div class="gpa-value" style="color:${gpaData.sem1 >= 3 ? "#16A34A" : gpaData.sem1 >= 2 ? "#D97706" : "#B91C1C"};" dir="ltr">${gpaData.sem1.toFixed(2)}</div>
        <div class="gpa-label">من 4.00</div>
      </div>
      <div class="gpa-card">
        <div class="gpa-label">السداسي الثاني</div>
        <div class="gpa-value" style="color:${gpaData.sem2 >= 3 ? "#16A34A" : gpaData.sem2 >= 2 ? "#D97706" : "#B91C1C"};" dir="ltr">${gpaData.sem2.toFixed(2)}</div>
        <div class="gpa-label">من 4.00</div>
      </div>
      <div class="gpa-card" style="border:2px solid ${gpaColor};">
        <div class="gpa-label">المعدل العام</div>
        <div class="gpa-value" style="color:${gpaColor};" dir="ltr">${overallGPA.toFixed(2)}</div>
        <div class="gpa-label">من 4.00</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:12px;font-size:12px;color:#8B7E6A;">
      * المعدل محسوب تلقائياً بناءً على نسبة التقدم في كل مادة
    </div>
  </div>

  <!-- Study Streak -->
  <div class="section no-page-break">
    <div class="section-title">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
      معلومات المواظبة على الدراسة
    </div>
    <div class="streak-section">
      <div class="streak-card">
        <div class="streak-value">${streakData.currentStreak}</div>
        <div class="streak-label">أيام متتالية حالياً</div>
      </div>
      <div class="streak-card">
        <div class="streak-value">${streakData.bestStreak}</div>
        <div class="streak-label">أفضل سجل متتالي</div>
      </div>
      <div class="streak-card">
        <div class="streak-value">${studySessions.filter((s) => s.completed).length}</div>
        <div class="streak-label">إجمالي جلسات الدراسة</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div style="font-weight:600;color:#B91C1C;">البديل - منصة التعليم الذكي</div>
    <div style="margin-top:4px;">تم إنشاء هذا التقرير تلقائياً بتاريخ ${dateStr} الساعة ${timeStr}</div>
    <div style="margin-top:4px;color:#D4A843;">◆ هذا التقرير للإطلاع الشخصي فقط وليس وثيقة رسمية ◆</div>
  </div>
</body>
</html>`;
  }, [progress, subjectNotes, studySessions, stats, categoryBreakdown, semesterSubjects, gpaData, streakData]);

  /* ---------- Generate & Download PDF ---------- */
  const handleGeneratePDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Small delay for UX feedback
      await new Promise((r) => setTimeout(r, 600));

      const html = generateReportHTML();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        // Wait for content to load, then trigger print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    } finally {
      setIsGenerating(false);
    }
  }, [generateReportHTML]);

  /* ---------- Preview ---------- */
  const handlePreview = useCallback(() => {
    const html = generateReportHTML();
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  }, [generateReportHTML]);

  /* ---------- Mini preview summary ---------- */
  const previewStats = useMemo(() => {
    const s1Completed = semesterSubjects[1].filter(
      (s) => getStatusForSubject(s.id, progress).status === "completed"
    ).length;
    const s2Completed = semesterSubjects[2].filter(
      (s) => getStatusForSubject(s.id, progress).status === "completed"
    ).length;
    return { s1Completed, s2Completed };
  }, [progress, semesterSubjects]);

  /* ================================================================ */
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass card-ornament overflow-hidden border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="size-5 text-omni-red" />
            تقرير التقدم الدراسي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            أنشئ تقريراً شاملاً لتقدمك الأكاديمي بصيغة PDF جاهز للطباعة
          </p>

          {/* Mini Preview Card */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full text-right"
            >
              <div className="rounded-xl border border-border p-4 bg-gradient-to-br from-omni-red/5 via-background to-omni-gold/5 hover:from-omni-red/10 hover:to-omni-gold/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-omni-red/10 flex items-center justify-center">
                      <GraduationCap className="size-4 text-omni-red" />
                    </div>
                    <span className="text-sm font-semibold">معاينة التقرير</span>
                  </div>
                  <Eye className="size-4 text-muted-foreground" />
                </div>

                {/* Mini stats row */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-omni-red">{stats.total}</div>
                    <div className="text-[10px] text-muted-foreground">إجمالي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                    <div className="text-[10px] text-muted-foreground">مكتملة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-omni-gold">{stats.inProgress}</div>
                    <div className="text-[10px] text-muted-foreground">قيد التقدم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground" dir="ltr">
                      {Math.round(stats.overallProgress)}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">التقدم</div>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #B91C1C, #D4A843)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(stats.overallProgress)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Expanded Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-border p-4 space-y-3 bg-background/50">
                  <h4 className="text-sm font-semibold text-omni-red">
                    محتويات التقرير
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: <FileText className="size-3.5" />, text: "ه البديل معلومات الطالب والعنوان", done: true },
                      { icon: <BookOpen className="size-3.5" />, text: `${stats.total} مادة - ملخص التقدم العام`, done: true },
                      { icon: <CheckCircle className="size-3.5" />, text: `السداسي الأول: ${previewStats.s1Completed} من ${semesterSubjects[1].length} مكتملة`, done: true },
                      { icon: <Clock className="size-3.5" />, text: `السداسي الثاني: ${previewStats.s2Completed} من ${semesterSubjects[2].length} مكتملة`, done: true },
                      { icon: <Circle className="size-3.5" />, text: `${categories.length} تصنيفات مع نسب التقدم`, done: true },
                      { icon: <GraduationCap className="size-3.5" />, text: `معدل GPA: ${gpaData.sem1.toFixed(2)} / ${gpaData.sem2.toFixed(2)}`, done: true },
                      { icon: <Flame className="size-3.5" />, text: `سجل المواظبة: ${streakData.currentStreak} أيام متتالية`, done: true },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="text-omni-red">{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Preview in new tab */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handlePreview}
                variant="outline"
                className="w-full gap-2 btn-ripple border-omni-gold/30 text-omni-gold-dark hover:bg-omni-gold/10 hover:text-omni-gold-dark dark:text-omni-gold dark:hover:bg-omni-gold/10"
              >
                <Eye className="size-4" />
                معاينة التقرير
              </Button>
            </motion.div>

            {/* Generate PDF */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`w-full gap-2 btn-ripple ${generated ? "bg-green-600 hover:bg-green-700" : "btn-omni-primary"}`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جارٍ الإنشاء...
                  </>
                ) : generated ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    تم الإنشاء ✓
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    تحميل PDF
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Info note */}
          <p className="text-[11px] text-muted-foreground text-center">
            سيتم فتح التقرير في نافذة جديدة. استخدم &quot;حفظ كـ PDF&quot; من متصفحك للتحميل.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
