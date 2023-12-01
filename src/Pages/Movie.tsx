import { useParams } from "react-router-dom";
import MovieContent from "../components/Movie/MovieContent";

const Movie = () => {
  const { id } = useParams();

  return (
    <div className="movie">
      <MovieContent id={id} />
    </div>
  );
};

export default Movie;
