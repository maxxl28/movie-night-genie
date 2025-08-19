/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Render the user's liked movies
*/

import { useEffect } from "react";
import NavBar from "../components/NavBar";  
import { fetchUserMovies} from '../api';
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
    <div>
      <NavBar />
      <h1>User's Liked Movies</h1>
      <ul>
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <li key={index}>
              {movie.movie_title}
            </li>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </ul>
    </div>
  );

}  