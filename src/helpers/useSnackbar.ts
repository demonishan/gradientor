/**
 * React hook to manage a snackbar's open state and message.
 * @returns Tuple: open state, message, show function, hide function
 */
import { useState, useCallback } from 'react';
function useSnackbar(): [boolean, string, (msg: string) => void, () => void] {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const show = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);
  const hide = useCallback(() => setOpen(false), []);
  return [open, message, show, hide];
}
export default useSnackbar;
