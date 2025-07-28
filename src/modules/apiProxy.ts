/**
 * Fetches Contentful API keys from the PHP proxy endpoint (production) or Vite env (local).
 * @returns {Promise<{ GRADIENTOR_SPACE_ID: string; GRADIENTOR_ACCESS_TOKEN: string; GRADIENTOR_ENVIRONMENT: string }>}
 * @throws {Error} If the request fails or keys are missing.
 */
export const fetchContentfulKeys = async (): Promise<{ GRADIENTOR_SPACE_ID: string; GRADIENTOR_ACCESS_TOKEN: string; GRADIENTOR_ENVIRONMENT: string }> => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const GRADIENTOR_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const GRADIENTOR_ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
    const GRADIENTOR_ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
    if (!GRADIENTOR_SPACE_ID || !GRADIENTOR_ACCESS_TOKEN) throw new Error('Missing Contentful API keys');
    return { GRADIENTOR_SPACE_ID, GRADIENTOR_ACCESS_TOKEN, GRADIENTOR_ENVIRONMENT };
  } else {
    const res = await fetch('https://www.666de666.com/api-proxy/api-proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch Contentful API keys');
    const data = await res.json();
    if (!data.GRADIENTOR_SPACE_ID || !data.GRADIENTOR_ACCESS_TOKEN) throw new Error('Missing Contentful API keys');
    return data;
  }
};
