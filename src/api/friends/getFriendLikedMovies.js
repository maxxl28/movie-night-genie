// Get a friend's liked movies
export const getFriendLikedMovies = async (friendId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/friends/${friendId}/liked-movies`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch friend\'s movies');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
