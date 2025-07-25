import { AppBar, Toolbar, IconButton, Badge, Button, Box } from '@mui/material';
import { generateRandomGradient } from '../modules/randomGradient';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import Favorite from './Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImportGradient from './ImportGradient';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import logo from '../assets/logo.webp';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import type { GradientConfig } from '../App';
import useDebounce from '../helpers/useDebounce';
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
        const favs = JSON.parse(window.localStorage.getItem(`gradientor-favorites`) || `[]`);
        setFavoriteCount(Array.isArray(favs) ? favs.length : 0);
      } catch {
        setFavoriteCount(0);
      }
    };
    updateCount();
    window.addEventListener(`storage`, updateCount);
    window.addEventListener(`favorites-updated`, updateCount);
    return () => {
      window.removeEventListener(`storage`, updateCount);
      window.removeEventListener(`favorites-updated`, updateCount);
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
    showSnackbar(!darkMode ? `Switched to dark mode!` : `Switched to light mode!`);
  }, darkModeButtonRef);
  const debouncedRandomGradient = useDebounce(() => {
    setGradient(generateRandomGradient());
    showSnackbar(`Random gradient generated!`);
    handleMenuClose();
  }, randomButtonRef);
  const [importOpen, setImportOpen] = React.useState(false);
  const menuItems = [
    { label: `Import`, onClick: () => setImportOpen(true) },
    { label: `Random Gradient`, onClick: debouncedRandomGradient, buttonRef: randomButtonRef },
  ];
  return (
    <>
      <AppBar position="static" sx={{ '--Paper-overlay': 'none !important', boxShadow: 1 }}>
        <Toolbar>
          <img src={logo} alt="Gradientor Logo" style={{ height: `2rem`, width: `auto`, marginRight: `auto` }} />
          <Box sx={{ display: { xs: `none`, md: `flex` }, justifyContent: `flex-end`, flexGrow: 1, gap: 2 }}>
            {menuItems.map((item, idx) => (
              <Button component="button" color="inherit" key={idx} ref={item.buttonRef} onClick={item.onClick} sx={{ minWidth: `auto` }} aria-label={item.label}>
                {item.label}
              </Button>
            ))}
          </Box>
          <Button component="button" color="inherit" onClick={() => setFavoriteOpen(true)} sx={{ minWidth: `auto` }} aria-label="Open favorites">
            <Badge badgeContent={favoriteCount} max={99} color="secondary">
              <FavoriteBorderIcon aria-label="Open favorites" />
            </Badge>
          </Button>
          <Button component="button" color="inherit" ref={darkModeButtonRef} onClick={handleToggleDarkMode} sx={{ minWidth: `auto` }} aria-label="Toggle dark mode">
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </Button>
          <IconButton color="inherit" aria-label="open menu" onClick={handleMenuOpen} sx={{ display: { xs: `inline-flex`, md: `none` } }}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: `bottom`, horizontal: `right` }}>
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
          showSnackbar(`Gradient imported!`);
        }}
      />
      <Favorite
        open={favoriteOpen}
        onClose={() => setFavoriteOpen(false)}
        showSnackbar={showSnackbar}
        onGradientSelect={(fav) =>
          setGradient({
            ...fav,
            angle: fav.angle ?? 90,
            colorStops: fav.colorStops.map((stop, i) => ({
              ...stop,
              id: String(i + 1),
            })),
          })
        }
      />
    </>
  );
};
export default Header;
