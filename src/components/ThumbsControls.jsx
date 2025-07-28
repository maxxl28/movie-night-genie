/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control like and dislike buttons 
*/

export default function ThumbsControls ({onLike, onDislike}) {
  return (
    <div className="thumbs-controls"> 
      <button onClick={onLike}>LIKE</button> {/* Trigger modal */}
      <button onClick={onDislike}>DISLIKE</button> {/* Next movie */}
    </div>
  );
}