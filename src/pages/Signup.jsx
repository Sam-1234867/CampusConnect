import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import db from '../services/firestore'

function Signup() {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event) {
    event.preventDefault()

    setError('')

    if (name.trim() === '') {
      setError('Please enter your name.')
      return
    }

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

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      )
      return
    }

    if (confirmPassword === '') {
      setError('Please confirm your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )

      const user = userCredential.user

      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: name.trim(),
          email: email.trim(),
          role: 'student',
          status: 'active',
          createdAt: serverTimestamp(),
        }
      )

      navigate('/student')
    } catch (error) {
      console.error(error)

      if (
        error.code ===
        'auth/email-already-in-use'
      ) {
        setError(
          'This email is already registered.'
        )
      } else {
        setError(
          'Unable to create account. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Signup</h1>

      <form
        onSubmit={handleSignup}
        noValidate
      >
        <div>
          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating account...'
            : 'Signup'}
        </button>
      </form>
    </div>
  )
}

export default Signup