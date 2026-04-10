"use client";

import { useEffect, useId, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className = "max-w-2xl",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close modal"
        className="animate-modal-backdrop absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`animate-modal-surface relative z-10 w-full rounded-4xl border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,241,231,0.96)_100%)] p-6 shadow-[0_32px_90px_rgba(15,23,42,0.18)] ${className}`}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id={titleId}
              className="text-2xl font-semibold tracking-tight text-slate-950"
            >
              {title}
            </h3>
            {description ? (
              <p
                id={descriptionId}
                className="mt-2 max-w-2xl text-sm leading-6 text-slate-600"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            aria-label="Close modal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-orange-400 hover:text-orange-700"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
