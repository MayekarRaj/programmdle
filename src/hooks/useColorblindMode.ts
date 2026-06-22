'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pgmdle-colorblind';

export function useColorblindMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('colorblind', enabled);
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { enabled, toggle };
}
