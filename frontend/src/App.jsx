import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import CursorGlow from './components/CursorGlow'
import SquirrelLoader from './components/SquirrelLoader'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const App = () => {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#08070f]">
      <CursorGlow />

      {/* Routes mount in background while splash is visible */}
      <div style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Splash overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#08070f]"
          >
            <SquirrelLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
