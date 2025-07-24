import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import logo from '../assets/logo.webp';
import React from 'react';
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showSnackbar: (msg: string) => void;
}
const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, showSnackbar }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    showSnackbar(!darkMode ? 'Switched to dark mode' : 'Switched to light mode');
  };
  const menuItems = [
    { label: 'Menu 1', onClick: handleMenuClose },
    { label: 'Menu 2', onClick: handleMenuClose },
  ];
  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Toolbar>
        <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
        <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, gap: '0.5rem' }}>
          {menuItems.map((item, idx) => (
            <Button key={item.label} variant="text" onClick={item.onClick} sx={{ color: 'inherit' }}>
              {item.label}
            </Button>
          ))}
        </Box>
        <IconButton onClick={handleToggleDarkMode} color="primary" size="large">
          {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton color="inherit" aria-label="open menu" onClick={handleMenuOpen} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {menuItems.map((item, idx) => (
            <MenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
