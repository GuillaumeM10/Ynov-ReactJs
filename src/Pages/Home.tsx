import { useContext } from "react";
import { ExempleContext } from "../context/ExempleContext";
import PopularMovies from "../components/PopularMovies";

const Home = () => {
  const { testValue } = useContext(ExempleContext);

  return (
    <main className="home">
      <p>Home page</p>
      <p>{testValue}</p>

      <PopularMovies />
    </main>
  );
};

export default Home;
