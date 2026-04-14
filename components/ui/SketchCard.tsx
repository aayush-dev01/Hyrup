/* SketchCard.tsx — A card with a hand-drawn SVG border overlay and subtle tilt. */
"use client";

import React from "react";
import { motion } from "framer-motion";

interface SketchCardProps {
  children: React.ReactNode;
  tilt?: number;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button";
}

export const SketchCard = ({
  children,
  tilt = 0,
  className = "",
  onClick,
  as = "div",
}: SketchCardProps) => {
  const Component = as === "button" ? motion.button : motion.div;

  return (
    <Component
      className={`relative ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
      whileHover={{
        y: -4,
        rotate: 0,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      onClick={onClick}
    >
      {children}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 200 200"
      >
        <motion.path
          d="M 4 6 C 40 3, 160 2, 196 5 C 198 40, 197 160, 195 195 C 160 198, 40 197, 5 194 C 2 160, 3 40, 4 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink/[0.15]"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.92 }}
          whileHover={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </Component>
  );
};
