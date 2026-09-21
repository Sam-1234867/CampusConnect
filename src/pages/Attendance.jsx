import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import db from '../services/firestore'

function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getAttendance() {
      try {
        const attendanceCollection = collection(db, 'attendance')
        const attendanceSnapshot = await getDocs(attendanceCollection)

        const attendanceData = attendanceSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))

        setAttendance(attendanceData)
      } catch (error) {
        console.error(error)
        setError('Unable to load attendance.')
      } finally {
        setLoading(false)
      }
    }

    getAttendance()
  }, [])

  return (
    <div>
      <h1>Attendance</h1>

      {loading && <p>Loading attendance...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && attendance.length === 0 && (
        <p>No attendance records found.</p>
      )}

      {!loading && !error && attendance.length > 0 && (
        <div>
          {attendance.map((record) => (
            <div key={record.id}>
              <p>Student ID: {record.studentId}</p>
              <p>Date: {record.date}</p>
              <p>Status: {record.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Attendance