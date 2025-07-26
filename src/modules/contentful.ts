/**
 * contentful.ts
 * Module for handling gradient library content (placeholder).
 * Intended for future integration with Contentful or similar CMS.
 */
/**
 * Fetch gradient presets from Contentful with pagination support.
 * @param {number} limit - Number of items to fetch per request.
 * @param {number} skip - Number of items to skip (for pagination).
 */
export const getGradientPresets = async (limit: number = 12, skip: number = 0) => {
  const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
  const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  if (!SPACE_ID || !ACCESS_TOKEN) {
    throw new Error('Contentful API credentials are missing.');
  }
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?content_type=gradient&limit=${limit}&skip=${skip}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch gradient presets from Contentful.');
  }
  const data = await res.json();
  if (data && Array.isArray(data.items)) {
    return data.items.map((item: any) => {
      const fields = item.fields || {};
      return {
        id: item.sys?.id,
        title: fields.title || 'N/A',
        rawInput: fields.rawInput.replace(/^background:\s*/, '').replace(/;/, '') || 'N/A',
        type: Array.isArray(fields.type) ? fields.type[0] : 'N/A',
        tags: fields.tags || 'N/A',
        angle: isNaN(fields.angle) ? 0 : fields.angle,
        lightness: fields.lightness || 'N/A',
        colorStops: fields.colorStops || [],
      };
    });
  }
  return [];
};
