import { Fragment, useEffect, useState } from "react";
import MoviesService from "../../services/movies.service";
import { Cast, Credits, Crew, Movie } from "../../types/movie.type";
import "./movie-content.scss";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Unknown from "../../assets/unknown.jpg";

export type MovieContentPropsType = {
  id: string | undefined;
};

const MovieContent = ({ id }: MovieContentPropsType) => {
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<Credits>();

  const getMovie = async (): Promise<void> => {
    try {
      const res = await MoviesService.getMovieById(id as string);
      setLoading(false);
      setError(null);
      console.log(res);

      setMovie(res);
    } catch (err: unknown) {
      setLoading(false);
      setError(err as string);
    }
  };

  const getCredit = async (): Promise<void> => {
    try {
      const res = await MoviesService.getCredits(id as string);
      setLoading(false);
      setError(null);

      const uniqueCrew = res.crew.filter(
        (crew: Crew, index: number, self: any) =>
          index === self.findIndex((c: Crew) => c.id === crew.id)
      );
      const uniqueCast = res.cast.filter(
        (cast: Cast, index: number, self: any) =>
          index === self.findIndex((c: Cast) => c.id === cast.id)
      );

      const newRes: Credits = {
        ...res,
        crew: uniqueCrew,
        cast: uniqueCast,
      };

      setCredits(newRes);
    } catch (err: unknown) {
      setLoading(false);
      setError(err as string);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovie();
      getCredit();
    }
  }, [id]);

  return (
    <Fragment>
      {loading ? (
        <p>Loading</p>
      ) : (
        movie && (
          <div className="movie-content">
            <div className="top">
              <div className="movie-content__image">
                <p className="year">{movie.release_date?.split("-")[0]}</p>
                <img
                  src={
                    movie.poster_path
                      ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                      : Unknown
                  }
                  className="cover"
                  alt="cover"
                />
              </div>

              <div className="movie-content__info">
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
                <div className="movie-content__info__details">
                  <p className="genres">
                    {movie.genres.map((genre, index) => (
                      <span key={genre.id}>
                        {genre.name}
                        {movie.genres.length !== index + 1 && ","}{" "}
                      </span>
                    ))}
                  </p>

                  <p className="date">
                    Date de sortie :{" "}
                    {movie.release_date?.split("-").map((date, index) => {
                      if (index === 0) {
                        return date;
                      }
                      return " / " + date;
                    })}
                  </p>

                  <p className="runtime">Durée du film : {movie.runtime} min</p>

                  {movie.budget !== 0 && (
                    <p className="budget">
                      Budget :{" "}
                      {movie.budget?.toLocaleString().split(" ").join(" ")}
                    </p>
                  )}

                  {movie.revenue !== 0 && (
                    <p className="revenue">
                      Revenu :{" "}
                      {movie.revenue?.toLocaleString().split(" ").join(" ")}
                    </p>
                  )}

                  <p className="original_language">
                    Langue originale : {movie.original_language}
                  </p>

                  <p className="original_title">
                    original_title : {movie.original_title}
                  </p>

                  <p className="homepage">{movie.homepage}</p>

                  <p className="production_companies">
                    Companies : <br></br>
                    {movie.production_companies.map((company, index) => (
                      <span key={company.id}>
                        {company.name}
                        {movie.production_companies.length !== index + 1 &&
                          ","}{" "}
                      </span>
                    ))}
                  </p>

                  <p className="production_countries">
                    Pays de productions : <br></br>
                    {movie.production_countries.map((country, index) => (
                      <span key={country.iso_3166_1}>
                        {country.name}
                        {movie.production_countries.length !== index + 1 &&
                          ","}{" "}
                      </span>
                    ))}
                  </p>

                  <p className="spoken_languages">
                    Langues parlées :
                    {movie.spoken_languages.map((language, index) => (
                      <span key={language.iso_639_1}>
                        {" "}
                        {language.name}
                        {movie.spoken_languages.length !== index + 1 && ","}
                      </span>
                    ))}
                  </p>

                  <p className="vote_average">
                    Note moyenne : {movie.vote_average}
                  </p>

                  <p className="vote_count">
                    Nombre de votants : {movie.vote_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="cast">
              <h3>Acteurs</h3>

              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={"auto"}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                navigation
                // pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                className="cast"
              >
                {credits &&
                  credits?.cast.map((cast) => (
                    <SwiperSlide key={cast.id} style={{ width: 100 }}>
                      <img
                        src={
                          cast.profile_path
                            ? "https://image.tmdb.org/t/p/w500/" +
                              cast.profile_path
                            : Unknown
                        }
                        className="cover"
                        alt="cover"
                        width={100}
                        height={150}
                      />
                      <p>{cast.name}</p>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            <div className="crew">
              <h3>Crew</h3>

              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={"auto"}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                navigation
                // pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                className="crew"
              >
                {credits &&
                  credits?.crew.map((crew) => (
                    <SwiperSlide key={crew.id} style={{ width: 100 }}>
                      <img
                        src={
                          crew.profile_path
                            ? "https://image.tmdb.org/t/p/w500/" +
                              crew.profile_path
                            : Unknown
                        }
                        className="cover"
                        alt="cover"
                        width={100}
                        height={150}
                      />
                      <p>{crew.name}</p>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        )
      )}
      {error && <p>{error}</p>}
    </Fragment>
  );
};

export default MovieContent;
