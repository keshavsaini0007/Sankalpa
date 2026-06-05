

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'

const TaskModal = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const isEditing = !!task

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '' },
  })

  useEffect(() => {
    if (task) reset({ title: task.title, description: task.description || '' })
    else reset({ title: '', description: '' })
  }, [task, reset])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .modal-input {
              width: 100%;
              border-radius: 10px;
              border: 1px solid rgba(255,255,255,0.09);
              background: rgba(255,255,255,0.04);
              padding: 12px 14px;
              font-size: 14px;
              color: rgba(255,255,255,0.9);
              outline: none;
              transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
            }
            .modal-input::placeholder { color: rgba(255,255,255,0.2); }
            .modal-input:focus {
              border-color: rgba(124,58,237,0.6);
              background: rgba(124,58,237,0.06);
              box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
            }
            .modal-submit {
              width: 100%;
              border-radius: 10px;
              padding: 12px;
              font-size: 14px;
              font-weight: 600;
              color: #fff;
              background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
              border: none;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
            }
            .modal-submit::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, #9333ea, #6366f1);
              opacity: 0;
              transition: opacity 0.2s ease;
            }
            .modal-submit:hover::before { opacity: 1; }
            .modal-submit:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 24px rgba(124,58,237,0.4);
            }
            .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            .modal-submit span { position: relative; z-index: 1; }
            .modal-label {
              display: block;
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.35);
              margin-bottom: 8px;
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:max-w-[420px]"
            style={{
              background: 'rgba(10,8,18,0.98)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '-24px 0 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Gradient accent strip */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb)',
              }}
            />

            <div className="flex h-full flex-col">
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {isEditing ? 'Edit Task' : 'New Task'}
                  </h2>
                  <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {isEditing ? 'Update task details' : 'Add a new task to your list'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-1 flex-col gap-5 px-6 py-6"
              >
                <div>
                  <label className="modal-label">Title</label>
                  <input
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: { value: 100, message: 'Max 100 characters' },
                    })}
                    placeholder="What needs to be done?"
                    className="modal-input"
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1.5 text-xs"
                        style={{ color: 'rgba(248,113,113,0.9)' }}
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="modal-label">
                    Description <span style={{ opacity: 0.5, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>
                  </label>
                  <textarea
                    {...register('description', {
                      maxLength: { value: 500, message: 'Max 500 characters' },
                    })}
                    rows={5}
                    placeholder="Add more details..."
                    className="modal-input"
                    style={{ resize: 'none' }}
                  />
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1.5 text-xs"
                        style={{ color: 'rgba(248,113,113,0.9)' }}
                      >
                        {errors.description.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-auto">
                  <button type="submit" disabled={isLoading} className="modal-submit">
                    <span className="flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving…
                        </>
                      ) : isEditing ? 'Update Task' : 'Create Task'}
                    </span>
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