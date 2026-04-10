"use client";

import { useId, useState, type ReactNode } from "react";

type TooltipProps = {
  content: string;
  children: ReactNode;
};

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      aria-describedby={open ? tooltipId : undefined}
      className="relative inline-flex"
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span
          className="pointer-events-none absolute bottom-[calc(100%+0.7rem)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold tracking-[0.08em] text-white shadow-lg"
          id={tooltipId}
          role="tooltip"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
