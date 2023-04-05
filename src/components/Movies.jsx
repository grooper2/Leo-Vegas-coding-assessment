import Movie from "./Movie";
import "../styles/movies.scss";

const Movies = ({
  movies,
  lastMovieRef,
  viewTrailer,
}) => {
  return (
    <div className="movie-grid" data-testid="movies">
      {movies?.map((movie, idx) => {
        if (movies.length === idx + 1) {
          return (
            <Movie
              movie={movie}
              key={idx} // placed index as a key to avoid error of duplicate key
              viewTrailer={viewTrailer}
              lastMovieRef={lastMovieRef}
            />
          );
        } else {
          return (
            <Movie
              movie={movie}
              key={idx} // placed index as a key to avoid error of duplicate key
              viewTrailer={viewTrailer}
            />
          );
        }
      })}
    </div>
  );
};

export default Movies;
