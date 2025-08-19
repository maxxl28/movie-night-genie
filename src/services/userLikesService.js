/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Call the backend API to add a liked movie for a user
*/

export async function addLikedMovie(user_id, movie_id, movie_title) {
  try {
    const response = await fetch('/api/liked-movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, movie_id, movie_title }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add liked movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding liked movie:', error);
    throw error;
  }
}