import { useState, useEffect } from 'react'
import CharacterCard from '../character-components/CharacterCard'
import './ReadCharacter.css'

const ReadCharacter = (props) => {

    const [characters, setCharacters] = useState([])

    useEffect(() => {
        setCharacters(props.data)
    }, [props])
    
    return (
        <div className="ReadCharacter">
            {
                characters && characters.length > 0 ?
                [...characters]
                .sort((a, b) => a.id - b.id)
                .map((character,index) => 
                    <CharacterCard 
                        key={character.id}
                        id={character.id} 
                        name={character.name}
                        player={character.player}
                        description={character.description}
                    />
                ) : <h2>{'No Characters Yet 😞'}</h2>
            }
        </div>  
    )
}

export default ReadCharacter