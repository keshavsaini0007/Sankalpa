import { useAuth } from '../context/AuthContext'
import { LogOut, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-border bg-dark-bg/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-accent" />
          <span className="font-heading text-lg font-semibold text-white">
            TaskFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block">
            {user?.name}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
