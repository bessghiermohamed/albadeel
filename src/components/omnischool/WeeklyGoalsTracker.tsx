"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Check, Trash2, Clock, Trophy } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { subjectsData } from "@/lib/subjects-data";
import { WeeklyGoal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

/* ------------------------------------------------------------------ */
/*  Motivational messages based on completion rate                     */
/* ------------------------------------------------------------------ */
function getMotivationalMessage(rate: number): string {
  if (rate === 0) return "ابدأ بتحديد أهدافك الأسبوعية! 🎯";
  if (rate < 25) return "بداية جيدة، واصل التقدم! 💪";
  if (rate < 50) return "أنت في الطريق الصحيح! 🌟";
  if (rate < 75) return "إنجاز رائع، اقتربت من الهدف! 🔥";
  if (rate < 100) return "خطوة واحدة وتكمل! 🏆";
  return "أكملت جميع أهدافك! أنت بطل! 👑";
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const checkVariants = {
  unchecked: { scale: 1, backgroundColor: "transparent" },
  checked: {
    scale: [1, 1.2, 1],
    backgroundColor: "rgb(22 163 74)",
    transition: { duration: 0.3 },
  },
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function WeeklyGoalsTracker() {
  const { weeklyGoals, addWeeklyGoal, toggleWeeklyGoal, removeWeeklyGoal } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState("");
  const [newTargetHours, setNewTargetHours] = useState("2");
  const [newDescription, setNewDescription] = useState("");

  // Calculate completion stats
  const stats = useMemo(() => {
    const total = weeklyGoals.length;
    const completed = weeklyGoals.filter((g) => g.completed).length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, rate };
  }, [weeklyGoals]);

  const handleAddGoal = () => {
    if (!newSubjectId || !newTargetHours) return;
    const goal: WeeklyGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      subjectId: newSubjectId,
      targetHours: Number(newTargetHours),
      completedHours: 0,
      description: newDescription || subjectsData.find((s) => s.id === newSubjectId)?.nameAr || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    addWeeklyGoal(goal);
    setNewSubjectId("");
    setNewTargetHours("2");
    setNewDescription("");
    setDialogOpen(false);
  };

  return (
    <Card className="glass card-ornament overflow-hidden border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="size-5 text-omni-gold" />
            أهداف الأسبوع
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 border-omni-gold/30 text-omni-gold-dark dark:text-omni-gold hover:bg-omni-gold/10"
              >
                <Plus className="size-3.5" />
                إضافة هدف
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة هدف أسبوعي</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm">المادة</Label>
                  <Select value={newSubjectId} onValueChange={setNewSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsData.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">عدد الساعات المستهدفة</Label>
                  <Input
                    type="number"
                    min="1"
                    max="40"
                    value={newTargetHours}
                    onChange={(e) => setNewTargetHours(e.target.value)}
                    className="text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">وصف الهدف (اختياري)</Label>
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="مثلاً: مراجعة الفصل الثالث"
                  />
                </div>
                <Button
                  onClick={handleAddGoal}
                  disabled={!newSubjectId}
                  className="w-full bg-omni-red hover:bg-omni-red/90 text-white"
                >
                  <Plus className="size-4 ml-1" />
                  إضافة الهدف
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly progress summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-3 rounded-xl bg-omni-gold/5 dark:bg-omni-gold/10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="size-4 text-omni-gold" />
            <span className="text-sm font-medium">تقدم الأسبوع</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <motion.span
              key={stats.completed}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-2xl font-black text-omni-gold"
            >
              {stats.completed}
            </motion.span>
            <span className="text-sm text-muted-foreground">من</span>
            <span className="text-2xl font-black text-foreground">
              {stats.total}
            </span>
            <span className="text-sm text-muted-foreground">أهداف</span>
          </div>
          {stats.total > 0 && (
            <Progress value={stats.rate} className="h-2 mt-2" />
          )}
        </motion.div>

        {/* Goals list */}
        <AnimatePresence>
          {weeklyGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <Target className="size-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                لم تضف أي أهداف بعد
              </p>
              <p className="text-xs text-muted-foreground/60">
                اضغط على &quot;إضافة هدف&quot; لبدء التخطيط
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar"
            >
              {weeklyGoals.map((goal) => {
                const subject = subjectsData.find((s) => s.id === goal.subjectId);
                const progressPct = goal.targetHours > 0
                  ? Math.min((goal.completedHours / goal.targetHours) * 100, 100)
                  : 0;

                return (
                  <motion.div
                    key={goal.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    className={`p-3 rounded-xl border transition-all ${
                      goal.completed
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-background/50 border-border"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Check button */}
                      <motion.button
                        variants={checkVariants}
                        animate={goal.completed ? "checked" : "unchecked"}
                        onClick={() => toggleWeeklyGoal(goal.id)}
                        className="mt-0.5 size-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          borderColor: goal.completed ? "rgb(22 163 74)" : undefined,
                        }}
                        aria-label={goal.completed ? "إلغاء الإنجاز" : "تحقيق الهدف"}
                      >
                        <AnimatePresence>
                          {goal.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                              <Check className="size-3.5 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              goal.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {subject?.nameAr || goal.description}
                          </span>
                          {subject && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0"
                              style={{
                                backgroundColor: `${subject.color}10`,
                                color: subject.color,
                                borderColor: `${subject.color}30`,
                              }}
                            >
                              {subject.category}
                            </Badge>
                          )}
                        </div>
                        {goal.description && subject && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {goal.description}
                          </p>
                        )}
                        {/* Progress bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress
                            value={progressPct}
                            className="h-1.5 flex-1"
                          />
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ltr-content" dir="ltr">
                            {goal.completedHours}/{goal.targetHours}h
                          </span>
                        </div>
                      </div>

                      {/* Time badge & delete */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{goal.targetHours} ساعة</span>
                        </div>
                        <button
                          onClick={() => removeWeeklyGoal(goal.id)}
                          className="text-muted-foreground/40 hover:text-red-500 transition-colors p-0.5"
                          aria-label="حذف الهدف"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-medium text-center text-omni-gold-dark dark:text-omni-gold"
        >
          {getMotivationalMessage(stats.rate)}
        </motion.p>
      </CardContent>
    </Card>
  );
}
