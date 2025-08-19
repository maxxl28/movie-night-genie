/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Call the backend API to fetch movies liked by the user
*/

import { auth } from '../firebase';

export async function fetchUserMovies() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    // Get the user token to authenticate the request
    const token = await user.getIdToken(); 
    const response = await fetch('/api/fetchUserMovies', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) { 
      throw new Error('Failed to fetch movies for the user');
    }
    return await response.json();
  } catch (error) {
    console.error("fetchUserMovies error:", error);
    throw error;
  }
}
