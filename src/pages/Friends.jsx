import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFriends } from '../api/friends/getFriends';
import { getSentRequests } from '../api/friends/getSentRequests';
import { getReceivedRequests } from '../api/friends/getReceivedRequests';
import { sendFriendRequest } from '../api/friends/sendRequest';
import { respondToRequest } from '../api/friends/respondToRequest';
import { getAllUsers } from '../api/friends/getAllUsers';
import '../styles/Friends.css';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const auth = getAuth();
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthReady(true);
      if (!user) {
        setLoading(false);
        setError('Please log in to view friends');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthReady) return;
      if (!auth.currentUser) return;

      try {
        const token = await auth.currentUser.getIdToken();

        const [friendsData, sentData, receivedData, usersData] = await Promise.all([
          getFriends(token),
          getSentRequests(token),
          getReceivedRequests(token),
          getAllUsers(token)
        ]);

        setFriends(friendsData);
        setSentRequests(sentData);
        setReceivedRequests(receivedData);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to load friends data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser, isAuthReady]);

  const handleSendRequest = async (userEmail) => {
    try {
      if (!auth.currentUser) {
        setError('You must be logged in to send friend requests');
        return;
      }
      const token = await auth.currentUser.getIdToken();
      await sendFriendRequest(token, userEmail);
      
      // Refresh both users and sent requests lists
      const [sentData, usersData] = await Promise.all([
        getSentRequests(token),
        getAllUsers(token)
      ]);
      
      setSentRequests(sentData);
      setUsers(usersData);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to send friend request: ' + err.message);
      console.error('Send request error:', err);
    }
  };

  const handleRequestResponse = async (senderId, response) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await respondToRequest(token, senderId, response);
      
      // Refresh both friends and requests lists
      const [friendsData, receivedData] = await Promise.all([
        getFriends(token),
        getReceivedRequests(token)
      ]);
      
      setFriends(friendsData);
      setReceivedRequests(receivedData);
    } catch (err) {
      setError('Failed to respond to request');
      console.error(err);
    }
  };

  if (!isAuthReady || loading) return <div className="loading-state">Loading...</div>;
  
  if (!auth.currentUser) {
    return (
      <div className="auth-message">
        <h2>Please log in to view friends</h2>
      </div>
    );
  }

  return (
    <div className="friends-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="friends-section">
        <h2>Friends</h2>
        <div className="friends-list">
          {friends.map(friend => (
            <div
              key={friend.friend_id}
              className={`friend-item ${selectedFriend?.friend_id === friend.friend_id ? 'selected' : ''}`}
              onClick={() => setSelectedFriend(friend)}
            >
              <span>{friend.friend_email}</span>
              <span className="friend-since">
                {new Date(friend.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="requests-section">
        <h2>Friend Requests</h2>
        <div className="received-requests">
          <h3>Received Requests</h3>
          {receivedRequests.map(request => (
            <div key={request.sender_id} className="request-item">
              <span>{request.sender_email}</span>
              <div className="request-actions">
                <button
                  onClick={() => handleRequestResponse(request.sender_id, 'accepted')}
                  className="accept-btn"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequestResponse(request.sender_id, 'rejected')}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sent-requests">
          <h3>Sent Requests</h3>
          {sentRequests.map(request => (
            <div key={request.receiver_id} className="request-item">
              <span>{request.receiver_email}</span>
              <span className="pending-label">Pending</span>
            </div>
          ))}
        </div>
      </div>

      <div className="add-friend-section">
        <h2>Add New Friend</h2>
        {users.length === 0 ? (
          <p className="no-users-message">No other users available</p>
        ) : (
          <div className="users-list">
            {users
              .filter(user => {
                // Filter out current user and existing friends
                const isCurrentUser = user.user_id === auth.currentUser?.uid;
                const isFriend = friends.some(friend => friend.friend_id === user.user_id);
                const hasPendingSentRequest = sentRequests.some(request => request.receiver_id === user.user_id);
                const hasPendingReceivedRequest = receivedRequests.some(request => request.sender_id === user.user_id);
                return !isCurrentUser && !isFriend && !hasPendingSentRequest && !hasPendingReceivedRequest;
              })
              .map(user => (
                <div key={user.user_id} className="user-item">
                  <div className="user-info">
                    <span className="user-email">{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user.email)}
                    className="send-request-btn"
                  >
                    Send Request
                  </button>
                </div>
              ))}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <div className="debug-info">
          <p>Current user ID: {auth.currentUser?.uid}</p>
          <p>Total users: {users.length}</p>
          <p>Friends: {friends.length}</p>
          <p>Sent requests: {sentRequests.length}</p>
          <p>Received requests: {receivedRequests.length}</p>
          <p>Available users: {users.filter(user => {
            const isCurrentUser = user.user_id === auth.currentUser?.uid;
            const isFriend = friends.some(friend => friend.friend_id === user.user_id);
            const hasPendingSentRequest = sentRequests.some(request => request.receiver_id === user.user_id);
            const hasPendingReceivedRequest = receivedRequests.some(request => request.sender_id === user.user_id);
            if (isCurrentUser) console.log('Filtering out current user:', user.email);
            if (isFriend) console.log('Filtering out friend:', user.email);
            if (hasPendingSentRequest) console.log('Filtering out sent request:', user.email);
            if (hasPendingReceivedRequest) console.log('Filtering out received request:', user.email);
            return !isCurrentUser && !isFriend && !hasPendingSentRequest && !hasPendingReceivedRequest;
          }).length}</p>
        </div>
      </div>
    </div>
  );
}