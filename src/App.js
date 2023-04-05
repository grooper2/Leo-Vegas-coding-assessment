import { useState, useRef, useCallback } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { ENDPOINT, API_KEY } from "./constants";
import Header from "./components/Header";
import Movies from "./components/Movies";
import Starred from "./components/Starred";
import WatchLater from "./components/WatchLater";
import YouTubePlayer from "./components/YoutubePlayer";
import "./styles/app.scss";
import Modal from "./components/modal";
import useInfiniteMovies from "./hooks/useInfiniteMovies";
import useInfiniteSearchedMovies from "./hooks/useInfiniteSearchedMovies";
import Spinner from "./components/spinner";

const App = () => {
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState("");
  const observer = useRef();

  const handleSearch = (e) => {
    console.log(e.target.value);
    setQuery(e.target.value);
    setPageNumber(1);
  };

  const searchMovies = (query) => {
    handleSearch(query);
  };

  const { movies, hasMore, loading, error } = useInfiniteMovies(pageNumber);
  const { searchedMovies, hasMoreResults, loadingResult, errorResult } =
    useInfiniteSearchedMovies(query, pageNumber);
  const closeModal = () => setOpen(false);

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(true);
    setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const lastMovieInSearchElementRef = useCallback(
    (node) => {
      if (loadingResult) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreResults) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingResult, hasMoreResults]
  );

  return (
    <div className="App">
      <Header handleSearch={handleSearch} searchMovies={searchMovies} />
      <div className="container">
        <Modal onClose={() => closeModal()} show={isOpen}>
          {videoKey ? (
            <YouTubePlayer videoKey={videoKey} />
          ) : (
            <div className="no-trailer-container">
              <h6>No trailer available. Try another movie</h6>
            </div>
          )}
        </Modal>
        <Routes>
          <Route
            path="/"
            element={
              <Movies
                lastMovieRef={
                  query !== ""
                    ? lastMovieInSearchElementRef
                    : lastMovieElementRef
                }
                movies={query !== "" ? searchedMovies : movies}
                viewTrailer={viewTrailer}
              />
            }
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
        {(loading || loadingResult) && <Spinner />}
      </div>
    </div>
  );
};

export default App;
