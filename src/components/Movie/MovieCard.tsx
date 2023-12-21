import { Link } from "react-router-dom";
import Unknown from "../../assets/unknown.jpg";
import { Movie } from "../../types/movie.type";
import './movie-card.scss'

export type MovieCardType = {
  movie: Movie;
};

const MovieCard = ({movie} : MovieCardType) => {
  const year = movie.release_date?.split("-")[0];

  return (
    <li
                key={movie.id}
                id={movie.id?.toString()}
                className="movie-card"
              >
                <Link to={"/film/" + movie.id}>
                  <div className="data">
                    <p className="year">{year}</p>
                    <p className="title">{movie.title}</p>
                  </div>
                  <img
                    src={
                      movie.poster_path
                        ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                        : Unknown
                    }
                    className="popular-movie-img"
                    alt=""
                  />
                </Link>
              </li>
  );
};

export default MovieCard;