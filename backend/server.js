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



// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});