import { useParams } from "react-router-dom";
import MovieContent from "../components/Movie/MovieContent";

const Movie = () => {
  const { id } = useParams();

  return (
    <main className="movie">
      <MovieContent id={id} />
    </main>
  );
};

export default Movie;
