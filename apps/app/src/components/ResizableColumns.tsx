"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  /** initial left width in %, default 33 */
  initial?: number;
  /** localStorage key to persist width */
  storageKey?: string;
  /** min and max left widths in % */
  min?: number;
  max?: number;
};

export default function ResizableColumns({ left, right, initial = 33, storageKey = "layout.split.left", min = 20, max = 60 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftPct, setLeftPct] = useState<number>(() => {
    if (typeof window === "undefined") return initial;
    const v = window.localStorage.getItem(storageKey);
    return v ? Math.min(max, Math.max(min, Number(v))) : initial;
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, String(leftPct));
  }, [leftPct, storageKey]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setLeftPct(Math.min(max, Math.max(min, pct)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, min, max]);

  const leftStyle = useMemo<React.CSSProperties>(() => ({ width: `${leftPct}%` }), [leftPct]);
  const rightStyle = useMemo<React.CSSProperties>(() => ({ width: `${100 - leftPct}%` }), [leftPct]);

  return (
    <div ref={containerRef} className="flex gap-0 items-stretch w-full h-[calc(100vh-180px)] select-none">
      <div className="min-w-[160px] max-w-[70%] h-full" style={leftStyle}>
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize"
        className={`w-1.5 mx-1 rounded bg-border hover:bg-primary/60 cursor-col-resize ${dragging ? "bg-primary/70" : ""}`}
        onMouseDown={onMouseDown}
      />
      <div className="flex-1 h-full" style={rightStyle}>
        {right}
      </div>
    </div>
  );
}


