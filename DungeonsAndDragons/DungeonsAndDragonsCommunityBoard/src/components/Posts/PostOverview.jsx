import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../client.js'
import './Posts.css'

// shows a compact summary of a post for lists
// Props:
// - post: object with at least { id, title, display_name, username, avatar_url, created_at (or timestamp), likes_count }
// - showViewButton: optional boolean (default true)
const PostOverview = ({ post, showViewButton = true }) => {
  const navigate = useNavigate()
  const [likesCount, setLikesCount] = useState(post?.likes_count ?? post?.likes ?? 0)

  useEffect(() => {
    let mounted = true
    // if likes count not present on the post, fetch it
    async function fetchLikes() {
      if (!post?.id) return
      if (post?.likes_count != null || post?.likes != null) return
      try {
        const { data, error } = await supabase.from('post_likes').select('user_id').eq('post_id', post.id)
        if (error) throw error
        if (mounted) setLikesCount(data?.length ?? 0)
      } catch (err) {
        // ignore errors here; keep likesCount at 0
        // eslint-disable-next-line no-console
        console.error('Failed to load likes for post', err)
      }
    }
    fetchLikes()
    return () => { mounted = false }
  }, [post])

  if (!post) return null

  const avatar = post.avatar_url || post.userpfp || '/avatar-fallback.png'
  const displayName = post.display_name || post.userDisplayName || post.author || 'Unknown'
  const username = post.username || post.user_name || ''
  const created = post.created_at || post.timestamp || postInfoTimestampSafe(post)

  function postInfoTimestampSafe(p) {
    // fallback helper in case no timestamp fields
    return new Date().toISOString()
  }

  function elapsed(ts) {
    const t = Date.parse(ts)
    if (Number.isNaN(t)) return ''
    const diff = Date.now() - t
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  const handleLikeClick = async () => {
    // optimistic UI update: increment locally immediately
    setLikesCount(c => (c || 0) + 1)
    try {
      // attempt to persist the like. Allow anonymous likes (user_id null).
      // This may fail if your DB/RLS denies anonymous inserts; we don't revert the UI here.
      const { error } = await supabase.from('post_likes').insert([{ post_id: post.id, user_id: null }])
      if (error) {
        // eslint-disable-next-line no-console
        console.warn('Could not persist like:', error.message || error)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error persisting like:', err)
    }
  }

  return (
    <div className="post-overview">
      <div className="post-overview-top">
        <div className='overview-user-info'>
          <div className='overview-user-avatar'>
            <img src={avatar} alt={displayName} />
          </div>
          <div className='overview-user-names'>
            <span className="post-overview-author">{displayName}</span>
            {username && <span className="post-overview-username">@{username}</span>}
          </div>
        </div>
        <div className='overview-timestamp'>
          <span className="post-overview-time">{elapsed(created)}</span>
        </div>
      </div>
      <h3 className="post-overview-title">{post.title || '(no title)'}</h3>
      <div className='post-overview-bottom'>
        <button type="button" className="post-like-btn" onClick={handleLikeClick} aria-label={`Like post ${post.id}`}>
          ❤️ {likesCount} likes
        </button>
        {showViewButton && (
        <div className="post-overview-view-button">
          <button onClick={() => navigate(`/posts/${post.id}`)}>view post details</button>
        </div>
      )}
      </div>
    </div>
  )
}

export default PostOverview