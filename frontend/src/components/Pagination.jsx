import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const start = Math.max(1, page - 1)
    const end = Math.min(totalPages, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const NavBtn = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.5)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(124,58,237,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
    >
      {children}
    </button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-1.5"
    >
      <NavBtn onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-3.5 w-3.5" />
        Prev
      </NavBtn>

      {getPages().map((p) => (
        <motion.button
          key={p}
          onClick={() => onPageChange(p)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-w-[32px] rounded-lg px-2.5 py-2 text-xs font-semibold transition-all"
          style={p === page
            ? {
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                border: '1px solid rgba(124,58,237,0.5)',
              }
            : {
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
              }
          }
        >
          {p}
        </motion.button>
      ))}

      <NavBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
        <ChevronRight className="h-3.5 w-3.5" />
      </NavBtn>
    </motion.div>
  )
}

export default Pagination