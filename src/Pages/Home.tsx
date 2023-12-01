import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import PopularMovies from "../components/PopularMovies";

const Home = () => {
  const { testValue } = useContext(UserContext);

  return (
    <main className="home">
      <p>Home page</p>
      <p>{testValue}</p>

      <PopularMovies />
    </main>
  );
};

export default Home;
