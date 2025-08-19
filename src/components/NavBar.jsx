/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Create a navigation bar to be reused
*/

import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="nav-container">
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/Trending">Trending</a></li>
        <li><a href="/Movies">Your Movies</a></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
