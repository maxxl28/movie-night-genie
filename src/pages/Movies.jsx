/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Render the user's liked movies
*/

import { useEffect } from "react";
import NavBar from "../components/NavBar";  
import { fetchUserMovies } from '../services/userMoviesService';
import { useState } from "react";
import { auth } from '../firebase';

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Only fetch if user exists
        try {
          const response = await fetchUserMovies();
          setMovies(response);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    });
        return () => unsubscribe();
    }, []);

  return (
    <div className="page-container">
      <NavBar />
      <div className="your-movies-container">
        <h1 className="page-title">Your Liked Movies</h1>
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <div key={index} className="movie-card">
                <h3 className="movie-title">{movie.movie_title}</h3>
                <div className="liked-at">
                  <span>Liked on {new Date(movie.liked_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <p>No movies found. Start liking some movies to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}  