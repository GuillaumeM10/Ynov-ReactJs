import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Movie from "../Pages/Movie";
import NotFound from "../Pages/NotFound";
import Auth from "../Pages/Auth";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="film/:id" element={<Movie />} />
      <Route path="/authentification" element={<Auth />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute to="/" bool={false}>
            <Auth />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute to="/" bool={false}>
            <Auth />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
