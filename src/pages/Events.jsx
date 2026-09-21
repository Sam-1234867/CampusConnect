import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import db from '../services/firestore'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getEvents() {
      try {
        const eventsCollection = collection(db, 'events')
        const eventsSnapshot = await getDocs(eventsCollection)

        const eventsData = eventsSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))

        setEvents(eventsData)
      } catch (error) {
        console.error(error)
        setError('Unable to load events.')
      } finally {
        setLoading(false)
      }
    }

    getEvents()
  }, [])

  return (
    <div>
      <h1>Events</h1>

      {loading && <p>Loading events...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>No events found.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <div>
          {events.map((event) => (
            <div key={event.id}>
              <h2>{event.title}</h2>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events