/* AvatarSVG.tsx — Deterministic hand-drawn face avatar generated from a seed string. */
import React from "react";

interface AvatarSVGProps {
  seed: string;
  size?: number;
  className?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export const AvatarSVG = ({ seed, size = 48, className = "" }: AvatarSVGProps) => {
  const h = hashCode(seed);
  const eyeY = 38 + (h % 5);
  const eyeSpacing = 12 + (h % 6);
  const mouthCurve = 58 + (h % 8);
  const mouthWidth = 8 + (h % 6);
  const headSquish = 30 + (h % 8);
  const hairStyle = h % 4;
  const browTilt = (h % 3) - 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`text-ink ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head */}
      <ellipse cx="50" cy="52" rx={headSquish} ry="34" />

      {/* Hair variations */}
      {hairStyle === 0 && (
        <path d={`M ${50 - headSquish + 2} 30 Q 50 ${10 + (h % 8)} ${50 + headSquish - 2} 30`} />
      )}
      {hairStyle === 1 && (
        <>
          <path d={`M ${50 - headSquish + 5} 28 Q 40 12 50 18 Q 60 12 ${50 + headSquish - 5} 28`} />
          <path d={`M 42 20 Q 45 14 50 18`} />
        </>
      )}
      {hairStyle === 2 && (
        <path d={`M ${50 - headSquish} 40 Q ${50 - headSquish - 3} 20 50 ${14 + (h % 5)} Q ${50 + headSquish + 3} 20 ${50 + headSquish} 40`} />
      )}
      {hairStyle === 3 && (
        <>
          <path d={`M ${50 - headSquish + 2} 32 C 35 10, 65 10, ${50 + headSquish - 2} 32`} />
          <line x1="45" y1="18" x2="43" y2="22" />
          <line x1="55" y1="18" x2="57" y2="22" />
        </>
      )}

      {/* Eyes */}
      <circle cx={50 - eyeSpacing / 2} cy={eyeY} r="2.5" fill="currentColor" stroke="none" />
      <circle cx={50 + eyeSpacing / 2} cy={eyeY} r="2.5" fill="currentColor" stroke="none" />

      {/* Brows */}
      <line
        x1={50 - eyeSpacing / 2 - 4}
        y1={eyeY - 6 + browTilt}
        x2={50 - eyeSpacing / 2 + 4}
        y2={eyeY - 6 - browTilt}
      />
      <line
        x1={50 + eyeSpacing / 2 - 4}
        y1={eyeY - 6 - browTilt}
        x2={50 + eyeSpacing / 2 + 4}
        y2={eyeY - 6 + browTilt}
      />

      {/* Mouth */}
      <path
        d={`M ${50 - mouthWidth} ${mouthCurve} Q 50 ${mouthCurve + 6 + (h % 4)} ${50 + mouthWidth} ${mouthCurve}`}
      />
    </svg>
  );
};
