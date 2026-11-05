"use client";

import { useState } from "react";
import { Grade, GRADE_COLOR, GRADE_SHARE } from "@/lib/seed";

// Image with a graceful fallback to a tinted plate if the photo fails to load,
// so a broken URL never shows a broken-image icon in the demo.
export function SmartImage({
  src,
  alt,
  tint,
  className = "",
}: {
  src: string;
  alt: string;
  tint: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: tint }}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

export function GradeBadge({ grade, eur }: { grade: Grade; eur?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-sm px-3 py-1.5 text-white">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: GRADE_COLOR[grade], boxShadow: `0 0 10px ${GRADE_COLOR[grade]}` }}
      />
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em]">
        {grade} · {GRADE_SHARE[grade]} to local housing
      </span>
      {eur && <span className="font-mono text-[0.68rem] opacity-80">· {eur} so far</span>}
    </div>
  );
}

export function GradeChip({
  grade,
  active,
  onClick,
}: {
  grade: Grade | "All";
  active: boolean;
  onClick: () => void;
}) {
  const color = grade === "All" ? "var(--ink)" : GRADE_COLOR[grade];
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[0.72rem] uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors ${
        active ? "text-paper" : "text-ink hover:bg-paper-deep"
      }`}
      style={{ backgroundColor: active ? color : "transparent", borderColor: color }}
    >
      {grade === "All" ? "All" : `${grade} · ${GRADE_SHARE[grade as Grade]}`}
    </button>
  );
}
