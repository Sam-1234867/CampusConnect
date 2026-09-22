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

function Events() {
  const { user } = useAuth()
  const { userData } = useUser()

  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canManage =
    userData?.role === 'teacher' ||
    userData?.role === 'admin'

  async function loadEvents() {
    try {
      const snapshot = await getDocs(
        collection(db, 'events')
      )

      const eventData = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        .sort((a, b) => {
          const dateA = `${a.date || ''} ${a.time || ''}`
          const dateB = `${b.date || ''} ${b.time || ''}`

          return dateA.localeCompare(dateB)
        })

      setEvents(eventData)
    } catch (error) {
      console.error(error)
      setError('Unable to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  function clearForm() {
    setTitle('')
    setDate('')
    setTime('')
    setLocation('')
    setDescription('')
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setMessage('')

    if (
      !title.trim() ||
      !date ||
      !time ||
      !location.trim() ||
      !description.trim()
    ) {
      setError('Please complete all event fields.')
      return
    }

    setSaving(true)

    try {
      const eventData = {
        title: title.trim(),
        date,
        time,
        location: location.trim(),
        description: description.trim(),
      }

      if (editingId) {
        await updateDoc(
          doc(db, 'events', editingId),
          eventData
        )

        setMessage('Event updated successfully.')
      } else {
        await addDoc(
          collection(db, 'events'),
          {
            ...eventData,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
          }
        )

        setMessage('Event created successfully.')
      }

      clearForm()
      await loadEvents()
    } catch (error) {
      console.error(error)
      setError('Unable to save event.')
    } finally {
      setSaving(false)
    }
  }

  function editEvent(event) {
    setEditingId(event.id)
    setTitle(event.title || '')
    setDate(event.date || '')
    setTime(event.time || '')
    setLocation(event.location || '')
    setDescription(event.description || '')
  }

  async function deleteEvent(eventId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setMessage('')

    try {
      await deleteDoc(
        doc(db, 'events', eventId)
      )

      setMessage('Event deleted successfully.')

      await loadEvents()
    } catch (error) {
      console.error(error)
      setError('Unable to delete event.')
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Events</h1>
        <p>Loading events...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Events</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {canManage && (
        <>
          <h2>
            {editingId
              ? 'Edit Event'
              : 'Create Event'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
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
                  setDate(event.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="time">
                Time
              </label>

              <input
                id="time"
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="description">
                Description
              </label>

              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Event'
                  : 'Create Event'}
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

      <h2>Upcoming Events</h2>

      {events.length === 0 && (
        <p>No events found.</p>
      )}

      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>

          <p>Date: {event.date}</p>

          <p>Time: {event.time}</p>

          <p>Location: {event.location}</p>

          <p>{event.description}</p>

          {canManage && (
            <>
              <button
                type="button"
                onClick={() =>
                  editEvent(event)
                }
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteEvent(event.id)
                }
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </main>
  )
}

export default Events