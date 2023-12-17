import { useEffect, useState } from "react";
import MovieService from "../services/movies.service";
import { Link } from "react-router-dom";
import { Movies } from "../types/movie.type";

const PopularMovies = () => {
  const [movies, setMovies] = useState<Movies>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    console.log(movies);
  }, [movies]);

  const getMovies = async (): Promise<void> => {
    try {
      const res = await MovieService.popularMovies(page);
      setLoading(false);
      setError(null);
      setMovies(res.data);
    } catch (err: unknown) {
      setLoading(false);
      setError(err as string);
    }
  };

  useEffect(() => {
    setLoading(true);
    getMovies();
  }, [page]);

  useEffect(() => {
    console.log(movies);
  }, [movies]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        "innerHeight" in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        setPage(page + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  return (
    <div className="popular-movies">
      <p>Popular Movies</p>

      <div className="popular-movies-list">
        {movies && !loading && movies.results?.length > 0 ? (
          movies.results.map((movie: any) => {
            return (
              <Link
                className="popular-movie"
                to={"/movie/" + movie.id}
                key={movie.id}
              >
                <p>{movie.title}</p>
              </Link>
            );
          })
        ) : (
          <p>No movies found</p>
        )}
      </div>
      {loading && <p>Loading</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PopularMovies;
