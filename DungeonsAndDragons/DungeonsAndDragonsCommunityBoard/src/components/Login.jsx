import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../client.js'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'magic'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/posts'

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      // sign-in succeeded, navigate back
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // sign up the user (v2)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // optional: initial user_metadata
        options: {
          data: { display_name: displayName || null }
        }
      })
      if (error) throw error
      // Account created — if using email confirmations, the user may need to confirm first.
      // Redirect to posts or a "check your email" page
      navigate('/posts', { replace: true })
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      // show a message that magic link was sent
      setError('Magic link sent — check your email.')
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '24px auto', padding: 16 }}>
      <h2>{mode === 'signup' ? 'Create account' : mode === 'magic' ? 'Sign in (magic link)' : 'Sign in'}</h2>

      <nav style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setMode('signin')} disabled={mode === 'signin'}>Sign in</button>{' '}
        <button type="button" onClick={() => setMode('signup')} disabled={mode === 'signup'}>Sign up</button>{' '}
        <button type="button" onClick={() => setMode('magic')} disabled={mode === 'magic'}>Magic link</button>
      </nav>

      <form onSubmit={mode === 'signup' ? handleSignUp : mode === 'magic' ? handleMagicLink : handleSignIn}>
        {mode === 'signup' && (
          <>
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Optional display name"
            />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {mode !== 'magic' && (
          <>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === 'signin' || mode === 'signup'}
            />
          </>
        )}

        {error && <div style={{ color: error.startsWith('Magic link') ? 'green' : 'crimson', marginTop: 8 }}>{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Working...' : mode === 'signup' ? 'Create account' : mode === 'magic' ? 'Send magic link' : 'Sign in'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12 }}>
        After successful sign-in your session will be stored and your current pages (like CreatePost) will receive the authenticated user via your auth provider / hook.
      </p>
    </div>
  )
}