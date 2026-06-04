import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'

const TaskModal = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description || '' })
    } else {
      reset({ title: '', description: '' })
    }
  }, [task, reset])

  const onSubmitForm = (data) => {
    onSubmit(data)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full border-l border-border bg-dark-bg sm:max-w-md"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-white">
                  {isEditing ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-sm p-1.5 text-muted transition-colors hover:bg-surface hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitForm)}
                className="flex flex-1 flex-col gap-5 p-6"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted">
                    Title
                  </label>
                  <input
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: { value: 100, message: 'Max 100 characters' },
                    })}
                    placeholder="What needs to be done?"
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted">
                    Description{' '}
                    <span className="text-xs text-muted">(optional)</span>
                  </label>
                  <textarea
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: 'Max 500 characters',
                      },
                    })}
                    rows={5}
                    placeholder="Add more details..."
                    className="w-full resize-none rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="mt-auto">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading
                      ? 'Saving...'
                      : isEditing
                        ? 'Update Task'
                        : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TaskModal
