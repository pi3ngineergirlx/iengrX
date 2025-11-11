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
        player: post ? post.player : '',
        description: post ? post.description : '',
        alignment: post ? post.alignment || '' : '',
    }))

    // If post changes (data arrives), sync into local state
    useEffect(() => {
        if (post) {
            setCharacter({
                name: post.name || '',
                player: post.player || '',
                description: post.description || '',
                alignment: post.alignment || '',
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
                <div className='basic'>
                    <h3>Basic Character Information</h3>
                    <label htmlFor="name">Name</label> <br />
                    <input type="text" id="name" name="name" value={character.name} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="player">Player</label><br />
                    <input type="text" id="player" name="player" value={character.player} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="description">Description</label><br />
                    <textarea rows="5" cols="50" id="description" name="description" value={character.description} onChange={handleChange}></textarea>
                    <br />
                </div>
                <div className='appearance'>
                    <h3>Character Appearance</h3>
                    <label htmlFor="age">Age</label><br />
                    <input type="text" id="age" name="age" value={character.age} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="gender">Gender</label><br />
                    <input type="text" id="gender" name="gender" value={character.gender} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="species">Species</label><br />
                    <input type="text" id="species" name="species" value={character.species} onChange={handleChange} /><br />
                    <br />
                </div>
                <div className='attributes'>
                    <h3>Character Attributes</h3>
                    <label htmlFor="role">Role</label><br />
                    <input type="text" id="role" name="role" value={character.role} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor='level'>Level</label><br />
                    <input type="text" id="level" name="level" value={character.level} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor='alignment'>Alignment</label>
                    <div className="alignment-grid" role="group" aria-label="D and D alignment">
                        {[
                            ['Lawful Good','Neutral Good','Chaotic Good'],
                            ['Lawful Neutral','True Neutral','Chaotic Neutral'],
                            ['Lawful Evil','Neutral Evil','Chaotic Evil']
                        ].map((row, rIdx) => (
                            <div className="alignment-row" key={rIdx}>
                                {row.map((label) => {
                                    const selected = character.alignment === label
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            className={`alignment-cell ${selected ? 'is-selected' : ''}`}
                                            aria-pressed={selected}
                                            onClick={() => setCharacter(prev => ({ ...prev, alignment: label }))}
                                            >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <br />
                    <label htmlFor="abilities">Abilities</label><br />
                    <input type="text" id="abilities" name="abilities" value={character.abilities} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="equipment">Equipment</label><br />
                    <input type="text" id="equipment" name="equipment" value={character.equipment} onChange={handleChange} /><br />
                    <br />
                </div>
                <div className='submit-delete-buttons'>
                    <input type="submit" value="Submit" />
                    <button type="button" className="deleteButton">Delete</button>
                </div>
            </form>
        </div>
    )
}

export default EditCharacter