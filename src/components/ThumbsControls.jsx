/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control like and dislike buttons 
*/

export default function ThumbsControls ({onLike, onDislike}) {
  return (
    <div className="thumbs-controls"> 
      <button onClick={onLike}>LIKE</button>
      <button onClick={onDislike}>DISLIKE</button>
    </div>
  );
}