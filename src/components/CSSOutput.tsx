import { generateFullCSS } from '../modules/generateGradientCSS';
import { generateShareLink } from '../modules/share';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import type { GradientConfig } from '../App';
import type { GradientShareConfig } from '../modules/share';
interface CSSOutputProps {
  gradient: GradientConfig;
}
const CSSOutput: React.FC<CSSOutputProps> = ({ gradient }) => {
  const [maxCompatibility, setMaxCompatibility] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateFullCSS(gradient, maxCompatibility));
    setSnackbarOpen(true);
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleShare = async () => {
    const link = generateShareLink(gradient as GradientShareConfig);
    await navigator.clipboard.writeText(link);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);
  return (
    <div className="css-output">
      <div className="css-code">
        <TextField value={generateFullCSS(gradient, maxCompatibility)} multiline fullWidth label="CSS Code" inputProps={{ readOnly: true, style: { fontFamily: `monospace` } }} />
      </div>
      <div className="css-controls">
        <FormControlLabel control={<Checkbox checked={maxCompatibility} onChange={(e) => setMaxCompatibility(e.target.checked)} color="primary" />} label="Max compatibility" />
        <Button variant="text" color="primary" onClick={handleShare}>
          Share
        </Button>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose} message="Copied to clipboard!" anchorOrigin={{ vertical: `bottom`, horizontal: `center` }} />
        <Button variant="contained" color="primary" onClick={handleCopy} startIcon={<ContentCopyIcon />}>
          Copy CSS
        </Button>
      </div>
    </div>
  );
};
export default CSSOutput;
