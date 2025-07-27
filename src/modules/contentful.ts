export interface GradientPreset {
  id: string;
  title: string;
  tags: string;
  lightness: string;
  colorStops: string[];
  linearGradient: string;
}
export const getGradientPresets = async (limit: number = 20, skip: number = 0): Promise<{ items: GradientPreset[]; total: number }> => {
  const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
  const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  if (!SPACE_ID || !ACCESS_TOKEN) throw new Error('Contentful API credentials are missing.');
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?content_type=gradient&limit=${limit}&skip=${skip}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } });
  if (!res.ok) throw new Error('Failed to fetch gradient presets from Contentful.');
  const data = await res.json();
  const total: number = data.total || 0;
  const items: GradientPreset[] = Array.isArray(data.items)
    ? data.items.map((item: { sys: { id: string }; fields: { title?: string; tags?: string; lightness?: string; colorStops?: any } }) => {
        const fields = item.fields || {};
        const stops = fields.colorStops && typeof fields.colorStops === 'object' && Object.keys(fields.colorStops).length > 0 ? Object.values(fields.colorStops).map((stop: any) => `${stop.color || '#000'} ${typeof stop.position === 'number' ? stop.position + '%' : '0%'}`) : ['#eee 0%', '#ccc 100%'];
        return {
          id: item.sys?.id,
          title: fields.title || 'N/A',
          tags: fields.tags || 'N/A',
          lightness: fields.lightness || 'N/A',
          colorStops: stops,
          linearGradient: `linear-gradient(45deg, ${stops.join(', ')})`,
        };
      })
    : [];
  return { items, total };
};
