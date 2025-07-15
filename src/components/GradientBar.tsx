import React, { useRef, useCallback } from 'react';
import type { GradientConfig, ColorStop } from '../App';
import './GradientBar.css';
interface GradientBarProps {
  gradient: GradientConfig;
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onAddStop: (position: number) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
}
const GradientBar: React.FC<GradientBarProps> = ({ gradient, selectedStopId, onStopSelect, onAddStop, onUpdateStop }) => {
  const barRef = useRef<HTMLDivElement>(null);
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
        return `${colorValue} ${stop.position}%`;
      })
      .join(', ');
    return `linear-gradient(90deg, ${stops})`;
  }, [gradient]);
  const handleBarClick = (e: React.MouseEvent) => {
    if (e.target === barRef.current) {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));
      onAddStop(clampedPosition);
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
      const clampedPosition = Math.max(0, Math.min(100, position));
      onUpdateStop(stopId, { position: clampedPosition });
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
