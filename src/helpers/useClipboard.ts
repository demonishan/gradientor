/**
 * React hook to copy text to clipboard using the browser API.
 * @returns Function to copy a string to clipboard
 */
import { useCallback } from 'react';
function useClipboard(): (text: string) => Promise<void> {
  return useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);
}
export default useClipboard;
