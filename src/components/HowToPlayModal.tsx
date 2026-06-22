'use client';

import { useEffect, useRef } from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorblindEnabled: boolean;
  onToggleColorblind: () => void;
}

const LEGEND = [
  { color: 'bg-teal', label: 'Exact match' },
  { color: 'bg-amber', label: 'Partial / overlapping match' },
  { color: 'bg-white/10', label: 'No match' },
  { color: 'bg-blue', label: 'Wrong era — arrow shows direction' },
];

export function HowToPlayModal({
  isOpen,
  onClose,
  colorblindEnabled,
  onToggleColorblind,
}: HowToPlayModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="max-w-md rounded-lg border border-[var(--border)] bg-surface p-6 text-sm text-[var(--text)]"
      >
        <h2 className="mb-3 font-mono text-lg font-bold text-violet">How to Play</h2>
        <p className="mb-4 text-[var(--text2)]">
          Guess the hidden tech entry in 8 tries. Each guess reveals clues across 8 attributes:
          category, paradigm, use case, typing, era, origin, open source, and platform.
        </p>
        <ul className="mb-4 space-y-2">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className={`h-4 w-4 rounded ${item.color}`} />
              <span className="text-[var(--text2)]">{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="mb-2 text-[var(--text2)]">Example guess:</p>
        <div className="grid grid-cols-3 gap-1 text-center text-xs">
          <span className="rounded bg-surface2 px-2 py-1 font-mono font-bold">Python</span>
          <span className="rounded bg-teal/15 px-2 py-1 text-teal">Language</span>
          <span className="rounded bg-amber/15 px-2 py-1 text-amber">Multi-paradigm</span>
        </div>
        <label className="mt-4 flex items-center justify-between gap-3 rounded-md border border-[var(--border)] px-3 py-2 text-xs text-[var(--text2)]">
          <span>Colourblind mode (teal → orange)</span>
          <input
            type="checkbox"
            checked={colorblindEnabled}
            onChange={onToggleColorblind}
            aria-label="Toggle colourblind mode, swaps correct colour from teal to orange"
            className="h-4 w-4 accent-violet"
          />
        </label>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-md bg-surface2 py-2 text-xs font-bold hover:bg-surface3"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
