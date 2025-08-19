/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Set up a backend server to help handle database operations
*/


import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import admin from 'firebase-admin';

// Initialize Firebase Admin 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}


// App and Middleware setup
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Routes

// Endpoint: Get all users
app.get('/api/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Current user:', decodedToken.uid);
    
    const result = await pool.query(
      'SELECT user_id, email FROM users WHERE user_id != $1',
      [decodedToken.uid]
    );
    
    console.log('Found users:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint: Insert into Users table 
app.post('/api/users', async (req, res) => {
  try {
    const { user_id, email } = req.body;
    const result = await pool.query(
      `INSERT INTO users (user_id, email) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET email = $2 RETURNING *`,
      [user_id, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ 
      error: 'Database operation failed',
      details: err.message 
    });
  }
});

// Endpoint: Let a user add a liked movie
app.post('/api/liked-movies', async (req, res) => {
  try {
    const { user_id, movie_id, movie_title } = req.body;
    const result = await pool.query(
      'INSERT INTO liked_movies (user_id, movie_id, liked_at, movie_title) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [user_id, movie_id, movie_title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint: Get the trending movies
app.get('/api/trending-movies', async (req, res) => {
  try {
    // Get movies liked in the last 7 days, ordered by popularity
    const result = await pool.query(
      `SELECT movie_id, movie_title, COUNT(*) as like_count FROM liked_movies WHERE liked_at > NOW() - INTERVAL '7 days' GROUP BY movie_id, movie_title ORDER BY like_count DESC LIMIT 20`
    )
    res.json(result.rows);
  } catch (err) {
    console.error('Trending movies error:', err);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Endpoint: Fetch the movies liked by a user
app.get('/api/fetchUserMovies', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token); // Firebase Admin
    const uid = decodedToken.uid;
    const result = await pool.query(
      'SELECT * FROM liked_movies WHERE user_id = $1 ORDER BY liked_at DESC LIMIT 20', [uid]
    );
    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint: Send a friend request
app.post('/api/friend-requests', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid: sender_id } = await admin.auth().verifyIdToken(token);

    const { receiver_email } = req.body;
    console.log('Sending friend request from', sender_id, 'to email:', receiver_email);

    const receiver = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [receiver_email]
    );

    if (!receiver.rows || receiver.rows.length === 0) {
      console.log('Receiver not found for email:', receiver_email);
      return res.status(404).json({ error: 'User not found' });
    }

    const receiver_id = receiver.rows[0].user_id;
    console.log('Found receiver_id:', receiver_id);

    // Check if request already exists
    const existingRequest = await pool.query(
      'SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2',
      [sender_id, receiver_id]
    );

    if (existingRequest.rows.length > 0) {
      console.log('Request already exists');
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    await pool.query(
      'INSERT INTO friend_requests (sender_id, receiver_id, status, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (sender_id, receiver_id) DO NOTHING',
      [sender_id, receiver_id, 'pending']
    );  

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send request' });
  }
});  

// Endpoint: Sent requests
app.get('/api/friend-requests/sent', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid: sender_id } = await admin.auth().verifyIdToken(token);
    console.log('Getting sent requests for user:', sender_id);
    
    const result = await pool.query(
      `SELECT r.receiver_id, u.email as receiver_email, r.created_at, r.status
       FROM friend_requests r
       JOIN users u ON r.receiver_id = u.user_id
       WHERE r.sender_id = $1 AND r.status = 'pending'`,
      [sender_id]
    );
    
    console.log('Found sent requests:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting sent requests:', err);
    res.status(500).json({ error: 'Failed to get sent requests' });
  }
});

// Endpoint: Received requests
app.get('/api/friend-requests/received', async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  const { uid: receiver_id } = await admin.auth().verifyIdToken(token);
  
  const result = await pool.query(
    `SELECT r.sender_id, u.email as sender_email, r.created_at 
     FROM friend_requests r
     JOIN users u ON r.sender_id = u.user_id
     WHERE r.receiver_id = $1 AND r.status = 'pending'`,
    [receiver_id]
  );
  
  res.json(result.rows);
});

// Endpoint: Accept/Reject a friend request
app.post('/api/friend-requests/respond', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid: receiver_id } = await admin.auth().verifyIdToken(token);
    const { sender_id, response } = req.body;

    // Validate response type
    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({ error: "Response must be 'accepted' or 'rejected'" });
    }

    // Single query handles both acceptance and rejection
    await pool.query(
      `UPDATE friend_requests SET status = $1 WHERE sender_id = $2 AND receiver_id = $3`,
      [response, sender_id, receiver_id]
    );

    // Only create friendship records if accepted
    if (response === 'accepted') {
      await pool.query(
        `INSERT INTO friends (user_id, friend_id, created_at) VALUES ($1, $2, NOW()), ($2, $1, NOW())`,
        [sender_id, receiver_id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process response' });
  }
});

// Endpoint: Get friends list
app.get('/api/friends', async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  const { uid: user_id } = await admin.auth().verifyIdToken(token);
  
  const result = await pool.query(
    `SELECT f.friend_id, u.email as friend_email, f.created_at
     FROM friends f
     JOIN users u ON f.friend_id = u.user_id
     WHERE f.user_id = $1`,
    [user_id]
  );
  
  res.json(result.rows);
});
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});