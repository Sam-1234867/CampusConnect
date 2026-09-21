import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import db from '../services/firestore'

function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const announcementsCollection = collection(db, 'announcements')
        const announcementsSnapshot = await getDocs(announcementsCollection)

        const announcementsData = announcementsSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))

        setAnnouncements(announcementsData)
      } catch (error) {
        console.error(error)
        setError('Unable to load announcements.')
      } finally {
        setLoading(false)
      }
    }

    getAnnouncements()
  }, [])

  return (
    <div>
      <h1>Announcements</h1>

      {loading && <p>Loading announcements...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && announcements.length === 0 && (
        <p>No announcements found.</p>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div>
          {announcements.map((announcement) => (
            <div key={announcement.id}>
              <h2>{announcement.title}</h2>
              <p>Date: {announcement.date}</p>
              <p>{announcement.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Announcements