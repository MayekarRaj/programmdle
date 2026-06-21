import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — keep default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setAndPersist = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // localStorage unavailable — state still updates in memory
      }
    },
    [key],
  );

  return [value, setAndPersist];
}
