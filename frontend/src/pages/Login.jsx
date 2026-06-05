

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../utils/helpers'
import { useShine } from '../hooks/useShine'
import { CheckSquare } from 'lucide-react'
import SankalpaLogo from '../components/SankalpaLogo'

/* ─── Canvas Particle Background ─── */
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

    /* Particles */
    const PARTICLE_COUNT = 60
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
    }))

    /* Connection threshold */
    const CONN = 120

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* Move & wrap */
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })

      /* Connections */
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

      /* Dots */
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

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}

/* ─── Animated Gradient Orbs ─── */
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
      className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full opacity-10"
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
      @keyframes scanline {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(200%); }
      }
      @keyframes borderGlow {
        0%, 100% { opacity: 0.6; }
        50%       { opacity: 1; }
      }
      @keyframes cardEntrance {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes inputFocus {
        from { box-shadow: 0 0 0 0px rgba(124,58,237,0); }
        to   { box-shadow: 0 0 0 3px rgba(124,58,237,0.25); }
      }
      .glow-input:focus {
        border-color: #7c3aed !important;
        box-shadow: 0 0 0 3px rgba(124,58,237,0.18), inset 0 1px 2px rgba(0,0,0,0.4);
        outline: none;
      }
      .submit-btn {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }
      .submit-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .submit-btn:hover::before { opacity: 1; }
      .submit-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 32px rgba(124,58,237,0.45), 0 2px 8px rgba(0,0,0,0.3);
      }
      .submit-btn:active { transform: translateY(0px); }
      .submit-btn span { position: relative; z-index: 1; }
      .card-glow {
        animation: cardEntrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .card-glow::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 14px;
        padding: 1px;
        background: linear-gradient(135deg, rgba(124,58,237,0.7) 0%, rgba(79,70,229,0.4) 50%, rgba(37,99,235,0.6) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: borderGlow 4s ease-in-out infinite;
        pointer-events: none;
      }
      .scanline {
        position: absolute;
        inset-inline: 0;
        height: 40%;
        background: linear-gradient(to bottom, transparent, rgba(124,58,237,0.04) 50%, transparent);
        animation: scanline 6s linear infinite;
        pointer-events: none;
        border-radius: 12px;
      }
    `}</style>
  </div>
)

/* ─── Main Login Component ─── */
const Login = () => {
  const { login } = useAuth()
  const { addToast } = useToast()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const { shineStyle, handleMouseMove, handleMouseLeave } = useShine()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')
    try {
      await login(data.email, data.password)
    } catch (err) {
      const msg = getErrorMessage(err)
      setServerError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-4">
      {/* Layered animated background */}
      <ParticleCanvas />
      <Orbs />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      {/* Card */}
      <div className="card-glow relative z-10 w-full max-w-100">
        <div
          className="relative overflow-hidden rounded-[13px] border border-white/[0.07] bg-white/3 px-8 py-9 backdrop-blur-xl"
          style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Shine reflection */}
          <div style={shineStyle} />

          {/* Scanline sweep */}
          <div className="scanline" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-8 flex items-center justify-center gap-2.5"
          >
            <SankalpaLogo/>
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20 ring-1 ring-violet-500/40">
              <CheckSquare className="h-5 w-5 text-violet-400" />
            </div>
            <span
              className="text-2xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}
            >
              Sankalpa
            </span> */}
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mb-7"
          >
            <h1 className="text-xl font-semibold text-white/90">Welcome back</h1>
            <p className="mt-1 text-sm text-white/35">Sign in to continue your journey</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-widest text-white/40 uppercase">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                placeholder="you@example.com"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="glow-input w-full rounded-lg border border-white/9 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 transition-all duration-200"
                style={{ background: focusedField === 'email' ? 'rgba(124,58,237,0.06)' : undefined }}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-400/80"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-widest text-white/40 uppercase">
                Password
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                placeholder="••••••••"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="glow-input w-full rounded-lg border border-white/9 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 transition-all duration-200"
                style={{ background: focusedField === 'password' ? 'rgba(124,58,237,0.06)' : undefined }}
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-400/80"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400"
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="submit-btn mt-1 w-full rounded-lg py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </span>
            </button>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-7 text-center text-sm text-white/30"
          >
            No account?{' '}
            <Link
              to="/register"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              Register
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export default Login