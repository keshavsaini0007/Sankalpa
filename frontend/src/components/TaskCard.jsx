import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Trash2, CheckCircle, RotateCcw } from 'lucide-react'
import { formatDate } from '../utils/helpers'

const statusBorder = {
  pending: 'border-l-accent',
  completed: 'border-l-green-accent',
}

const statusBadge = {
  pending: 'bg-accent/10 text-accent border-accent/20',
  completed: 'bg-green-accent/10 text-green-accent border-green-accent/20',
}

const TaskCard = ({ task, onEdit, onDelete, onToggle, index = 0 }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative border-l-4 ${statusBorder[task.status]} rounded-sm border border-border bg-surface p-4 transition-all hover:border-border hover:shadow-lg hover:shadow-black/20`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`truncate text-base font-semibold ${task.status === 'completed' ? 'text-muted line-through' : 'text-white'}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${statusBadge[task.status]}`}
            >
              {task.status === 'pending' ? 'Pending' : 'Completed'}
            </span>
            <span className="text-xs text-muted">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onToggle(task._id)}
          className="rounded-sm p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-accent"
          title={task.status === 'pending' ? 'Mark complete' : 'Reopen'}
        >
          {task.status === 'pending' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="rounded-sm p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-white"
          title="Edit"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">Sure?</span>
            <button
              onClick={() => {
                onDelete(task._id)
                setConfirmDelete(false)
              }}
              className="rounded-sm px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-400/10"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-sm px-1.5 py-0.5 text-xs text-muted hover:bg-surface-hover"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-sm p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default TaskCard
