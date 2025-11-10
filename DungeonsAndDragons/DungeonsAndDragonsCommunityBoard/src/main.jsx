import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CharacterDesigner from './components/character-designer/CharacterDesigner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
  {/* include a wildcard so nested subpaths like /characterdesigner/edit/:id match */}
  <Route path="/characterdesigner/*" element={<CharacterDesigner />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);