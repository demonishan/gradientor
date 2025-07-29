/**
 * Fetches Contentful API keys for the Gradientor app.
 *
 * - In local development (localhost/127.0.0.1), reads keys from Vite environment variables.
 * - In production, fetches keys from a remote PHP proxy endpoint.
 *
 * @returns {Promise<{ GRADIENTOR_SPACE_ID: string; GRADIENTOR_ACCESS_TOKEN: string; GRADIENTOR_ENVIRONMENT: string }>}
 *   Resolves with an object containing Contentful space ID, access token, and environment name.
 * @throws {Error}
 *   Throws if the request fails, or if any required keys are missing in either environment.
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
