import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
// Utility types for favorites
export type ColorStop = {
  color: string;
  position: number;
  opacity: number;
};
export type GradientFavorite = {
  type: 'linear' | 'radial' | 'elliptical' | 'conic';
  angle?: number;
  repeating?: boolean;
  colorStops: ColorStop[];
  radialDirection?: string;
  radialSize?: string;
  conicPosition?: { x: number; y: number };
};
export const FAVORITES_KEY = 'gradientor-favorites';
export function addFavorite(gradient: GradientFavorite) {
  const item = window.localStorage.getItem(FAVORITES_KEY);
  const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
  favs.unshift(gradient);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, 50)));
  window.dispatchEvent(new Event('favorites-updated'));
}
import { Drawer } from '@mui/material';
const FavoriteSidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [gradients, setGradients] = React.useState<GradientFavorite[]>([]);
  React.useEffect(() => {
    const fetchGradients = () => {
      try {
        const item = window.localStorage.getItem(FAVORITES_KEY);
        const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
        setGradients(Array.isArray(favs) ? favs : []);
      } catch {
        setGradients([]);
      }
    };
    fetchGradients();
    window.addEventListener('favorites-updated', fetchGradients);
    return () => {
      window.removeEventListener('favorites-updated', fetchGradients);
    };
  }, []);
  const handleRemove = (idx: number) => {
    const item = window.localStorage.getItem(FAVORITES_KEY);
    const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
    favs.splice(idx, 1);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event('favorites-updated'));
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2, position: 'relative', height: '100%' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Favorites
        </Typography>
        <Box>
          {gradients.map((g, idx) => (
            <Card key={idx} sx={{ mb: 2, position: 'relative' }}>
              <CardMedia style={{ position: 'relative', height: '5rem', background: generateGradientCSS(g) }}>
                <Button variant="contained" aria-label="remove favorite" color="error" sx={{ minWidth: 'auto', p: 0.5, position: 'absolute', top: 4, right: 4, zIndex: 2 }} onClick={() => handleRemove(idx)}>
                  <DeleteIcon />
                </Button>
              </CardMedia>
              <CardContent sx={{ mb: -2, px: 2, pt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {g.type} Gradient
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {g.colorStops.map((stop, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: stop.color, borderRadius: '50%', border: '1px solid #ccc' }} />
                      <Typography variant="caption">{stop.position}%</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};
export default FavoriteSidebar;
const generateGradientCSS = (gradient: GradientFavorite): string => {
  const stops = gradient.colorStops
    .sort((a: ColorStop, b: ColorStop) => a.position - b.position)
    .map((stop: ColorStop) => stop.color + ' ' + stop.position + '%')
    .join(', ');
  if (gradient.type === 'linear') return `${gradient.repeating ? 'repeating-linear-gradient' : 'linear-gradient'}(${gradient.angle ?? 90}deg, ${stops})`;
  if (gradient.type === 'radial' || gradient.type === 'elliptical') {
    let dir = gradient.radialDirection || 'center';
    if (dir === 'center') dir = 'at center';
    const size = gradient.radialSize && gradient.radialSize !== 'None' ? gradient.radialSize : '';
    const prefix = gradient.repeating ? 'repeating-radial-gradient' : 'radial-gradient';
    const shape = gradient.type === 'elliptical' ? 'ellipse' : 'circle';
    if (size && dir.startsWith('at ')) return `${prefix}(${shape} ${size} ${dir}, ${stops})`;
    if (size) return `${prefix}(${shape} ${size}, ${stops})`;
    if (dir.startsWith('at ')) return `${prefix}(${shape} ${dir}, ${stops})`;
    return `${prefix}(${shape}, ${stops})`;
  }
  if (gradient.type === 'conic') {
    const pos = gradient.conicPosition || { x: 50, y: 50 };
    const prefix = gradient.repeating ? 'repeating-conic-gradient' : 'conic-gradient';
    return `${prefix}(from ${gradient.angle ?? 0}deg at ${pos.x}% ${pos.y}%, ${stops})`;
  }
  return '';
};
