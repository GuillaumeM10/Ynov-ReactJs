import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Movie from "../Pages/Movie";
import Login from "../Pages/Login";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="movie/:id" element={<Movie />} />
      <Route path="*" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;
