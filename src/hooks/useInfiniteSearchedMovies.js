import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINT_SEARCH } from "../constants";
import useDebounce from "./useDebounce";

export default function useInfiniteSearchedMovies(query, pageNumber) {
  const [loadingResult, setLoading] = useState(true);
  const [errorResult, setError] = useState(false);
  const [searchedMovies, setMovies] = useState([]);
  const [hasMoreResults, setHasMore] = useState(false);

  const debounceSearchTerm = useDebounce(query, 1000)

  useEffect(() => {
    setMovies([]);
  }, [debounceSearchTerm]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: ENDPOINT_SEARCH,
      params: {query: debounceSearchTerm , page: pageNumber },
    }).then((res) => {
        setMovies((prevMovies) => {
          return [...prevMovies, ...res.data.results];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      }).catch((e) => {
        setError(true);
        console.error(e)
      });
  }, [debounceSearchTerm, pageNumber]);
  return { loadingResult, errorResult, searchedMovies, hasMoreResults };
}
