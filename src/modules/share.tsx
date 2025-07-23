// share.ts
// Module for sharing gradients or generating shareable links

export const generateShareLink = (gradientConfig) => {
  // Example: encode gradient config as a base64 string
  const encoded = btoa(JSON.stringify(gradientConfig));
  return `${window.location.origin}/?gradient=${encoded}`;
};

export const parseShareLink = (url) => {
  const params = new URL(url).searchParams;
  const encoded = params.get('gradient');
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
};
