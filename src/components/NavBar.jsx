/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Create a navigation bar to be reused
*/

export default function NavBar() {
  return (
    <nav className="nav-container">
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/Friends">Find Friends</a></li>
        <li><a href="/Trending">Trending</a></li>
        <li><a href="/Movies">Your movies</a></li>
      </ul>
    </nav>
  )
}
