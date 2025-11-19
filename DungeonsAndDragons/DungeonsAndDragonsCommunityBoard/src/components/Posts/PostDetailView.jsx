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

      // fetch likes (get count and whether current user liked)
      const { data: likesData, error: likesErr } = await supabase
        .from('post_likes')
        .select('user_id')
        .eq('post_id', postId)
      if (likesErr) throw likesErr
      setLikesCount(likesData?.length ?? 0)
      setLikedByMe(Boolean(user && likesData?.some(l => l.user_id === user.id)))

      // fetch comments
      const { data: commentsData, error: commentsErr } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (commentsErr) throw commentsErr
      setComments(commentsData || [])

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
    if (!user) {
      navigate('/login')
      return
    }
    if (!newComment?.trim()) return
    setBusy(true)
    try {
      const payload = {
        post_id: postId,
        user_id: user.id,
        content: newComment,
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null
      }
      const { data, error } = await supabase.from('comments').insert([payload]).select().single()
      if (error) throw error
      setComments(prev => [...prev, data])
      setNewComment('')
      if (typeof refresh === 'function') await refresh()
    } catch (err) {
      console.error('Submit comment error', err)
      setError(err?.message || String(err))
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
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
          <div className="submit-delete-buttons">
            <button type="submit" disabled={busy || !newComment.trim()}>{busy ? 'Posting...' : 'Post Comment'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PostDetailView