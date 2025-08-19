// Get the current user's auth token
import { Auth } from "firebase-admin/auth";
const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
};

// Get all users for friend requests
export const getAllUsers = async () => {
  const token = await getAuthToken();
  const response = await fetch('/api/users/all', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

// Get friend's liked movies
export const getFriendLikedMovies = async (friendId) => {
  const token = await getAuthToken();
  const response = await fetch(`/api/friends/${friendId}/liked-movies`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch friend\'s movies');
  return response.json();
};

// Get sent friend requests
export const getSentRequests = async () => {
  const token = await getAuthToken();
  const response = await fetch('/api/friend-requests/sent', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch sent requests');
  return response.json();
};

// Get received friend requests
export const getReceivedRequests = async () => {
  const token = await getAuthToken();
  const response = await fetch('/api/friend-requests/received', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch received requests');
  return response.json();
};

// Send friend request
export const sendFriendRequest = async (receiverEmail) => {
  const token = await getAuthToken();
  const response = await fetch('/api/friend-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ receiver_email: receiverEmail })
  });
  if (!response.ok) throw new Error('Failed to send friend request');
  return response.json();
};

// Respond to friend request
export const respondToFriendRequest = async (senderId, response) => {
  const token = await getAuthToken();
  const res = await fetch('/api/friend-requests/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ sender_id: senderId, response })
  });
  if (!res.ok) throw new Error('Failed to respond to request');
  return res.json();
};

// Get friends list
export const getFriends = async () => {
  const token = await getAuthToken();
  const response = await fetch('/api/friends', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch friends');
  return response.json();
};
