import { useState, useCallback } from 'react';
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const showSnackbar = useCallback((message: string) => setSnackbar({ open: true, message }), []);
  const closeSnackbar = useCallback(() => setSnackbar((prev) => ({ ...prev, open: false })), []);
  return { snackbar, showSnackbar, closeSnackbar };
};
