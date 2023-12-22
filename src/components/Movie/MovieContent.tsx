import { Fragment, useContext, useEffect, useState } from "react";
import MoviesService from "../../services/movies.service";
import { Cast, Credits, Crew, Movie } from "../../types/movie.type";
import "./movie-content.scss";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Unknown from "../../assets/unknown.jpg";
import Loading from "../../assets/loading.svg";
import { AuthContext } from "../../context/AuthContext";
import UserDetailsService from "../../services/userdetails.service";
import { UPDATE_USER_INFOS } from "../../reducer/AuthReducer";
import MovieComments from "../Comments/MovieComments";
import CreateComment from "../Comments/CreateComment";
import { MoviesColection } from "../../types/colections.type";

export type MovieContentPropsType = {
  id: number;
};

const MovieContent = ({ id }: MovieContentPropsType) => {
  const [movie, setMovie] = useState<Movie>();
  const [movieCollection, setMovieCollection] = useState<MoviesColection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<Credits>();
  const { state } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [isLike, setIsLike] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);

  const getMovie = async (): Promise<void> => {
    try {
      const res = await MoviesService.getMovieById(id);
      setLoading(false);
      setError(null);
      setMovie(res);
    } catch (err: unknown) {
      setLoading(false);
      setError(err as string);
    }
  };

  const getCredit = async (): Promise<void> => {
    try {
      const res = await MoviesService.getCredits(id);
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

  const getLike = async (): Promise<void> => {
    try {
      if(!state.userDetails?.likes) return;
      setIsLike(state.userDetails?.likes?.includes(movie?.id as number))
      setLoadingLike(false)
    } catch (err: unknown) {
      console.log(err);
      setLoadingLike(false)
    }
  };

  const getMovieCollection = async () : Promise<void> => {
    try {
      const res = await MoviesService.getMovieData(id);

      if(!res) return;
      const resDate = res.data()

      setMovieCollection(resDate as MoviesColection);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setIsLike(false);
    setLoading(true);
    getMovie();
    getCredit();
  }, [id]);

  useEffect(() => {
    getMovieCollection();
  }, [id, isLike]);

  useEffect(() => {
    if (movie) {
      getLike();
    }
  }, [movie]);

  const toggleLikeMovie = async () => {
    setLoadingLike(true);
    try {
      if(!state.userDetails?.userId) return;
      await UserDetailsService.toggleLikeMovie(
        state.userDetails?.userId,
        movie as Movie
      );


      const updateUserDetails = await UserDetailsService.getUserDetails(state.userDetails?.userId)
      const updateUserDetailsData = updateUserDetails?.data()
      
      dispatch({
        type: UPDATE_USER_INFOS,
        payload: {
          userInfos: state.userInfos,
          userDetails : {
            ...updateUserDetailsData
          }
        },
      })
      
      if(updateUserDetailsData?.likes?.includes(movie?.id as number)){
        await MoviesService.likeMovie(movie as Movie);
        setIsLike(true);
      }else{
        await MoviesService.removeLikeMovie(movie as Movie);
        setIsLike(false);
      }
      setLoadingLike(false);
    } catch (err: unknown) {
      console.log(err);
      setLoadingLike(false);
    }
  }

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

                {state.isLogged && (
                  <Fragment>
                    {loadingLike ? (
                      <img src={Loading} className="like loading" />
                    ) : (
                      <Fragment>
                        {!isLike ? (
                          <img
                            src="/heart.png"
                            className="like"
                            onClick={() => {
                              toggleLikeMovie();
                            }}
                          />
                        ) : (
                          <img
                            src="/heart_fill.png"
                            className="like"
                            onClick={() => {
                              toggleLikeMovie();
                            }}
                          />
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                )}

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
                    Nombre de j'aime : {movieCollection?.likes ?? "0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="cast">
              <h3>Acteurs</h3>

              <Swiper
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

            {state.isLogged && state.userInfos &&(
              <CreateComment movie={movie} userInfos={state.userInfos} />
            )}

            <MovieComments movie={movie} />
          </div>
        )
      )}
      {error && <p>{error}</p>}
    </Fragment>
  );
};

export default MovieContent;
