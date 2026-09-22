import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

import db from '../services/firestore'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

function Announcements() {
  const { user } = useAuth()
  const { userData } = useUser()

  const [announcements, setAnnouncements] = useState([])

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canManage =
    userData?.role === 'teacher' ||
    userData?.role === 'admin'

  async function loadAnnouncements() {
    try {
      const snapshot = await getDocs(
        collection(db, 'announcements')
      )

      const data = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        .sort((a, b) => {
          const timeA =
            a.createdAt?.seconds ||
            0

          const timeB =
            b.createdAt?.seconds ||
            0

          return timeB - timeA
        })

      setAnnouncements(data)
    } catch (error) {
      console.error(error)
      setError('Unable to load announcements.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  function clearForm() {
    setTitle('')
    setMessage('')
    setAudience('all')
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (title.trim() === '') {
      setError('Please enter a title.')
      return
    }

    if (message.trim() === '') {
      setError('Please enter a message.')
      return
    }

    setSaving(true)

    try {
      const announcementData = {
        title: title.trim(),
        message: message.trim(),
        audience,
      }

      if (editingId) {
        await updateDoc(
          doc(db, 'announcements', editingId),
          announcementData
        )

        setSuccess(
          'Announcement updated successfully.'
        )
      } else {
        await addDoc(
          collection(db, 'announcements'),
          {
            ...announcementData,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
          }
        )

        setSuccess(
          'Announcement created successfully.'
        )
      }

      clearForm()

      await loadAnnouncements()
    } catch (error) {
      console.error(error)
      setError('Unable to save announcement.')
    } finally {
      setSaving(false)
    }
  }

  function editAnnouncement(announcement) {
    setEditingId(announcement.id)
    setTitle(announcement.title || '')
    setMessage(announcement.message || '')
    setAudience(
      announcement.audience || 'all'
    )
  }

  async function deleteAnnouncement(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this announcement?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await deleteDoc(
        doc(db, 'announcements', id)
      )

      setSuccess(
        'Announcement deleted successfully.'
      )

      await loadAnnouncements()
    } catch (error) {
      console.error(error)
      setError(
        'Unable to delete announcement.'
      )
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Announcements</h1>
        <p>Loading announcements...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Announcements</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {canManage && (
        <>
          <h2>
            {editingId
              ? 'Edit Announcement'
              : 'Create Announcement'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="announcementTitle">
                Title
              </label>

              <input
                id="announcementTitle"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="announcementMessage">
                Message
              </label>

              <input
                id="announcementMessage"
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="audience">
                Audience
              </label>

              <select
                id="audience"
                value={audience}
                onChange={(event) =>
                  setAudience(event.target.value)
                }
              >
                <option value="all">
                  All Users
                </option>

                <option value="students">
                  Students
                </option>

                <option value="teachers">
                  Teachers
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Announcement'
                  : 'Create Announcement'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </form>
        </>
      )}

      <h2>Latest Announcements</h2>

      {announcements.length === 0 && (
        <p>No announcements found.</p>
      )}

      {announcements.map(
        (announcement) => (
          <div key={announcement.id}>
            <h2>{announcement.title}</h2>

            <p>
              {announcement.message}
            </p>

            <p>
              Audience:{' '}
              {announcement.audience ||
                'All Users'}
            </p>

            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    editAnnouncement(
                      announcement
                    )
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteAnnouncement(
                      announcement.id
                    )
                  }
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )
      )}
    </main>
  )
}

export default Announcements