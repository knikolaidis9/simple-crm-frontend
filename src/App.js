// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ContactsPage from './ContactsPage'; // Your contacts page component
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <nav className="p-4">
                    <Link to="/contacts" className="text-blue-500">Contacts</Link>
                    {/* Add other navigation links here */}
                </nav>
                <Routes>
                    <Route path="/contacts" element={<ContactsPage />} />
                    {/* Other routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
