/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Display the relevant movie information
*/

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      {movie.poster && (
        <img 
          src={movie.poster} 
          alt={`${movie.title} poster`}
          className="movie-poster"
        />
      )}
      <div className="movie-title">{movie.title}</div> 
      <div className="movie-year">{movie.year}</div> 
      <div className="movie-overview">{movie.overview}</div> 
    </div>
  );
}