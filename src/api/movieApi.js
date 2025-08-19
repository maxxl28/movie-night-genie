/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Fetch movies by genre from TMDB API, including trailer
*/

import { GENRE_MAP, TMDB_BASE_URL } from '../utils/tmdb';

const MAX_RANDOM_PAGE = 20; // cap at 20 to avoid going too deep into low-quality results

// Helper function to fetch trailer for a movie
async function fetchTrailerForMovie(movieId) {
  const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}/videos`);
  url.searchParams.append('language', 'en-US');
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
    }
  });
  if (!response.ok) return null;
  const data = await response.json();
  // Find YouTube trailer
  const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? trailer.key : null;
}

// Fetch movies by genre and return necessary info
export async function fetchMoviesByGenre(genreName) {
  // Validate genre
  const genreId = GENRE_MAP[genreName];

  try {
    const randomPage = Math.floor(Math.random() * MAX_RANDOM_PAGE) + 1; // Randomize page
    const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
    url.searchParams.append('with_genres', genreId);
    url.searchParams.append('page', randomPage);
    url.searchParams.append('sort_by', 'popularity.desc,release_date.desc'); // Sort by quality of movie (popularity)
    url.searchParams.append('vote_count.gte', '100');
    url.searchParams.append('include_adult', 'false'); // No adult content
    url.searchParams.append('language', 'en-US'); // English movies

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    // For each movie, fetch trailer
    const movies = await Promise.all(data.results.map(async movie => {
      const trailer = await fetchTrailerForMovie(movie.id);
      return {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null, // fallback if no poster
        year: movie.release_date?.split('-')[0] || 'N/A',
        overview: movie.overview,
        trailer // YouTube video key
      };
    }));
    return {
      movies,
      error: null
    };

  } catch (error) {
    return {
      movies: [],
      error: error.message
    };
  }
}


