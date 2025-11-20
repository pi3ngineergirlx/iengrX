import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../client.js'
import PostOverview from './PostOverview.jsx'
import '../../App.css'
import './Posts.css'

const PostsGrid = ({ threadId = null, category = null, refresh } = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [totalCount, setTotalCount] = useState(null)
  const [sortMode, setSortMode] = useState('latest')

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
          // If we got data back, set a quick local total while the exact DB count is fetched
          if (data) setTotalCount(data.length)
        }
      } catch (err) {
        if (mounted) {
          // surface an error message so the UI can show it if needed
          // (keep posts empty so fallback/empty state renders)
          // eslint-disable-next-line no-console
          console.error('fetchPosts error', err)
          setError(err?.message || String(err))
          setPosts([])
          setLoading(false)
        }
      }
    }

    fetchPosts()
    // fetch a server-side total count (respects any filters)
    async function fetchTotalCount() {
      try {
        let countQuery = supabase.from('posts').select('*', { head: true, count: 'exact' })
        if (threadId) countQuery = countQuery.eq('thread_id', threadId)
        if (category) countQuery = countQuery.eq('category', category)
        const { count, error: countError } = await countQuery
        if (countError) throw countError
        if (mounted) setTotalCount(count ?? 0)
      } catch (err) {
        // keep the local count if server count fails
        // eslint-disable-next-line no-console
        console.warn('fetchTotalCount error', err)
        if (mounted) {
          // leave totalCount as-is (may be set from fetchPosts) or null
        }
      }
    }

    fetchTotalCount()

    return () => { mounted = false }
  }, [threadId, category, refresh])

  if (loading) {
    return <div> loading posts... </div>
  }

  // Always render the posts container so the header and layout remain visible
  // even when there are no posts. Inside the container, show either the
  // posts list or a friendly empty state. If an error occurs but posts exist,
  // show an error banner above the list.
  // Prepare the posts to display: always render the posts container so the
  // header and controls remain visible even when there are no posts. Apply
  // the selected sort (latest or top) to the client-side list before
  // rendering. If there are no posts, show a friendly empty state.
  const getSortedPosts = (list, mode) => {
    const copy = (list || []).slice()
    if (mode === 'latest') {
      copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (mode === 'top') {
      copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }
    return copy
  }

  // apply search filter (client-side) then sort
  const basePosts = searchInput.trim()
    ? posts.filter(p => {
        const q = searchInput.toLowerCase()
        return (p.title || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q)
      })
    : posts

  const displayedPosts = getSortedPosts(basePosts, sortMode)
  const content = displayedPosts.length === 0
    ? <div className="empty">no posts yet</div>
    : displayedPosts.map((post, idx) => (
        <div
          key={post.id}
          className={`post-item ${post.category ?? ''}`}
          data-index={idx}
        >
          <PostOverview post={post} />
        </div>
      ))

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
      <div className='post-buttons'>
        <Link to='/posts'>
          <button className='postBtn'> View All Posts </button>
        </Link>
        <input
        type="text"
        placeholder="search for posts..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        />
        <Link to='/posts/new'>
            <button className='postBtn'> Create Post </button>
        </Link>
      </div>
      <div className='total-sort-buttons'>
        <div className='total-sort-buttons-left'>
          <div className='postCountBox' role='status' aria-label='total-posts'>
            {totalCount !== null ? totalCount : posts.length} posts
          </div>
        </div>
        <div className='total-sort-buttons-right'>
          <button
            className={`postBtn ${sortMode === 'latest' ? 'active' : ''}`}
            onClick={() => setSortMode('latest')}
            aria-pressed={sortMode === 'latest'}
          >
            latest
          </button>
          <button
            className={`postBtn ${sortMode === 'top' ? 'active' : ''}`}
            onClick={() => setSortMode('top')}
            aria-pressed={sortMode === 'top'}
          >
            top
          </button>
        </div>
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