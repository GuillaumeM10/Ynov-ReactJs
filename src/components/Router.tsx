import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Movie from "../Pages/Movie";
import NotFound from "../Pages/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="movie/:id" element={<Movie />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
