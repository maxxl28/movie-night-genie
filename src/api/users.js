/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Call the backend API to register a user
*/

export async function registerUser(user_id, email) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(`Failed to sync user: ${error.message}`);
  }
};