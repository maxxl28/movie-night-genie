// Send a friend request to a user by email
export const sendFriendRequest = async (receiverEmail) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/friend-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                receiver_email: receiverEmail
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send friend request');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
