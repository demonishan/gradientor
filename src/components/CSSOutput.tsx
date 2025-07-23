import { generateFullCSS } from '../modules/generateGradientCSS';
import { generateShareLink } from '../modules/share';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react';
import { useSnackbar } from '../helpers/snackbar';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import type { GradientConfig } from '../App';
import type { GradientShareConfig } from '../modules/share';
import { Box } from '@mui/material';
interface CSSOutputProps {
  gradient: GradientConfig;
}
const CSSOutput: React.FC<CSSOutputProps> = ({ gradient }) => {
  const [maxCompatibility, setMaxCompatibility] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateFullCSS(gradient, maxCompatibility));
    showSnackbar('Copied to clipboard!');
  };
  const handleShare = async () => {
    const link = generateShareLink(gradient as GradientShareConfig);
    await navigator.clipboard.writeText(link);
    showSnackbar('Copied to clipboard!');
  };
  return (
    <div className="css-output">
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={closeSnackbar} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      <TextField value={generateFullCSS(gradient, maxCompatibility)} multiline fullWidth label="CSS Code" inputProps={{ readOnly: true, style: { fontFamily: `monospace` } }} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControlLabel control={<Checkbox checked={maxCompatibility} onChange={(e) => setMaxCompatibility(e.target.checked)} color="primary" />} label="Compatibility" />
        <Button variant="text" color="primary" onClick={handleShare} sx={{ ml: 'auto' }}>
          Share
        </Button>
        <Button variant="contained" color="primary" onClick={handleCopy} startIcon={<ContentCopyIcon />}>
          Copy CSS
        </Button>
      </Box>
    </div>
  );
};
export default CSSOutput;
