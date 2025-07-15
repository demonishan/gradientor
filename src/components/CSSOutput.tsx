import React, { useState, useCallback } from 'react';
import type { GradientConfig } from '../App';
interface CSSOutputProps {
  gradient: GradientConfig;
}
const CSSOutput: React.FC<CSSOutputProps> = ({ gradient }) => {
  const [copied, setCopied] = useState(false);
  const [maxCompatibility, setMaxCompatibility] = useState(false);
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(1)})`;
  };
  const generateGradientCSS = useCallback(() => {
    const stops = gradient.colorStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => {
        const colorValue = stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color;
        return `${colorValue} ${stop.position.toFixed(1)}%`;
      })
      .join(', ');
    if (gradient.type === 'linear') {
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    } else if (gradient.type === 'radial') {
      let dir = gradient.radialDirection || 'center';
      if (dir === 'center') dir = 'at center';
      return `radial-gradient(circle ${dir}, ${stops})`;
    } else if (gradient.type === 'conic') {
      const pos = gradient.conicPosition || { x: 50, y: 50 };
      return `conic-gradient(from ${gradient.angle}deg at ${pos.x}% ${pos.y}%, ${stops})`;
    }
    return '';
  }, [gradient]);
  const generateFullCSS = useCallback(() => {
    const gradientCSS = generateGradientCSS();
    if (maxCompatibility) {
      const fallbackColor = gradient.colorStops.sort((a, b) => a.position - b.position)[0].color;
      return `background: ${fallbackColor};
background: -webkit-${gradientCSS};
background: -moz-${gradientCSS};
background: -o-${gradientCSS};
background: ${gradientCSS};`;
    } else {
      return `background: ${gradientCSS};`;
    }
  }, [generateGradientCSS, maxCompatibility, gradient.colorStops]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFullCSS());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <div className="css-output">
      <div className="css-code">
        <pre>
          <code>{generateFullCSS()}</code>
        </pre>
      </div>
      <div className="css-controls">
        <label className="compatibility-checkbox">
          <input type="checkbox" checked={maxCompatibility} onChange={(e) => setMaxCompatibility(e.target.checked)} />
          <span>Max compatibility</span>
        </label>
        <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy CSS'}
        </button>
      </div>
    </div>
  );
};
export default CSSOutput;
