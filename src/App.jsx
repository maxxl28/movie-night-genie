/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Handle routing and main application structure
*/

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';    
import Trending from './pages/Trending';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/Movies" element={<Movies />} />
        <Route path="/Trending" element={<Trending />} />
      </Routes>
    </Router>
  );
}
