import { useEffect, useState, useCallback } from "react";
import MoviesService from "../../services/movies.service";
import { FetchMovies, Movie } from "../../types/movie.type";
import "./popularMovies.scss";
import ScrollTop from "../ScrollTop";
import Loading from "../../assets/loading.svg";
import MovieCard from "../Movie/MovieCard";

const PopularMovies = () => {
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endPost, setEndPost] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const getMovies = useCallback(async () => {
    try {
      setLoading(true);
      const newMovies: FetchMovies = await MoviesService.popularMovies(page);

      setTotalPages(newMovies.total_pages);
      setTotalResults(newMovies.total_results);

      if (newMovies?.results?.length === 0 && page === 1) {
        setMovies([]);
        setEndPost(true);
        setLoading(false);
      } else if (newMovies?.results?.length === 0) {
        setEndPost(true);
        setLoading(false);
      } else if (page === 1) {
        setEndPost(false);
        setMovies(newMovies?.results);
        setLoading(false);
      } else {
        newMovies.results.forEach((element) => {
          if (!movies.find((m) => m.id === element.id)) {
            setMovies((prevMovies) => [...prevMovies, element]);
          }
        });

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setError(err as string);
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !endPost) {
      getMovies();
    }
  }, [page]);

  useEffect(() => {
    if (!endPost && !loading) {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100
        ) {
          const nextPage = page + 1;
          setPage(nextPage);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [endPost, loading, page]);

  return (
    <section className="popular-movies">
      <ScrollTop />
      {totalPages > 0 && totalResults && (
        <div className="popular-movies-infos">
          <p className="page-count">
            Page <span>{page} sur {totalPages}</span>
          </p>
          <p className="results-count">
            Résultats <span>{movies.length} sur {totalResults}</span>
          </p>
        </div>
      )}
      <ul className="popular-movies-list">
        {movies && movies.length > 0 ? (
          movies.map((movie: Movie) => {
            return (<MovieCard movie={movie} key={movie.id} />);
          })
        ) : (
          <p>No movies found</p>
        )}
      </ul>
      {loading ? (
        <img 
          className="loading"
          src={Loading} 
          alt="loading"
          width={40}
          height={40}
        />
      ) : (
        <button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
          }}
          className="load-more secondary"
        >
          Charger plus
        </button>
      )}
      {error && <p>{error}</p>}
    </section>
  );
};

export default PopularMovies;
