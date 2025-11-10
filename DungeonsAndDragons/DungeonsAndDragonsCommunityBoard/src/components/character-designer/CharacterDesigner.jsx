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

  const posts = [
      {'id':'1', 
      'title': 'Cartwheel in Chelsea 🤸🏽‍♀️',
      'author':'Harvey Milian', 
      'description': descr},
      {'id':'2', 
      'title': 'Love Lock in Paris 🔒',
      'author':'Beauford Delaney', 
      'description':descr},
      {'id':'3', 
      'title': 'Wear Pink on Fridays 🎀',
      'author':'Onika Tonya', 
      'description':descr},
      {'id':'4', 
      'title': 'Adopt a Dog 🐶',
      'author':'Denise Michelle', 
      'description':descr},
  ]

  let element = useRoutes([
    {
      path: "",
      element: <ReadCharacter data={posts} />,
    },
    {
      path: "edit/:id",
      element: <EditCharacter data={posts} />,
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
        {/* Use absolute paths for these top-level buttons so they always navigate
            to the character-designer base and its new page */}
        <Link to="/characterdesigner"><button className="headerBtn"> Explore Challenges 🔍  </button></Link>
        <Link to="/characterdesigner/new"><button className="headerBtn"> Submit Challenge 🏆 </button></Link>
      </div>
        {element}
    </div>
    </>
  )
}

export default CharacterDesigner;