import { AppBar, Toolbar, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const randomButtonRef = React.useRef<{ disabled: boolean }>(null);
  const randomButtonElRef = React.useRef<HTMLButtonElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const darkModeButtonRef = React.useRef<{ disabled: boolean }>(null);
  const darkModeButtonElRef = React.useRef<HTMLButtonElement>(null);
  const handleToggleDarkMode = useDebounce(() => {
    setDarkMode(!darkMode);
    showSnackbar(!darkMode ? 'Switched to dark mode' : 'Switched to light mode');
  }, darkModeButtonRef as React.RefObject<{ disabled: boolean }>);
  const debouncedRandomGradient = useDebounce(() => {
    setGradient(generateRandomGradient());
    showSnackbar('Random gradient generated!');
    handleMenuClose();
  }, randomButtonRef as React.RefObject<{ disabled: boolean }>);
  const menuItems = [{ label: 'Random Gradient', onClick: debouncedRandomGradient, buttonRef: randomButtonRef, elRef: randomButtonElRef }];
  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Toolbar>
        <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
        <List sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
          {menuItems.map((item, idx) => (
            <ListItemButton component="button" key={idx} sx={{ flexGrow: 0 }} ref={item.elRef}>
              <ListItemText primary={item.label} onClick={item.onClick} />
            </ListItemButton>
          ))}
        </List>
        <IconButton onClick={handleToggleDarkMode} color="primary" size="large" component="button" ref={darkModeButtonElRef}>
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
      </Toolbar>
    </AppBar>
  );
};
export default Header;
