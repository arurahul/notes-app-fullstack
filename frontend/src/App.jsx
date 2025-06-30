import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import Notes from './pages/Notes';
import Navbar from './components/Navbar';
import NoteEditor from './pages/NoteEditor';
export default function App() {
  return (
     
      <Router>
        
          <Navbar />
          <div className="p-4">
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/notes/:id" element={<NoteEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </div>
      </Router>
  
  );
}
