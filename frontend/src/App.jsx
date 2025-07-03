import React from 'react';
import Login from "./features/auth/Login"
import Register from './features/auth/Register';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import Notes from './features/notes/Notes';
import Navbar from './components/Navbar';
import NoteEditor from './pages/NoteEditor';
import ProtectedRoute from './components/ProtectedRoute';
export default function App() {
  return (
     
      <Router>
        
          <Navbar />
          <div className="p-4">
          <Routes>
            <Route path="/notes" element={
              <ProtectedRoute>
              <Notes />
              </ProtectedRoute>} />
            <Route path="/notes/:id" element={<NoteEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          
          </Routes>
          </div>
      </Router>
  
  );
}
