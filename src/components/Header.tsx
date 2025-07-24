import { AppBar, Toolbar, IconButton, List, ListItemButton, ListItemText, Badge } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteSidebar from './FavoriteSidebar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import logo from '../assets/logo.webp';
import React from 'react';
import useDebounce from '../helpers/useDebounce';
import { generateRandomGradient } from '../modules/randomGradient';
import type { GradientConfig } from '../App';
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showSnackbar: (msg: string) => void;
  setGradient: (g: GradientConfig) => void;
}
const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, showSnackbar, setGradient }) => {
  const [favoriteOpen, setFavoriteOpen] = React.useState(false);
  const [favoriteCount, setFavoriteCount] = React.useState(0);
  React.useEffect(() => {
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const randomButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const darkModeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const handleToggleDarkMode = useDebounce(() => {
    setDarkMode(!darkMode);
    showSnackbar(!darkMode ? 'Switched to dark mode' : 'Switched to light mode');
  }, darkModeButtonRef);
  const debouncedRandomGradient = useDebounce(() => {
    setGradient(generateRandomGradient());
    showSnackbar('Random gradient generated!');
    handleMenuClose();
  }, randomButtonRef);
  const menuItems = [
    { label: 'Random Gradient', onClick: debouncedRandomGradient, buttonRef: randomButtonRef },
    {
      label: (
        <Badge badgeContent={favoriteCount} max={99} color="primary">
          <FavoriteBorderIcon />
        </Badge>
      ),
      onClick: () => setFavoriteOpen(true),
    },
  ];
  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Toolbar>
        <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
        <List sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
          {menuItems.map((item, idx) => (
            <ListItemButton component="button" key={idx} sx={{ flexGrow: 0 }} ref={item.buttonRef} onClick={item.onClick}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <IconButton onClick={handleToggleDarkMode} component="button" ref={darkModeButtonRef}>
          {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton color="inherit" aria-label="open menu" onClick={handleMenuOpen} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {menuItems.map((item, idx) => (
            <MenuItem key={idx} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
        <FavoriteSidebar open={favoriteOpen} onClose={() => setFavoriteOpen(false)}>
          {/* TODO: Render favorite gradients here using favorites.ts */}
        </FavoriteSidebar>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
