/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Get the requests of the user (both sent and received)
*/


import { auth } from '../../firebase';

export async function getSentRequests() {
  return fetchRequests('/api/friend-requests/sent');
}

export async function getReceivedRequests() {
  return fetchRequests('/api/friend-requests/received');
}

async function fetchRequests(endpoint) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch requests');
    return await response.json();
  } catch (error) {
    console.error(`${endpoint} error:`, error);
    throw error;
  }
}