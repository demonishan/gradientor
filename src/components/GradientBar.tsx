/**
 * GradientBar component
 *
 * Renders a horizontal gradient bar with draggable color stops.
 * Allows adding, selecting, and updating color stops interactively.
 *
 * @param {GradientBarProps} props - The props for the component.
 * @returns {JSX.Element} Gradient bar UI.
 */
import React, { useRef, useCallback } from 'react';
import type { GradientConfig, ColorStop } from '../App';

/**
 * Props for GradientBar component.
 * @property gradient - Gradient configuration object.
 * @property selectedStopId - ID of the selected color stop.
 * @property onStopSelect - Function to select a color stop.
 * @property onAddStop - Function to add a color stop at a position.
 * @property onUpdateStop - Function to update a color stop's properties.
*/
interface GradientBarProps {
  gradient: GradientConfig;
  selectedStopId: string;
  onStopSelect: (id: string) => void;
  onAddStop: (position: number) => void;
  onUpdateStop: (id: string, updates: Partial<ColorStop>) => void;
}
const GradientBar: React.FC<GradientBarProps> = ({ gradient, selectedStopId, onStopSelect, onAddStop, onUpdateStop }) => {
  const barRef = useRef<HTMLDivElement>(null);

  /**
   * Converts a hex color and opacity to an RGBA string.
   * @param hex Hex color string.
   * @param opacity Opacity value (0-1).
   * @returns RGBA color string.
   */
  const hexToRgba = (hex: string, opacity: number) =>
    `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${opacity.toFixed(1)})`;

  /**
   * Generates the CSS for the gradient bar background.
   * @returns CSS linear-gradient string.
   */
  const generateGradientCSS = useCallback(() =>
    `linear-gradient(90deg, ${gradient.colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.opacity !== 1 ? hexToRgba(stop.color, stop.opacity) : stop.color} ${stop.position}%`)
      .join(`, `)})`,
    [gradient]
  );

  /**
   * Handles click on the gradient bar to add a new color stop.
   */
  const handleBarClick = (e: React.MouseEvent) => {
    if (e.target !== barRef.current || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    onAddStop(Math.max(0, Math.min(100, position)));
  };
  const handleStopClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  /**
   * Handles mouse down on a color stop for dragging.
   */
  const handleStopMouseDown = (e: React.MouseEvent, stopId: string) => {
    e.preventDefault();
    onStopSelect(stopId);
    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      onUpdateStop(stopId, { position: Math.max(0, Math.min(100, position)) });
    };
    const handleMouseUp = () => {
      document.removeEventListener(`mousemove`, handleMouseMove);
      document.removeEventListener(`mouseup`, handleMouseUp);
    };
    document.addEventListener(`mousemove`, handleMouseMove);
    document.addEventListener(`mouseup`, handleMouseUp);
  };
  return (
    <div className="gradient-bar-container">
      <div ref={barRef} className="gradient-bar" style={{ background: generateGradientCSS() }} onClick={handleBarClick} role="slider" aria-label="Gradient bar - click to add color stops" aria-valuenow={selectedStopId ? gradient.colorStops.find((s: ColorStop) => s.id === selectedStopId)?.position ?? 0 : 0} aria-valuemin={0} aria-valuemax={100} tabIndex={0}>
        {gradient.colorStops.map((stop: ColorStop) => (
          <div key={stop.id} className={`color-stop ${selectedStopId === stop.id ? `selected` : ``}`} style={{ left: `${stop.position}%`, backgroundColor: stop.color }} onClick={handleStopClick} onMouseDown={(e) => handleStopMouseDown(e, stop.id)} role="button" aria-label={`Color stop at ${stop.position}% with color ${stop.color}`} aria-pressed={selectedStopId === stop.id} tabIndex={0} />
        ))}
      </div>
    </div>
  );
};
export default GradientBar;
