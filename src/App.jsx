// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';    
import Trending from './pages/Trending';
import Friends from './pages/Friends';  

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/Movies" element={<Movies />} />
        <Route path="/Trending" element={<Trending />} />
        <Route path="/Friends" element={<Friends />} />
      </Routes>
    </Router>
  );
}
