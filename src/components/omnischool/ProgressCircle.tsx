"use client";

import { motion } from "framer-motion";

interface ProgressCircleProps {
  /** Progress percentage 0-100 */
  percentage: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color of the progress arc */
  color?: string;
  /** Background track color */
  trackColor?: string;
  /** Whether to show the percentage text in the center */
  showText?: boolean;
  /** Font size of the percentage text */
  textSize?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Additional CSS class */
  className?: string;
}

export function ProgressCircle({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#B91C1C",
  trackColor = "rgba(185, 28, 28, 0.1)",
  showText = true,
  textSize = 18,
  delay = 0,
  className = "",
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay,
          }}
        />
      </svg>
      {showText && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{ fontSize: textSize, color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
}
