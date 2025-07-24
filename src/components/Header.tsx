import { AppBar, Container, Toolbar, IconButton } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import logo from '../assets/logo.webp';
import React from 'react';
interface HeaderProps { darkMode: boolean; setDarkMode: (v: boolean) => void; showSnackbar: (msg: string) => void; }
const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, showSnackbar }) => {
  const handleToggleDarkMode = () => { setDarkMode(!darkMode); showSnackbar(!darkMode ? 'Switched to dark mode' : 'Switched to light mode'); };
  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Container>
        <Toolbar>
          <img src={logo} alt="Gradientor Logo" style={{ height: '2rem', width: 'auto', marginRight: 'auto' }} />
          <IconButton onClick={handleToggleDarkMode} color="primary" size="large">
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
