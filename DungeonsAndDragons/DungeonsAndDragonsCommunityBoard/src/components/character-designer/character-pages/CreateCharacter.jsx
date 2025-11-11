import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateCharacter.css'

const CreateCharacter = () => {

    const navigate = useNavigate()

    const [character, setCharacter] = useState({
        name: "",
        player: "",
        description: "",
        age: "",
        gender: "",
        species: "",
        role: "",
        level: "",
        alignment: "",
        abilities: "",
        equipment: "",
    })

    const handleChange = (event) => {
        const {name, value} = event.target
        setCharacter( (prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // For now just log and navigate back to list; saving would require Supabase integration
        console.log('Creating character', character)
        navigate('/characterdesigner')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='basic'>
                    <h5>Basic Character Information</h5>
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
                    <h5>Character Appearance</h5>
                    <label htmlFor="age">Age</label><br />
                    <input type="text" id="age" name="age" value={character.age} onChange={handleChange} /><br />
                    <br />
                    <label htmlFor="gender">Gender</label><br />
                    <div className="alignment-grid" role="group" aria-label="Gender">
                        {[
                            ['female','nonbinary','male']
                        ].map((row, rIdx) => (
                            <div className="alignment-row" key={rIdx}>
                                {row.map((label) => {
                                    const selected = character.gender === label
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            className={`alignment-cell ${selected ? 'is-selected' : ''}`}
                                            aria-pressed={selected}
                                            onClick={() => setCharacter(prev => ({ ...prev, gender: label }))}
                                        >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <br />
                    <br />
                    <label htmlFor="species">Species</label><br />
                    <input type="text" id="species" name="species" value={character.species} onChange={handleChange} /><br />
                    <br />
                </div>
                <div className='attributes'>
                    <h5>Character Attributes</h5>
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
                    <input type="submit" value="Create" />
                </div>
            </form>
        </div>
    )
}

export default CreateCharacter