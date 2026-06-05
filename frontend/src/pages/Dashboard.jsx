

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, ListTodo, ClipboardCheck, FileText, Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import Pagination from '../components/Pagination'
import SkeletonTaskCard from '../components/SkeletonTaskCard'
import { useTasks } from '../hooks/useTasks'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../utils/helpers'

/* ─── StatCard ─── */
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.max(1, Math.ceil(value / (800 / 16)))
    const timer = setInterval(() => {
      start = Math.min(start + step, value)
      setDisplay(start)
      if (start >= value) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Subtle corner glow */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0,
          width: 80, height: 80,
          background: `radial-gradient(circle at top right, ${color}20, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
            {label}
          </p>
          <p className="text-2xl font-bold tabular-nums text-white" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
            {display}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── FilterBar ─── */
const FilterBar = ({ search, setSearch, status, setStatus }) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search tasks…"
        className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.85)',
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.background = 'rgba(124,58,237,0.05)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
      />
    </div>
    <div className="relative">
      <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="appearance-none rounded-xl py-2.5 pl-9 pr-10 text-sm transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: status ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
          outline: 'none',
          cursor: 'pointer',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        <option value="" style={{ background: '#0d0b18' }}>All status</option>
        <option value="pending" style={{ background: '#0d0b18' }}>Pending</option>
        <option value="completed" style={{ background: '#0d0b18' }}>Completed</option>
      </select>
    </div>
  </div>
)

/* ─── EmptyState ─── */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full flex flex-col items-center justify-center py-20"
  >
    <div
      className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
      style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
    >
      <FileText className="h-7 w-7" style={{ color: 'rgba(167,139,250,0.6)' }} />
    </div>
    <h3 className="text-base font-semibold text-white">No tasks yet</h3>
    <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
      Create your first task to get started
    </p>
  </motion.div>
)

/* ─── Dashboard ─── */
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const debounceRef = useRef(null)
  const { addToast } = useToast()

  const { tasks, total, page, totalPages, isLoading, fetchTasks, createTask, updateTask, deleteTask, toggleStatus } = useTasks()

  const params = { ...(search && { search }), ...(status && { status }), page, limit: 10 }

  useEffect(() => {
    const sp = new URLSearchParams()
    if (search) sp.set('search', search)
    if (status) sp.set('status', status)
    if (page > 1) sp.set('page', page)
    setSearchParams(sp, { replace: true })
  }, [search, status, page, setSearchParams])

  useEffect(() => { fetchTasks(params) }, [fetchTasks, search, status, page])

  const handleSearchChange = useCallback((val) => {
    setSearch(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchTasks({ ...params, search: val, page: 1 }), 300)
  }, [fetchTasks, params])

  const handleStatusChange = useCallback((val) => {
    setStatus(val)
    fetchTasks({ ...params, status: val, page: 1 })
  }, [fetchTasks, params])

  const handlePageChange = useCallback((p) => fetchTasks({ ...params, page: p }), [fetchTasks, params])

  const withToast = async (fn, msg) => {
    try { await fn(); addToast(msg, 'success'); fetchTasks(params) }
    catch (err) { addToast(getErrorMessage(err), 'error') }
  }

  const handleCreate = async (data) => {
    setSubmitLoading(true)
    await withToast(() => createTask(data), 'Task created')
    setSubmitLoading(false); setModalOpen(false)
  }

  const handleUpdate = async (data) => {
    if (!editingTask) return
    setSubmitLoading(true)
    await withToast(() => updateTask(editingTask._id, data), 'Task updated')
    setSubmitLoading(false); setEditingTask(null); setModalOpen(false)
  }

  const handleDelete = (id) => withToast(() => deleteTask(id), 'Task deleted')
  const handleToggle = (id) => withToast(() => toggleStatus(id), 'Status updated')

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen" style={{ background: '#08070f' }}>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard icon={ListTodo}     label="Total Tasks" value={total}          color="#7c3aed" delay={0}    />
          <StatCard icon={FileText}     label="Pending"     value={pendingCount}   color="#f59e0b" delay={0.07} />
          <StatCard icon={ClipboardCheck} label="Completed" value={completedCount} color="#22c55e" delay={0.14} />
        </div>

        {/* Filters */}
        <div className="mb-5">
          <FilterBar search={search} setSearch={handleSearchChange} status={status} setStatus={handleStatusChange} />
        </div>

        {/* Task grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonTaskCard key={i} />)}
            </motion.div>
          ) : tasks.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tasks.map((task, i) => (
                <TaskCard key={task._id} task={task} index={i} onEdit={t => { setEditingTask(t); setModalOpen(true) }} onDelete={handleDelete} onToggle={handleToggle} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-7">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </main>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}
        whileTap={{ scale: 0.94 }}
        onClick={() => { setEditingTask(null); setModalOpen(true) }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
          border: '1px solid rgba(124,58,237,0.5)',
        }}
      >
        <Plus className="h-4 w-4" />
        New Task
      </motion.button>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        isLoading={submitLoading}
      />
    </div>
  )
}

export default Dashboard