import React, { useState, useCallback } from 'react'
import type { GradientConfig } from '../App'
import './CSSOutput.css'
interface CSSOutputProps {
  gradient: GradientConfig
}
const CSSOutput: React.FC<CSSOutputProps> = ({ gradient }) => {
  const [copied, setCopied] = useState(false)
  const generateGradientCSS = useCallback(() => {
    const stops = gradient.colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position.toFixed(1)}%`)
      .join(', ')
    if (gradient.type === 'linear') return `linear-gradient(${gradient.angle}deg, ${stops})`
    else return `radial-gradient(circle, ${stops})`
  }, [gradient])
  const generateFullCSS = useCallback(() => {
    const gradientCSS = generateGradientCSS()
    return `background: ${gradientCSS};`
  }, [generateGradientCSS])
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFullCSS())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  return (
    <div className="css-output">
      <div className="output-header">
        <h3>CSS Output</h3>
        <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>{copied ? '✓ Copied!' : '📋 Copy CSS'}</button>
      </div>
      <div className="css-code"><pre><code>{generateFullCSS()}</code></pre></div>
    </div>
  )
}
export default CSSOutput
