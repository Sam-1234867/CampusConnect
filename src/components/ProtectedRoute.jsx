import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import Loader from './Loader'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading: authLoading } = useAuth()
  const { userData, loading: userLoading } = useUser()

  if (authLoading || userLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!userData) {
    return (
      <div>
        <h1>User Data Not Found</h1>
        <p>Firebase login works, but the user information was not found.</p>
        <p>User UID: {user.uid}</p>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return (
      <div>
        <h1>Not Authorized</h1>
        <p>Your account role is:</p>
        <strong>{userData.role}</strong>

        <p>Required role:</p>
        <strong>{allowedRoles.join(', ')}</strong>
      </div>
    )
  }

  return children
}

export default ProtectedRoute