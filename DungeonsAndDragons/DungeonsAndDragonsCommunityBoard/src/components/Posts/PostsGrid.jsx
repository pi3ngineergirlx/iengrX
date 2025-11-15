import { useState, useEffect } from 'react'
import { supabase } from '../../client.js'
import PostOverview from './PostOverview.jsx'
import '../../App.css'
import './Posts.css'

const PostsGrid = ({ threadId = null, category = null, refresh } = {}) => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [filters, setFilters] = useState({
    storyType: '',
    type: '',
    likesMin: '',
    likesMax: '',
    timestampMin: '',
    timestampMax: ''
})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchPosts() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
        if (threadId) {
          query = query.eq('thread_id', threadId)
        }
        if (category) {
          query = query.eq('category', category)
        }
        const { data, error: fetchError } = await query
        if (fetchError) throw fetchError
        if (mounted) {
          setPosts(data || [])
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(null)
          setPosts([])
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => { mounted = false }
  }, [threadId, category, refresh])

  if (loading) {
    return <div> loading posts... </div>
  }

  // Always render the posts container so the header and layout remain visible
  // even when there are no posts. Inside the container, show either the
  // posts list or a friendly empty state. If an error occurs but posts exist,
  // show an error banner above the list.
  const content = posts.length === 0
    ? <div className="empty">no posts yet</div>
    : posts.map((post) => <PostOverview key={post.id} post={post} />)

  return (
    <div className='posts-grid'>
      <h1>Story Plot Discussion Forum</h1>
      <div className='discussion-description'>
        <p>
            Discuss your ideas for story plots focusing on biological,
            technological, apocalyptic, societal, and space exploration
            themes! Share your concepts, obtain feedback, and collaborate
            with fellow Dungeons and Dragons enthusiasts to create
            captivating narratives set in futuristic and imaginative worlds.
        </p>
      </div>
      {error && posts.length > 0 && (
        <div className="error-message">{error}</div>
      )}
      <div className="posts-content">
        {content}
      </div>
    </div>
  )
}

export default PostsGrid