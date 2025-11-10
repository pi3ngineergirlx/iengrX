import { useState } from 'react'
import './CharacterCard.css'
import { Link } from 'react-router-dom'

const CharacterCard = (props) =>  {

  return (
    <div className="character-card">
      <Link to={'edit/'+ props.id}>more</Link>
          <h2 className="title">{props.title}</h2>
          <h3 className="author">{"by " + props.author}</h3>
          <p className="description">{props.description}</p>
          <button className="detailsButton">Character Details</button>
      </div>
  );
};

export default CharacterCard