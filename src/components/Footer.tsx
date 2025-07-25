/**
 * Footer component
 *
 * Displays a simple footer for the Gradientor app.
 * You can customize the content as needed.
 *
 * @returns {JSX.Element} Footer UI.
 */
import { Box, Typography, useTheme } from '@mui/material';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import packageJson from '../../package.json';

function Footer() {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  return (
    <Box component="footer" aria-label="Gradientor app footer" sx={{ mt: 4, p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="body2" sx={{ color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        v{packageJson.version}
        <BlurOnRoundedIcon fontSize="small" sx={{ verticalAlign: 'middle', color: 'text.secondary' }} aria-label="divider icon" />
        &copy; {new Date().getFullYear()}
        <BlurOnRoundedIcon fontSize="small" sx={{ verticalAlign: 'middle', color: 'text.secondary' }} aria-label="divider icon" />
        Made with
        <FavoriteTwoToneIcon fontSize="small" sx={{ verticalAlign: 'middle', color: 'error.main' }} aria-label="favorite icon" />
        by
        <a target="_blank" rel="noopener noreferrer" href="https://www.666de666.com" style={{ color: textColor, display: 'flex', alignItems: 'center' }} aria-label="Visit Ishan Samanta's website">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ fill: textColor, width: '1.5em', height: '1.5em', marginRight: '0.25em' }} role="img" aria-labelledby="footer-logo-title">
            <title id="footer-logo-title">Ishan Samanta Logo</title>
            <path d="M26.7 47.1v32.7c0 2.9-2.3 5.2-5.2 5.2-2.9 0-5.1-2.4-5.1-5.3V53.7V21c0-2.9 2.3-5.2 5.2-5.2 2.9 0 5.1 2.4 5.1 5.3v26zm18.7 32.7c0 2.7-2.1 5-4.9 5-2.8 0-4.8-2.3-4.8-5.1V53.7c0-2.7 2.1-5 4.9-5 2.8 0 4.8 2.3 4.8 5.1v26.1zm19.1 0c0 2.7-2.3 5-5 5-2.8 0-5-2.3-5-5.1V53.7c0-2.7 2.3-5 5-5 2.8 0 5 2.3 5 5.1v26.1zm19.1-32.7v32.7c0 2.9-2.2 5.2-5 5.2-2.9 0-5-2.4-5-5.3V53.7V21c0-2.9 2.2-5.2 5-5.2 2.9 0 5 2.4 5 5.3v26z" />
          </svg>
          Ishan Samanta
        </a>
      </Typography>
    </Box>
  );
}

export default Footer;
