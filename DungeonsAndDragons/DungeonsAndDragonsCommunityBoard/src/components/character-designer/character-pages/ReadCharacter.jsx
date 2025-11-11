import { useState, useEffect } from 'react'
import { supabase } from '../../../client.js'
import CharacterCard from '../character-components/CharacterCard'
import './ReadCharacter.css'

const ReadCharacter = (props) => {

    const [characters, setCharacters] = useState([])

    useEffect(() => {
        // If parent provided data (CharacterDesigner passes data prop), use it so refresh() works
        if (props && Array.isArray(props.data)) {
            setCharacters(props.data)
            return
        }

        const fetchCharacters = async () => {
            const {data} = await supabase
            .from('characters')
            .select()
            .order('created_at', { ascending: true })
            // set state of characters
            setCharacters(data)
        }
        // call fetch on mount
        fetchCharacters().catch(err => {
            console.error('Failed to fetch characters', err)
            setCharacters([])
        })
    }, [props && props.data])

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