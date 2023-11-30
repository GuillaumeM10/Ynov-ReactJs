import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Movie from "../Pages/Movie";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="movie/:id" element={<Movie />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default Router;
