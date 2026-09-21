import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import db from '../services/firestore'

function Login() {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    setError('')

    if (email.trim() === '') {
      setError('Please enter your email.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }

    if (password === '') {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

      const user = userCredential.user

      const userDocument = await getDoc(
        doc(db, 'users', user.uid)
      )

      if (!userDocument.exists()) {
        setError('User information was not found.')
        return
      }

      const userData = userDocument.data()

      if (userData.role === 'student') {
        navigate('/student')
      } else if (userData.role === 'teacher') {
        navigate('/teacher')
      } else if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        setError('Invalid user role.')
      }
    } catch (error) {
      console.error('Firebase login error:', error)
      setError(`Firebase error: ${error.code}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login