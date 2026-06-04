import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Plus, ListTodo, ClipboardCheck, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import { useTasks } from '../hooks/useTasks'

const StatCard = ({ icon: Icon, label, value, accent }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 800
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div
      ref={ref}
      className="rounded-sm border border-border bg-surface p-4"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-sm"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="font-heading text-2xl font-semibold text-white">
            {display}
          </p>
        </div>
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16">
    <FileText className="mb-4 h-16 w-16 text-muted/30" />
    <h3 className="font-heading text-lg font-semibold text-white">
      No tasks yet
    </h3>
    <p className="mt-1 text-sm text-muted">
      Create your first task to get started
    </p>
  </div>
)

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const debounceRef = useRef(null)

  const {
    tasks,
    total,
    page,
    totalPages,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
  } = useTasks()

  const params = {
    ...(search && { search }),
    ...(status && { status }),
    page,
    limit: 10,
  }

  useEffect(() => {
    const sp = new URLSearchParams()
    if (search) sp.set('search', search)
    if (status) sp.set('status', status)
    if (page > 1) sp.set('page', page)
    setSearchParams(sp, { replace: true })
  }, [search, status, page, setSearchParams])

  useEffect(() => {
    fetchTasks(params)
  }, [fetchTasks, search, status, page])

  const handleSearchChange = useCallback((val) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchTasks({ ...params, search: val, page: 1 })
    }, 300)
  }, [fetchTasks, params])

  const handleStatusChange = useCallback((val) => {
    setStatus(val)
    fetchTasks({ ...params, status: val, page: 1 })
  }, [fetchTasks, params])

  const handlePageChange = useCallback((newPage) => {
    fetchTasks({ ...params, page: newPage })
  }, [fetchTasks, params])

  const handleCreate = async (data) => {
    setSubmitLoading(true)
    try {
      await createTask(data)
      setModalOpen(false)
      fetchTasks(params)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleUpdate = async (data) => {
    if (!editingTask) return
    setSubmitLoading(true)
    try {
      await updateTask(editingTask._id, data)
      setEditingTask(null)
      setModalOpen(false)
      fetchTasks(params)
    } finally {
      setSubmitLoading(false)
    }
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <StatCard icon={ListTodo} label="Total Tasks" value={total} accent="#3b82f6" />
          <StatCard icon={FileText} label="Pending" value={pendingCount} accent="#f59e0b" />
          <StatCard icon={ClipboardCheck} label="Completed" value={completedCount} accent="#22c55e" />
        </motion.div>

        <div className="mb-6">
          <FilterBar
            search={search}
            setSearch={handleSearchChange}
            status={status}
            setStatus={handleStatusChange}
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={openEdit}
                  onDelete={async (id) => {
                    await deleteTask(id)
                    fetchTasks(params)
                  }}
                  onToggle={async (id) => {
                    await toggleStatus(id)
                    fetchTasks(params)
                  }}
                />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </main>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openCreate}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-sm bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-accent/90 hover:shadow-[0_0_25px_var(--color-accent-glow)]"
      >
        <Plus className="h-5 w-5" />
        New Task
      </motion.button>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        isLoading={submitLoading}
      />
    </div>
  )
}

export default Dashboard
