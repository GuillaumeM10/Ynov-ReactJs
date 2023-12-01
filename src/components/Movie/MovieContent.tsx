import { Fragment, useEffect, useState } from "react";
import MoviesService from "../../services/movies.service";
import { Movie } from "../../types/movie.type";

export type MovieContentPropsType = {
  id: string | undefined;
};

const MovieContent = ({ id }: MovieContentPropsType) => {
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMovie = async (): Promise<void> => {
    try {
      const res = await MoviesService.getMovieById(id as string);
      setLoading(false);
      setError(null);
      setMovie(res.data);
    } catch (err: unknown) {
      setLoading(false);
      setError(err as string);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovie();
    }
  }, [id]);

  // useEffect(() => {
  //   console.log(movie);
  // }, [movie]);

  return (
    <Fragment>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="movie-content">
          <p>{movie?.title}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </Fragment>
  );
};

export default MovieContent;
