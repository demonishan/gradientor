/**
 * Fetch Contentful API keys from the PHP proxy endpoint.
 * @returns Promise resolving to an object with Contentful credentials.
 */
export const fetchContentfulKeys = async (): Promise<{ SPACE_ID: string; ACCESS_TOKEN: string; ENVIRONMENT: string }> => {
  const res = await fetch('/api/api-proxy.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch Contentful API keys');
  const data = await res.json();
  if (!data.SPACE_ID || !data.ACCESS_TOKEN) throw new Error('Missing Contentful API keys');
  return data;
};