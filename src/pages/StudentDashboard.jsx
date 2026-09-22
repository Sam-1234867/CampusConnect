import { useUser } from '../context/UserContext'

function StudentDashboard() {
  const { userData } = useUser()

  return (
    <main>
      <h1>Student Dashboard</h1>

      <p>
        Welcome, {userData?.name || 'Student'}.
      </p>

      <h2>Quick Summary</h2>

      <p>Attendance: View your attendance</p>
      <p>Events: View upcoming events</p>
      <p>Announcements: View latest announcements</p>
    </main>
  )
}

export default StudentDashboard