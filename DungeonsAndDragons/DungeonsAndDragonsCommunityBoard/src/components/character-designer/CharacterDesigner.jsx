import React, { useState, useEffect } from 'react'
import { useRoutes, Link } from 'react-router-dom'
import ReadCharacter from './character-pages/ReadCharacter'
import CreateCharacter from './character-pages/CreateCharacter'
import EditCharacter from './character-pages/EditCharacter'
import { supabase } from '../../client.js'
import '../../App.css'

const CharacterDesigner = () => {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCharacters = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch characters', error)
      setCharacters([])
    } else {
      setCharacters(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCharacters()
  }, [])

  const element = useRoutes([
    { path: '', element: <ReadCharacter data={characters} loading={loading} /> },
    { path: 'edit/:id', element: <EditCharacter data={characters} refresh={fetchCharacters} /> },
    { path: 'new', element: <CreateCharacter refresh={fetchCharacters} /> },
  ])

  return (
    <>
      <div className='CharacterDesigner'>
        <h1>Character Designer</h1>
        <h4>iengrX</h4>
        <div className='header'>
          <Link to='/characterdesigner'>
            <button className='characterBtn'> View Characters </button>
          </Link>
          <Link to='/characterdesigner/new'>
            <button className='characterBtn'> Create Character </button>
          </Link>
        </div>
        {element}
      </div>
    </>
  )
}

export default CharacterDesigner