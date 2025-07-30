/**
 * React hook to persist state in localStorage.
 * @template T State type
 * @param {string} key Storage key
 * @param {T} initialValue Initial value if nothing is stored
 * @returns {[T, (v: T) => void]} Tuple of value and setter function
 */
import { useState } from 'react';
function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setStoredValue = (v: T) => {
    setValue(v);
    window.localStorage.setItem(key, JSON.stringify(v));
  };
  return [value, setStoredValue];
}
export default useLocalStorage;
