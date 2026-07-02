import { useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center, ContactShadows, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 60
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
    }))

    const CONN = 120

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONN) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / CONN)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}

const Orbs = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div
      className="absolute -left-32 -top-32 h-120 w-120 rounded-full opacity-20"
      style={{
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        animation: 'orbDrift1 18s ease-in-out infinite alternate',
      }}
    />
    <div
      className="absolute -bottom-32 -right-32 h-140 w-140 rounded-full opacity-15"
      style={{
        background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
        animation: 'orbDrift2 22s ease-in-out infinite alternate',
      }}
    />
    <div
      className="absolute left-1/2 top-1/3 h-180 w-180 -translate-x-1/2 rounded-full opacity-10"
      style={{
        background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
        animation: 'orbDrift3 14s ease-in-out infinite alternate',
      }}
    />
    <style>{`
      @keyframes orbDrift1 {
        from { transform: translate(0, 0) scale(1); }
        to   { transform: translate(60px, 80px) scale(1.15); }
      }
      @keyframes orbDrift2 {
        from { transform: translate(0, 0) scale(1); }
        to   { transform: translate(-80px, -60px) scale(1.2); }
      }
      @keyframes orbDrift3 {
        from { transform: translateX(-50%) translateY(0) scale(1); }
        to   { transform: translateX(-50%) translateY(-40px) scale(1.1); }
      }
    `}</style>
  </div>
)

const Model = () => {
  const { scene } = useGLTF('/keshav%2010.glb')
  return <primitive object={scene} scale={1} />
}

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: 'rgba(139,92,246,0.3)', borderTopColor: '#8b5cf6' }}
      />
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading model…</span>
    </div>
  </Html>
)

const Keshav = () => {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#08070f' }}>
      <ParticleCanvas />
      <Orbs />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Keshav
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            3D Model Viewer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#6366f1" />
            <directionalLight position={[0, -5, 3]} intensity={0.3} color="#a855f7" />
            <Suspense fallback={<Loader />}>
              <Center>
                <Model />
              </Center>
              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={6}
                blur={2.5}
                color="#000"
              />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={2}
              maxDistance={10}
              autoRotate
              autoRotateSpeed={2}
            />
          </Canvas>
        </motion.div>
      </main>
    </div>
  )
}

export default Keshav
