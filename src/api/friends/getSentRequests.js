export const getSentRequests = async (token) => {
  try {
    const response = await fetch('/api/friend-requests/sent', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch sent requests');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    throw error;
  }
};
