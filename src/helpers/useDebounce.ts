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
