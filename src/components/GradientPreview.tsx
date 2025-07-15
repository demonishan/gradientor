import type { GradientConfig } from '../App'
import './GradientPreview.css'

interface GradientPreviewProps {
  gradient: GradientConfig
}

const generateGradientCSS = (gradient: GradientConfig): string => {
  const colorStops = gradient.colorStops
    .sort((a, b) => a.position - b.position)
    .map(stop => `rgba(${parseInt(stop.color.slice(1, 3), 16)}, ${parseInt(stop.color.slice(3, 5), 16)}, ${parseInt(stop.color.slice(5, 7), 16)}, ${stop.opacity}) ${stop.position}%`)
    .join(', ')
  
  return `linear-gradient(90deg, ${colorStops})`
}

const GradientPreview = ({ gradient }: GradientPreviewProps) => (
  <div className="gradient-preview">
    <div className="gradient-preview-display" style={{ background: generateGradientCSS(gradient) }} />
  </div>
)

export default GradientPreview
