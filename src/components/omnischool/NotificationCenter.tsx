"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, BookOpen, Trophy, Flame, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type NotificationType = "study_reminder" | "achievement" | "streak_warning";

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "الآن";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days === 1) return "منذ يوم";
  if (days === 2) return "منذ يومين";
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسبوع`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  study_reminder: BookOpen,
  achievement: Trophy,
  streak_warning: Flame,
};

const notificationColors: Record<NotificationType, { icon: string; bg: string; border: string }> = {
  study_reminder: {
    icon: "text-omni-gold",
    bg: "bg-omni-gold/10",
    border: "border-omni-gold/20",
  },
  achievement: {
    icon: "text-omni-red",
    bg: "bg-omni-red/10",
    border: "border-omni-red/20",
  },
  streak_warning: {
    icon: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
};

/* ------------------------------------------------------------------ */
/*  Single notification item                                           */
/* ------------------------------------------------------------------ */
function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const Icon = notificationIcons[notification.type];
  const colors = notificationColors[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative rounded-xl p-3 border transition-all duration-200 ${
        notification.read
          ? "bg-muted/30 border-border/50"
          : `${colors.bg} ${colors.border} shadow-sm`
      }`}
      onClick={() => {
        if (!notification.read) onMarkRead(notification.id);
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg} ${colors.border} border`}
        >
          <Icon className={`size-4 ${colors.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-semibold leading-tight ${
                notification.read ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {notification.title}
            </p>
            {/* Unread dot */}
            {!notification.read && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-omni-red mt-1.5" />
            )}
          </div>
          <p
            className={`text-xs mt-0.5 leading-relaxed ${
              notification.read ? "text-muted-foreground/70" : "text-muted-foreground"
            }`}
          >
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground/60">
              {getRelativeTime(notification.createdAt)}
            </span>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(notification.id);
              }}
              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground/50 hover:text-omni-red hover:bg-omni-red/10 transition-colors"
              aria-label="حذف الإشعار"
            >
              <Trash2 className="size-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function NotificationCenter() {
  const {
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    progress,
    studySessions,
    achievements,
  } = useAppStore();

  const [open, setOpen] = useState(false);
  const generatedRef = useRef<Set<string>>(new Set());

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  /* ---- Auto-generate notifications ---- */
  useEffect(() => {
    // Use ref to track already-generated IDs — avoids infinite loops
    const knownIds = generatedRef.current;
    const newNotifications: AppNotification[] = [];

    // 1. Study reminders: subjects not updated in 3+ days
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    progress.forEach((p) => {
      if (p.status === "in_progress") {
        const noteKey = `study_reminder_${p.subjectId}`;
        if (!knownIds.has(noteKey)) {
          // Check if there's been a study session for this subject recently
          const recentSession = studySessions.find(
            (s) => s.subjectId === p.subjectId && new Date(s.date).getTime() > threeDaysAgo
          );
          if (!recentSession) {
            newNotifications.push({
              id: noteKey,
              type: "study_reminder",
              title: "حان وقت المراجعة",
              message: `لم تراجع هذه المادة منذ فترة. حافظ على تقدمك!`,
              read: false,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    });

    // 2. Achievement notifications
    achievements.forEach((a) => {
      const achKey = `achievement_${a.id}`;
      if (!knownIds.has(achKey) && a.unlockedAt) {
        newNotifications.push({
          id: achKey,
          type: "achievement",
          title: "أحرزت إنجاز جديد",
          message: a.title,
          read: false,
          createdAt: a.unlockedAt,
        });
      }
    });

    // 3. Streak warning: no sessions today
    const todayStr = new Date().toDateString();
    const hasSessionToday = studySessions.some(
      (s) => s.completed && new Date(s.date).toDateString() === todayStr
    );
    const streakWarnKey = "streak_warning_today";
    if (!hasSessionToday && studySessions.length > 0 && !knownIds.has(streakWarnKey)) {
      // Only warn if there are study sessions at all (user is active)
      const lastSession = studySessions
        .filter((s) => s.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      if (lastSession) {
        const lastDate = new Date(lastSession.date);
        const diffDays = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 1) {
          newNotifications.push({
            id: streakWarnKey,
            type: "streak_warning",
            title: "سلسلتك الدراسية في خطر!",
            message: "حافظ عليها بإنهاء جلسة دراسية اليوم",
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Add new notifications
    if (newNotifications.length > 0) {
      newNotifications.forEach((n) => {
        generatedRef.current.add(n.id);
        addNotification(n);
      });
    }
  }, [progress, studySessions, achievements, addNotification]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead();
  }, [markAllNotificationsRead]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden"
          aria-label="الإشعارات"
        >
          <motion.div
            key={`bell-${unreadCount}`}
            initial={unreadCount > 0 ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Bell className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
          </motion.div>

          {/* Badge count */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] rounded-full bg-omni-red text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-sm"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 glass-strong border-border shadow-xl rounded-xl overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-omni-red" />
            <h3 className="text-sm font-bold text-foreground">الإشعارات</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-omni-red/10 text-omni-red">
                {unreadCount} جديد
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-omni-gold hover:text-omni-gold-dark transition-colors"
            >
              <CheckCheck className="size-3.5" />
              قراءة الكل
            </motion.button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-muted border border-border">
                <Bell className="size-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">لا توجد إشعارات</p>
              <p className="text-[11px] text-muted-foreground/60">ستظهر هنا تنبيهات الدراسة والإنجازات</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markNotificationRead}
                    onRemove={removeNotification}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-border bg-muted/10 text-center">
            <p className="text-[10px] text-muted-foreground/60">
              {notifications.length} إشعار • {unreadCount} غير مقروء
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
