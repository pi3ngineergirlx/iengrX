import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './EditCharacter.css'

const EditCharacter = ({ data = [] }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    // Find the post by id from passed-in data (ids are strings in sample data)
    const post = data && data.length ? data.find((p) => String(p.id) === String(id)) : null

    const [character, setCharacter] = useState(() => ({
        name: post ? post.name : '',
        author: post ? post.author : '',
        description: post ? post.description : '',
    }))

    // If post changes (data arrives), sync into local state
    useEffect(() => {
        if (post) {
            setCharacter({
                name: post.name || '',
                author: post.author || '',
                description: post.description || '',
            })
        }
    }, [post])

    const handleChange = (event) => {
        const { name, value } = event.target
        setCharacter((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // For now just log and navigate back to list; saving would require lifting state
        console.log('Saving character', character)
        navigate('/characterdesigner')
    }

    if (!post) return <div><h2>Character not found</h2></div>

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label> <br />
                <input type="text" id="name" name="name" value={character.name} onChange={handleChange} /><br />
                <br />

                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="author" value={character.author} onChange={handleChange} /><br />
                <br />

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={character.description} onChange={handleChange}>
                </textarea>
                <br />
                <input type="submit" value="Submit" />
                <button type="button" className="deleteButton">Delete</button>
            </form>
        </div>
    )
}

export default EditCharacter