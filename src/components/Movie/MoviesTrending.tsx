import MovieService from "../../services/movies.service";
import { Movies } from "../../types/movie.type";
import { useState, useEffect, Fragment } from "react"
import Loading from "../../assets/loading.svg"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import MovieCard from "./MovieCard";

const MoviesTrending = () => {
  const [movies, setMovivies] = useState<Movies | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getMovies = async (): Promise<void> => {
    try {
      setLoading(true)
      const movies = await MovieService.getMoviesTopRated()
      setMovivies(movies)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <Fragment>
      {!loading && movies && movies.results.length > 0 ? (
        
        <div className="trending">
          <h2>Ils sont les mieux notés !</h2>

            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={20}
              slidesPerView={"auto"}
              autoplay={{ delay: 2500 }}
              navigation
              pagination={{ clickable: true }}
              className="similars"
            >
              {
                movies.results.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <MovieCard movie={movie} />
                  </SwiperSlide>
                ))}
            </Swiper>

        </div>
            
      ) : <img width={50} height={50} src={Loading} alt="loading" />}
    </Fragment>
  );
};

export default MoviesTrending;