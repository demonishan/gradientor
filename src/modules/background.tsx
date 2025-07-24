import React, { useRef, useEffect, useMemo } from 'react';
function generateColors(min: number, max: number) {
  return Array.from({ length: 6 }, () => {
    const r = min + Math.floor(Math.random() * (max - min + 1));
    const g = min + Math.floor(Math.random() * (max - min + 1));
    const b = min + Math.floor(Math.random() * (max - min + 1));
    return [r, g, b];
  });
}
interface GradientAnimationProps {
  darkMode?: boolean;
}
const GradientAnimation: React.FC<GradientAnimationProps> = ({ darkMode = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useMemo(() => darkMode ? generateColors(0, 99) : generateColors(180, 255), [darkMode]);
  useEffect(() => {
    let step = 0;
    const colorIndices = [0, 1, 2, 3];
    function updateGradient() {
      const c0_0 = colors[colorIndices[0]];
      const c0_1 = colors[colorIndices[1]];
      const c1_0 = colors[colorIndices[2]];
      const c1_1 = colors[colorIndices[3]];
      const istep = 1 - step;
      const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      const color1 = `rgb(${r1},${g1},${b1})`;
      const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      const color2 = `rgb(${r2},${g2},${b2})`;
      if (ref.current) {
        ref.current.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
      }
      step += 0.001;
      if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      }
      requestAnimationFrame(updateGradient);
    }
    const frame = requestAnimationFrame(updateGradient);
    return () => cancelAnimationFrame(frame);
  }, [colors]);
  return <div ref={ref} style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: -1, pointerEvents: 'none' }} />;
};
export default GradientAnimation;
