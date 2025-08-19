/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control the movie viewer, displaying movie cards and handling likes/dislikes
*/

import { useState } from 'react';
import MovieCard from './MovieCard';
import ThumbsControls from './ThumbsControls';
import MovieModal from './MovieModal'
import { addLikedMovie } from '../services/userLikesService';
import { auth } from '../firebase';

export default function MovieViewer({ movies, onFinished }) {
  // Track the current movie
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleNext = () => {
    // go to next movie and check if there are more movies
    if (currentIndex >= movies.length-1) {
      onFinished();
    } else {
      setCurrentIndex(prev => prev + 1)
    };
  }
  
  const handleLike = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addLikedMovie(user.uid, movies[currentIndex].id, movies[currentIndex].title); 
      }
      setSelectedMovie(movies[currentIndex]);
      handleNext();
    } catch (error) {
      console.error('Error saving liked movie:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-viewer">
      {/* If no movie is selected, show the movie card and the thumbs controls */}
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