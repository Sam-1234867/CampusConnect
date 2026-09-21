import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { auth, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/login">Login</Link>

      {' | '}

      <Link to="/signup">Signup</Link>

      {user && (
        <>
          {' | '}

          <Link to="/student">Student</Link>

          {' | '}

          <Link to="/teacher">Teacher</Link>

          {' | '}

          <Link to="/admin">Admin</Link>

          {' | '}

          <Link to="/attendance">Attendance</Link>

          {' | '}

          <Link to="/events">Events</Link>

          {' | '}

          <Link to="/announcements">Announcements</Link>

          {' | '}

          <Link to="/users">Users</Link>

          {' | '}

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  )
}

export default Navbar