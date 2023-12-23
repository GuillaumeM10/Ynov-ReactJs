import MoviesTrending from "../components/Movie/MoviesTrending";
import PopularMovies from "../components/PopularMovies/PopularMovies";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <MoviesTrending />
      <PopularMovies />
    </div>
  );
};

export default Home;
