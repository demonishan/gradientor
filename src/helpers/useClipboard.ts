/**
 * React hook to copy text to clipboard using the browser API.
 * @returns Function to copy a string to clipboard
 */
import { useCallback } from 'react';

/**
 * Returns a function that copies the provided text to the clipboard.
 * @returns {(text: string) => Promise<void>} Function to copy text
 */
function useClipboard(): (text: string) => Promise<void> {
  return useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);
}
export default useClipboard;
