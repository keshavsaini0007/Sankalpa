
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Trash2, CheckCircle, RotateCcw } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import { useShine } from '../hooks/useShine'

const TaskCard = ({ task, onEdit, onDelete, onToggle, index = 0 }) => {
  const { shineStyle, handleMouseMove, handleMouseLeave } = useShine()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isDone = task.status === 'completed'

  return (
    <>
      <style>{`
        .task-card {
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .task-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 3px 0 0 3px;
          background: ${isDone
            ? 'linear-gradient(180deg, #34d399, #10b981)'
            : 'linear-gradient(180deg, #a78bfa, #7c3aed)'};
          transition: opacity 0.2s ease;
        }
        .task-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.12);
        }
        .task-card:hover::before { opacity: 1; }
        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          transition: color 0.15s ease;
        }
        .action-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.05);
          opacity: 0;
          transition: opacity 0.15s ease;
          border-radius: 6px;
        }
        .action-btn:hover::before { opacity: 1; }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="task-card group relative rounded-xl p-4 pl-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shine reflection */}
        <div style={shineStyle} />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-[15px] font-semibold leading-snug"
              style={{
                color: isDone ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: 'rgba(255,255,255,0.2)',
              }}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <span
                className="status-badge"
                style={isDone
                  ? { background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }
                  : { background: 'rgba(167,139,250,0.1)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.2)' }
                }
              >
                <span className="badge-dot" style={{ background: isDone ? '#34d399' : '#a78bfa' }} />
                {isDone ? 'Completed' : 'Pending'}
              </span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => onToggle(task._id)}
            className="action-btn p-1.5"
            title={isDone ? 'Reopen' : 'Mark complete'}
            style={{ color: isDone ? 'rgba(52,211,153,0.6)' : 'rgba(167,139,250,0.6)' }}
          >
            {isDone ? <RotateCcw className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="action-btn p-1.5"
            title="Edit"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence mode="wait">
            {confirmDelete ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 rounded-lg px-2 py-1"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Sure?</span>
                <button
                  onClick={() => { onDelete(task._id); setConfirmDelete(false) }}
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors"
                  style={{ color: '#f87171' }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded px-1.5 py-0.5 text-[11px] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  No
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="delete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmDelete(true)}
                className="action-btn p-1.5"
                title="Delete"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      </motion.div>
    </>
  )
}

export default TaskCard