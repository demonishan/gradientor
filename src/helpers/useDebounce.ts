import { useRef, useCallback } from 'react';
const useDebounce = <T extends (...args: any[]) => void>(callback: T, buttonRef?: React.RefObject<{ disabled: boolean }>): T => {
  const lastCalled = useRef(0);
  const delay = 2000;
  return useCallback(
    (...args: any[]) => {
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
