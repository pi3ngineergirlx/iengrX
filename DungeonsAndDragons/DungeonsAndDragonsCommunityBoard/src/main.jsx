import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CharacterDesigner from './components/character-designer/CharacterDesigner';
import PostsGrid from './components/Posts/PostsGrid';
import Layout from './components/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="posts" element={<PostsGrid />} />
          {/* include a wildcard so nested subpaths like /characterdesigner/edit/:id match */}
          <Route path="characterdesigner/*" element={<CharacterDesigner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);