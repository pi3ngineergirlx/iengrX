import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../client.js'

const AuthContext = createContext({ user: null, profile: null })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadInitialUser() {
      try {
        // supabase-js v2: supabase.auth.getUser()
        if (supabase?.auth?.getUser) {
          const res = await supabase.auth.getUser()
          const u = res?.data?.user ?? null
          if (!mounted) return
          setUser(u)
          if (u) {
            const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single()
            if (mounted) setProfile(data)
          }
        } else if (supabase?.auth?.user) {
          // older clients
          const u = supabase.auth.user()
          if (!mounted) return
          setUser(u)
          if (u) {
            const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single()
            if (mounted) setProfile(data)
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading initial user/profile', err)
      }
    }

    loadInitialUser()

    // subscribe to auth changes
    const listener = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single()
          setProfile(data)
        } else {
          setProfile(null)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error in auth state change handler', err)
      }
    })

    return () => {
      mounted = false
      // unsubscribe compatibly across supabase-js versions
      try {
        if (listener?.subscription?.unsubscribe) {
          listener.subscription.unsubscribe()
        } else if (listener?.data?.unsubscribe) {
          listener.data.unsubscribe()
        } else if (typeof listener?.unsubscribe === 'function') {
          listener.unsubscribe()
        }
      } catch (err) {
        // ignore unsubscribe errors
      }
    }
  }, [])

  return React.createElement(AuthContext.Provider, { value: { user, profile } }, children)
}

export const useAuth = () => useContext(AuthContext)
