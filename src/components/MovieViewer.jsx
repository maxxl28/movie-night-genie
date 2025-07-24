/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control the movie viewer, displaying movie cards and handling likes/dislikes
*/

import { useState } from 'react';
import MovieCard from './MovieCard';
import ThumbsControls from './ThumbsControls';
import MovieModal from './MovieModal'

export default function MovieViewer({ movies, onFinished }) {
  // Track the current movie
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleNext = () => {
    if (currentIndex >= movies.length-1) {
      onFinished();
    } else {
      setCurrentIndex(prev => prev + 1)
    };
  }
  
  const handleLike = () => {
    // open Modal
    setSelectedMovie(movies[currentIndex]);
    handleNext();
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-viewer">
      {!selectedMovie && (<MovieCard movie={movies[currentIndex]} />)}
      
      {!selectedMovie && (
        <ThumbsControls 
          onLike={handleLike}
          onDislike={handleNext}
        />
      )}

      {/* If a movie is selected/liked, show the modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}