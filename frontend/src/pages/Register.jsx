

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../utils/helpers'
import { useShine } from '../hooks/useShine'
import { CheckSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'

/* ─── Reused canvas particles (same as Login) ─── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.45 + 0.1,
    }))
    const CONN = 115
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width
        p.y = (p.y + p.vy + canvas.height) % canvas.height
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONN) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,102,241,${0.11 * (1 - d / CONN)})`
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}

/* ─── Orbs ─── */
const Orbs = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', opacity: 0.18, animation: 'orbA 20s ease-in-out infinite alternate' }} />
    <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)', opacity: 0.13, animation: 'orbB 24s ease-in-out infinite alternate' }} />
    <div style={{ position: 'absolute', top: '50%', left: '20%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', opacity: 0.08, animation: 'orbC 16s ease-in-out infinite alternate' }} />
    <style>{`
      @keyframes orbA { from { transform: translate(0,0) scale(1); } to { transform: translate(-50px,70px) scale(1.12); } }
      @keyframes orbB { from { transform: translate(0,0) scale(1); } to { transform: translate(70px,-50px) scale(1.18); } }
      @keyframes orbC { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-40px) scale(1.08); } }
      @keyframes borderPulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .reg-card-glow { animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
      .reg-card-glow::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 14px;
        padding: 1px;
        background: linear-gradient(135deg, rgba(124,58,237,0.65) 0%, rgba(79,70,229,0.35) 50%, rgba(37,99,235,0.55) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: borderPulse 4s ease-in-out infinite;
        pointer-events: none;
      }
      .reg-scanline {
        position: absolute;
        inset-inline: 0;
        height: 35%;
        background: linear-gradient(to bottom, transparent, rgba(124,58,237,0.035) 50%, transparent);
        animation: scanline 7s linear infinite;
        pointer-events: none;
        border-radius: 12px;
      }
      .reg-input {
        width: 100%;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(255,255,255,0.04);
        padding: 11px 14px;
        font-size: 14px;
        color: rgba(255,255,255,0.9);
        outline: none;
        transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      }
      .reg-input::placeholder { color: rgba(255,255,255,0.2); }
      .reg-input:focus {
        border-color: rgba(124,58,237,0.6);
        background: rgba(124,58,237,0.055);
        box-shadow: 0 0 0 3px rgba(124,58,237,0.13);
      }
      .reg-submit {
        width: 100%;
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }
      .reg-submit::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #9333ea, #6366f1);
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .reg-submit:hover::before { opacity: 1; }
      .reg-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(124,58,237,0.42); }
      .reg-submit:active { transform: translateY(0); }
      .reg-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      .reg-submit span { position: relative; z-index: 1; }
    `}</style>
  </div>
)

/* ─── Field wrapper with staggered reveal ─── */
const Field = ({ label, error, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ marginTop: 6, fontSize: 12, color: 'rgba(248,113,113,0.9)' }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
)

/* ─── Register ─── */
const Register = () => {
  const { register: registerUser } = useAuth()
  const { addToast } = useToast()
  const { shineStyle, handleMouseMove, handleMouseLeave } = useShine()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, getValues, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password)
    } catch (err) {
      const msg = getErrorMessage(err)
      setServerError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10" style={{ background: '#08070f' }}>
      <ParticleCanvas />
      <Orbs />

      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />

      {/* Card */}
      <div className="reg-card-glow relative z-10 w-full max-w-100">
        <div
          className="relative overflow-hidden rounded-[13px] px-8 py-9"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Shine reflection */}
          <div style={shineStyle} />

          <div className="reg-scanline" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="mb-7 flex items-center justify-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)' }}>
              <CheckSquare className="h-5 w-5" style={{ color: '#a78bfa' }} />
            </div>
            <span className="text-2xl font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
              Sankalpa
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mb-7"
          >
            <h1 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Create account</h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Start organising your tasks today</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Field label="Name" error={errors.name?.message} delay={0.27}>
              <input
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="John Doe"
                className="reg-input"
              />
            </Field>

            <Field label="Email" error={errors.email?.message} delay={0.32}>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                placeholder="you@example.com"
                className="reg-input"
              />
            </Field>

            <Field label="Password" error={errors.password?.message} delay={0.37}>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                placeholder="••••••••"
                className="reg-input"
              />
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword?.message} delay={0.42}>
              <input
                type="password"
                {...register('confirmPassword', { required: 'Please confirm your password', validate: val => val === getValues('password') || 'Passwords do not match' })}
                placeholder="••••••••"
                className="reg-input"
              />
            </Field>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', padding: '10px 14px', fontSize: 12, color: 'rgba(248,113,113,0.95)' }}
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.4 }}
              style={{ marginTop: 4 }}
            >
              <button type="submit" disabled={loading} className="reg-submit">
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account…
                    </>
                  ) : 'Create account'}
                </span>
              </button>
            </motion.div>
          </form>
        </div>
      </div>

      {/* Footer link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="absolute bottom-8 left-0 right-0 text-center text-sm"
        style={{ color: 'rgba(255,255,255,0.28)' }}
      >
        Already have an account?{' '}
        <Link to="/login" className="font-medium transition-colors" style={{ color: '#a78bfa' }}
          onMouseEnter={e => e.target.style.color = '#c4b5fd'}
          onMouseLeave={e => e.target.style.color = '#a78bfa'}
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  )
}

export default Register