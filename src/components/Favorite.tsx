/**
 * `Favorite` component
 *
 * Displays a drawer with a list of favorite gradients stored in `localStorage`.
 * Allows loading and removing gradients, and shows a preview for each.
 *
 * @param {`FavoriteProps`} `props` - The props for the component.
 * @returns {`JSX.Element`} Drawer UI for managing favorite gradients.
 */
import { Box, Typography, Card, CardMedia, CardContent, Button, List, ListItem, CardActions, IconButton, Drawer } from '@mui/material';
import { FAVORITES_KEY } from '../modules';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import type { GradientFavorite, ColorStop } from '../modules';

/**
 * Props for `Favorite` component.
 * @property `open` - Whether the drawer is open.
 * @property `onClose` - Function to close the drawer.
 * @property `showSnackbar` - Function to show a snackbar message.
 * @property `onGradientSelect` - Function to load a selected gradient.
 */
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
        setGradients(JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || `[]`));
      } catch {
        setGradients([]);
      }
    };
    fetchGradients();
    window.addEventListener(`favorites-updated`, fetchGradients);
    return () => window.removeEventListener(`favorites-updated`, fetchGradients);
  }, []);

  /**
   * Removes a gradient from `localStorage` favorites by index.
   * @param {number} `idx` - Index of the gradient to remove.
   */
  const handleRemove = (idx: number) => {
    const favs = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || `[]`);
    favs.splice(idx, 1);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event(`favorites-updated`));
    showSnackbar(`Gradient removed from favorites!`);
  };

  /**
   * Generates a CSS gradient string from a `GradientFavorite` object.
   * @param {`GradientFavorite`} `gradient` - GradientFavorite object.
   * @returns {string} CSS gradient string.
   */
  const generateGradientCSS = (gradient: GradientFavorite): string => {
    const stops = gradient.colorStops
      .sort((a: ColorStop, b: ColorStop) => a.position - b.position)
      .map((stop: ColorStop) => `${stop.color} ${stop.position}%`)
      .join(`, `);
    if (gradient.type === `linear`) return `${gradient.repeating ? `repeating-linear-gradient` : `linear-gradient`}(${gradient.angle ?? 90}deg, ${stops})`;
    if (gradient.type === `radial` || gradient.type === `elliptical`) {
      let dir = gradient.radialDirection || `center`;
      if (dir === `center`) dir = `at center`;
      const size = gradient.radialSize && gradient.radialSize !== `None` ? gradient.radialSize : ``;
      const prefix = gradient.repeating ? `repeating-radial-gradient` : `radial-gradient`;
      const shape = gradient.type === `elliptical` ? `ellipse` : `circle`;
      if (size && dir.startsWith(`at `)) return `${prefix}(${shape} ${size} ${dir}, ${stops})`;
      if (size) return `${prefix}(${shape} ${size}, ${stops})`;
      if (dir.startsWith(`at `)) return `${prefix}(${shape} ${dir}, ${stops})`;
      return `${prefix}(${shape}, ${stops})`;
    }
    if (gradient.type === `conic`) {
      const pos = gradient.conicPosition || { x: 50, y: 50 };
      const prefix = gradient.repeating ? `repeating-conic-gradient` : `conic-gradient`;
      return `${prefix}(from ${gradient.angle ?? 0}deg at ${pos.x}% ${pos.y}%, ${stops})`;
    }
    return ``;
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ bgcolor: `background.paper`, display: `flex`, flexDirection: `column`, width: 320, position: `relative`, height: `100%` }}>
        <IconButton onClick={onClose} sx={{ position: `absolute`, top: 8, right: 8 }} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ m: `1rem 1rem 0.5rem` }}>
          Favorites
        </Typography>
        <List sx={{ overflowY: `auto`, flexGrow: 1, p: 0 }}>
          {gradients.map((g, idx) => (
            <ListItem key={idx} sx={{ p: 0 }}>
              <Card sx={{ width: `100%`, m: `0.5rem 1rem` }}>
                <CardMedia style={{ height: `7.5rem`, background: generateGradientCSS(g) }} />
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom sx={{ textTransform: `capitalize` }}>
                    {g.type} Gradient
                  </Typography>
                  <Box sx={{ display: `flex`, flexWrap: `wrap`, gap: 0.25 }}>
                    {g.colorStops.map((stop, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        <Box sx={{ width: '12px', height: '12px', borderRadius: '2px', border: '1px solid #fff', background: stop.color, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {stop.position}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      onGradientSelect(g);
                      showSnackbar(`Gradient loaded from favorites!`);
                      onClose();
                    }}
                  >
                    Load
                  </Button>
                  <Button size="small" color="error" onClick={() => handleRemove(idx)}>
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>
        <Typography sx={{ fontSize: `0.7rem`, p: 1, textAlign: `center`, fontStyle: `italic`, opacity: 0.5, m: 0 }}>
          The favorites are stored in the local storage,
          <br />
          so they may not persist across sessions.
        </Typography>
      </Box>
    </Drawer>
  );
};
export default Favorite;
