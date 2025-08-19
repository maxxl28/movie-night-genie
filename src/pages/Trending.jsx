/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Display trending movies
*/

import { useEffect, useState } from 'react';
import { fetchTrendingMovies } from '../api/trending';
import NavBar from '../components/NavBar';

export default function Trending() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const data = await fetchTrendingMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadTrendingMovies();
  }, []);

  return (
    <div className="page-container">
      <NavBar />
      <div className="trending-container">
        <h1 className="page-title">Trending This Week</h1>
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie.movie_id} className="movie-card">
              <h3 className="movie-title">{movie.movie_title}</h3>
              <div className="like-count">
                <span role="img" aria-label="heart">❤️</span>
                <span>{movie.like_count} likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
