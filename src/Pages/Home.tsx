import PopularMovies from "../components/PopularMovies/PopularMovies";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <p>Home page</p>

      <PopularMovies />
    </div>
  );
};

export default Home;
