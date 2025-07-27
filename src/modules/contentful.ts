export const getGradientPresets = async (limit: number = 20, skip: number = 0) => {
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
  if (!res.ok) throw new Error('Failed to fetch gradient presets from Contentful.');
  const data = await res.json();
  const total = data.total || 0;
  interface GradientPreset {
    id: string;
    title: string;
    rawInput: string;
    type: string;
    tags: string;
    angle: number;
    lightness: string;
    colorStops: string[];
  }
  let items: GradientPreset[] = [];
  if (data && Array.isArray(data.items)) {
    items = data.items.map(
      (item: {
        sys: { id: string };
        fields: {
          title?: string;
          rawInput: string;
          type?: string[] | string;
          tags?: string;
          angle?: number;
          lightness?: string;
          colorStops?: string[];
        };
      }) => {
        const fields = item.fields || {};
        return {
          id: item.sys?.id,
          title: fields.title || 'N/A',
          rawInput: fields.rawInput.replace(/^background:\s*/, '').replace(/;/, '') || 'N/A',
          type: Array.isArray(fields.type) ? fields.type[0] : 'N/A',
          tags: fields.tags || 'N/A',
          angle: isNaN(fields.angle ?? NaN) ? 0 : fields.angle ?? 0,
          lightness: fields.lightness || 'N/A',
          colorStops: Array.isArray(fields.colorStops) ? fields.colorStops : [],
        };
      },
    );
  }
  return { items, total };
};
