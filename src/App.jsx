/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Relevant App component to manage movie selection and display
*/

import { useState } from 'react';
import MoodSelector from './components/MoodSelector';
import { fetchMoviesByGenre } from './api';
import MovieViewer from './components/MovieViewer';
import './styles/App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);

  // Handle when the user has finished viewing all movies
  const handleFinished = () => {
    setShowEndMessage(true);
    setMovies([]);
  };

  // Handle when a genre is selected
  const handleGenreClick = async (genreName) => {
    setShowEndMessage(false); 
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchMoviesByGenre(genreName);
      if (result.error) {
        setError(result.error);
        setMovies([]);
      } else {
        setMovies(result.movies);
      }
    } catch (err) {
      setError('Failed to fetch movies');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🎬 Movie Night Genie 🧞</h1>
      <MoodSelector onGenreSelect={handleGenreClick} />
      {error && <div className="error-state">Error: {error}</div>} 
      {showEndMessage && <div className="loading-state">No more movies to show!</div>} 
      {movies.length > 0 && (
        <MovieViewer movies={movies} onFinished={handleFinished} />
      )}
    </div>
  );
}

export default App;