/**
 * React hook to debounce a callback and optionally disable a button during the delay.
 * @template T Function type
 * @param {T} callback Function to debounce
 * @param {React.RefObject<HTMLButtonElement | null>} [buttonRef] Optional ref to a button to disable during debounce
 * @returns {T} Debounced callback function
 */
import { useRef, useCallback } from 'react';
const useDebounce = <T extends (...args: unknown[]) => void>(callback: T, buttonRef?: React.RefObject<HTMLButtonElement | null>): T => {
  const lastCalled = useRef(0);
  const delay = 2500;
  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCalled.current < delay) return;
      lastCalled.current = now;
      if (buttonRef?.current) {
        buttonRef.current.disabled = true;
        setTimeout(() => {
          if (buttonRef.current) buttonRef.current.disabled = false;
        }, delay);
      }
      callback(...args);
    },
    [callback, buttonRef],
  ) as T;
};
export default useDebounce;
