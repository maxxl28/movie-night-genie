/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Set up a backend server to help handle database operations
*/


import { auth } from '../../firebase';

export async function respondToRequest(senderId, response) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();
    const Response = await fetch('/api/friend-requests/respond', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        sender_id: senderId, 
        response: response // 'accepted' or 'rejected'
      })
    });

    if (!Response.ok) throw new Error('Failed to process response');
    return await Response.json();
  } catch (error) {
    console.error('respondToRequest error:', error);
    throw error;
  }
}