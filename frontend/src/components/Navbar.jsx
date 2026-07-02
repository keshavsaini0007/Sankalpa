

import { useAuth } from '../context/AuthContext'
import { LogOut, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import SankalpaLogo from './SankalpaLogo'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <>
      <style>{`
        .navbar-brand-glow::after {
          content: '';
          position: absolute;
          inset: -4px -8px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%);
          border-radius: 8px;
          pointer-events: none;
        }
        .logout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(124,58,237,0.08);
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 6px;
        }
        .logout-btn:hover::before { opacity: 1; }
        .nav-bottom-line {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.45) 30%, rgba(79,70,229,0.45) 70%, transparent 100%);
        }
      `}</style>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{ background: 'rgba(8,7,15,0.85)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        <div className="nav-bottom-line" />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="navbar-brand-glow relative flex items-center gap-2.5">
              <SankalpaLogo/>
          </div>

          <div className="flex items-center gap-4">
            {user?.name && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.name}</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="logout-btn relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </>
  )
}

export default Navbar