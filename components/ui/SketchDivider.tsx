/* SketchDivider.tsx — A full-width slightly wavy hand-drawn divider line. */
import React from "react";

interface SketchDividerProps {
  className?: string;
}

export const SketchDivider = ({ className = "" }: SketchDividerProps) => {
  return (
    <div className={`w-full py-1 ${className}`}>
      <svg
        className="w-full h-[3px]"
        preserveAspectRatio="none"
        viewBox="0 0 400 4"
      >
        <path
          d="M 0 2 Q 50 0.5, 100 2 T 200 2 T 300 2 T 400 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-ink/[0.08]"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};
