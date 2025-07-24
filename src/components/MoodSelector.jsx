/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Select mood/genre for movie recommendations
*/

// Reusable button component for each genre
function GenreButton({ value, onClick }) {
  return <button onClick={() => onClick(value)}>{value}</button>;
}

// 6 main genres of movies
export default function MoodSelector({ onGenreSelect }) {
  return (
    <div className="mood-selector"> 
      <div>
        <GenreButton value="Comedy" onClick={onGenreSelect} />
        <GenreButton value="Action" onClick={onGenreSelect} />
        <GenreButton value="Thriller" onClick={onGenreSelect} />
      </div>
      <div>
        <GenreButton value="Sci-Fi" onClick={onGenreSelect} />
        <GenreButton value="Romance" onClick={onGenreSelect} />
        <GenreButton value="Horror" onClick={onGenreSelect} />
      </div>
    </div>
  );
}
