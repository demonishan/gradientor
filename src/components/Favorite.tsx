import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Typography, Card, CardMedia, CardContent, Button, List, ListItem, ListItemButton, CardActions } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import { Drawer } from '@mui/material';
import { FAVORITES_KEY } from '../modules/favoriteUtils';
import type { GradientFavorite, ColorStop } from '../modules/favoriteUtils';
interface FavoriteProps {
  open: boolean;
  onClose: () => void;
  showSnackbar: (msg: string) => void;
  onGradientSelect: (gradient: GradientFavorite) => void;
}
const Favorite: React.FC<FavoriteProps> = ({ open, onClose, showSnackbar, onGradientSelect }) => {
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
    showSnackbar('Gradient removed from favorites!');
  };
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
                <Card sx={{ width: '100%', m: '0.5rem 1rem' }}>
                  <CardMedia style={{ height: '7.5rem', background: generateGradientCSS(g) }}></CardMedia>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {g.type} Gradient
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {g.colorStops.map((stop, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: stop.color, borderRadius: '50%', border: '1px solid #ccc' }} />
                          <Typography sx={{ fontSize: '0.75rem' }}>{stop.position}%</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        onGradientSelect(g);
                        showSnackbar('Gradient loaded from favorites!');
                        onClose();
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      size="small"
                      color='error'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </ListItem>
            ))}
            <Typography sx={{ fontSize: '0.8rem', p: 0.5, textAlign: 'center', fontStyle: 'italic', opacity: 0.5 }}>
              The favorites are stored in the local storage,
              <br />
              so they may not persist across sessions.
            </Typography>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
export default Favorite;
