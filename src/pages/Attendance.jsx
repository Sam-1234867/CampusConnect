import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import db from '../services/firestore'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

function Attendance() {
  const { user } = useAuth()
  const { userData } = useUser()

  const [sessions, setSessions] = useState([])
  const [students, setStudents] = useState([])
  const [studentRecords, setStudentRecords] = useState({})
  const [records, setRecords] = useState({})

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const sessionsSnapshot = await getDocs(
          collection(db, 'attendanceSessions')
        )

        const sessionsData =
          sessionsSnapshot.docs.map(
            (document) => ({
              id: document.id,
              ...document.data(),
            })
          )

        setSessions(sessionsData)

        if (
          userData?.role === 'teacher' ||
          userData?.role === 'admin'
        ) {
          const usersSnapshot =
            await getDocs(
              collection(db, 'users')
            )

          const studentsData =
            usersSnapshot.docs
              .map((document) => ({
                id: document.id,
                ...document.data(),
              }))
              .filter(
                (student) =>
                  student.role === 'student' &&
                  student.status !== 'inactive'
              )

          setStudents(studentsData)
        }

        if (
          userData?.role === 'student' &&
          user
        ) {
          const recordsData = {}

          for (
            const session of sessionsData
          ) {
            const recordDocument =
              await getDoc(
                doc(
                  db,
                  'attendanceSessions',
                  session.id,
                  'records',
                  user.uid
                )
              )

            if (
              recordDocument.exists()
            ) {
              recordsData[session.id] =
                recordDocument.data()
            }
          }

          setStudentRecords(recordsData)
        }
      } catch (error) {
        console.error(
          'Attendance error:',
          error
        )

        setError(
          'Unable to load attendance.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      loadData()
    }
  }, [user, userData])

  async function createSession(event) {
    event.preventDefault()

    setError('')
    setMessage('')

    if (title.trim() === '') {
      setError(
        'Please enter a session title.'
      )
      return
    }

    if (date === '') {
      setError(
        'Please select a date.'
      )
      return
    }

    setSaving(true)

    try {
      const sessionData = {
        title: title.trim(),
        date,
        createdBy: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
      }

      const sessionReference =
        await addDoc(
          collection(
            db,
            'attendanceSessions'
          ),
          sessionData
        )

      setSessions(
        (currentSessions) => [
          ...currentSessions,
          {
            id: sessionReference.id,
            ...sessionData,
          },
        ]
      )

      setTitle('')
      setDate('')

      setMessage(
        'Attendance session created successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        'Unable to create attendance session.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function saveAttendance(
    sessionId
  ) {
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const sessionRecords =
        records[sessionId] || {}

      for (
        const student of students
      ) {
        const status =
          sessionRecords[
            student.id
          ] || 'Absent'

        await setDoc(
          doc(
            db,
            'attendanceSessions',
            sessionId,
            'records',
            student.id
          ),
          {
            studentId: student.id,
            status,
            markedBy: user.uid,
            markedAt:
              serverTimestamp(),
          }
        )
      }

      setMessage(
        'Attendance saved successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        'Unable to save attendance.'
      )
    } finally {
      setSaving(false)
    }
  }

  function changeStatus(
    sessionId,
    studentId,
    status
  ) {
    setRecords(
      (currentRecords) => ({
        ...currentRecords,
        [sessionId]: {
          ...currentRecords[
            sessionId
          ],
          [studentId]: status,
        },
      })
    )
  }

  if (loading) {
    return (
      <main>
        <h1>Attendance</h1>
        <p>
          Loading attendance...
        </p>
      </main>
    )
  }

  const attendanceValues =
    Object.values(studentRecords)

  const presentCount =
    attendanceValues.filter(
      (record) =>
        record.status === 'Present'
    ).length

  const absentCount =
    attendanceValues.filter(
      (record) =>
        record.status === 'Absent'
    ).length

  const lateCount =
    attendanceValues.filter(
      (record) =>
        record.status === 'Late'
    ).length

  const totalMarked =
    presentCount +
    absentCount +
    lateCount

  const attendancePercentage =
    totalMarked > 0
      ? Math.round(
          (presentCount /
            totalMarked) *
            100
        )
      : 0

  return (
    <main>
      <h1>Attendance</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {(userData?.role === 'teacher' ||
        userData?.role === 'admin') && (
        <>
          <h2>
            Create Attendance Session
          </h2>

          <form
            onSubmit={createSession}
          >
            <div>
              <label htmlFor="title">
                Session Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Creating...'
                : 'Create Session'}
            </button>
          </form>
        </>
      )}

      {userData?.role ===
        'student' && (
        <>
          <h2>
            My Attendance Summary
          </h2>

          <p>
            Attendance:{' '}
            {attendancePercentage}%
          </p>

          <p>
            Present: {presentCount}
          </p>

          <p>
            Absent: {absentCount}
          </p>

          <p>
            Late: {lateCount}
          </p>
        </>
      )}

      {sessions.length === 0 && (
        <p>
          No attendance sessions
          found.
        </p>
      )}

      {sessions.map(
        (session) => (
          <div
            key={session.id}
          >
            <h2>
              {session.title}
            </h2>

            <p>
              Date: {session.date}
            </p>

            {userData?.role ===
            'student' ? (
              <div>
                <p>
                  Status:{' '}
                  {studentRecords[
                    session.id
                  ]?.status ||
                    'Not marked yet'}
                </p>
              </div>
            ) : (
              <>
                {students.map(
                  (student) => (
                    <div
                      key={
                        student.id
                      }
                    >
                      <p>
                        {student.name}
                      </p>

                      <select
                        value={
                          records[
                            session.id
                          ]?.[
                            student.id
                          ] ||
                          'Absent'
                        }
                        onChange={(
                          event
                        ) =>
                          changeStatus(
                            session.id,
                            student.id,
                            event.target
                              .value
                          )
                        }
                      >
                        <option value="Present">
                          Present
                        </option>

                        <option value="Absent">
                          Absent
                        </option>

                        <option value="Late">
                          Late
                        </option>
                      </select>
                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    saveAttendance(
                      session.id
                    )
                  }
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Attendance'}
                </button>
              </>
            )}
          </div>
        )
      )}
    </main>
  )
}

export default Attendance