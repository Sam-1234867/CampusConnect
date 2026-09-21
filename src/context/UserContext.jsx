import { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

import { useAuth } from './AuthContext'
import db from '../services/firestore'

const UserContext = createContext()

function UserProvider({ children }) {
  const { user } = useAuth()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUserData() {
      if (!user) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const userDocument = await getDoc(doc(db, 'users', user.uid))

        if (userDocument.exists()) {
          setUserData(userDocument.data())
        } else {
          setUserData(null)
        }
      } catch (error) {
        setUserData(null)
      }

      setLoading(false)
    }

    getUserData()
  }, [user])

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  )
}

function useUser() {
  return useContext(UserContext)
}

export { UserProvider, useUser }