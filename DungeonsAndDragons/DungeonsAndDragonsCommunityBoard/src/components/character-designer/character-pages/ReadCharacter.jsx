import { useState, useEffect } from 'react'
import Card from '../components/Card'

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
                    <Card 
                        key={character.id}
                        id={character.id} 
                        title={character.title}
                        author={character.author}
                        description={character.description}
                    />
                ) : <h2>{'No Characters Yet 😞'}</h2>
            }
        </div>  
    )
}

export default ReadCharacter