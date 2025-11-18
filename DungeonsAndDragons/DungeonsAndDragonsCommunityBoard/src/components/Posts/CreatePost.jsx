import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../client.js'
import { useAuth } from '../../hooks/useAuth'
import './Posts.css'

const CreatePost = ({ threadId = null, refresh } = {}) => {
  
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, profile } = useAuth()

  const [postInfo, setPostInfo] = useState({
    title: '',
    text: '',
    image: null,
    timestamp: new Date().toISOString(),
    likes: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
  setPostInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null
  setPostInfo((prev) => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!user) {
      navigate('/login')
      return
    }

    if (!postInfo.text?.trim() && !postInfo.title?.trim()) {
      setError('Please enter a title or some content.')
      return
    }

    setLoading(true)
    try {
      let image_url = null
      if (postInfo.image) {
        const file = postInfo.image
        const filePath = `${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('post-images').upload(filePath, file)
        if (uploadError) throw uploadError
        const publicObj = supabase.storage.from('post-images').getPublicUrl(filePath)
        image_url = publicObj?.publicURL || publicObj?.data?.publicUrl || null
      }

      const payload = {
        thread_id: threadId,
        user_id: user.id,
        title: postInfo.title || null,
        content: postInfo.text,
        image_url,
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null
      }

      const { data, error: insertError } = await supabase.from('posts').insert([payload]).select().single()
      if (insertError) throw insertError

  setPostInfo({ title: '', text: '', image: null, timestamp: new Date().toISOString(), likes: 0 })
      if (typeof refresh === 'function') await refresh()
    } catch (err) {
      console.error('Create post error', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="CreatePost">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="post-author">
          <img src={profile?.avatar_url || '/avatar-fallback.png'} alt={profile?.display_name || 'Author'} className="post-author__avatar" />
          <div className="post-author__meta">
            <div className="post-author__name">{profile?.display_name || user?.email || 'Anonymous'}</div>
            <div className="post-author__id">{user?.id}</div>
          </div>
        </div>

        <div className='post-details'>
          <h3> Post Details </h3>
          <label htmlFor="title"> Post Title </label>
          <input id="title" name="title" value={postInfo.title} onChange={handleChange} />

          <label htmlFor="text">Text</label>
          <textarea id="text" name="text" rows={6} value={postInfo.text} onChange={handleChange} />

          <label htmlFor="image"> Upload Image (optional)</label>
        <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="submit-delete-buttons">
          <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost