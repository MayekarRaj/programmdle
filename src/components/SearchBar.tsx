'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { TECH_DATA } from '@/data';
import type { TechEntry } from '@/types';

interface SearchBarProps {
  onGuess: (name: string) => void;
  guessedIds: Set<number>;
  disabled: boolean;
}

const MAX_RESULTS = 10;

function highlightMatch(name: string, query: string) {
  if (!query) return name;
  const index = name.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return name;

  const before = name.slice(0, index);
  const match = name.slice(index, index + query.length);
  const after = name.slice(index + query.length);

  return (
    <>
      {before}
      <span className="text-violet">{match}</span>
      {after}
    </>
  );
}

export function SearchBar({ onGuess, guessedIds, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<TechEntry[]>(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return TECH_DATA.filter(
      (entry) => !guessedIds.has(entry.id) && entry.name.toLowerCase().includes(lowerQuery),
    ).slice(0, MAX_RESULTS);
  }, [query, guessedIds]);

  useEffect(() => {
    setHighlightIndex(0);
    setIsOpen(results.length > 0);
  }, [results]);

  const submit = (entry?: TechEntry) => {
    const target = entry ?? (results.length === 1 ? results[0] : results[highlightIndex]);
    if (!target) return;
    onGuess(target.name);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        placeholder="Guess a language, framework, or tool..."
        aria-label="Guess a language, framework, or tool"
        role="combobox"
        aria-expanded={isOpen && results.length > 0}
        aria-controls="search-results-listbox"
        aria-autocomplete="list"
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(results.length > 0)}
        className="w-full rounded-md border border-[var(--border)] bg-surface px-3 py-2 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-violet/40 focus:border-violet focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15),0_0_16px_rgba(124,106,247,0.18)] disabled:opacity-50"
      />
      {isOpen && results.length > 0 && (
        <ul
          id="search-results-listbox"
          role="listbox"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-[var(--border)] bg-surface2 shadow-lg"
        >
          {results.map((entry, index) => (
            <li key={entry.id} role="option" aria-selected={index === highlightIndex}>
              <button
                type="button"
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => submit(entry)}
                aria-label={`Guess ${entry.name}, ${entry.category}`}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                  index === highlightIndex ? 'bg-surface3' : ''
                }`}
              >
                <span>{highlightMatch(entry.name, query)}</span>
                <span className="rounded bg-surface3 px-2 py-0.5 text-[10px] uppercase text-[var(--text2)]">
                  {entry.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
