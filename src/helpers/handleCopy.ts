export const copyToClipboard = async (text: string): Promise<boolean> =>
  !navigator?.clipboard
    ? false
    : navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);
export const handleCopy = (text: string) => copyToClipboard(text);
