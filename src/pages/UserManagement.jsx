import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import db from '../services/firestore'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getUsers() {
      try {
        const usersCollection = collection(db, 'users')
        const usersSnapshot = await getDocs(usersCollection)

        const usersData = usersSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))

        setUsers(usersData)
      } catch (error) {
        console.error(error)
        setError('Unable to load users.')
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  return (
    <div>
      <h1>User Management</h1>

      {loading && <p>Loading users...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserManagement