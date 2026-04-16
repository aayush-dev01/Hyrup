/* SessionBlock.tsx — Calendar session block rendered as a filled ink rectangle. */
"use client";

import React from "react";

interface SessionBlockProps {
  learnerName: string;
  topic: string;
  startHour: number;
  endHour: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const SessionBlock = ({
  learnerName,
  topic,
  startHour,
  endHour,
  isActive = false,
  onClick,
}: SessionBlockProps) => {
  const duration = endHour - startHour;
  const height = duration * 60; // 60px per hour
  const top = (startHour - 7) * 60; // offset from 7AM

  return (
    <div
      onClick={onClick}
      className={`absolute left-1 right-1 rounded-sm cursor-pointer transition-opacity ${
        isActive ? "bg-ink" : "bg-ink/90 hover:bg-ink"
      }`}
      style={{ top: `${top}px`, height: `${height}px`, minHeight: "48px" }}
    >
      <div className="px-2 py-1.5 overflow-hidden h-full flex flex-col justify-center">
        <span className="font-hand text-[13px] text-warm-white leading-tight truncate">
          {learnerName}
        </span>
        <span className="text-[11px] text-warm-white/80 font-sans leading-tight truncate">
          {topic}
        </span>
      </div>
    </div>
  );
};
