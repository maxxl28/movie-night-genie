/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Call the backend API to fetch trending movies
*/

export async function fetchTrendingMovies() {
  try {
    const response = await fetch('/api/trending-movies');
    if (!response.ok) {
      throw new Error('Error fetching trending movies');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    throw error;
  }
}