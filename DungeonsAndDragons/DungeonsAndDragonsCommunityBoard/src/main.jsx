import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CharacterDesigner from './components/character-designer/CharacterDesigner';
import CreatePost from './components/Posts/CreatePost';
import PostsGrid from './components/Posts/PostsGrid';
import PostDetailView from './components/Posts/PostDetailView.jsx'
import Login from './components/Login.jsx'
import Layout from './components/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="posts" element={<PostsGrid />} />
          <Route path="posts/:postId" element={<PostDetailView />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="login" element={<Login />} />
          {/* include a wildcard so nested subpaths like /characterdesigner/edit/:id match */}
          <Route path="characterdesigner/*" element={<CharacterDesigner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);