# Movie Night Genie

## Description
The Movie Night Genie is perfect for helping indecisive film watchers find their perfect movie. Users can choose from a selection of six genres, and can go through up to 20 movies that are fetched from the TMDB API. They can see the name of the movie, the movie poster, release date, and a brief description. If the user likes the movie, they can watch a trailer for the movie, and see the streaming options (which is fetched from WatchMode API). The user can also refresh the movies at any time and if the user has gone through all 20 movies, there will be a message prompting the user to choose a new category.

## Live Application
[Deployed application link](https://movie-night-genie-mvp.vercel.app/)

## Demo Video
https://user-images.githubusercontent.com/.../Screen-Recording.mp4

## Local Setup
1. Clone the Repo
2. Run `npm install`
3. Add all necessary API keys: 
   - `VITE_TMDB_API_KEY` 
   - `VITE_WATCHMODE_API_KEY`
4. Run `npm run dev`

## Learning Journey
As a movie lover tired of endless scrolling on streaming platforms, I wanted to create a Tinder for movies—a fun, swipeable way to discover films without decision fatigue. The app solves the universal problem people face on dates, hanging out with friends, or those lonely Friday nights when you want to watch an entertaining movie but spend more time browsing than watching. I eventually see this evolving into a social platform where friends vote on what movies to watch in real-time. Through integration with messaging platforms like Discord and WhatsApp, they can communicate their thoughts on the movie. Additionally, connecting users who have similar taste profiles would be fun to implement to match film lovers with each other.

For the community of movie watchers, this app cuts the average "what to watch" time from 30+ minutes to seconds through gamified swiping. By consolidating movies from all major streaming services into a single, swipeable interface with instant availability info, Movie Night Genie could fundamentally change viewing habits. This unified approach would:
1. Reduce subscription fatigue as users realize they don't need four services just to browse options
2. Give smaller streaming platforms equal visibility against giants when their content matches user preferences
3. Create pressure for services to improve their original content rather than relying on library exclusivity

Overall, the app reignites the joy of movie night by making discovery fast, social, and fun, leading to less time wasted scrolling, and more time enjoying great movies.

## Technologies Learned
Through building Movie Night Genie, I learned:
- **React.js** managing state and side effects using hooks like useState and useEffect to create dynamic, interactive components
- **Vite build system** for its blazing-fast performance
- How to use **APIs** for the first time, practicing RESTful resource modeling
- **Deployment** using Vercel to auto deploy my GitHub repository

## Technology Choices
I chose:
- **React.js** for its component-based architecture, which allowed me to break down the UI into reusable pieces like MovieCard and ThumbsControls. I saw firsthand how React made the code more modular and easier to maintain.
- **TMDB API** because it provided the most comprehensive movie data (upon researching options)
- **WatchMode API** for accurate streaming information to solve the "Where can I watch this?" problem
- **Vercel** for deployment due to its seamless GitHub integration, automatic deployments, and global CDN

## Challenges Faced
One of the biggest challenges I faced was trailer integration. Initially, I considered using the YouTube API to fetch trailers, but quickly realized its search results were inconsistent—often returning fan edits, reaction videos, or unofficial clips instead of the actual movie trailers. This led me to switch to TMDB's video endpoint, which provided direct access to official YouTube trailer keys, ensuring reliability.

Similarly, for streaming data, I first experimented with Utelly, but found its API responses were often outdated or incomplete, failing to show all available platforms. Migrating to WatchMode solved this with its structured, region-specific source listings.

At the beginning of development, I struggled a little bit with state management in React. However, through trial and error, I learned to effectively manage state by properly structuring my components and debugging async operations.

Perhaps the most valuable lesson was the importance of adaptability in development. When one approach didn't work (like YouTube API or Utelly), I researched alternatives, tested them, and pivoted when necessary. The state management got very complex with the API calls and I learned to be flexible and reiterate again and again to ensure a smooth user experience despite imperfect data.

The final product may look similar to my initial mockups, but the underlying architecture became more thoughtful and resilient through this process of continuous refinement and problem-solving.
