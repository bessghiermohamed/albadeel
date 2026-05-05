"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ChevronLeft, ChevronRight, SkipForward, User, BookOpen, Star } from "lucide-react";
import { subjectsData } from "@/lib/subjects-data";
import type { UserRole } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const TOTAL_STEPS = 3;

const roleOptions: { value: UserRole; label: string; icon: string }[] = [
  { value: "student", label: "طالب", icon: "🎓" },
  { value: "teacher", label: "معلم", icon: "👨‍🏫" },
  { value: "admin", label: "مدير", icon: "🔧" },
];

const semesterSubjects = {
  1: subjectsData.filter((s) => s.semester === 1),
  2: subjectsData.filter((s) => s.semester === 2),
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25 },
  }),
};

const logoVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatingDot = (i: number) => ({
  animate: {
    y: [0, -10 - i * 3, 0],
    x: [0, i % 2 === 0 ? 5 : -5, 0],
    opacity: [0.3, 0.7, 0.3],
  },
  transition: {
    duration: 3 + i * 0.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: i * 0.3,
  },
});

/* ------------------------------------------------------------------ */
/*  Step Indicators (external component)                               */
/* ------------------------------------------------------------------ */
function StepIndicators({ currentStep }: { currentStep: number }) {
  /* In RTL Arabic, steps should flow right-to-left visually.
     We reverse the rendering order so step 1 appears on the right
     and step 3 appears on the left, matching RTL reading direction. */
  const reversedIndices = Array.from({ length: TOTAL_STEPS }, (_, i) => TOTAL_STEPS - 1 - i);

  return (
    <div className="flex items-center justify-center gap-3 mb-6" dir="rtl">
      {reversedIndices.map((i, arrIdx) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i === currentStep
                ? "bg-omni-red text-white shadow-lg glow-red-sm"
                : i < currentStep
                ? "bg-omni-gold text-white"
                : "bg-white/20 text-white/60 border border-white/20"
            }`}
            animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, repeat: i === currentStep ? Infinity : 0, ease: "easeInOut" }}
          >
            {i < currentStep ? "✓" : i + 1}
          </motion.div>
          {arrIdx < TOTAL_STEPS - 1 && (
            <div
              className={`w-8 h-0.5 rounded-full ${
                i < currentStep ? "bg-omni-gold" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Welcome (external component)                               */
/* ------------------------------------------------------------------ */
function WelcomeStep({ direction }: { direction: number }) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center space-y-6 px-4"
    >
      {/* Animated Logo */}
      <motion.div
        variants={logoVariants}
        animate="pulse"
        className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20"
      >
        <GraduationCap className="w-14 h-14 text-omni-gold" />
      </motion.div>

      {/* Floating decorative dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-omni-gold/40"
          style={{
            top: `${15 + i * 12}%`,
            left: `${10 + (i % 3) * 35}%`,
          }}
          {...floatingDot(i)}
        />
      ))}

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          مرحباً بك في{" "}
          <span className="text-omni-gold">البديل</span>
        </h1>
        <p className="text-white/80 text-base sm:text-lg max-w-md leading-relaxed">
          منصتك التعليمية المتكاملة لطلبة المدرسة العليا للأساتذة
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {["تتبع التقدم", "ملاحظات ذكية", "إنجازات", "مساعد AI"].map((feature, i) => (
          <motion.span
            key={feature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10"
          >
            {feature}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: User Info (external component)                             */
/* ------------------------------------------------------------------ */
function UserInfoStep({
  direction,
  name,
  setName,
  role,
  setRole,
}: {
  direction: number;
  name: string;
  setName: (v: string) => void;
  role: UserRole;
  setRole: (v: UserRole) => void;
}) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center space-y-6 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <User className="w-9 h-9 text-omni-gold" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">أخبرنا عنك</h2>
        <p className="text-white/70 text-sm">حتى نتمكن من تخصيص تجربتك</p>
      </div>

      {/* Name input */}
      <div className="w-full max-w-xs space-y-2">
        <label className="text-white/90 text-sm font-medium text-right block">الاسم</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك..."
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-center text-lg h-12 focus:border-omni-gold focus:ring-omni-gold/30"
          dir="rtl"
        />
      </div>

      {/* Role selector */}
      <div className="w-full max-w-xs space-y-2">
        <label className="text-white/90 text-sm font-medium text-right block">الدور</label>
        <div className="grid grid-cols-3 gap-2">
          {roleOptions.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole(opt.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                role === opt.value
                  ? "bg-omni-red/40 border-omni-gold text-white shadow-lg glow-gold-sm"
                  : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-semibold">{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Semester & Subjects (external component)                   */
/* ------------------------------------------------------------------ */
function SemesterStep({
  direction,
  semester,
  setSemester,
  selectedSubjects,
  toggleSubject,
}: {
  direction: number;
  semester: 1 | 2;
  setSemester: (v: 1 | 2) => void;
  selectedSubjects: string[];
  toggleSubject: (id: string) => void;
}) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center space-y-5 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <BookOpen className="w-9 h-9 text-omni-gold" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">اختر السداسي والمواد</h2>
        <p className="text-white/70 text-sm">حدد السداسي الحالي والمواد المفضلة</p>
      </div>

      {/* Semester selector */}
      <div className="flex gap-3">
        {([1, 2] as const).map((sem) => (
          <motion.button
            key={sem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSemester(sem)}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
              semester === sem
                ? "bg-omni-gold text-white shadow-lg glow-gold-sm"
                : "bg-white/10 text-white/70 border border-white/15 hover:bg-white/15"
            }`}
          >
            السداسي {sem}
          </motion.button>
        ))}
      </div>

      {/* Subject chips */}
      <div className="w-full max-w-md space-y-2">
        <label className="text-white/90 text-sm font-medium text-right block">
          المواد المفضلة
          <span className="text-white/50 text-xs ms-2">(اختياري)</span>
        </label>
        <div className="max-h-40 overflow-y-auto rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="flex flex-wrap gap-2">
            {semesterSubjects[semester].map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id);
              return (
                <motion.button
                  key={subject.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleSubject(subject.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-omni-gold/30 border border-omni-gold text-omni-gold-light"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {subject.nameAr}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function OnboardingModal() {
  const { hasOnboarded, completeOnboarding, setUserName, setUserRole, setSelectedSemester } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [semester, setSemester] = useState<1 | 2>(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  /* Show on mount if not onboarded */
  useEffect(() => {
    if (!hasOnboarded) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasOnboarded]);

  if (hasOnboarded) return null;

  /* Handlers */
  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const finishOnboarding = () => {
    if (name.trim()) setUserName(name.trim());
    setUserRole(role);
    setSelectedSemester(semester);
    completeOnboarding();
    setIsOpen(false);
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (currentStep === 1 && !name.trim()) return false;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Gradient background */}
            <div className="gradient-hero p-6 sm:p-8 relative min-h-[420px] flex flex-col">
              {/* Decorative gold circle */}
              <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-omni-gold/5 pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-omni-red/5 pointer-events-none" />

              {/* Step Indicators */}
              <StepIndicators currentStep={currentStep} />

              {/* Step Content */}
              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  {currentStep === 0 && (
                    <WelcomeStep key="welcome" direction={direction} />
                  )}
                  {currentStep === 1 && (
                    <UserInfoStep
                      key="userinfo"
                      direction={direction}
                      name={name}
                      setName={setName}
                      role={role}
                      setRole={setRole}
                    />
                  )}
                  {currentStep === 2 && (
                    <SemesterStep
                      key="semester"
                      direction={direction}
                      semester={semester}
                      setSemester={setSemester}
                      selectedSubjects={selectedSubjects}
                      toggleSubject={toggleSubject}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/15">
                {/* Skip button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={finishOnboarding}
                  className="flex items-center gap-1 text-white/50 text-sm hover:text-white/80 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  تخطي
                </motion.button>

                <div className="flex items-center gap-3">
                  {/* Back */}
                  {currentStep > 0 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        className="text-white/70 hover:text-white hover:bg-white/10 gap-1"
                      >
                        <ChevronRight className="w-4 h-4" />
                        السابق
                      </Button>
                    </motion.div>
                  )}

                  {/* Next / Finish */}
                  {currentStep < TOTAL_STEPS - 1 ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={goNext}
                        disabled={!canProceed()}
                        className="btn-omni-gold rounded-xl px-6 gap-1 font-semibold text-sm"
                      >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={finishOnboarding}
                        className="btn-omni-gold rounded-xl px-6 gap-2 font-semibold text-sm glow-gold-sm"
                      >
                        <Star className="w-4 h-4" />
                        ابدأ الآن
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
