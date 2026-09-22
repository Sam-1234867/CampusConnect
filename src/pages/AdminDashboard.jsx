import { useUser } from '../context/UserContext'

function AdminDashboard() {
  const { userData } = useUser()

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome, {userData?.name || 'Admin'}.
      </p>

      <h2>Quick Summary</h2>

      <p>Users: Manage users</p>
      <p>Attendance: Manage attendance</p>
      <p>Events: Manage campus events</p>
      <p>Announcements: Manage announcements</p>
    </main>
  )
}

export default AdminDashboard