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
    <div>
      <NavBar />
      <h1>Trending This Week</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.movie_id}>
            <h3>{movie.movie_title}</h3>
            <p>Likes: {movie.like_count}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
