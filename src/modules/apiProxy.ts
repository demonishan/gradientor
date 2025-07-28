/**
 * Fetch Contentful API keys from the PHP proxy endpoint.
 * @returns Promise resolving to an object with Contentful credentials.
 */
export const fetchContentfulKeys = async (): Promise<{ GRADIENTOR_SPACE_ID: string; GRADIENTOR_ACCESS_TOKEN: string; GRADIENTOR_ENVIRONMENT: string }> => {
  const res = await fetch('https://www.666de666.com/api-proxy/api-proxy.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch Contentful API keys');
  const data = await res.json();
  if (!data.GRADIENTOR_SPACE_ID || !data.GRADIENTOR_ACCESS_TOKEN) throw new Error('Missing Contentful API keys');
  return data;
};
