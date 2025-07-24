import React from 'react';
// Removed local useSnackbar, will use showSnackbar from props
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Typography, Card, CardMedia, CardContent, Button, List, ListItem, ListItemButton } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
import { WidthFull } from '@mui/icons-material';
interface FavoriteProps {
  open: boolean;
  onClose: () => void;
  showSnackbar: (msg: string) => void;
}

const Favorite: React.FC<FavoriteProps> = ({ open, onClose, showSnackbar }) => {
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
    showSnackbar('Gradient removed from favorites');
  };
  return (
    <>
      <Backdrop open={open} onClick={onClose} />
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 320, position: 'relative', height: '100%' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ m: '1rem 1rem 0.5rem' }}>
            Favorites
          </Typography>
          <List sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
            {gradients.map((g, idx) => (
              <ListItem key={idx} sx={{ p: 0 }}>
                <ListItemButton sx={{ p: '0.5rem 1rem 1rem' }}>
                  <Card sx={{ width: '100%', position: 'relative' }}>
                    <CardMedia style={{ position: 'relative', height: '5rem', background: generateGradientCSS(g) }}>
                      <Button variant="contained" aria-label="remove favorite" color="error" sx={{ minWidth: 'auto', p: 0.5, position: 'absolute', top: 4, right: 4, zIndex: 2 }} onClick={() => handleRemove(idx)}>
                        <DeleteIcon />
                      </Button>
                    </CardMedia>
                    <CardContent sx={{ mb: -1, px: 2, pt: 1 }}>
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
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Typography sx={{ fontSize: '0.65rem', p: 0.5, textAlign: 'center', fontStyle: 'italic', opacity: 0.5 }}>The favorites are stored in the local storage, so there's a chance they may not persist across sessions.</Typography>
        </Box>
      </Drawer>
    </>
  );
};
export default Favorite;
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
