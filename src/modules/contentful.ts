/**
 * Represents a gradient preset fetched from Contentful.
 * @property id - Unique identifier for the preset.
 * @property title - Preset title.
 * @property tags - Comma-separated tags.
 * @property lightness - Lightness value.
 * @property colorStops - Array of color stops as CSS strings.
 * @property linearGradient - CSS linear-gradient string.
 */
export interface GradientPreset {
  id: string;
  title: string;
  tags: string;
  lightness: string;
  colorStops: string[];
  linearGradient: string;
}

/**
 * Fetches gradient presets from Contentful API.
 * @param limit - Number of presets to fetch.
 * @param skip - Number of presets to skip (for pagination).
 * @returns Object containing array of GradientPreset and total count.
 */
export const getGradientPresets = async (limit: number = 20, skip: number = 0): Promise<{ items: GradientPreset[]; total: number }> => {
  const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID,
    ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
    ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  if (!SPACE_ID || !ACCESS_TOKEN) throw new Error('Contentful API credentials are missing.');
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?content_type=gradient&limit=${limit}&skip=${skip}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } });
  if (!res.ok) throw new Error('Failed to fetch gradient presets from Contentful.');
  const data = await res.json();
  const total: number = data.total || 0;
  const items: GradientPreset[] = Array.isArray(data.items)
    ? data.items.map((item: { sys: { id: string }; fields: { title?: string; tags?: string; lightness?: string; colorStops?: Record<string, { color?: string; position?: number }> } }) => {
        const f = item.fields || {},
          s =
            f.colorStops && typeof f.colorStops === 'object' && Object.keys(f.colorStops).length > 0
              ? Object.values(f.colorStops).map(
                  (st: { color?: string; position?: number }) => `${st.color || '#000'} 
          ${typeof st.position === 'number' ? st.position + '%' : '0%'}`,
                )
              : ['#eee 0%', '#ccc 100%'];
        return {
          id: item.sys?.id,
          title: f.title || 'N/A',
          tags: f.tags || 'N/A',
          lightness: f.lightness || 'N/A',
          colorStops: s,
          linearGradient: `linear-gradient(45deg, ${s.join(', ')})`,
        };
      })
    : [];
  return { items, total };
};
