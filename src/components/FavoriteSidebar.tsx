import React from 'react';
// Utility types for favorites
export interface ColorStop {
  color: string;
  position: number;
  opacity: number;
}
export interface GradientFavorite {
  type: 'linear' | 'radial' | 'elliptical' | 'conic';
  angle?: number;
  repeating?: boolean;
  colorStops: ColorStop[];
  radialDirection?: string;
  radialSize?: string;
  conicPosition?: { x: number; y: number };
}
export const FAVORITES_KEY = 'gradientor-favorites';
export function addFavorite(gradient: GradientFavorite) {
  const item = window.localStorage.getItem(FAVORITES_KEY);
  const favs: GradientFavorite[] = item ? JSON.parse(item) : [];
  favs.unshift(gradient);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, 50)));
  window.dispatchEvent(new Event('favorites-updated'));
}
import { Drawer, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface FavoriteSidebarProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
const FavoriteSidebar: React.FC<FavoriteSidebarProps> = ({ open, onClose, children }) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <Box sx={{ width: 320, p: 2, position: 'relative', height: '100%' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} aria-label="close">
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Favorites
      </Typography>
      {children}
    </Box>
  </Drawer>
);
export default FavoriteSidebar;
