// src/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'movie_night_genie',
  password: 'IamlemonySNICKET123',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL successfully!'))
  .catch(err => console.error('Connection error:', err.stack));
export async function saveLikedMovie(userId, movieData) {
  const { id: movieId } = movieData;
  const query = `
    INSERT INTO liked_movies (user_id, movie_id, liked_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, movie_id) DO NOTHING
    RETURNING *`;
  
  const values = [userId, movieId];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving liked movie:', error);
    throw error;
  }
}
export default pool;
