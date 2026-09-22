import { useUser } from '../context/UserContext'

function TeacherDashboard() {
  const { userData } = useUser()

  return (
    <main>
      <h1>Teacher Dashboard</h1>

      <p>
        Welcome, {userData?.name || 'Teacher'}.
      </p>

      <h2>Quick Summary</h2>

      <p>Attendance: Manage student attendance</p>
      <p>Events: Manage campus events</p>
      <p>Announcements: Manage announcements</p>
    </main>
  )
}

export default TeacherDashboard