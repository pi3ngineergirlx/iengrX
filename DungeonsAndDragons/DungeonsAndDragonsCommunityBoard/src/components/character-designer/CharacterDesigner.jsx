import React from 'react';
import { useRoutes } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar';
import ReadCharacter from './character-pages/ReadCharacter'
import CreateCharacter from './character-pages/CreateCharacter'
import EditCharacter from './character-pages/EditCharacter'
import '../../App.css';

const CharacterDesigner = () => {
    const descr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

  const characters = [
    {'id':'1', 
    'name': 'Character 1',
    'player':'Player 1', 
    'description': descr},
    {'id':'2', 
    'name': 'Character 2',
    'player':'Player 2', 
    'description':descr},
    {'id':'3', 
    'name': 'Character 3',
    'player':'Player 3', 
    'description':descr},
    {'id':'4', 
    'name': 'Character 4',
    'player':'Player 4', 
    'description':descr},
  ]

  let element = useRoutes([
    {
      path: "",
      element: <ReadCharacter data={characters} />,
    },
    {
      path: "edit/:id",
      element: <EditCharacter data={characters} />,
    },
    {
      path: "new",
      element: <CreateCharacter />,
    },
  ]);

  return (
    <>
    <Navbar />
    <div className='CharacterDesigner'>
      <h1>Character Designer</h1>
      <h4>iengrX</h4>
      <div className="header">
        <Link to="/characterdesigner"><button className="characterBtn"> View Characters </button></Link>
        <Link to="/characterdesigner/new"><button className="characterBtn"> Create Character </button></Link>
      </div>
        {element}
    </div>
    </>
  )
}

export default CharacterDesigner;