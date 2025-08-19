/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Home page with all functionality for the Movie Night Genie app
*/

import { useState, useEffect } from 'react';
import MoodSelector from '../components/MoodSelector';
import { fetchMoviesByGenre } from '../api';
import MovieViewer from '../components/MovieViewer';
import NavBar from '../components/NavBar';
//import '../styles/App.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const navigate = useNavigate();

  // Minimal auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) navigate('/login');
    });
    return unsubscribe;
  }, [navigate]);

  // Handle when the user has finished viewing all movies
  const handleFinished = () => {
    setShowEndMessage(true);
    setMovies([]);
  };

  // Handle when a genre is selected
  const handleGenreClick = async (genreName) => {
    setShowEndMessage(false); 
    setError(null);

    try {
      const result = await fetchMoviesByGenre(genreName);
      if (result.error) {
        setError(result.error); 
        setMovies([]); // Clear movies on error
      } else {
        setMovies(result.movies); // Update movies state
      }
    } catch (err) {
      setError('Failed to fetch movies');
      setMovies([]);
    } 
  };

  return (
    <div className="app">
      <h1>🎬 Movie Night Genie 🧞</h1>
      <NavBar />
      {/* Genre selection component */}
      <MoodSelector onGenreSelect={handleGenreClick} />
      {/* Error display (conditionally rendered) */}
      {error && <div className="error-state">Error: {error}</div>} 
      {showEndMessage && <div className="loading-state">No more movies to show! Click a new category.</div>} 
      {/* Main movie viewer (only renders when movies exist) */}
      {movies.length > 0 && (
        <MovieViewer movies={movies} onFinished={handleFinished} />
      )}
    </div>
  );
}
// (Comment: Minimum working Home with Firebase auth check)
