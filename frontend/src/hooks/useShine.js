import { useState, useCallback } from 'react'

export function useShine() {
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setShine({ x, y, opacity: 1 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShine(prev => ({ ...prev, opacity: 0 }))
  }, [])

  const shineStyle = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
    opacity: shine.opacity,
    transition: 'opacity 0.25s ease',
    zIndex: 1,
    borderRadius: 'inherit',
  }

  return { shineStyle, handleMouseMove, handleMouseLeave }
}
