import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/helpers'
import { CheckSquare } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setServerError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_60%)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <CheckSquare className="h-8 w-8 text-accent" />
          <span className="font-heading text-2xl font-bold text-white">
            TaskFlow
          </span>
        </div>

        <div className="rounded-sm border border-border bg-surface p-6">
          <h1 className="mb-6 font-heading text-xl font-semibold text-white">
            Sign in
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted">Email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
                placeholder="you@example.com"
                className="w-full rounded-sm border border-border bg-dark-bg px-3 py-2.5 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-muted">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                placeholder="••••••••"
                className="w-full rounded-sm border border-border bg-dark-bg px-3 py-2.5 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <motion.p
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="rounded-sm bg-red-400/10 px-3 py-2 text-xs text-red-400"
              >
                {serverError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-accent transition-colors hover:text-accent/80"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
