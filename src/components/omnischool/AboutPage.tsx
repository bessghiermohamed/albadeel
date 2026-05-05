"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Heart,
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Star,
  Shield,
  Zap,
  Globe,
  Eye,
  Target,
  Sparkles,
  ArrowLeft,
  Quote,
  Code2,
  Palette,
  TrendingUp,
  MousePointerClick,
  CheckCircle2,
  Database,
  Layers,
  GitBranch,
  Cpu,
  MessageCircle,
  Lightbulb,
  Rocket,
  HandHeart,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const stats = [
  { value: 24, label: "مادة دراسية", icon: BookOpen, color: "#B91C1C" },
  { value: 2, label: "سداسي", icon: Calendar, color: "#D4A843" },
  { value: 7, label: "تصنيفات", icon: Target, color: "#059669" },
  { value: 10, label: "+ مواد مشتركة", icon: Star, color: "#7C3AED" },
];

const features = [
  {
    number: "01",
    icon: BookOpen,
    title: "24 مادة دراسية",
    description: "مواد كاملة للسداسيين الأول والثاني مع تصنيفات واضحة",
    color: "#B91C1C",
  },
  {
    number: "02",
    icon: TrendingUp,
    title: "تتبع التقدم",
    description: "تابع تقدمك في كل مادة مع إحصائيات ومخططات بصرية",
    color: "#D4A843",
  },
  {
    number: "03",
    icon: Shield,
    title: "حفظ محلي آمن",
    description: "بياناتك محفوظة بشكل آمن في متصفحك بدون حساب أو تسجيل",
    color: "#059669",
  },
  {
    number: "04",
    icon: Palette,
    title: "وضع مظلم وفاتح",
    description: "واجهة بألوان دافئة تناسب جميع الأوقات والظروف",
    color: "#7C3AED",
  },
  {
    number: "05",
    icon: MousePointerClick,
    title: "تفاعل سلس",
    description: "حركات وانتقالات سلسة مع دعم كامل للعربية RTL",
    color: "#0891B2",
  },
  {
    number: "06",
    icon: Sparkles,
    title: "ذكاء اصطناعي",
    description: "مساعد دراسي ذكي يجيب على أسئلتك ويرشدك في دراستك",
    color: "#E11D48",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "اختر مادتك",
    description: "تصفح المواد مصنفة حسب السداسي والنوع واختر ما تريد دراسته",
    icon: BookOpen,
    color: "#B91C1C",
  },
  {
    step: 2,
    title: "تتبع تقدمك",
    description: "حدد نسبة إنجازك وحالة كل مادة واحفظ ملاحظاتك الشخصية",
    icon: Target,
    color: "#D4A843",
  },
  {
    step: 3,
    title: "حقق أهدافك",
    description: "استخدم جدول الدراسة ومؤقت بومودورو لتنظيم وقتك بفعالية",
    icon: CheckCircle2,
    color: "#059669",
  },
];

const testimonials = [
  {
    name: "أمينة بوعلام",
    role: "طالبة — السداسي الثاني",
    text: "ساعدتني المنصة كثيراً في تنظيم دراستي وتتبع تقدمي في كل مادة. أصبحت أكثر التزاماً بخطتي الدراسية!",
    avatar: "أ",
    color: "#B91C1C",
    rating: 5,
  },
  {
    name: "محمد أمين حمداني",
    role: "طالب — السداسي الأول",
    text: "واجهة جميلة وسهلة الاستخدام. ميزة الملاحظات والروابط لمصادر Drive وفّرت علي وقتاً كبيراً في البحث.",
    avatar: "م",
    color: "#D4A843",
    rating: 5,
  },
  {
    name: "فاطمة الزهراء بلقاسم",
    role: "طالبة — السداسي الثاني",
    text: "المؤقت بومودورو وجدول الدراسة الأسبوعي غيّرا طريقة مذاكرتي بالكامل. أنصح كل طالب باستخدامهما!",
    avatar: "ف",
    color: "#059669",
    rating: 4,
  },
];

const techStack = [
  { name: "Next.js 16", color: "#000000", icon: Globe, description: "إطار عمل React متكامل" },
  { name: "TypeScript", color: "#3178C6", icon: Code2, description: "لغة برمجة آمنة الأنواع" },
  { name: "Tailwind CSS", color: "#06B6D4", icon: Palette, description: "تصميم سريع ومتجاوب" },
  { name: "shadcn/ui", color: "#000000", icon: Layers, description: "مكونات واجهة أنيقة" },
  { name: "Framer Motion", color: "#FF0055", icon: Zap, description: "حركات وانتقالات سلسة" },
  { name: "Zustand", color: "#764ABC", icon: Database, description: "إدارة حالة خفيفة" },
  { name: "Prisma", color: "#2D3748", icon: GitBranch, description: "ORM قواعد بيانات حديث" },
  { name: "SQLite", color: "#003B57", icon: Cpu, description: "قاعدة بيانات محلية سريعة" },
];

/* ------------------------------------------------------------------ */
/*  Animated Counter Component                                          */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                  */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ================================================================== */
/*  AboutPage Component                                                */
/* ================================================================== */
export function AboutPage() {
  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ============================================================ */}
      {/* ENHANCED Hero Section — Larger icon, animated background,   */}
      {/* better info pills                                            */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 islamic-pattern-bg opacity-100">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(212,168,67,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(212,168,67,0.08) 0%, transparent 40%)
            `,
          }} />
        </div>

        {/* ENHANCED: Animated background elements — more of them, larger */}
        <div className="absolute top-8 left-8 w-28 h-28 rounded-full border border-white/10 animate-float" />
        <div className="absolute bottom-12 right-12 w-20 h-20 rounded-full border border-white/5 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-omni-gold/10 animate-float" style={{ animationDelay: "2s" }} />
        {/* NEW: Additional animated decorative elements */}
        <div className="absolute top-16 right-1/4 w-6 h-6 rounded-full bg-white/5 animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-16 left-1/4 w-14 h-14 rounded-full border border-omni-gold/10 animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-12 w-4 h-4 rotate-45 bg-omni-gold/8 animate-spin-slow" />
        <div className="absolute bottom-1/3 left-12 w-5 h-5 rotate-45 border border-white/8 animate-spin-slow" style={{ animationDelay: "2s" }} />

        {/* Content */}
        <div className="relative z-10 text-center py-16 sm:py-24 space-y-6">
          {/* ENHANCED: Larger icon/illustration */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center mb-2"
          >
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                <GraduationCap className="size-14 sm:size-16 text-white drop-shadow-lg" />
              </div>
              {/* ENHANCED: Glow rings around icon */}
              <div className="absolute inset-[-8px] rounded-3xl border border-omni-gold/20 animate-pulse" />
              <div className="absolute inset-[-16px] rounded-3xl border border-white/5" />
              {/* Floating sparkle elements */}
              <Sparkles className="absolute -top-2 -right-2 size-5 text-omni-gold-light animate-float" style={{ animationDelay: "0.3s" }} />
              <Star className="absolute -bottom-1 -left-3 size-4 text-omni-gold-light animate-float" style={{ animationDelay: "1.2s" }} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-white text-shadow-omni"
          >
            حول{" "}
            <span className="gradient-text-red-gold">البديل</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            منصة تعليمية متكاملة مصممة خصيصاً لطلبة المدرسة العليا للأساتذة
            بالجزائر، فرع PEP، تخصص الأدب العربي
          </motion.p>

          {/* Decorative ornamental divider */}
          <div className="decorative-line max-w-xs mx-auto pt-2">
            <div className="diamond" />
          </div>

          {/* ENHANCED: Better info pills design */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 pt-2"
          >
            {[
              { icon: MapPin, text: "ENS — الجزائر", accent: "border-omni-gold/30" },
              { icon: Users, text: "PEP — أدب عربي", accent: "border-white/20" },
              { icon: Calendar, text: "سداسيان — 24 مادة", accent: "border-omni-gold/30" },
            ].map((item) => (
              <div
                key={item.text}
                className={`flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border ${item.accent} hover:bg-white/15 transition-colors`}
              >
                <item.icon className="size-4 text-omni-gold-light" />
                <span className="text-white/90 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* Animated Statistics Counter Row                              */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={scaleVariants}
                whileHover={{ scale: 1.04, y: -4 }}
                className="card-depth bg-card border border-border rounded-2xl p-5 text-center relative overflow-hidden"
              >
                {/* Decorative accent bar */}
                <div
                  className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)` }}
                />
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}12` }}
                >
                  <Icon className="size-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold ltr-content" style={{ color: stat.color }} dir="ltr">
                  <AnimatedCounter target={stat.value} />
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Features Showcase — Feature numbers, better card   */}
      {/* depth, hover effects with color transitions, gradient cards */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Sparkles className="size-5 text-omni-gold" />
          <span className="section-header-line">مميزات المنصة</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group"
              >
                <Card className="card-depth bg-card border border-border h-full relative overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                  {/* ENHANCED: Subtle gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(145deg, ${feature.color}08 0%, transparent 60%)`,
                    }}
                  />
                  {/* ENHANCED: Feature number badge */}
                  <div
                    className="absolute top-4 left-4 text-5xl font-black opacity-[0.06] ltr-content"
                    style={{ color: feature.color }}
                    dir="ltr"
                  >
                    {feature.number}
                  </div>

                  <CardContent className="p-6 flex flex-col items-start gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${feature.color}12` }}
                      >
                        <FeatureIcon className="size-7" style={{ color: feature.color }} />
                      </div>
                      {/* ENHANCED: Feature number as small badge */}
                      <Badge
                        className="text-[10px] font-bold px-2 py-0.5"
                        style={{
                          backgroundColor: `${feature.color}15`,
                          color: feature.color,
                          border: `1px solid ${feature.color}20`,
                        }}
                      >
                        {feature.number}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg group-hover:transition-colors" style={{}}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED How It Works — Better step indicators, animated    */}
      {/* connecting lines, better descriptions                        */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Eye className="size-5 text-omni-red" />
          <span className="section-header-line">كيف تعمل المنصة؟</span>
        </h2>
        <div className="relative">
          {/* ENHANCED: Animated connecting line (desktop only) */}
          <div className="hidden sm:block absolute top-20 right-[16.67%] left-[16.67%] h-1 rounded-full overflow-hidden bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #B91C1C, #D4A843, #059669)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          {/* Step dots on the line */}
          <div className="hidden sm:flex absolute top-[76px] right-[16.67%] left-[16.67%] justify-between">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-background border-2 border-omni-red/30 z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.3 }}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {howItWorks.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* ENHANCED: Step number circle — larger, more prominent */}
                  <div className="relative mx-auto mb-5">
                    <div
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border-4 border-background shadow-xl relative z-10"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <span
                        className="text-3xl font-black"
                        style={{ color: step.color }}
                      >
                        {step.step}
                      </span>
                    </div>
                    {/* Glow ring — animated */}
                    <motion.div
                      className="absolute inset-[-6px] rounded-full"
                      style={{
                        boxShadow: `0 0 20px ${step.color}30, 0 0 40px ${step.color}15`,
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                    />
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}12` }}
                  >
                    <StepIcon className="size-6" style={{ color: step.color }} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* Semester Overview                                            */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="size-5 text-omni-red" />
          <span className="section-header-line">نظرة على المواد</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02, y: -2 }}>
            <Card className="card-depth bg-card border border-border overflow-hidden h-full">
              <div className="h-2 bg-gradient-to-l from-omni-red to-red-400" />
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-omni-red/10 flex items-center justify-center">
                    <BookOpen className="size-4 text-omni-red" />
                  </div>
                  السداسي الأول
                </h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-red mt-2 shrink-0" />
                    9 مواد تخصص + 3 مواد مشتركة
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-red mt-2 shrink-0" />
                    تصنيفات: تربوية، نفسية، لغوية، اجتماعية
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-red mt-2 shrink-0" />
                    مواد أساسية: أصول التربية، علم النفس العام
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -2 }}>
            <Card className="card-depth bg-card border border-border overflow-hidden h-full">
              <div className="h-2 bg-gradient-to-l from-omni-gold to-amber-400" />
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-omni-gold/10 flex items-center justify-center">
                    <BookOpen className="size-4 text-omni-gold" />
                  </div>
                  السداسي الثاني
                </h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-gold mt-2 shrink-0" />
                    9 مواد تخصص + 3 مواد مشتركة
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-gold mt-2 shrink-0" />
                    تصنيفات: تربوية، نفسية، لغوية، منهجية
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-gold mt-2 shrink-0" />
                    مواد أساسية: طرق التدريس، التربية العملية
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Testimonials — Star ratings, better avatar, quote  */}
      {/* animation                                                    */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Heart className="size-5 text-omni-red" />
          <span className="section-header-line">آراء الطلاب</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group"
            >
              <Card className="card-depth bg-card border border-border h-full relative overflow-hidden">
                {/* Accent bar at top */}
                <div
                  className="absolute top-0 right-0 left-0 h-1"
                  style={{ backgroundColor: testimonial.color }}
                />
                <CardContent className="p-6 pt-7">
                  {/* ENHANCED: Animated quote icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.1 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                  >
                    <Quote
                      className="size-8 mb-3"
                      style={{ color: testimonial.color }}
                    />
                  </motion.div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {testimonial.text}
                  </p>

                  {/* ENHANCED: Star ratings */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < testimonial.rating ? "fill-current" : ""}`}
                        style={{
                          color: i < testimonial.rating ? "#D4A843" : "var(--muted-foreground)",
                          opacity: i < testimonial.rating ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* ENHANCED: Better avatar styling with ring */}
                    <div className="relative">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
                        style={{ backgroundColor: testimonial.color }}
                      >
                        {testimonial.avatar}
                      </div>
                      {/* Avatar ring */}
                      <div
                        className="absolute inset-[-3px] rounded-full border-2 opacity-20"
                        style={{ borderColor: testimonial.color }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Tech Stack — Colorful interactive badges,          */}
      {/* descriptions, better visual layout                           */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Code2 className="size-5 text-omni-gold" />
          <span className="section-header-line">التقنيات المستخدمة</span>
        </h2>
        <Card className="card-depth bg-card border border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {techStack.map((tech, idx) => {
                const TechIcon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-default group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${tech.color}15` }}
                    >
                      <TechIcon className="size-5" style={{ color: tech.color === "#000000" ? undefined : tech.color }} />
                    </div>
                    <span
                      className="text-sm font-bold text-center"
                      style={{ color: tech.color === "#000000" ? undefined : tech.color }}
                    >
                      {tech.name}
                    </span>
                    {/* ENHANCED: Brief description under each tech */}
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">
                      {tech.description}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* ENHANCED Team/Credits Section — Larger profile area,        */}
      {/* better social links, "contribute" CTA                       */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Users className="size-5 text-omni-red" />
          <span className="section-header-line">فريق العمل</span>
        </h2>
        <Card className="card-depth bg-card border border-border relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.03] islamic-pattern-bg" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-omni-red/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-omni-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <CardContent className="relative z-10 p-8 sm:p-10 text-center space-y-5">
            {/* ENHANCED: Larger profile area */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-omni-red/10 flex items-center justify-center border-2 border-omni-red/20 shadow-lg">
                  <span className="text-4xl font-black text-omni-red">B</span>
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-[-6px] rounded-2xl border-2 border-omni-gold/20" />
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-background" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground">
              Besseghier Mohamed
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              مطور ومصمم المنصة — طالب في المدرسة العليا للأساتذة
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-omni-red" />
              <span>المدرسة العليا للأساتذة ENS — الجزائر</span>
            </div>

            {/* ENHANCED: Better social links styling */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="gap-2 px-5 py-2.5 font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #24292e, #333)",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() =>
                    window.open("https://github.com/BesseghierMohamed", "_blank")
                  }
                >
                  <Github className="size-4" />
                  GitHub
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="gap-2 px-5 py-2.5 font-semibold"
                  onClick={() =>
                    window.open("mailto:besseghiermohamed@gmail.com", "_blank")
                  }
                >
                  <Mail className="size-4" />
                  البريد الإلكتروني
                </Button>
              </motion.div>
            </div>

            {/* ENHANCED: Contribute CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-5 border-t border-border/50"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <HandHeart className="size-5 text-omni-gold" />
                <p className="text-sm font-semibold text-foreground">هل تريد المساهمة؟</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3 max-w-md mx-auto">
                هذا المشروع مفتوح المصدر! يمكنك المساهمة في تطويره أو اقتراح ميزات جديدة
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="btn-omni-gold btn-ripple gap-2 text-sm font-semibold"
                  onClick={() =>
                    window.open(
                      "https://github.com/bessghiermohamed/albadeel",
                      "_blank"
                    )
                  }
                >
                  <Rocket className="size-4" />
                  ساهم في المشروع
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ============================================================ */}
      {/* Action Links                                                 */}
      {/* ============================================================ */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button
          className="btn-omni-primary btn-ripple gap-2 text-base px-6 py-5"
          onClick={() =>
            window.open(
              "https://github.com/bessghiermohamed/albadeel",
              "_blank"
            )
          }
        >
          <Github className="size-5" />
          المشروع على GitHub
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-base px-6 py-5"
          onClick={() =>
            window.open(
              "https://besseghiermohamed.github.io/albadeel/",
              "_blank"
            )
          }
        >
          <ExternalLink className="size-5" />
          زيارة الموقع
        </Button>
      </motion.div>

      {/* ============================================================ */}
      {/* Footer Credits                                               */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="text-center pt-6 pb-2">
        <div className="decorative-line max-w-xs mx-auto mb-4">
          <div className="diamond" />
        </div>
        <p className="text-sm text-muted-foreground">
          صُمم وطوّر بـ <Heart className="size-3.5 inline-block text-omni-red mx-0.5" /> بواسطة{" "}
          <span className="font-semibold text-omni-red">
            Besseghier Mohamed
          </span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          المدرسة العليا للأساتذة — الجزائر © {new Date().getFullYear()}
        </p>
      </motion.div>
    </motion.div>
  );
}
