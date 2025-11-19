import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../client.js'
import { useAuth } from '../../hooks/useAuth'
import './Posts.css'

const PostDetailView = ({ refresh } = {}) => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [postInfo, setPostInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // editing state
  const [editing, setEditing] = useState(false)
  const [editState, setEditState] = useState({ title: '', text: '', image: null })

  // likes
  const [likesCount, setLikesCount] = useState(0)
  const [likedByMe, setLikedByMe] = useState(false)

  // comments
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!postId) return
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, user])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      // fetch post
      const { data: post, error: postErr } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle()
      if (postErr) throw postErr
      if (!post) {
        setError('Post not found')
        setLoading(false)
        return
      }
  setPostInfo(post)
  setEditState({ title: post.title || '', text: post.content || '', image: null })
  // comments are stored as a JSONB array on the post row (posts.comments)
  setComments(post.comments || [])

  // fetch likes (get count and whether current user liked)
        try {
          const { data: likesData, error: likesErr } = await supabase
            .from('post_likes')
            .select('user_id')
            .eq('post_id', postId)
          if (likesErr) {
            // If post_likes table is missing or another error occurs, don't fail the whole view.
            // Fallback to the denormalized `likes` column on the post when available.
            // eslint-disable-next-line no-console
            console.warn('Could not load post_likes:', likesErr.message || likesErr)
            setLikesCount(post?.likes ?? 0)
            setLikedByMe(false)
          } else {
            setLikesCount(likesData?.length ?? (post?.likes ?? 0))
            setLikedByMe(Boolean(user && likesData?.some(l => l.user_id === user.id)))
          }
        } catch (likesErr) {
          // Defensive: any unexpected error shouldn't block the entire page.
          // eslint-disable-next-line no-console
          console.warn('Error fetching likes:', likesErr)
          setLikesCount(post?.likes ?? 0)
          setLikedByMe(false)
        }

      // comments are already populated from the post row (see above). No separate table query.

    } catch (err) {
      console.error('Load post error', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditState(prev => ({ ...prev, [name]: value }))
  }

  const handleEditFile = (e) => {
    const file = e.target.files?.[0] ?? null
    setEditState(prev => ({ ...prev, image: file }))
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!user || !postInfo) return
    if (user.id !== postInfo.user_id) {
      setError('You are not allowed to edit this post')
      return
    }
    setBusy(true)
    try {
      let image_url = postInfo.image_url || null
      if (editState.image) {
        const file = editState.image
        const filePath = `${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('post-images').upload(filePath, file)
        if (uploadError) throw uploadError
        const publicObj = supabase.storage.from('post-images').getPublicUrl(filePath)
        image_url = publicObj?.publicURL || publicObj?.data?.publicUrl || null
      }

      const updates = {
        title: editState.title || null,
        content: editState.text,
        image_url
      }

      const { data, error: updateErr } = await supabase.from('posts').update(updates).eq('id', postId).select().single()
      if (updateErr) throw updateErr
      setPostInfo(data)
      setEditing(false)
      if (typeof refresh === 'function') await refresh()
    } catch (err) {
      console.error('Save edit error', err)
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  const toggleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setBusy(true)
    try {
      if (likedByMe) {
        // remove like
        const { error } = await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id })
        if (error) throw error
        setLikesCount(c => Math.max(0, c - 1))
        setLikedByMe(false)
      } else {
        const { error } = await supabase.from('post_likes').insert([{ post_id: postId, user_id: user.id }])
        if (error) throw error
        setLikesCount(c => c + 1)
        setLikedByMe(true)
      }
    } catch (err) {
      console.error('Like toggle error', err)
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    // Allow anonymous comments: user may be null. Store user_id when available,
    // otherwise insert a comment with user_id = null and a snapshot display name.
    if (!newComment?.trim()) return
    setBusy(true)
    try {
      // Build a new comment object and append it to the post.comments JSONB array.
      const newCommentObj = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random()*100000)}`,
        post_id: postId,
        user_id: user?.id ?? null,
        content: newComment,
        display_name: profile?.display_name ?? (user?.email ? user.email.split('@')[0] : 'Anonymous'),
        avatar_url: profile?.avatar_url ?? null,
        created_at: new Date().toISOString()
      }

      // Create the new array locally and send the full array to Supabase to update the post row.
      const newComments = [...(comments || []), newCommentObj]

  // Use explicit select and tolerate either an array result or an object.
  const { data, error } = await supabase.from('posts').update({ comments: newComments }).eq('id', postId).select('*')
  if (error) throw error
  const updatedPost = Array.isArray(data) ? data[0] : data
  // update local state with the returned comments array (or fallback)
  setComments(updatedPost?.comments ?? newComments)
      setNewComment('')
      if (typeof refresh === 'function') await refresh()
    } catch (err) {
      console.error('Submit comment error', err)
      // If the DB rejects anonymous inserts due to RLS, show a gentle message
      // and don't crash the page.
      setError(err?.message || String(err) || 'Could not post comment')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div>Loading post...</div>
  if (error) return <div className="form-error">{error}</div>
  if (!postInfo) return <div>Post not found</div>

  const isOwner = user && postInfo.user_id === user.id

  return (
    <div className="PostDetailView">
      <article className="post-full">
        <header className="post-full__header">
          <img src={postInfo.avatar_url || '/avatar-fallback.png'} alt={postInfo.display_name || 'Author'} className="post-author__avatar" />
          <div>
            <h2>{postInfo.title}</h2>
            <div className="meta">By {postInfo.display_name || 'Unknown'} — {new Date(postInfo.created_at || postInfo.timestamp).toLocaleString()}</div>
          </div>
        </header>

        {editing ? (
          <form onSubmit={saveEdit} className="edit-post-form">
            <label>Title</label>
            <input name="title" value={editState.title} onChange={handleEditChange} />
            <label>Content</label>
            <textarea name="text" rows={6} value={editState.text} onChange={handleEditChange} />
            <label>Change image</label>
            <input type="file" accept="image/*" onChange={handleEditFile} />
            <div className="submit-delete-buttons">
              <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <section className="post-full__body">
            {postInfo.image_url && <img src={postInfo.image_url} alt="attached" className="post-image" />}
            <p>{postInfo.content}</p>
          </section>
        )}

        <footer className="post-full__footer">
          <button onClick={toggleLike} disabled={busy}>{likedByMe ? 'Unlike' : 'Like'} ({likesCount})</button>
          {isOwner && !editing && <button onClick={() => setEditing(true)}>Edit</button>}
        </footer>
      </article>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        <ul className="comments-list">
          {comments.map(c => (
            <li key={c.id} className="comment">
              <img src={c.avatar_url || '/avatar-fallback.png'} alt={c.display_name || 'User'} className="comment-avatar" />
              <div>
                <div className="comment-meta">{c.display_name || 'User'} • {new Date(c.created_at).toLocaleString()}</div>
                <div className="comment-body">{c.content}</div>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={submitComment} className="new-comment-form">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment (login optional)..." />
          <div className="submit-delete-buttons">
            <button type="submit" disabled={busy || !newComment.trim()}>{busy ? 'Posting...' : 'Post Comment'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PostDetailView