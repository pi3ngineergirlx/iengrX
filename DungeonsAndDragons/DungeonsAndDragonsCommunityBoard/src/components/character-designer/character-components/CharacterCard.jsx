import { useState } from 'react'
import './CharacterCard.css'
import { Link } from 'react-router-dom'

const CharacterCard = (props) =>  {

  return (
    <div className="character-card">
      <h3 className="name">{props.name}</h3>
      <h5 className="author">{"by " + props.author}</h5>
      <p className="description">{props.description}</p>
      <Link to={'edit/'+ props.id} className='detailsButton'>Character Details</Link>
    </div>
  );
};

export default CharacterCard