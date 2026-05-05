"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { StudySession } from "@/lib/types";

/* ------------------------------------------------------------------
   Icon Mapping — maps subject.icon string → lucide-react component
   ------------------------------------------------------------------ */
import {
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
  type LucideIcon,
} from "lucide-react";

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
   Arabic Week Days (Saturday to Friday)
   ------------------------------------------------------------------ */
const arabicDays = [
  { key: "sat", label: "السبت", short: "س" },
  { key: "sun", label: "الأحد", short: "أ" },
  { key: "mon", label: "الاثنين", short: "ث" },
  { key: "tue", label: "الثلاثاء", short: "ث" },
  { key: "wed", label: "الأربعاء", short: "أ" },
  { key: "thu", label: "الخميس", short: "خ" },
  { key: "fri", label: "الجمعة", short: "ج" },
];

/* ------------------------------------------------------------------
   Helper: date utilities
   ------------------------------------------------------------------ */
function getWeekDates(referenceDate: Date): Date[] {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0=Sun, 6=Sat
  // Saturday = 6 in JS. Offset to get Saturday as start.
  const diffToSat = day === 6 ? 0 : -(day + 1);
  const sat = new Date(d);
  sat.setDate(d.getDate() + diffToSat);
  sat.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sat);
    date.setDate(sat.getDate() + i);
    return date;
  });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

function isSameDay(d1: Date, d2: Date): boolean {
  return formatDateISO(d1) === formatDateISO(d2);
}

/* ------------------------------------------------------------------
   Duration presets
   ------------------------------------------------------------------ */
const durationOptions = [
  { value: 30, label: "٣٠ دقيقة" },
  { value: 45, label: "٤٥ دقيقة" },
  { value: 60, label: "ساعة واحدة" },
  { value: 90, label: "ساعة ونصف" },
  { value: 120, label: "ساعتان" },
  { value: 150, label: "ساعتان ونصف" },
  { value: 180, label: "٣ ساعات" },
];

/* ------------------------------------------------------------------
   Stagger animation variants
   ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------
   StudyPlanner Component
   ------------------------------------------------------------------ */
export function StudyPlanner() {
  const { studySessions, addStudySession, removeStudySession, toggleStudySession } =
    useAppStore();

  const [weekOffset, setWeekOffset] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));
  const [formSubjectId, setFormSubjectId] = useState("");
  const [formTime, setFormTime] = useState("09:00");
  const [formDuration, setFormDuration] = useState("60");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const weekDates = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setDate(now.getDate() + weekOffset * 7);
    return getWeekDates(now);
  }, [weekOffset]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const dateStr = formatDateISO(date);
    return studySessions
      .filter((s) => s.date === dateStr)
      .sort((a, b) => (a as StudySession & { time?: string }).id.localeCompare(b.id));
  };

  // Today's sessions
  const todaySessions = getSessionsForDate(today);

  // Selected day sessions for detail view
  const selectedDay = selectedDayIndex !== null ? weekDates[selectedDayIndex] : today;
  const selectedDaySessions = getSessionsForDate(selectedDay);

  // Get subject info
  const getSubject = (id: string) => subjectsData.find((s) => s.id === id);

  // Add session handler
  const handleAddSession = () => {
    if (!formSubjectId || !formTime) return;

    addStudySession({
      id: uuidv4(),
      subjectId: formSubjectId,
      date: selectedDate,
      duration: parseInt(formDuration),
      completed: false,
      time: formTime,
    } as StudySession & { time: string });

    setDialogOpen(false);
    setFormSubjectId("");
    setFormTime("09:00");
    setFormDuration("60");
  };

  // Open dialog for a specific day
  const openAddForDay = (date: Date) => {
    setSelectedDate(formatDateISO(date));
    setDialogOpen(true);
  };

  // Format time for display (24h to Arabic-friendly 12h)
  const formatTimeAr = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "م" : "ص";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  // Format duration for display
  const formatDurationAr = (minutes: number) => {
    if (minutes < 60) return `${minutes} د`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} س`;
    return `${hours} س ${mins} د`;
  };

  // Navigation
  const goToThisWeek = () => setWeekOffset(0);
  const goToPrevWeek = () => setWeekOffset((o) => o - 1);
  const goToNextWeek = () => setWeekOffset((o) => o + 1);

  // Week label
  const weekLabel = useMemo(() => {
    const first = weekDates[0];
    const last = weekDates[6];
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ];
    return `${first.getDate()} ${months[first.getMonth()]} — ${last.getDate()} ${months[last.getMonth()]} ${last.getFullYear()}`;
  }, [weekDates]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl glass-red flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-omni-red" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              مخطط الدراسة
            </h1>
            <p className="text-muted-foreground text-sm">
              نظّم جلساتك الدراسية أسبوعيًا
            </p>
          </div>
        </div>
      </motion.div>

      {/* Today's Sessions Summary */}
      {todaySessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-red p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-omni-red" />
                <h2 className="text-lg font-bold text-omni-red">جلسات اليوم</h2>
              </div>
              <Badge className="badge-omni-red">{todaySessions.length} جلسة</Badge>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 max-h-64 overflow-y-auto"
            >
              <AnimatePresence>
                {todaySessions.map((session) => {
                  const subject = getSubject(session.subjectId);
                  if (!subject) return null;
                  return (
                    <motion.div
                      key={session.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        session.completed
                          ? "bg-green-500/5 border border-green-500/10"
                          : "glass"
                      }`}
                    >
                      <Checkbox
                        checked={session.completed}
                        onCheckedChange={() => toggleStudySession(session.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${subject.color}15` }}
                      >
                        <SubjectIcon
                          iconName={subject.icon}
                          className="h-4 w-4"
                          style={{ color: subject.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            session.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {subject.nameAr}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {(session as StudySession & { time?: string }).time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAr((session as StudySession & { time?: string }).time!)}
                            </span>
                          )}
                          <span>{formatDurationAr(session.duration)}</span>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeStudySession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </Card>
        </motion.div>
      )}

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevWeek}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={goToThisWeek} className="text-omni-red">
              هذا الأسبوع
            </Button>
          )}
        </div>
        <p className="text-sm font-medium text-foreground">{weekLabel}</p>
      </motion.div>

      {/* Weekly Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Day headers */}
          {arabicDays.map((day, idx) => {
            const date = weekDates[idx];
            const isToday = isSameDay(date, today);
            const isSelected = selectedDayIndex === idx;
            const daySessions = getSessionsForDate(date);
            const completedCount = daySessions.filter((s) => s.completed).length;

            return (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx + 0.3, duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Day label */}
                <span
                  className={`text-[10px] sm:text-xs font-medium mb-1 ${
                    isToday ? "text-omni-red" : "text-muted-foreground"
                  }`}
                >
                  {day.label}
                </span>

                {/* Day card */}
                <button
                  onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
                  className={`w-full relative rounded-xl p-1.5 sm:p-2 transition-all duration-300 flex flex-col items-center gap-1 ${
                    isToday
                      ? "bg-omni-red/10 border-2 border-omni-red/30 ring-2 ring-omni-red/10"
                      : isSelected
                      ? "bg-omni-gold/10 border-2 border-omni-gold/30"
                      : "glass hover:bg-omni-red/5 border border-transparent"
                  }`}
                >
                  {/* Date number */}
                  <span
                    className={`text-sm sm:text-lg font-bold ${
                      isToday ? "text-omni-red" : "text-foreground"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {/* Session indicator dots */}
                  {daySessions.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      {daySessions.slice(0, 4).map((s, si) => (
                        <div
                          key={si}
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.completed ? "bg-green-500" : "bg-omni-gold"
                          }`}
                        />
                      ))}
                      {daySessions.length > 4 && (
                        <span className="text-[8px] text-muted-foreground">
                          +{daySessions.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Completed / total count */}
                  {daySessions.length > 0 && (
                    <span className="text-[9px] text-muted-foreground">
                      {completedCount}/{daySessions.length}
                    </span>
                  )}

                  {/* Add button on hover */}
                  <div className="absolute -top-1 -left-1 sm:opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddForDay(date);
                      }}
                      className="w-5 h-5 rounded-full bg-omni-red text-white flex items-center justify-center shadow-md hover:bg-omni-red-light transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Day Sessions Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              {selectedDayIndex !== null
                ? `${arabicDays[selectedDayIndex].label} ${selectedDay.getDate()}`
                : `جلسات اليوم`}
            </h3>
            <Button
              onClick={() => openAddForDay(selectedDay)}
              className="btn-omni-primary rounded-xl text-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 me-1" />
              إضافة جلسة
            </Button>
          </div>

          {selectedDaySessions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-red flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-omni-red/40" />
              </div>
              <p className="text-muted-foreground text-sm">
                لا توجد جلسات دراسية في هذا اليوم
              </p>
              <p className="text-muted-foreground text-xs">
                اضغط على &quot;إضافة جلسة&quot; لبدء التخطيط
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 max-h-96 overflow-y-auto"
            >
              <AnimatePresence>
                {selectedDaySessions.map((session) => {
                  const subject = getSubject(session.subjectId);
                  if (!subject) return null;
                  const sessionTime = (session as StudySession & { time?: string }).time;

                  return (
                    <motion.div
                      key={session.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
                        session.completed
                          ? "bg-green-500/5 border-green-500/15"
                          : "glass border-transparent"
                      }`}
                    >
                      {/* Checkbox */}
                      <motion.div whileTap={{ scale: 0.85 }}>
                        <Checkbox
                          checked={session.completed}
                          onCheckedChange={() => toggleStudySession(session.id)}
                          className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                      </motion.div>

                      {/* Subject icon */}
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${subject.color}15` }}
                      >
                        <SubjectIcon
                          iconName={subject.icon}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: subject.color }}
                        />
                      </div>

                      {/* Subject info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm sm:text-base font-bold truncate transition-all ${
                            session.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {subject.nameAr}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {sessionTime && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-medium gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              {formatTimeAr(sessionTime)}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="text-[10px] font-medium"
                          >
                            {formatDurationAr(session.duration)}
                          </Badge>
                          <Badge
                            className="text-[10px] font-medium"
                            style={{
                              backgroundColor: `${subject.color}12`,
                              color: subject.color,
                              border: `1px solid ${subject.color}25`,
                            }}
                          >
                            {subject.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Delete button */}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeStudySession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Add Session Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-omni-red" />
              إضافة جلسة دراسية
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              حدد المادة والوقت والمدة لجلسة الدراسة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Subject selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">المادة</Label>
              <Select value={formSubjectId} onValueChange={setFormSubjectId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المادة" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {subjectsData.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <SubjectIcon
                          iconName={subject.icon}
                          className="h-4 w-4"
                          style={{ color: subject.color }}
                        />
                        <span>{subject.nameAr}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">التاريخ</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">الوقت</Label>
              <Input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">المدة</Label>
              <Select value={formDuration} onValueChange={setFormDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المدة" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddSession}
              disabled={!formSubjectId || !formTime}
              className="btn-omni-primary rounded-xl"
            >
              إضافة الجلسة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
