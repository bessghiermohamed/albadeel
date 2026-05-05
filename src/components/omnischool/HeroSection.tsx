"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Layers,
  Tag,
  Share2,
  ArrowLeft,
  LayoutDashboard,
  CalendarClock,
  Timer,
  Compass,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, type FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */
const STATS = [
  { icon: BookOpen, value: "24", label: "مادة" },
  { icon: Layers, value: "2", label: "سداسي" },
  { icon: Tag, value: "7", label: "تصنيفات" },
  { icon: Share2, value: "10", label: "مواد مشتركة" },
] as const;

/* ------------------------------------------------------------------ */
/*  Quick actions data                                                 */
/* ------------------------------------------------------------------ */
const QUICK_ACTIONS = [
  {
    icon: Compass,
    label: "تصفح المواد",
    view: "subjects" as const,
    gradient: "from-red-600/20 to-red-800/10",
    border: "border-red-400/30 hover:border-red-400/60",
    iconColor: "text-red-300",
  },
  {
    icon: LayoutDashboard,
    label: "لوحة المتعلم",
    view: "dashboard" as const,
    gradient: "from-amber-500/20 to-amber-700/10",
    border: "border-amber-400/30 hover:border-amber-400/60",
    iconColor: "text-amber-300",
  },
  {
    icon: CalendarClock,
    label: "مخطط الدراسة",
    view: "planner" as const,
    gradient: "from-emerald-500/20 to-emerald-700/10",
    border: "border-emerald-400/30 hover:border-emerald-400/60",
    iconColor: "text-emerald-300",
  },
  {
    icon: Timer,
    label: "مؤقت بومودورو",
    view: "timer" as const,
    gradient: "from-purple-500/20 to-purple-700/10",
    border: "border-purple-400/30 hover:border-purple-400/60",
    iconColor: "text-purple-300",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Floating decorative particle                                       */
/* ------------------------------------------------------------------ */
function FloatingDot({
  size,
  top,
  left,
  delay,
  opacity = 20,
}: {
  size: number;
  top: string;
  left: string;
  delay: number;
  opacity?: number;
}) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full bg-omni-gold"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity: opacity / 100,
      }}
      animate={{
        y: [0, -14, 0],
        opacity: [opacity / 100, (opacity + 20) / 100, opacity / 100],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay * 0.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Floating diamond shape                                             */
/* ------------------------------------------------------------------ */
function FloatingDiamond({
  size,
  top,
  left,
  delay,
  opacity = 15,
}: {
  size: number;
  top: string;
  left: string;
  delay: number;
  opacity?: number;
}) {
  return (
    <motion.span
      className="pointer-events-none absolute bg-omni-gold rotate-45"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity: opacity / 100,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [45, 90, 45],
        opacity: [opacity / 100, (opacity + 10) / 100, opacity / 100],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Geometric pattern line                                             */
/* ------------------------------------------------------------------ */
function GeometricLine({
  top,
  left,
  width,
  rotate,
  delay,
}: {
  top: string;
  left: string;
  width: number;
  rotate: number;
  delay: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute h-px"
      style={{
        top,
        left,
        width,
        rotate: `${rotate}deg`,
        background:
          "linear-gradient(90deg, transparent, rgba(212,168,67,0.12), rgba(212,168,67,0.25), rgba(212,168,67,0.12), transparent)",
      }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Arabic Ornamental Divider                                          */
/* ------------------------------------------------------------------ */
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-omni-gold/50 to-transparent" />
      <div className="flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-omni-gold/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-omni-gold/60" />
        <span className="w-2.5 h-2.5 bg-omni-gold/80 rotate-45" />
        <span className="w-1.5 h-1.5 rounded-full bg-omni-gold/60" />
        <span className="w-1 h-1 rounded-full bg-omni-gold/40" />
      </div>
      <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-omni-gold/50 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const { setView, setSearchQuery } = useAppStore();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      setView("search");
    }
  };

  /* Container variants for staggered children */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="gradient-hero relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-24 sm:py-32">
      {/* ---- Gold radial glow overlay ---- */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 40% 30%, rgba(212,168,67,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Secondary warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 70% 60%, rgba(185,28,28,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ---- Layer 1: Floating dots (primary) ---- */}
      <FloatingDot size={10} top="12%" left="10%" delay={0} opacity={20} />
      <FloatingDot size={6} top="22%" left="80%" delay={0.8} opacity={15} />
      <FloatingDot size={14} top="65%" left="15%" delay={1.6} opacity={12} />
      <FloatingDot size={8} top="75%" left="85%" delay={2.4} opacity={18} />
      <FloatingDot size={12} top="35%" left="90%" delay={0.4} opacity={14} />
      <FloatingDot size={6} top="85%" left="50%" delay={1.2} opacity={16} />
      <FloatingDot size={10} top="8%" left="55%" delay={2.0} opacity={20} />
      <FloatingDot size={8} top="50%" left="5%" delay={3.0} opacity={12} />

      {/* ---- Layer 2: Floating diamonds ---- */}
      <FloatingDiamond size={8} top="18%" left="20%" delay={0.5} opacity={12} />
      <FloatingDiamond size={6} top="30%" left="75%" delay={1.2} opacity={10} />
      <FloatingDiamond size={10} top="70%" left="25%" delay={2.0} opacity={8} />
      <FloatingDiamond size={5} top="55%" left="88%" delay={0.8} opacity={14} />
      <FloatingDiamond size={7} top="80%" left="65%" delay={1.5} opacity={10} />
      <FloatingDiamond size={9} top="15%" left="70%" delay={2.5} opacity={8} />

      {/* ---- Layer 3: Geometric pattern lines ---- */}
      <GeometricLine top="25%" left="5%" width={120} rotate={-15} delay={0} />
      <GeometricLine top="60%" left="80%" width={100} rotate={25} delay={1.5} />
      <GeometricLine top="40%" left="70%" width={80} rotate={-30} delay={2.5} />
      <GeometricLine top="80%" left="10%" width={140} rotate={10} delay={0.8} />

      {/* ---- Layer 4: Additional subtle dots (deeper layer) ---- */}
      <FloatingDot size={4} top="20%" left="40%" delay={1.0} opacity={8} />
      <FloatingDot size={5} top="45%" left="60%" delay={2.2} opacity={6} />
      <FloatingDot size={3} top="70%" left="45%" delay={0.3} opacity={10} />
      <FloatingDot size={4} top="90%" left="30%" delay={1.8} opacity={7} />
      <FloatingDot size={5} top="10%" left="85%" delay={2.8} opacity={9} />

      {/* ---- Content ---- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        {/* Title with text shadow — even larger and more impactful */}
        <motion.h1
          variants={itemVariants}
          className="text-shadow-omni mb-1 text-6xl font-extrabold leading-none tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
        >
          ال
          <span className="bg-gradient-to-l from-omni-gold via-omni-gold-light to-omni-gold bg-clip-text text-transparent">
            بديل
          </span>
        </motion.h1>

        {/* Ornamental divider */}
        <motion.div variants={itemVariants}>
          <OrnamentalDivider />
        </motion.div>

        {/* Tagline — more compelling */}
        <motion.p
          variants={itemVariants}
          className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl leading-relaxed"
        >
          رحلتك الأكاديمية تبدأ هنا
        </motion.p>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-3 text-base font-medium text-white/85 sm:text-lg leading-loose"
        >
          منصة تعليمية متكاملة لطلبة المدرسة العليا للأساتذة
        </motion.p>

        {/* Sub-subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-10 text-sm text-omni-gold-light/70 sm:text-base"
        >
          فرع PEP — تخصص الأدب العربي
        </motion.p>

        {/* Search bar with glowing border effect on focus */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearch}
          className="relative mb-8 w-full max-w-2xl"
        >
          {/* Animated glow ring behind the search bar */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-0 blur-md"
            animate={{
              opacity: searchFocused ? 0.6 : 0,
              background: searchFocused
                ? "linear-gradient(135deg, rgba(212,168,67,0.5), rgba(185,28,28,0.4), rgba(212,168,67,0.5))"
                : "transparent",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <div
            className={`relative glass-strong flex items-center rounded-2xl border shadow-lg transition-all duration-300 ${
              searchFocused
                ? "border-omni-gold/60 shadow-[0_0_30px_rgba(212,168,67,0.25)]"
                : "border-white/20 shadow-lg"
            }`}
          >
            <Search
              className={`ms-5 size-5 shrink-0 transition-colors duration-300 ${
                searchFocused ? "text-omni-gold" : "text-white/50"
              }`}
            />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="ابحث عن مادة، تصنيف، أو كود..."
              className="h-16 border-0 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-0 shadow-none px-4"
            />
            <button
              type="submit"
              className="group relative ms-2 me-3 flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-l from-omni-red to-omni-red-dark px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-omni-red/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700" />
              <span className="relative">بحث</span>
              <ArrowLeft className="relative size-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </motion.form>

        {/* Stats row — enhanced pills with depth */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="glass-gold flex items-center gap-2.5 rounded-full px-5 py-2.5 sm:px-7 sm:py-3 border border-omni-gold/20 hover:border-omni-gold/50 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300"
              >
                <Icon className="size-4 text-omni-gold" />
                <span className="text-xl font-extrabold text-white tracking-wide">
                  {stat.value}
                </span>
                <span className="text-sm text-white/70 font-medium">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setView(action.view)}
                className={`group flex items-center gap-2.5 rounded-xl px-5 py-3 sm:px-6 sm:py-3.5 border bg-gradient-to-b backdrop-blur-md shadow-md shadow-black/10 transition-all duration-300 ${action.gradient} ${action.border}`}
              >
                <Icon
                  className={`size-5 transition-transform duration-300 group-hover:scale-110 ${action.iconColor}`}
                />
                <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ---- Enhanced Multi-layer wave divider ---- */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Top fade layer */}
        <div className="absolute bottom-28 left-0 right-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent opacity-20" />

        {/* Wave layer 3 (back, lightest) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-28 opacity-30"
        >
          <path
            fill="var(--background)"
            d="M0,60 C240,20 480,80 720,50 C960,20 1200,70 1440,40 L1440,100 L0,100 Z"
          />
        </svg>

        {/* Wave layer 2 (middle, medium opacity) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-20 sm:h-24 opacity-60"
        >
          <path
            fill="var(--background)"
            d="M0,50 C180,30 360,70 540,45 C720,20 900,65 1080,50 C1260,35 1380,55 1440,45 L1440,100 L0,100 Z"
          />
        </svg>

        {/* Wave layer 1 (front, full opacity) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="relative w-full h-16 sm:h-20"
        >
          <path
            fill="var(--background)"
            d="M0,48L48,45.3C96,43,192,37,288,37.3C384,37,480,43,576,48C672,53,768,59,864,56C960,53,1056,43,1152,40C1248,37,1344,43,1392,45.3L1440,48L1440,80L0,80Z"
          />
        </svg>
      </div>
    </section>
  );
}
