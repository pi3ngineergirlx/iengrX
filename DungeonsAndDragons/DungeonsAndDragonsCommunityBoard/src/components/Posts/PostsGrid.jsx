import React, { useEffect, useState } from 'react'
import { supabase } from '../../client.js'
import PostOverview from './PostOverview'
import './Posts.css'

const CATEGORIES = ['gaming', 'story', 'cosplay']

function matchesCategory(post, cat) {
  if (!post) return false
  // direct category field
  if (post.category && String(post.category).toLowerCase() === cat) return true
  // tags as array
  if (Array.isArray(post.tags) && post.tags.map(t => String(t).toLowerCase()).includes(cat)) return true
  // tags as comma string
  if (typeof post.tags === 'string' && post.tags.split(',').map(t => t.trim().toLowerCase()).includes(cat)) return true
  // fallback: check title for category keyword
  if (post.title && String(post.title).toLowerCase().includes(cat)) return true
  return false
}

const PostsGrid = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
        if (error) throw error
        if (!mounted) return
        setPosts(data || [])
      } catch (err) {
        console.error('Failed to load posts', err)
        setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPosts()

    // realtime subscription to keep list updated
    let subscription = null
    try {
      if (supabase.channel) {
        // supabase-js v2
        subscription = supabase.channel('public:posts')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
            if (!mounted) return
            const evt = payload.eventType || payload.type || payload.event
            const newRow = payload.new ?? payload.record ?? payload
            const oldRow = payload.old ?? payload.oldRecord
            if (evt === 'INSERT' || evt === 'insert') {
              setPosts(prev => [newRow, ...prev])
            } else if (evt === 'UPDATE' || evt === 'update') {
              setPosts(prev => prev.map(p => (p.id === newRow.id ? newRow : p)))
            } else if (evt === 'DELETE' || evt === 'delete') {
              setPosts(prev => prev.filter(p => p.id !== (oldRow?.id ?? payload?.record?.id)))
            }
          })
          .subscribe()
      } else if (supabase.from) {
        // supabase-js v1
        subscription = supabase.from('posts').on('*', payload => {
          const evt = payload.eventType || payload.event
          if (evt === 'INSERT') setPosts(prev => [payload.new, ...prev])
          if (evt === 'UPDATE') setPosts(prev => prev.map(p => (p.id === payload.new.id ? payload.new : p)))
          if (evt === 'DELETE') setPosts(prev => prev.filter(p => p.id !== payload.old.id))
        }).subscribe()
      }
    } catch (err) {
      // if realtime not available, ignore
      console.warn("Realtime subscription failed (it's optional)", err)
    }

    return () => {
      mounted = false
      try {
        if (subscription?.unsubscribe) subscription.unsubscribe()
        if (subscription?.remove) subscription.remove()
      } catch (err) {
        // ignore
      }
    }
  }, [])

  if (loading) return <div>Loading posts...</div>
  if (error) return <div className="form-error">{error}</div>

  const postsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = posts.filter(p => matchesCategory(p, cat))
    return acc
  }, {})

  return (
    <div className="posts-grid">
      {CATEGORIES.map(cat => (
        <section key={cat} className={`posts-column posts-column--${cat}`}>
          <header className="posts-column__header"><h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3></header>
          <div className="posts-column__list">
            {postsByCategory[cat].length === 0 ? (
              <div className="empty">No posts yet</div>
            ) : (
              postsByCategory[cat].map(p => (
                <PostOverview key={p.id} post={p} />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

export default PostsGrid