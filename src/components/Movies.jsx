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
              key={movie.id}
              viewTrailer={viewTrailer}
              lastMovieRef={lastMovieRef}
            />
          );
        } else {
          return (
            <Movie
              movie={movie}
              key={movie.id}
              viewTrailer={viewTrailer}
            />
          );
        }
      })}
    </div>
  );
};

export default Movies;
