/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Send a friend request to another user
*/


import { auth } from '../../firebase';

export async function sendFriendRequest(token, receiverEmail) {
  try {
    const response = await fetch('/api/friend-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ receiver_email: receiverEmail })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send request');
    }

    return await response.json();
  } catch (error) {
    console.error('sendFriendRequest error:', error);
    throw error;
  }
}