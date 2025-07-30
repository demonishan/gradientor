import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Badge, Box, Button, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import { DarkModeOutlined as DarkModeOutlinedIcon, FavoriteBorder as FavoriteBorderIcon, LightModeOutlined as LightModeOutlinedIcon, Menu as MenuIcon } from '@mui/icons-material';
import { generateRandomGradient } from '../modules';
import type { ColorStop } from '../modules';
import { useDebounce } from '../helpers';
import logo from '../assets/logo.webp';
import ImportGradient from './ImportGradient';
import Favorite from './Favorite';
/**
 * Header component for the app bar and main controls.
 * @param darkMode Current dark mode state
 * @param setDarkMode Function to toggle dark mode
 * @param showSnackbar Function to show snackbar messages
 * @param setGradient Function to set the current gradient
 */
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showSnackbar: (msg: string) => void;
  setGradient: (g: any) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, showSnackbar, setGradient }) => {
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  useEffect(() => {
    const updateCount = () => {
      try {
        const favs = JSON.parse(window.localStorage.getItem('gradientor-favorites') || '[]');
        setFavoriteCount(Array.isArray(favs) ? favs.length : 0);
      } catch {
        setFavoriteCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('favorites-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('favorites-updated', updateCount);
    };
  }, []);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = !!anchorEl;
  const randomButtonRef = useRef<HTMLButtonElement | null>(null);
  const darkModeButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleToggleDarkMode = useDebounce(() => {
    setDarkMode(!darkMode);
    showSnackbar(!darkMode ? 'Switched to dark mode!' : 'Switched to light mode!');
  }, darkModeButtonRef);
  const debouncedRandomGradient = useDebounce(() => {
    setGradient(generateRandomGradient());
    showSnackbar('Random gradient generated!');
    handleMenuClose();
  }, randomButtonRef);
  const [importOpen, setImportOpen] = useState(false);
  const menuItems = [
    { label: 'Import', onClick: () => setImportOpen(true) },
    { label: 'Random Gradient', onClick: debouncedRandomGradient, buttonRef: randomButtonRef },
  ];
  return (
    <>
      <AppBar position="static" sx={{ '--Paper-overlay': 'none !important', boxShadow: 1 }}>
        <Toolbar>
          <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1, gap: 2 }}>
            {menuItems.map((item, idx) => (
              <Button component="button" color="inherit" key={idx} ref={item.buttonRef} onClick={item.onClick} sx={{ minWidth: 'auto' }} aria-label={item.label}>
                {item.label}
              </Button>
            ))}
          </Box>
          <Button component="button" color="inherit" onClick={() => setFavoriteOpen(true)} sx={{ minWidth: 'auto' }} aria-label="Open favorites">
            <Badge badgeContent={favoriteCount} max={99} color="secondary">
              <FavoriteBorderIcon aria-label="Open favorites" />
            </Badge>
          </Button>
          <Button component="button" color="inherit" ref={darkModeButtonRef} onClick={handleToggleDarkMode} sx={{ minWidth: 'auto' }} aria-label="Toggle dark mode">
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </Button>
          <IconButton color="inherit" aria-label="open menu" onClick={handleMenuOpen} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            {menuItems.map((item, idx) => (
              <MenuItem color="inherit" key={idx} onClick={item.onClick}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <ImportGradient
        open={importOpen}
        onClose={(errMsg) => {
          setImportOpen(false);
          if (errMsg) showSnackbar(errMsg);
        }}
        onImport={(g) => {
          setGradient(g);
          showSnackbar('Gradient imported!');
        }}
      />
      <Favorite open={favoriteOpen} onClose={() => setFavoriteOpen(false)} showSnackbar={showSnackbar} onGradientSelect={(fav) => setGradient({ ...fav, angle: fav.angle ?? 90, colorStops: fav.colorStops.map((stop: ColorStop, i: number) => ({ ...stop, id: String(i + 1) })) })} />
    </>
  );
};
export default Header;
