/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Create a navigation bar to be reused
*/

export default function NavBar() {
  return (
    <nav className="navbar">
      <a href="/">Home</a>
      <a href="/Friends">Find Friends</a>
      <a href="/Trending">Trending</a>
      <a href="/Movies">Your movies</a>
    </nav>
  )
}