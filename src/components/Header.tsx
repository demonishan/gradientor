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
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showSnackbar: (msg: string) => void;
  setGradient: (g: any) => void;
}
const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, showSnackbar, setGradient }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const randomButtonRef = React.useRef<any>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const darkModeButtonRef = React.useRef<any>(null);
  const handleToggleDarkMode = useDebounce(() => {
    setDarkMode(!darkMode);
    showSnackbar(!darkMode ? 'Switched to dark mode' : 'Switched to light mode');
  }, darkModeButtonRef);
  const debouncedRandomGradient = useDebounce(() => {
    setGradient(generateRandomGradient());
    showSnackbar('Random gradient generated!');
    handleMenuClose();
  }, randomButtonRef);
  const menuItems = [{ label: 'Random Gradient', onClick: debouncedRandomGradient, buttonRef: randomButtonRef }];
  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Toolbar>
        <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
        <List sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
          {menuItems.map((item, idx) => (
            <ListItemButton component="button" key={idx} sx={{ flexGrow: 0 }} ref={item.buttonRef as any}>
              <ListItemText primary={item.label} onClick={item.onClick} />
            </ListItemButton>
          ))}
        </List>
        <IconButton onClick={handleToggleDarkMode} color="primary" size="large" component="button" ref={darkModeButtonRef}>
          {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton color="inherit" aria-label="open menu" onClick={handleMenuOpen} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {menuItems.map((item, idx) => (
            <MenuItem key={idx} onClick={item.onClick} ref={item.buttonRef as any}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
