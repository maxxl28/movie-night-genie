/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: get the friends of the user
*/

import { auth } from '../../firebase';

export async function getFriends() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();
    const response = await fetch('/api/friends', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch friends');
    return await response.json();
  } catch (error) {
    console.error('getFriends error:', error);
    throw error;
  }
}