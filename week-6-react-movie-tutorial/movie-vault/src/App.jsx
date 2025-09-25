// src/App.js

import React, { useEffect, useState } from 'react';
import './App.css'; 
import MovieCard from './components/MovieCard'; // Adjust path if necessary

// --- Our initial movie data ---
const initialMovies = [
  { id: 1, title: "The Martian", liked: false, favorited: false },
  { id: 2, title: "Interstellar", liked: false, favorited: false },
  { id: 3, title: "Gravity", liked: false, favorited: false },
  { id: 4, title: "Arrival", liked: false, favorited: false },
  { id: 5, title: "2001: A Space Odyssey", liked: false, favorited: false },
];
// -----------------------------

function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
    // We wrap the data in a timeout to simulate network latency
    const timer = setTimeout(() => {
        setMovies(initialMovies); // Load the actual data
        setIsLoading(false);      // Stop loading
    }, 2000); // Waits 2 seconds (2000 milliseconds)

    // Cleanup function: good practice to clear the timer
    return () => clearTimeout(timer);
}, []); // Empty array means this only runs ONCE after the component mounts


  // --- Search Input Handler (Removed unnecessary code) ---
  const handleMessage = (e) => {
      setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
      setSearchTerm('');
  }

  // --- Core Immutability Logic ---
  const handleToggle = (id, key) => {
    const updatedMovies = movies.map(movie => {
        if (movie.id === id) {
            return {
                ...movie,
                [key]: !movie[key] 
            };
        }
        return movie;
    });
    setMovies(updatedMovies);
  };
  
  // --- Derived State Logic (The Filter Logic) ---
  let displayedMovies = movies;

  // 1. Apply the Search filter
  if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      displayedMovies = displayedMovies.filter(movie =>
          movie.title.toLowerCase().includes(lowercasedSearch)
      );
  }

  // 2. Apply the Favorites filter
  if (showFavorites) {
      displayedMovies = displayedMovies.filter(movie => movie.favorited);
  }

  // src/App.js (inside function App())

return (
    <>
      <h1>Movie Vault</h1>
           
      {/* Show the loader if data is being fetched */}
      {isLoading ? (
        <div className="loader-message">
            <h2>Loading Movies...</h2>
            {/* You would usually add a CSS spinner here  */}
        </div>
      ) : (
        // Show the main application content once loading is complete
        <>
          <input 
              type="text" 
              placeholder='Search Movies' 
              onChange={handleMessage} 
              value={searchTerm} 
          />
          <button onClick={clearSearch}>Clear Search</button>
          <button onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? "View All Movies" : "View Favorites"}
          </button>
        
          <div className='movie-list'>
              {/* Only render MovieCards if there are movies to show */}
              {displayedMovies.length > 0 ? (
                displayedMovies.map((movie)=>(
                  <MovieCard 
                      key ={movie.id} 
                      movie={movie} 
                      onToggle = {handleToggle}
                  />
                ))
              ) : (
                <p>No movies found matching your criteria.</p>
              )}
          </div>
        </>
      )}
    </>
);
}

export default App;