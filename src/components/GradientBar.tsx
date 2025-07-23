import React, { useRef, useCallback } from 'react';
import type { GradientConfig, ColorStop } from '../App';
import { hexToRgba } from '../helpers/color';
import { sortColorStops } from '../modules/generateGradientCSS';
import { clamp } from '../helpers/clamp';
interface GradientBarProps {
  gradient: GradientConfig;
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onAddStop: (position: number) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
}
const GradientBar: React.FC<GradientBarProps> = ({ gradient, selectedStopId, onStopSelect, onAddStop, onUpdateStop }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const generateGradientCSS = useCallback(() => {
    const stops = sortColorStops(gradient.colorStops)
      .map((stop) => `${stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(90deg, ${stops})`;
  }, [gradient]);
  const handleBarClick = (e: React.MouseEvent) => {
    if (e.target === barRef.current) {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      onAddStop(clamp(position, 0, 100));
    }
  };
  const handleStopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const handleStopMouseDown = (e: React.MouseEvent, stopId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onStopSelect(stopId);
    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      onUpdateStop(stopId, { position: clamp(position, 0, 100) });
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div className="gradient-bar-container">
      <div ref={barRef} className="gradient-bar" style={{ background: generateGradientCSS() }} onClick={handleBarClick} role="slider" aria-label="Gradient bar - click to add color stops" tabIndex={0}>
        {gradient.colorStops.map((stop) => (
          <div key={stop.id} className={`color-stop ${selectedStopId === stop.id ? 'selected' : ''}`} style={{ left: `${stop.position}%`, backgroundColor: stop.color }} onClick={handleStopClick} onMouseDown={(e) => handleStopMouseDown(e, stop.id)} role="button" aria-label={`Color stop at ${stop.position}% with color ${stop.color}`} tabIndex={0} />
        ))}
      </div>
    </div>
  );
};
export default GradientBar;
