import { useCallback } from 'react';
function useClipboard(): (text: string) => Promise<void> {
  return useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);
}
export default useClipboard;
