export const getReceivedRequests = async (token) => {
  try {
    const response = await fetch('/api/friend-requests/received', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch received requests');
    return await response.json();
  } catch (error) {
    console.error('Error fetching received requests:', error);
    throw error;
  }
};
