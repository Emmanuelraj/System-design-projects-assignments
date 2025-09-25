function MovieCard({movie, onToggle}){

   const handleLikeClick =()=>{

    console.log('handleLikeClick');
     // Calls the passed handler with the movie's ID and the key 'liked'
    onToggle(movie.id, 'liked');
   }

   const handleFavoriteClick=()=>{
      console.log('handleFavoriteClick')
        // Calls the passed handler with the movie's ID and the key 'favorited'
    onToggle(movie.id, 'favorited');
   }


    console.log("movies"+JSON.stringify(movie))
    return(
        <div className="movie-card">
      <h3>{movie.title}</h3>
      <div className="actions">
        {/* Placeholder buttons to be made interactive in Step 3 */}
        <button onClick ={handleLikeClick}> 
          {movie.liked ? '❤️' : '🤍'} Like
        </button>
        <button onClick = {handleFavoriteClick}>
          {movie.favorited ? '⭐' : '☆'} Favorite
        </button>
      </div>
    </div>
    )
}

export default MovieCard;