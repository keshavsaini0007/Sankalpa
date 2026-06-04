import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth()

  if (isLoading) return <Loader />
  if (!token) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
