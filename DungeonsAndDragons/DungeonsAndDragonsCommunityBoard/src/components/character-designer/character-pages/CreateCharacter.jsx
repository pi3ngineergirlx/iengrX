import { useState } from 'react'
import './CreateCharacter.css'

const CreateCharacter = () => {

    const [character, setCharacter] = useState({name: "", race: "", class: "", background: ""})

    const handleChange = (event) => {
        const {name, value} = event.target
        setCharacter( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    return (
        <div>
            <form>
                <label htmlFor="name">Name</label> <br />
                <input type="text" id="name" name="name" onChange={handleChange} /><br />
                <br/>

                <label htmlFor="player">Player</label><br />
                <input type="text" id="player" name="player" onChange={handleChange} /><br />
                <br/>

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}>
                </textarea>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default CreateCharacter