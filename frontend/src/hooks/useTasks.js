import { useState, useCallback } from 'react'
import api from '../api/axios'
import { getErrorMessage } from '../utils/helpers'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/v1/tasks', { params })
      const { tasks: t, total: tot, page: p, totalPages: tp } = res.data.data
      setTasks(t)
      setTotal(tot)
      setPage(p)
      setTotalPages(tp)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTask = useCallback(async (data) => {
    await api.post('/api/v1/tasks', data)
  }, [])

  const updateTask = useCallback(async (id, data) => {
    await api.patch(`/api/v1/tasks/${id}`, data)
  }, [])

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/api/v1/tasks/${id}`)
  }, [])

  const toggleStatus = useCallback(async (id) => {
    await api.patch(`/api/v1/tasks/${id}/toggle`)
  }, [])

  return {
    tasks,
    total,
    page,
    totalPages,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
  }
}
