import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINT_DISCOVER } from "../constants";

export default function useInfiniteMovies(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(false);

//   useEffect(() => {
//     setMovies([]);
//   }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: ENDPOINT_DISCOVER,
      params: {page: pageNumber },
    }).then((res) => {
        setMovies((prevMovies) => {
          return [...prevMovies, ...res.data.results];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      }).catch((e) => {
        setError(true);
        console.log(e)
      });
  }, [pageNumber]);
  return { loading, error, movies, hasMore };
}
