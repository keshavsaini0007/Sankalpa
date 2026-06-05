import { useState, useEffect } from 'react'

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -9999, y: -9999 })

  useEffect(() => {
    const handleMouse = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9999,
        background: `radial-gradient(800px at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.06), transparent 80%)`,
        transition: 'background 0.05s ease',
      }}
    />
  )
}

export default CursorGlow
