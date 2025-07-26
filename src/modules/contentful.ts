/**
 * contentful.ts
 * Module for handling gradient library content (placeholder).
 * Intended for future integration with Contentful or similar CMS.
 */
export const getGradientPresets = async () => {
  const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
  const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  if (!SPACE_ID || !ACCESS_TOKEN) {
    throw new Error('Contentful API credentials are missing.');
  }
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?content_type=gradient&limit=15`;
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
        rawInput: fields.rawInput || 'N/A',
        type: Array.isArray(fields.type) ? fields.type[0] : 'N/A',
        tags: fields.tags || 'N/A',
        angle: fields.angle || 'N/A',
        lightness: fields.lightness || 'N/A',
      };
    });
  }
  return [];
};
